# 상담 신청 데이터베이스 · 관리자 패널 설치 안내

## 현재 상태 (2026-09-16 기준)

**실제 접수까지 전 구간 검증을 마쳤습니다.**

| | 항목 | 확인된 내용 |
|---|---|---|
| ✅ | Supabase 프로젝트 | 서울 리전 · `ghfoffpgkftudwfpldua` |
| ✅ | 표 4개 · 권한 · RLS | anon 권한 없음, 신청 원문 수정 불가 확인 |
| ✅ | 접수 함수 | 실제 접수 2건 성공 |
| ✅ | 관리자 계정 | `mdmiraecellclinic@gmail.com` (owner) |
| ✅ | 회원가입 차단 | |
| ✅ | 알림 메일 (Resend) | 2통 수신 확인 |
| ✅ | 관리자 패널 | 로그인·목록·상태변경·메모 저장 확인 |
| ✅ | 열람 기록 | view/list/update 가 담당자 계정과 함께 기록됨 |
| ✅ | keepalive 시크릿 | 저장소에 등록 완료 |

### 사이트는 이미 GitHub Pages로 발행되고 있습니다

이 저장소는 **GitHub Pages가 켜져 있어 `main` 에 병합하면 자동 배포**됩니다.
(저장소 파일에는 흔적이 없어 처음엔 파악하지 못했던 부분입니다.)

👉 현재 주소: **https://intoedu.github.io/mdmiraecell/**

그래서 `ALLOWED_ORIGINS` 에 `https://intoedu.github.io` 를 포함시켜 두었습니다.
`mdmiraecell.com` 으로 옮긴 뒤에도 그대로 두면 두 주소 모두에서 접수가 됩니다.

### 남은 것

| | 항목 | 비고 |
|---|---|---|
| ⓐ | **카페24 FTP 비밀번호 변경** | 메신저로 평문 공유된 이력이 있음 |
| ⓑ | 개인정보처리방침 보호책임자·시행일 확인 | 현재 값은 제안값 |
| ⓒ | 카페24 배포 (`mdmiraecell.com` 연결) | 기존 `/www` 백업 먼저 |
| ⓓ | **Resend 도메인 인증** | 스팸함 문제의 근본 해결 — 아래 7-1 |
| ⓔ | Cloudflare Turnstile 캡차 | 광고 봇이 들어오기 시작하면 |

---

홈페이지 예약·문의 폼이 이제 메일 앱을 여는 대신 **데이터베이스에 저장**되고,
`/admin` 페이지에서 확인·처리할 수 있습니다.

이 문서대로 순서대로 따라 하시면 됩니다. 전부 합쳐 30분 정도 걸립니다.

---

## 병원에 확인받아야 하는 것

주소 · 진료시간 · 개인정보 보호책임자 · 원장님 성함 표기 · 병원 사진 등
**제가 임의로 정했거나 병원에서만 알 수 있는 항목**을
**[docs/병원-확인사항.md](병원-확인사항.md)** 에 모아 두었습니다.

특히 **주소(현재 "퇴계로 123" — 확인 안 됨)** 와
**카페24 FTP 비밀번호 변경(메신저 평문 노출)** 은 먼저 봐 주십시오.

---

## 다국어·이미지는 별도 문서로

언어 전환(한국어·영어·중국어·일본어·러시아어)과 그림·사진 관리는
**[docs/LANG-IMAGES.md](LANG-IMAGES.md)** 에 따로 정리해 두었습니다.
번역 문구 고치는 법, 갤러리에 실제 사진 넣는 법이 들어 있습니다.

---

## 0. 전체 구조

```
  방문자 ──▶ 예약/문의 폼 ──▶ 접수 함수 ──▶ 데이터베이스
              (reserve,        (스팸·동의      (consultations)
               contact)         검사)              │
                                                   ▼
  담당자 ──▶ 관리자 패널 (/admin) ──── 로그인한 관리자만 조회 ─┘
```

**폼은 데이터베이스에 직접 접근하지 못합니다.** 반드시 접수 함수를 거칩니다.
관리자 패널도 화면에서 권한을 판정하지 않고, **데이터베이스가 직접 판정**합니다.
즉 주소를 알아도, 화면 코드를 고쳐도 신청 내역은 볼 수 없습니다.

