// ============================================================
//  명동미래셀의원 · 관리자 가입 신청 접수 함수
//
//  관리자 패널을 쓰고 싶은 분이 신청을 넣는 곳입니다.
//  여기서 계정이 만들어지지는 않습니다. 신청만 받아 두고,
//  대표(owner)가 승인해야 비로소 계정이 생깁니다.
//
//  여기서 하는 일:
//    1) 보낸 곳이 우리 홈페이지가 맞는지 확인 (CORS)
//    2) 사람이 보낸 것이 맞는지 확인 (허니팟 + Turnstile 캡차)
//    3) 같은 곳에서 몰아넣는 것을 차단
//    4) 값이 정상인지 확인
//    5) 신청 저장
//    6) 대표에게 메일 알림
//
//  환경변수 (Supabase 대시보드 > Edge Functions > Secrets)
//    IP_SALT               권장. IP 해시에 쓰는 임의의 긴 문자열.
//    ALLOWED_ORIGINS       선택. 쉼표로 구분.
//    TURNSTILE_SECRET_KEY  선택. 없으면 캡차 검사를 건너뜁니다.
//    RESEND_API_KEY        선택. 있으면 대표에게 메일 알림.
//    NOTIFY_TO / NOTIFY_FROM  메일 수신/발신 주소.
//    ADMIN_URL             선택. 관리자 패널 주소. 메일 안내에 씁니다.
// ============================================================

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TURNSTILE_SECRET = Deno.env.get("TURNSTILE_SECRET_KEY") ?? "";
const IP_SALT = Deno.env.get("IP_SALT") ?? "mdmiraecell-default-salt-change-me";
const RESEND_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const NOTIFY_TO = Deno.env.get("NOTIFY_TO") ?? "";
const NOTIFY_FROM = Deno.env.get("NOTIFY_FROM") ?? "";
const ADMIN_URL = Deno.env.get("ADMIN_URL") ?? "https://intoedu.github.io/mdmiraecell/admin";

const DEFAULT_ORIGINS = [
  "https://mdmiraecell.com",
  "https://www.mdmiraecell.com",
  "https://intoedu.github.io",
  "http://localhost:8791",
  "http://127.0.0.1:8791",
];
const ENV_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",").map((s) => s.trim()).filter(Boolean);
const ORIGINS = ENV_ORIGINS.length ? ENV_ORIGINS : DEFAULT_ORIGINS;

/* 신청은 상담 접수보다 훨씬 드문 일이라 기준을 더 좁게 잡습니다 */
const LIMIT_HOUR = 2;
const LIMIT_DAY = 5;

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
  if (!TURNSTILE_SECRET) return true;
  const form = new FormData();
  form.append("secret", TURNSTILE_SECRET);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", body: form,
    });
    return (await r.json()).success === true;
  } catch {
    return false;
  }
}

/**
 * 대표에게 알림 메일.
 * 알림이 실패해도 신청은 성공으로 처리합니다. 다만 결과는 반드시 로그에 남깁니다.
 * 알림이 말없이 죽으면 운영 중에 아무도 모르기 때문입니다.
 */
