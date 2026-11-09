-- ============================================================
--  명동미래셀의원 · 가입 신청 함수가 쓰는 service_role 권한
-- ------------------------------------------------------------
--  왜 필요한가
--
--  이 프로젝트는 만들 때 '새 표 자동 노출'을 꺼 두었습니다.
--  그래서 새 표를 만들어도 service_role 에 읽기·쓰기 권한이 붙지 않습니다.
--  상담 접수 표는 20260915000001_consultations.sql 에서 명시적으로 줬지만,
--  20261020000001_admin_signup.sql 은 이것을 빠뜨렸습니다.
--
--  service_role 은 RLS 는 지나가지만, 표 권한(GRANT)까지 지나가지는 않습니다.
--  이 파일이 없으면 두 함수가 배포는 되어도 저장할 때 권한 오류가 납니다.
--    - 가입 신청이 저장되지 않음 (request-admin-access → save_failed)
--    - 승인해도 관리자 명단에 등록되지 않음 (approve-admin-access → register_failed)
--
--  2026-11-09 실제 배포 직전에 확인해 적용했습니다.
--  필요한 최소한만 줍니다. 지우기(delete)는 어느 표에도 주지 않습니다.
--
--  실행하는 곳: Supabase 대시보드 > SQL Editor
--  20261020000001_admin_signup.sql 다음에 실행합니다. 여러 번 실행해도 안전합니다.
-- ============================================================

-- request-admin-access
--   신청 저장(저장 후 결과를 돌려받으므로 select 도 필요),
--   반복 신청 건수 확인과 기록,
--   이미 관리자인 이메일인지 확인
grant select, insert         on public.admin_signup_requests to service_role;
grant select, insert         on public.signup_rate_log       to service_role;
grant select                 on public.admin_users           to service_role;

-- approve-admin-access
--   부른 사람이 대표인지 확인(admin_users select — 위에서 줌),
--   신청을 승인/거절로 바꾸기,
--   승인된 분을 관리자 명단에 등록(이미 있으면 덮어쓰므로 update 도 필요),
--   처리 기록 남기기
grant update                 on public.admin_signup_requests to service_role;
grant insert, update         on public.admin_users           to service_role;
grant insert                 on public.access_logs           to service_role;