---

## 1. Supabase 무료 조직과 프로젝트 만들기  ✅ 완료

1. https://supabase.com 접속 → 로그인
2. 왼쪽 위 조직 이름 클릭 → **New organization**
3. 이름은 `mdmiraecell` 정도로, 요금제는 반드시 **Free** 선택
4. 그 조직 안에서 **New project**
   - Name: `mdmiraecell`
   - Database Password: 자동 생성된 것을 쓰시고 **안전한 곳에 보관**하십시오
   - Region: **Northeast Asia (Seoul)** — 반드시 서울로 하십시오
5. 생성까지 2~3분 걸립니다

> 기존 조직(ESC·intoedu 등이 있는 조직)에 만들면 월 $10이 붙습니다.
> 새 무료 조직이어야 $0입니다.

---

## 2. 표(테이블) 만들기  ✅ 완료

1. 왼쪽 메뉴 **SQL Editor** → **New query**
2. 저장소의 `supabase/migrations/20260915000001_consultations.sql` 내용을 **전부 복사해 붙여넣기**
3. **Run** 클릭 → `Success` 가 뜨면 완료

만들어지는 것:

| 표 | 내용 |
|---|---|
| `consultations` | 신청 내역 본체 |
| `admin_users` | 관리자 명단 (여기 없으면 못 봅니다) |
| `access_logs` | 누가 언제 무엇을 열람·수정했는지 |
| `submit_rate_log` | 반복 접수 차단용 기록 |

---

## 3. 관리자 계정 만들기  ✅ 완료

### 3-1. 로그인 계정 생성
1. 왼쪽 메뉴 **Authentication** → **Users** → **Add user** → **Create new user**
2. 이메일과 비밀번호 입력, **Auto Confirm User 를 켜십시오**
3. 담당자가 여러 명이면 사람 수만큼 만드십시오 (계정 공유는 하지 마십시오)

### 3-2. 관리자 명단에 등록
**SQL Editor** 에서 아래를 실행합니다. 이메일만 본인 것으로 바꾸십시오.

```sql
insert into public.admin_users (user_id, email, name, role)
select id, email, '박종윤 원장', 'owner'
  from auth.users where email = '원장님이메일@example.com'
on conflict (user_id) do update set role = excluded.role, name = excluded.name;
```

직원 계정은 `'owner'` 대신 `'staff'` 로 넣으십시오.
`owner` 만 신청 내역 삭제와 열람기록 조회가 가능합니다.

### 3-3. 아무나 가입하지 못하게 막기
**Authentication** → **Sign In / Providers** → **Email** →
**Allow new users to sign up** 을 **끄십시오.** (이것을 빠뜨리면 누구나 계정을 만들 수 있습니다.
단, 계정을 만들어도 `admin_users` 에 없으면 신청 내역은 못 봅니다. 그래도 반드시 끄십시오.)

---

## 4. 접수 함수 배포하기  ✅ 완료 (환경변수 포함)

Supabase CLI 를 쓰거나, 대시보드에서 직접 붙여넣을 수 있습니다.

### 대시보드에서 하는 법 (간단)
1. 왼쪽 메뉴 **Edge Functions** → **Deploy a new function** → **Via Editor**
2. 이름을 정확히 **`submit-consultation`** 으로 입력
3. `supabase/functions/submit-consultation/index.ts` 내용을 전부 붙여넣기
4. **Verify JWT** 옵션을 **끄십시오.** (홈페이지 방문자는 로그인하지 않으므로 켜면 접수가 막힙니다)
5. Deploy

### 함수 환경변수 등록
**Edge Functions** → **Secrets** 에서 추가합니다.

| 이름 | 필수 | 값 |
|---|---|---|
| `IP_SALT` | 권장 | 아무 긴 임의 문자열 (예: 40자 랜덤). 한 번 정하면 바꾸지 마십시오 |
| `ALLOWED_ORIGINS` | 권장 | `https://mdmiraecell.com,https://www.mdmiraecell.com` |
| `TURNSTILE_SECRET_KEY` | 선택 | 6번 참고. 없으면 캡차 없이 동작합니다 |
| `RESEND_API_KEY` | 선택 | 7번 참고 |
| `NOTIFY_TO` | 선택 | `mdmiraecellclinic@gmail.com` |
| `NOTIFY_FROM` | 선택 | 발신 주소 (Resend에 인증된 도메인) |

