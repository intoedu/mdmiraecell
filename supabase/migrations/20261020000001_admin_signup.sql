-- ============================================================
--  명동미래셀의원 · 관리자 가입 신청
-- ------------------------------------------------------------
--  이 파일이 하는 일
--    1. 가입 신청을 담아 둘 표를 만듭니다.
--    2. 대표(owner)만 그 신청을 볼 수 있게 막습니다.
--    3. 신청 자체는 로그인하지 않은 사람도 넣을 수 있어야 하는데,
--       표에 직접 넣게 두면 아무나 마음대로 쓸 수 있습니다.
--       그래서 표에는 아무 권한도 주지 않고, Edge Function(서버)만
--       service_role 로 넣도록 합니다. 상담 신청과 같은 방식입니다.
--
--  실행하는 곳: Supabase 대시보드 > SQL Editor
--  한 번만 실행하면 됩니다. 여러 번 실행해도 안전합니다.
-- ============================================================

-- ------------------------------------------------------------
-- 1. 가입 신청 표
-- ------------------------------------------------------------
create table if not exists public.admin_signup_requests (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),

  email       text not null,
  name        text not null,
  reason      text,                 -- 어떤 일로 접근이 필요한지

  status      text not null default 'pending'
                check (status in ('pending','approved','rejected')),

  -- 처리 기록
  handled_at  timestamptz,
  handled_by  uuid references auth.users(id) on delete set null,
  note        text,                 -- 거절 사유 등 담당자 메모

  ip_hash     text                  -- 반복 신청 차단용. 원본 IP 는 저장하지 않습니다.
);

comment on table public.admin_signup_requests is
  '관리자 패널 접근 신청. 대표(owner)가 승인해야 계정이 만들어집니다.';

-- 같은 이메일로 처리 대기 중인 신청이 둘 이상 쌓이지 않게 합니다.
create unique index if not exists admin_signup_requests_pending_email
  on public.admin_signup_requests (lower(email))
  where status = 'pending';

create index if not exists admin_signup_requests_status_at
  on public.admin_signup_requests (status, created_at desc);

-- ------------------------------------------------------------
-- 2. 권한 — 아무에게도 주지 않습니다
-- ------------------------------------------------------------
--  신청을 넣는 것도, 승인하는 것도 Edge Function 이 합니다.
--  Edge Function 은 service_role 로 동작하므로 RLS 를 지나갑니다.
--  브라우저에서 오는 요청(anon)은 이 표에 손도 대지 못합니다.
alter table public.admin_signup_requests enable row level security;

revoke all on public.admin_signup_requests from anon;
revoke all on public.admin_signup_requests from authenticated;

-- 대표만 목록을 봅니다. (관리자 패널의 '가입 신청' 화면)
grant select on public.admin_signup_requests to authenticated;

drop policy if exists admin_signup_requests_select_owner on public.admin_signup_requests;
create policy admin_signup_requests_select_owner on public.admin_signup_requests
  for select to authenticated using (public.is_owner());

-- ------------------------------------------------------------
-- 3. 신청 반복 차단용 기록
-- ------------------------------------------------------------
--  상담 신청과 표를 나눠 둡니다. 성격이 다른 기록을 한곳에 섞으면
--  한쪽을 지울 때 다른 쪽까지 영향을 받습니다.
create table if not exists public.signup_rate_log (
  id      bigint generated always as identity primary key,
  at      timestamptz not null default now(),
  ip_hash text not null
);

create index if not exists signup_rate_log_at on public.signup_rate_log (at desc);

alter table public.signup_rate_log enable row level security;
revoke all on public.signup_rate_log from anon;
revoke all on public.signup_rate_log from authenticated;

-- ------------------------------------------------------------
-- 4. 열람 기록에 남길 동작 이름 보충
-- ------------------------------------------------------------
comment on column public.access_logs.action is
  'list / view / update / export / delete / signup_approve / signup_reject / password_change';
