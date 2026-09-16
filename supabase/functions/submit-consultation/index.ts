// ============================================================
//  명동미래셀의원 · 상담/예약 접수 함수
//
//  홈페이지 폼은 데이터베이스에 직접 접근하지 않습니다. 반드시 이 함수를 거칩니다.
//  여기서 하는 일:
//    1) 보낸 곳이 우리 홈페이지가 맞는지 확인 (CORS)
//    2) 사람이 보낸 것이 맞는지 확인 (허니팟 + Turnstile 캡차)
//    3) 같은 곳에서 짧은 시간에 여러 번 넣는 것을 차단
//    4) 값이 정상인지, 필수 동의를 받았는지 확인
//    5) 통과한 것만 데이터베이스에 저장
//    6) (설정된 경우) 병원 메일로 알림 발송
//
//  환경변수 (Supabase 대시보드 > Edge Functions > Secrets)
//    TURNSTILE_SECRET_KEY  선택. 없으면 캡차 검사를 건너뜁니다.
//    IP_SALT               권장. IP 해시에 쓰는 임의의 긴 문자열.
//    ALLOWED_ORIGINS       선택. 쉼표로 구분. 없으면 아래 기본 목록 사용.
//    RESEND_API_KEY        선택. 있으면 신규 접수 시 메일 알림.
//    NOTIFY_TO / NOTIFY_FROM  메일 알림 수신/발신 주소.
// ============================================================

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TURNSTILE_SECRET = Deno.env.get("TURNSTILE_SECRET_KEY") ?? "";
const IP_SALT = Deno.env.get("IP_SALT") ?? "mdmiraecell-default-salt-change-me";
const RESEND_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const NOTIFY_TO = Deno.env.get("NOTIFY_TO") ?? "";
const NOTIFY_FROM = Deno.env.get("NOTIFY_FROM") ?? "";

const DEFAULT_ORIGINS = [
  "https://mdmiraecell.com",
  "https://www.mdmiraecell.com",
  "http://localhost:8791",
  "http://127.0.0.1:8791",
];
const ENV_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",").map((s) => s.trim()).filter(Boolean);
const ORIGINS = ENV_ORIGINS.length ? ENV_ORIGINS : DEFAULT_ORIGINS;

/* 짧은 시간에 몰아넣는 것을 막는 기준 */
const LIMIT_10MIN = 3;
const LIMIT_DAY = 10;

const TOPICS = [
  "줄기세포", "피부과", "성형외과", "비뇨기과", "에스테틱",
  "내성발톱", "두피케어", "림프해독", "월드투어", "퀀텀 양자 진료치료", "기타",
];
const TIMES = ["오전", "오후", "상관없음"];

function corsHeaders(origin: string | null) {
  const allow = origin && ORIGINS.includes(origin) ? origin : ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "content-type, authorization, apikey",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...corsHeaders(origin) },
  });
}

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** PostgREST 호출 — service_role 키를 쓰므로 RLS를 우회합니다. 이 함수 안에서만 사용. */
async function db(path: string, init: RequestInit = {}) {
  return await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

/** 문자열 정리 — 제어문자 제거, 앞뒤 공백 제거, 길이 제한 */
function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  let out = "";
  for (const ch of v) {
    const code = ch.codePointAt(0)!;
    out += (code < 0x20 || code === 0x7f) ? " " : ch;
  }
  return out.trim().slice(0, max);
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return true; // 캡차 미설정 상태에서도 접수는 되게 둡니다
  const form = new FormData();
  form.append("secret", TURNSTILE_SECRET);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    const out = await r.json();
    return out.success === true;
  } catch {
    return false;
  }
}

/**
 * 알림 메일 발송.
 * 알림이 실패해도 접수는 성공으로 처리합니다. 다만 결과는 반드시 남깁니다.
 * 알림이 말없이 죽으면 운영 중에 아무도 모르기 때문입니다.
 */