---

## 5. 홈페이지에 주소 연결하기  ✅ 완료

**Project Settings** → **API Keys** 에서 두 값을 복사해 `js/config.js` 에 넣습니다.

```js
window.MIRAE_CONFIG = {
  SUPABASE_URL: "https://xxxxxxxxxxxx.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOi....",
  ...
};
```

> 이 두 값은 **공개돼도 되는 값**입니다. 브라우저가 어차피 보게 되며,
> 접근 권한은 이 키가 아니라 데이터베이스 규칙(RLS)이 결정합니다.
> **`service_role` 키는 절대 여기 넣지 마십시오.** 그 키는 모든 제한을 무시합니다.

---

## 6. 스팸 차단 (Cloudflare Turnstile · 무료 · 선택)

없어도 접수는 됩니다. 다만 광고 봇이 들어오기 시작하면 반드시 켜십시오.

1. https://dash.cloudflare.com 무료 가입
2. 좌측 **Turnstile** → **Add widget**
   - Domain: `mdmiraecell.com`
   - Widget Mode: **Managed**
3. **Site Key** → `js/config.js` 의 `TURNSTILE_SITE_KEY` 에
4. **Secret Key** → Supabase Edge Functions **Secrets** 의 `TURNSTILE_SECRET_KEY` 에

---

## 7. 새 신청 이메일 알림  ✅ 완료 (Resend)

1. https://resend.com 가입 (무료: 하루 100통)
2. 도메인 인증(`mdmiraecell.com`) 또는 테스트 발신 주소 사용
3. API Key 발급 → Supabase Secrets 에 `RESEND_API_KEY`, `NOTIFY_TO`, `NOTIFY_FROM` 등록

> 카카오 알림톡은 비즈니스 채널 개설과 템플릿 심사(영업일 며칠)가 필요합니다.
> 지금 구조에서 접수 함수의 `notify()` 부분만 바꾸면 되므로, 준비되면 이어 붙이면 됩니다.

---

## 7-1. 알림 메일이 스팸함으로 가는 문제  ⚠ 중요

첫 테스트에서 알림 메일 2통이 모두 **Gmail 스팸함**으로 들어갔습니다.
**직원이 스팸함을 보지 않으면 환자 신청을 놓칩니다.** 반드시 해결해야 합니다.

**원인** — `onboarding@resend.dev` 는 Resend가 전 세계 가입자에게 공용으로 빌려주는
테스트 발신 주소입니다. 발신자 이름은 병원인데 도메인은 남의 것이라 구글이 의심합니다.

**임시 조치 (완료)**
- 스팸함에서 `스팸 아님` 처리
- Gmail 필터 생성: 보낸사람 `onboarding@resend.dev` →
  `절대 스팸으로 신고하지 않음` + `항상 중요 메일로 표시` + 라벨 `상담신청`

**근본 해결 — Resend 도메인 인증**
1. Resend → **Domains** → **Add Domain** → `mdmiraecell.com`
2. 화면에 나오는 **DNS 레코드(SPF·DKIM 등)를 카페24 DNS 관리에 추가**
3. 인증되면 Supabase Secrets 의 `NOTIFY_FROM` 을 아래로 변경

```
명동미래셀의원 <no-reply@mdmiraecell.com>
```

4. 발신 주소가 바뀌므로 **Gmail 필터도 새 주소로 수정**해야 합니다

> 도메인 인증을 하면 `onboarding@resend.dev` 의 "가입 계정으로만 발송 가능" 제약도
> 함께 풀려서, 나중에 환자에게 예약 확인 메일을 보내는 것도 가능해집니다.

---

## 8. 프로젝트가 멈추지 않게 하기  ⚠ 남음

무료 요금제는 **일주일간 요청이 없으면 프로젝트가 자동으로 정지**됩니다.
정지된 상태에서는 환자가 신청을 눌러도 접수가 실패합니다.

이 저장소에 `.github/workflows/keepalive.yml` 이 들어 있습니다. 3일마다 자동으로 깨웁니다.

**저장소 Settings → Secrets and variables → Actions → New repository secret** 에서 등록하십시오.

