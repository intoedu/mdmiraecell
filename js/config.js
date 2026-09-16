/* ============================================================
   명동미래셀의원 · 연결 설정
   여기 값들은 브라우저에 그대로 노출되는 공개 값입니다.
   저장소에 올라가도 안전합니다. (비밀 키는 절대 여기 두지 마십시오)

   채우는 법은 docs/SETUP.md 를 보십시오.
   ============================================================ */
window.MIRAE_CONFIG = {
  /* Supabase 프로젝트 주소. 예: https://abcdefgh.supabase.co */
  SUPABASE_URL: "https://ghfoffpgkftudwfpldua.supabase.co",

  /* 공개(anon) 키. 대시보드 > Project Settings > API Keys */
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZm9mZnBna2Z0dWR3ZnBsZHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0OTg3NTEsImV4cCI6MjEwNTA3NDc1MX0.1WxZ_fSDcSVcn088G2CjlHyzUYS2k3qVNYOdRXGD6-k",

  /* 접수 함수 이름 — 바꾸지 마십시오 */
  SUBMIT_FUNCTION: "submit-consultation",

  /* Cloudflare Turnstile 사이트 키. 비워두면 캡차 없이 동작합니다. */
  TURNSTILE_SITE_KEY: "",

  /* 병원 대표번호 — 접수 실패 시 안내에 씁니다 */
  TEL: "02-776-8768",
};
