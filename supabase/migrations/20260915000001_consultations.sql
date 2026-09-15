-- ============================================================
--  명동미래셀의원 · 상담/예약 신청 저장소
--  적용: Supabase 대시보드 > SQL Editor 에 붙여넣고 실행
--
--  접근 원칙
--   · 홈페이지(브라우저)는 이 표에 직접 손대지 못합니다.
--     접수는 Edge Function(submit-consultation)만 할 수 있습니다.
--   · 조회는 admin_users 에 등록된 관리자만 가능합니다.
--   · 관리자도 신청 원문(성함·연락처·상담내용)은 수정할 수 없고,
--     처리상태와 메모만 바꿀 수 있습니다.
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- 1. 신청 표
-- ------------------------------------------------------------
create table if not exists public.consultations (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- 접수 내용
  kind              text not null check (kind in ('reserve','contact')),   -- 예약 / 문의
  name              text not null,
  phone             text not null,
  email             text,
  preferred_date    date,                                                  -- 예약 희망일
  preferred_time    text,                                                  -- 오전 / 오후 / 상관없음
  topic             text,                                                  -- 진료·문의 분야
  message           text,                                                  -- 상담 내용 (민감정보)

  -- 처리 현황
  status            text not null default 'new'
                      check (status in ('new','contacted','booked','done','canceled','noshow','spam')),
  admin_memo        text,
  handled_by        uuid references auth.users(id) on delete set null,
  handled_at        timestamptz,

  -- 동의 이력 (개인정보보호법 제15조 / 제23조)
  consent_privacy   boolean not null default false,   -- 개인정보 수집·이용 동의
  consent_sensitive boolean not null default false,   -- 민감정보(건강정보) 별도 동의
  consent_at        timestamptz,

  -- 접수 경로 (스팸 판별·유입 분석용)
  source_page       text,
  referrer          text,
  user_agent        text,
  ip_hash           text        -- 원문 IP는 저장하지 않습니다. 해시만 남깁니다.
);

comment on table  public.consultations          is '홈페이지 상담·예약 신청 접수 내역';
comment on column public.consultations.message  is '민감정보(건강정보). 별도 동의를 받은 경우에만 수집됩니다.';
comment on column public.consultations.ip_hash  is 'IP 원문이 아닌 솔트 해시. 중복·스팸 차단 목적으로만 사용합니다.';

create index if not exists consultations_created_idx on public.consultations (created_at desc);
create index if not exists consultations_status_idx  on public.consultations (status, created_at desc);
create index if not exists consultations_kind_idx    on public.consultations (kind, created_at desc);

-- updated_at 자동 갱신
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists consultations_touch on public.consultations;
create trigger consultations_touch
  before update on public.consultations
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- 2. 관리자 명단
--    로그인 계정이 있어도 여기 등록돼야 신청 내역을 볼 수 있습니다.
-- ------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  name       text,
  role       text not null default 'staff' check (role in ('owner','staff')),
  created_at timestamptz not null default now()
);

comment on table public.admin_users is '관리자 패널 접근 허용 명단. owner 는 삭제 권한까지 가집니다.';

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admin_users where user_id = auth.uid()) $$;

create or replace function public.is_owner()
returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admin_users where user_id = auth.uid() and role = 'owner') $$;

-- ------------------------------------------------------------
-- 3. 열람 기록
-- ------------------------------------------------------------
create table if not exists public.access_logs (
  id        bigint generated always as identity primary key,
  at        timestamptz not null default now(),
  user_id   uuid,
  email     text,
  action    text not null,        -- list / view / update / export / delete
  target_id uuid,
  detail    jsonb
);

create index if not exists access_logs_at_idx on public.access_logs (at desc);

comment on table public.access_logs is '관리자가 환자 정보를 열람·수정한 기록. 개인정보 안전성 확보조치 기준 대응.';

-- ------------------------------------------------------------
-- 4. 접수 속도 제한 기록 (Edge Function 전용)
-- ------------------------------------------------------------
create table if not exists public.submit_rate_log (
  id      bigint generated always as identity primary key,
  at      timestamptz not null default now(),
  ip_hash text not null
);

create index if not exists submit_rate_log_idx on public.submit_rate_log (ip_hash, at desc);

-- ------------------------------------------------------------
-- 5. 권한 — 기본 권한을 모두 회수한 뒤 필요한 것만 다시 부여
-- ------------------------------------------------------------
revoke all on public.consultations   from anon, authenticated;
revoke all on public.admin_users     from anon, authenticated;
revoke all on public.access_logs     from anon, authenticated;
revoke all on public.submit_rate_log from anon, authenticated;

grant select on public.consultations to authenticated;
-- 관리자도 신청 원문은 못 고칩니다. 처리 관련 칸만 수정 가능.
grant update (status, admin_memo, handled_by, handled_at) on public.consultations to authenticated;
grant delete on public.consultations to authenticated;   -- 실제 허용 여부는 아래 정책(owner)이 결정
grant select on public.admin_users   to authenticated;
grant insert, select on public.access_logs to authenticated;

-- ------------------------------------------------------------
-- 6. 행 단위 접근통제 (RLS)
--    정책이 없는 역할은 아무것도 못 합니다 = 홈페이지 방문자는 접근 불가
-- ------------------------------------------------------------
alter table public.consultations   enable row level security;
alter table public.admin_users     enable row level security;
alter table public.access_logs     enable row level security;
alter table public.submit_rate_log enable row level security;

drop policy if exists consultations_select_admin on public.consultations;
create policy consultations_select_admin on public.consultations
  for select to authenticated using (public.is_admin());

drop policy if exists consultations_update_admin on public.consultations;
create policy consultations_update_admin on public.consultations
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists consultations_delete_owner on public.consultations;
create policy consultations_delete_owner on public.consultations
  for delete to authenticated using (public.is_owner());

drop policy if exists admin_users_select_self on public.admin_users;
create policy admin_users_select_self on public.admin_users
  for select to authenticated using (user_id = auth.uid() or public.is_owner());

drop policy if exists access_logs_insert_admin on public.access_logs;
create policy access_logs_insert_admin on public.access_logs
  for insert to authenticated with check (public.is_admin());

drop policy if exists access_logs_select_owner on public.access_logs;
create policy access_logs_select_owner on public.access_logs
  for select to authenticated using (public.is_owner());

-- ------------------------------------------------------------
-- 7. 보관기간 경과분 파기
--    개인정보는 목적 달성 후 지체 없이 파기해야 합니다.
--    아래 함수를 주기적으로 돌리거나, 수동으로 실행하십시오.
-- ------------------------------------------------------------
create or replace function public.purge_expired_consultations(retain_months int default 36)
returns integer
language plpgsql security definer set search_path = public
as $$
declare removed integer;
begin
  delete from public.consultations
   where created_at < now() - (retain_months || ' months')::interval;
  get diagnostics removed = row_count;

  delete from public.submit_rate_log where at < now() - interval '7 days';

  return removed;
end $$;

revoke all on function public.purge_expired_consultations(int) from public, anon, authenticated;

comment on function public.purge_expired_consultations(int)
  is '보관기간(기본 36개월)이 지난 신청 내역을 파기합니다. 기간은 홈페이지 개인정보처리방침과 반드시 일치시키십시오.';