| 이름 | 값 |
|---|---|
| `SUPABASE_URL` | 5번의 주소 |
| `SUPABASE_ANON_KEY` | 5번의 공개 키 |

등록 후 **Actions 탭 → Supabase keepalive → Run workflow** 로 한 번 눌러 확인해 보십시오.

---

## 9. 점검 (배포 전 반드시)

- [ ] `reserve` 페이지에서 실제로 한 건 접수해 본다
- [ ] Supabase **Table Editor → consultations** 에 그 건이 들어와 있다
- [ ] `/admin` 에서 로그인해 그 건이 보인다
- [ ] **로그아웃 상태로 `/admin` 에 접속하면 아무것도 안 보인다**
- [ ] 민감정보 동의를 **체크하지 않고** 접수하면 상담 내용이 저장되지 않는다
- [ ] 관리자로 상태를 바꾸고 메모를 저장하면 반영된다
- [ ] 같은 브라우저에서 10분 안에 4번 접수하면 막힌다
- [ ] `privacy` 페이지의 노란 안내 상자를 지우고 대괄호 항목을 채웠다

---

## 10. 개인정보 관련 — 넘기지 말고 확인하십시오

데이터베이스에 환자 정보를 저장하는 순간 아래가 **의무**가 됩니다.

1. **동의**: 필수 동의(개인정보)와 별도 동의(건강정보)를 나누어 받아야 합니다 → 폼에 반영돼 있습니다
2. **개인정보처리방침 게시** → `privacy` 페이지 (초안이므로 확정 필요)
3. **보유기간 준수**: 방침에 3년으로 적었다면 3년이 지난 건은 실제로 지워야 합니다

```sql
-- 보관기간이 지난 건 파기 (기본 36개월). 방침에 적은 기간과 반드시 일치시키십시오.
select public.purge_expired_consultations(36);
```

4. **접근 권한 관리**: 퇴사자 계정은 즉시 삭제하십시오

```sql
delete from public.admin_users where email = '퇴사자@example.com';
```

5. **열람 기록 확인** (owner 계정으로)

```sql
select at, email, action, target_id from public.access_logs order by at desc limit 100;
```

---

## 10-1. 보안 점검에서 계속 뜨는 항목 (정상입니다)

Supabase 대시보드의 **Advisors → Security** 에 아래 세 가지가 계속 표시됩니다.
**셋 다 확인했고, 고치면 오히려 문제가 생기거나 고칠 필요가 없는 항목입니다.**

| 표시되는 내용 | 왜 그대로 두는가 |
|---|---|
| `submit_rate_log` 에 RLS는 켜져 있는데 정책이 없음 | **의도된 설정입니다.** 정책이 없으면 아무도 접근하지 못하고, 접수 함수만 쓸 수 있습니다. 가장 안전한 상태입니다. |
| `is_admin()` / `is_owner()` 를 로그인 사용자가 실행 가능 | **반드시 필요합니다.** 신청 내역 접근 규칙이 이 함수로 판정하므로, 실행 권한을 빼면 관리자 화면이 통째로 막힙니다. 로그인하지 않은 방문자는 이미 차단했습니다. |
| `rls_auto_enable()` 을 실행 가능 | 프로젝트 만들 때 켠 **'자동 RLS' 기능이 Supabase 쪽에서 만든 함수**입니다. 직접 호출해도 오류만 나고 정보가 새지 않습니다. 저희가 만든 것이 아니라 손대지 않았습니다. |

---

## 11. 자주 생기는 문제

| 증상 | 원인 | 조치 |
|---|---|---|
| 접수 버튼을 눌러도 "접수되지 않았습니다" | `js/config.js` 가 비어 있음 | 5번 확인 |
| 접수는 되는데 관리자 화면에 안 보임 | `admin_users` 미등록 | 3-2 실행 |
| 로그인은 되는데 "관리자로 등록돼 있지 않습니다" | 같은 원인 | 3-2 실행 |
| 콘솔에 CORS 오류 | `ALLOWED_ORIGINS` 불일치 | 4번 환경변수 확인 |
| 한동안 안 쓰다가 갑자기 접수 실패 | 프로젝트 자동 정지 | 8번 설정, 대시보드에서 Restore |