async function notifyOwner(row: { email: string; name: string; reason: string }) {
  if (!RESEND_KEY || !NOTIFY_TO || !NOTIFY_FROM) {
    console.log(JSON.stringify({
      notify: "skipped", reason: "missing_env",
      has_key: !!RESEND_KEY, has_to: !!NOTIFY_TO, has_from: !!NOTIFY_FROM,
    }));
    return;
  }
  const text = [
    "관리자 패널 접근 신청이 들어왔습니다.",
    "",
    `성함: ${row.name}`,
    `이메일: ${row.email}`,
    `사유: ${row.reason || "(적지 않음)"}`,
    "",
    "승인하거나 거절하시려면 관리자 패널의 '가입 신청' 화면을 열어 주십시오.",
    ADMIN_URL,
    "",
    "※ 승인하기 전에 신청하신 분이 실제로 그분이 맞는지",
    "   전화 등 다른 방법으로 한 번 확인해 주십시오.",
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: [NOTIFY_TO],
        subject: `[명동미래셀] 관리자 가입 신청 — ${row.name}`,
        text,
      }),
    });
    console.log(JSON.stringify({
      notify: res.ok ? "sent" : "failed",
      status: res.status,
      response: (await res.text()).slice(0, 500),
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
    return json({ error: "bad_json" }, 400, origin);
  }

  /* 허니팟 — 사람 눈에 보이지 않는 칸입니다. 채워져 있으면 기계입니다.
     기계에게는 성공한 것처럼 보여 줍니다. 실패를 알려 주면 다시 시도하기 때문입니다. */
  if (clean(body.company, 100)) return json({ ok: true }, 200, origin);

  const email = clean(body.email, 160).toLowerCase();
  const name = clean(body.name, 40);
  const reason = clean(body.reason, 300);

  if (!name) return json({ error: "name_required" }, 400, origin);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ error: "email_invalid" }, 400, origin);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const ipHash = await sha256(IP_SALT + "|" + ip);

  if (!(await verifyTurnstile(clean(body.captcha, 3000), ip))) {
    return json({ error: "captcha_failed" }, 400, origin);
  }

  /* 몰아넣기 차단.
     두 조회를 동시에 보내면 간헐적으로 인증이 틀어져 한쪽이 401 을 받습니다.
     그러면 건수가 0 으로 집계돼 제한이 걸리지 않습니다.
     상담 접수 함수에서 실제로 겪은 일이라 여기서도 순차로 확인합니다. */
  const hourAgo = new Date(Date.now() - 3600_000).toISOString();
  const dayAgo = new Date(Date.now() - 86_400_000).toISOString();
  try {
    const counted = { headers: { Prefer: "count=exact", Range: "0-0" } };
    const count = (res: Response) => Number(res.headers.get("content-range")?.split("/")[1] ?? 0);

    const h = await db(`signup_rate_log?select=id&ip_hash=eq.${ipHash}&at=gte.${hourAgo}`, counted);
    const d = await db(`signup_rate_log?select=id&ip_hash=eq.${ipHash}&at=gte.${dayAgo}`, counted);

    /* 조회가 실패했으면 건수를 믿을 수 없습니다. 반드시 남겨 둡니다 —
       말없이 0 으로 넘어가면 제한이 사라진 것을 아무도 모릅니다. */
    if (!h.ok || !d.ok) {
      console.log(JSON.stringify({ rate_check: "failed", hour: h.status, day: d.status }));
    } else if (count(h) >= LIMIT_HOUR || count(d) >= LIMIT_DAY) {
      return json({ error: "rate_limited" }, 429, origin);
    }
  } catch (err) {
    /* 기록을 못 읽었다고 신청까지 막지는 않습니다. 다만 남겨 둡니다. */
    console.log(JSON.stringify({ rate_check: "error", message: String(err).slice(0, 200) }));
  }

  /* 이미 관리자인 분이 다시 신청하는 경우.
     "이미 있습니다" 라고 알려 주면 어느 이메일이 관리자인지 밖에서 알아낼 수 있습니다.
     그래서 저장하지 않고 성공한 것처럼만 답합니다. */
  try {
    /* eq 가 아니라 ilike 로 봅니다. 명단에 Kim@... 로 들어가 있고
       신청은 kim@... 로 들어오면 eq 로는 못 잡습니다. */
    const r = await db(`admin_users?select=user_id&email=ilike.${encodeURIComponent(email)}`);
    if (!r.ok) {
      console.log(JSON.stringify({ admin_check: "failed", status: r.status }));
    } else {
      const rows = await r.json();
      if (Array.isArray(rows) && rows.length) {
        console.log(JSON.stringify({ request: "skipped", reason: "already_admin" }));
        return json({ ok: true }, 200, origin);
      }
    }
  } catch (err) {
    console.log(JSON.stringify({ admin_check: "error", message: String(err).slice(0, 200) }));
  }

  /* 저장 */
  const ins = await db("admin_signup_requests", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ email, name, reason: reason || null, ip_hash: ipHash }),
  });

  if (!ins.ok) {
    const detail = await ins.text();
    /* 같은 이메일로 이미 대기 중인 신청이 있으면 고유 색인에 걸립니다.
       이것도 성공처럼 답합니다. 중복해서 넣을 이유가 없습니다. */
    if (ins.status === 409) {
      console.log(JSON.stringify({ request: "duplicate_pending" }));
      return json({ ok: true }, 200, origin);
    }
    console.log(JSON.stringify({ insert: "failed", status: ins.status, detail: detail.slice(0, 400) }));
    return json({ error: "save_failed" }, 500, origin);
  }

  /* 차단 기록은 저장에 성공한 뒤에 남깁니다 */
  await db("signup_rate_log", { method: "POST", body: JSON.stringify({ ip_hash: ipHash }) })
    .catch(() => {});

  await notifyOwner({ email, name, reason });

  return json({ ok: true }, 200, origin);
});
