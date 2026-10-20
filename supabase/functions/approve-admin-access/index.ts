// ============================================================
//  명동미래셀의원 · 관리자 가입 신청 승인/거절 함수
//
//  대표(owner)만 호출할 수 있습니다.
//  승인하면 여기서 다음을 한 번에 합니다:
//    1) 로그인 계정 생성
//    2) 관리자 명단(admin_users)에 staff 로 등록
//    3) 비밀번호 설정 링크를 만들어 신청자에게 메일 발송
//    4) 신청 상태를 approved 로 바꾸고 열람기록에 남김
//
//  비밀번호는 여기서 임의의 긴 문자열로 정해 두고 아무에게도 알려 주지 않습니다.
//  신청자는 메일의 링크로 들어가 직접 새 비밀번호를 정합니다.
//  그래야 비밀번호가 메신저나 메일에 평문으로 남지 않습니다.
//
//  메일은 Supabase 기본 발송을 쓰지 않고 Resend 로 직접 보냅니다.
//  Supabase 기본 발송은 시간당 몇 통으로 제한되어 운영에 쓰기 어렵습니다.
//
//  환경변수 (Supabase 대시보드 > Edge Functions > Secrets)
//    RESEND_API_KEY     필수. 없으면 승인은 되지만 메일이 가지 않습니다.
//    NOTIFY_FROM        필수. 발신 주소.
//    ADMIN_RESET_URL    비밀번호 설정 페이지 주소.
//    ADMIN_URL          관리자 패널 주소. 메일 안내에 씁니다.
//    ALLOWED_ORIGINS    선택. 쉼표로 구분.
// ============================================================

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const NOTIFY_FROM = Deno.env.get("NOTIFY_FROM") ?? "";
const ADMIN_URL = Deno.env.get("ADMIN_URL") ?? "https://intoedu.github.io/mdmiraecell/admin";
const ADMIN_RESET_URL = Deno.env.get("ADMIN_RESET_URL")
  ?? "https://intoedu.github.io/mdmiraecell/admin-reset";

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

/** PostgREST 호출 — service_role 키를 쓰므로 RLS를 우회합니다. */
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

/** 계정 관리 API — 계정을 만들거나 링크를 뽑을 때만 씁니다. */
async function authAdmin(path: string, init: RequestInit = {}) {
  return await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  let out = "";
  for (const ch of v) {
    const code = ch.codePointAt(0)!;
    out += (code < 0x20 || code === 0x7f) ? " " : ch;
  }
  return out.trim().slice(0, max);
}

/** 아무도 모를 임시 비밀번호. 신청자는 메일 링크로 새로 정합니다. */
function randomPassword() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * 비밀번호 설정 링크 뽑기.
 * 돌아오는 칸 이름이 바뀔 수 있어, 몇 가지를 차례로 봅니다.
 * 못 찾으면 응답 전체를 로그에 남깁니다 — 말없이 실패하면 원인을 찾을 수 없습니다.
 */