async function notify(row: Record<string, unknown>) {
  if (!RESEND_KEY || !NOTIFY_TO || !NOTIFY_FROM) {
    console.log(JSON.stringify({
      notify: "skipped",
      reason: "missing_env",
      has_key: !!RESEND_KEY, has_to: !!NOTIFY_TO, has_from: !!NOTIFY_FROM,
    }));
    return;
  }

  const kindLabel = row.kind === "reserve" ? "예약 신청" : "문의";
  const lines = [
    `구분: ${kindLabel}`,
    `성함: ${row.name}`,
    `연락처: ${row.phone}`,
    row.email ? `이메일: ${row.email}` : "",
    row.preferred_date ? `희망일: ${row.preferred_date} ${row.preferred_time ?? ""}` : "",
    row.topic ? `분야: ${row.topic}` : "",
    "",
    "내용:",
    String(row.message ?? "(없음)"),
  ].filter(Boolean).join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: [NOTIFY_TO],
        subject: `[명동미래셀] 새 ${kindLabel} — ${row.name}`,
        text: `${lines}\n\n관리자 패널: https://mdmiraecell.com/admin`,
      }),
    });
    const body = await res.text();
    console.log(JSON.stringify({
      notify: res.ok ? "sent" : "failed",
      status: res.status,
      response: body.slice(0, 500),
      from: NOTIFY_FROM,
      to: NOTIFY_TO,
    }));
  } catch (err) {
    console.log(JSON.stringify({ notify: "error", message: String(err).slice(0, 300) }));
  }
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405, origin);
  if (origin && !ORIGINS.includes(origin)) return json({ error: "origin_not_allowed" }, 403, origin);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400, origin);
  }

  /* 1. 허니팟 — 사람 눈에 안 보이는 칸입니다. 채워져 있으면 봇입니다. */
  if (clean(body.website, 100)) return json({ ok: true }, 200, origin); // 봇에게는 성공처럼 보이게

  /* 2. 값 검사 */
  const kind = body.kind === "contact" ? "contact" : "reserve";
  const name = clean(body.name, 50);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 120);
  const message = clean(body.message, 2000);
  const topic = clean(body.topic, 40);
  const preferredTime = clean(body.preferred_time, 10);
  const preferredDate = clean(body.preferred_date, 10);

  if (name.length < 2) return json({ error: "name_invalid" }, 400, origin);
  if (!/^[0-9+\-()\s]{9,20}$/.test(phone)) return json({ error: "phone_invalid" }, 400, origin);
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "email_invalid" }, 400, origin);
  if (preferredDate && !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) return json({ error: "date_invalid" }, 400, origin);
  if (kind === "reserve" && !preferredDate) return json({ error: "date_required" }, 400, origin);
  if (kind === "contact" && message.length < 2) return json({ error: "message_required" }, 400, origin);

  /* 3. 동의 — 동의 없이는 저장하지 않습니다 */
  const consentPrivacy = body.consent_privacy === true;
  const consentSensitive = body.consent_sensitive === true;
  if (!consentPrivacy) return json({ error: "consent_required" }, 400, origin);
  // 민감정보 동의가 없으면 상담 내용은 버리고 연락처만 접수합니다
  const safeMessage = consentSensitive ? message : "";

  /* 4. 같은 곳에서 반복 접수하는지 확인 */
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  const ipHash = await sha256(IP_SALT + "|" + ip);

  if (ip) {
    /* 두 조회를 동시에 보내면 간헐적으로 인증이 틀어져 한쪽이 401을 받습니다.
       그러면 건수가 0으로 집계돼 제한이 걸리지 않으므로 순차로 확인합니다. */
    const counted = { headers: { Prefer: "count=exact", Range: "0-0" } };
    const count = (res: Response) => Number(res.headers.get("content-range")?.split("/")[1] ?? 0);

    const since10 = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const r10 = await db(`submit_rate_log?ip_hash=eq.${ipHash}&at=gte.${since10}&select=id`, counted);
    const since24 = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const r24 = await db(`submit_rate_log?ip_hash=eq.${ipHash}&at=gte.${since24}&select=id`, counted);

    if (!r10.ok || !r24.ok) {
      console.log(JSON.stringify({ ratelimit: "check_failed", s10: r10.status, s24: r24.status }));
    }
    if (count(r10) >= LIMIT_10MIN || count(r24) >= LIMIT_DAY) {
      return json({ error: "rate_limited" }, 429, origin);
    }
  }

  /* 5. 캡차 */
  const passed = await verifyTurnstile(clean(body.turnstile_token, 3000), ip);
  if (!passed) return json({ error: "captcha_failed" }, 400, origin);

  /* 6. 저장 */
  const row = {
    kind,
    name,
    phone,
    email: email || null,
    preferred_date: preferredDate || null,
    preferred_time: TIMES.includes(preferredTime) ? preferredTime : null,
    topic: TOPICS.includes(topic) ? topic : (topic ? "기타" : null),
    message: safeMessage || null,
    consent_privacy: consentPrivacy,
    consent_sensitive: consentSensitive,
    consent_at: new Date().toISOString(),
    source_page: clean(body.source_page, 200) || null,
    referrer: clean(body.referrer, 300) || null,
    user_agent: clean(req.headers.get("user-agent") ?? "", 300) || null,
    ip_hash: ipHash,
  };

  const res = await db("consultations", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    console.error("insert failed", res.status, await res.text());
    return json({ error: "save_failed" }, 500, origin);
  }

  await db("submit_rate_log", { method: "POST", body: JSON.stringify({ ip_hash: ipHash }) });
  await notify(row);

  return json({ ok: true }, 200, origin);
});
