-- ============================================================
--  명동미래셀의원 · 프로젝트가 멈추지 않게 하는 확인용 표
-- ------------------------------------------------------------
--  왜 필요한가
--
--  무료 요금제의 Supabase 프로젝트는 한 주 동안 '데이터베이스 활동'이
--  충분하지 않으면 자동으로 멈춥니다. 공식 문서의 표현은 이렇습니다.
--
--    "지난 한 주 동안 충분한 사용자 데이터베이스 활동이 없으면
--     비활성으로 간주됩니다. 사용자 쿼리가 너무 적은 프로젝트가
--     가장 먼저 중단 대상이 됩니다. 보통 하루에 몇 번씩 데이터베이스에
--     요청이 있으면 중단을 피할 수 있습니다."
--    https://supabase.com/docs/guides/platform/free-project-pausing
--
--  전에 쓰던 방식은 consultations 를 로그인 없이 불러 보는 것이었습니다.
--  그 표는 anon 에게 권한이 없으므로 권한 검사에서 바로 막힙니다.
--  요청은 갔지만 '정상적으로 수행된 쿼리'는 없었던 셈입니다.
--  2026년 9월과 10월, 두 번 멈춘 원인입니다.
--
--  그래서 아무 내용도 담기지 않은 표를 하나 두고, 그것만 읽게 합니다.
--  읽기가 실제로 성공해야 데이터베이스에서 쿼리로 집계됩니다.
--
--  ⚠ 이 표는 로그인하지 않은 사람도 읽을 수 있습니다.
--     그러므로 환자 정보든 병원 내부 정보든, 어떤 내용도
--     이 표에 절대 넣지 마십시오. 줄 하나, 숫자 하나로 충분합니다.
--
--  실행하는 곳: Supabase 대시보드 > SQL Editor
--  한 번만 실행하면 됩니다. 여러 번 실행해도 안전합니다.
-- ============================================================

create table if not exists public.health (
  -- 줄이 하나뿐이도록 못 박아 둡니다. 실수로 쌓일 일이 없습니다.
  id          smallint primary key default 1 check (id = 1),
  -- 이 표가 무엇인지 나중에 봐도 알 수 있게 적어 두는 칸입니다.
  note        text not null default '프로젝트 자동 중단 방지용. 개인정보 없음.'
);

insert into public.health (id) values (1) on conflict (id) do nothing;

comment on table public.health is
  '자동 중단 방지용 확인 표. 로그인 없이 읽힙니다. 어떤 정보도 넣지 마십시오.';

-- ------------------------------------------------------------
--  권한 — 읽기만, 그리고 이 표에만
-- ------------------------------------------------------------
alter table public.health enable row level security;

-- 먼저 모두 거둬들인 뒤, 필요한 것만 돌려줍니다.
revoke all on public.health from anon;
revoke all on public.health from authenticated;

grant select on public.health to anon;
grant select on public.health to authenticated;

drop policy if exists health_select_anyone on public.health;
create policy health_select_anyone on public.health
  for select to anon, authenticated using (true);

-- 쓰기 정책은 일부러 만들지 않습니다.
-- 정책이 없으면 아무도 쓰지 못합니다. 읽기만 되는 상태가 맞습니다.