async function makeSetPasswordLink(email: string): Promise<string | null> {
  const res = await authAdmin("admin/generate_link", {
    method: "POST",
    body: JSON.stringify({ type: "recovery", email, redirect_to: ADMIN_RESET_URL }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.log(JSON.stringify({ link: "failed", status: res.status, body: text.slice(0, 500) }));
    return null;
  }
  let out: Record<string, unknown> = {};
  try { out = JSON.parse(text); } catch { /* 아래에서 처리 */ }
  const link = out.action_link ?? out.actionLink
    ?? (out.properties as Record<string, unknown> | undefined)?.action_link;
  if (typeof link === "string" && link) return link;

  console.log(JSON.stringify({ link: "no_action_link", body: text.slice(0, 800) }));
  return null;
}

/**
 * 이메일로 기존 계정의 id 찾기.
 * 공식 문서에 있는 것은 page / perPage 뿐이라 그대로 넘겨 가며 봅니다.
 * 끝없이 돌지 않도록 상한을 둡니다.
 */
async function findUserId(email: string): Promise<string | null> {
  const want = email.toLowerCase();
  const PER_PAGE = 200;
  const MAX_PAGES = 10;        // 최대 2,000 개까지만 봅니다

  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await authAdmin(`admin/users?page=${page}&per_page=${PER_PAGE}`);
    if (!res.ok) {
      console.log(JSON.stringify({ find_user: "failed", status: res.status, page }));
      return null;
    }
    const out = await res.json();
    const users: Array<{ id?: string; email?: string }> = out?.users ?? [];
    const hit = users.find((u) => (u.email ?? "").toLowerCase() === want);
    if (hit?.id) return hit.id;
    if (users.length < PER_PAGE) break;   // 마지막 쪽까지 봤습니다
  }
  console.log(JSON.stringify({ find_user: "not_found" }));
  return null;
}

async function sendMail(to: string, subject: string, text: string) {
  if (!RESEND_KEY || !NOTIFY_FROM) {
    console.log(JSON.stringify({ mail: "skipped", reason: "missing_env" }));
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ from: NOTIFY_FROM, to: [to], subject, text }),
    });
    const body = await res.text();
    console.log(JSON.stringify({ mail: res.ok ? "sent" : "failed", status: res.status, body: body.slice(0, 400) }));
    return res.ok;
  } catch (err) {
    console.log(JSON.stringify({ mail: "error", message: String(err).slice(0, 300) }));
    return false;
  }
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405, origin);
  if (origin && !ORIGINS.includes(origin)) return json({ error: "origin_not_allowed" }, 403, origin);

  /* ── 부른 사람이 대표가 맞는지 ──
     화면에서 판정하지 않습니다. 토큰을 Supabase 에 되물어 확인합니다. */
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
  if (!token) return json({ error: "not_signed_in" }, 401, origin);

  const me = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${token}` },
  });
  if (!me.ok) return json({ error: "not_signed_in" }, 401, origin);
  const meUser = await me.json();
  const callerId = meUser?.id;
  const callerEmail = meUser?.email ?? "";
  if (!callerId) return json({ error: "not_signed_in" }, 401, origin);

  const roleRes = await db(`admin_users?select=role&user_id=eq.${callerId}`);
  const roleRows = await roleRes.json();
  if (roleRows?.[0]?.role !== "owner") return json({ error: "not_owner" }, 403, origin);

  /* ── 요청 읽기 ── */
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "bad_json" }, 400, origin); }

  const id = Number(body.id);
  const action = clean(body.action, 10);
  const note = clean(body.note, 300);
  if (!Number.isInteger(id) || id <= 0) return json({ error: "id_required" }, 400, origin);
  if (action !== "approve" && action !== "reject") return json({ error: "bad_action" }, 400, origin);

  /* 신청 가져오기 — 아직 처리되지 않은 것만 */
  const reqRes = await db(`admin_signup_requests?select=*&id=eq.${id}&status=eq.pending`);
  const reqRows = await reqRes.json();
  const row = reqRows?.[0];
  if (!row) return json({ error: "not_found_or_handled" }, 404, origin);

  const finish = async (status: string, extra: Record<string, unknown> = {}) => {
    await db(`admin_signup_requests?id=eq.${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, handled_at: new Date().toISOString(), handled_by: callerId, note: note || null }),
    });
    await db("access_logs", {
      method: "POST",
      body: JSON.stringify({
        user_id: callerId,
        email: callerEmail,
        action: status === "approved" ? "signup_approve" : "signup_reject",
        detail: { request_id: id, applicant: row.email, ...extra },
      }),
    }).catch(() => {});
  };

  /* ── 거절 ── */
  if (action === "reject") {
    await finish("rejected");
    return json({ ok: true, status: "rejected" }, 200, origin);
  }

  /* ── 승인 ── */
  /* 1) 계정 만들기. 이미 있으면 그 계정을 그대로 씁니다. */
  let newUserId: string | null = null;
  const create = await authAdmin("admin/users", {
    method: "POST",
    body: JSON.stringify({ email: row.email, password: randomPassword(), email_confirm: true }),
  });
  if (create.ok) {
    newUserId = (await create.json())?.id ?? null;
  } else {
    const detail = await create.text();
    console.log(JSON.stringify({ create_user: "failed", status: create.status, detail: detail.slice(0, 400) }));
    /* 이미 쓰이고 있는 이메일이면 그 계정을 찾아 씁니다.
       계정 목록 API 는 공식 문서에 page / perPage 만 나와 있습니다.
       이름으로 걸러 주는 조건은 문서에 없어 믿지 않고, 문서에 있는 방식대로
       차례로 넘겨 가며 찾습니다. 이 병원 계정 수는 많아도 수십 개입니다. */
    newUserId = await findUserId(String(row.email));
    if (!newUserId) {
      /* 여기까지 왔으면 사람이 봐야 합니다. 무엇을 해야 하는지 알려 줍니다. */
      return json({ error: "create_user_failed" }, 500, origin);
    }
    console.log(JSON.stringify({ create_user: "existing_reused" }));
  }

  /* 2) 관리자 명단에 등록. 새로 승인된 분은 항상 staff 입니다.
        owner 로 올리는 것은 대시보드에서 따로 하셔야 합니다. */
  const reg = await db("admin_users", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify({ user_id: newUserId, email: row.email, name: row.name, role: "staff" }),
  });
  if (!reg.ok) {
    const detail = await reg.text();
    console.log(JSON.stringify({ register: "failed", status: reg.status, detail: detail.slice(0, 400) }));
    return json({ error: "register_failed" }, 500, origin);
  }

  /* 3) 비밀번호 설정 메일.
        메일이 실패해도 승인은 되돌리지 않습니다. 계정과 권한은 이미 만들어졌고,
        링크는 대표가 다시 보낼 수 있습니다. 대신 결과를 그대로 알려 줍니다. */
  const link = await makeSetPasswordLink(row.email);
  let mailed = false;
  if (link) {
    mailed = await sendMail(
      row.email,
      "[명동미래셀] 관리자 패널 접근이 승인되었습니다",
      [
        `${row.name} 님,`,
        "",
        "명동미래셀의원 관리자 패널 접근이 승인되었습니다.",
        "아래 링크에서 비밀번호를 정하신 뒤 로그인해 주십시오.",
        "",
        link,
        "",
        "링크는 일정 시간이 지나면 쓸 수 없게 됩니다.",
        "만료되었으면 로그인 화면의 '비밀번호를 잊으셨나요'를 눌러 다시 받으십시오.",
        "",
        `관리자 패널: ${ADMIN_URL}`,
        "",
        "※ 이 화면에는 환자분의 성함과 연락처, 상담 내용이 들어 있습니다.",
        "   화면을 열어 둔 채 자리를 비우지 마시고, 비밀번호를 공유하지 마십시오.",
      ].join("\n"),
    );
  }

  await finish("approved", { user_id: newUserId, mailed, link_made: !!link });

  return json({
    ok: true,
    status: "approved",
    mailed,
    /* 메일이 못 갔을 때 대표가 직접 전달할 수 있도록 돌려줍니다.
       화면에서는 대표에게만 보이고, 전달은 안전한 방법으로 하도록 안내합니다. */
    link: mailed ? null : link,
  }, 200, origin);
});
