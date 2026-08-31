/* 공통 헤더/푸터 주입 — 페이지마다 복사하지 않도록 한 곳에서 관리 */

/* ---------- 진료/프로그램 데이터 (10개 분야 — 내용 수정은 여기서) ----------
   항목: 문자열이면 이름만, {n, d}면 탭 클릭 시 d 설명이 표시됨 */
const SERVICES = [
  { key: "stemcell", no: 1, title: "줄기세포",
    desc: "재생의학 기반의 줄기세포 치료로 손상된 조직의 회복과 건강한 세포 재생을 돕습니다.",
    groups: [
      { h: "혈액줄기세포", tags: [
        { n: "PRP (자가혈소판풍부혈장)", d: "자신의 혈액에서 혈소판을 농축해 손상 부위에 주입, 조직 재생을 촉진하는 치료입니다." },
        { n: "PRF (자가혈소판풍부섬유소)", d: "혈소판과 섬유소를 함께 활용해 보다 오래 지속되는 재생 효과를 기대할 수 있는 치료입니다." },
      ] },
      { h: "기타 줄기세포 치료", tags: [
        { n: "지방줄기세포", d: "자가 지방조직에서 채취한 줄기세포를 활용한 재생 치료입니다." },
        { n: "골수줄기세포", d: "골수에서 채취한 줄기세포로 조직의 재생과 회복을 돕습니다." },
        { n: "제대혈줄기세포", d: "제대혈 유래 줄기세포를 활용한 재생 치료 프로그램입니다." },
      ] },
    ] },
  { key: "derma", no: 2, title: "피부과",
    desc: "피부 본연의 건강함과 아름다움을 되찾는 맞춤 피부 치료 프로그램입니다.",
    groups: [ { tags: [
      { n: "엑소좀", d: "세포 유래 엑소좀 성분으로 피부 재생과 진정을 돕는 시술입니다." },
      { n: "리프팅 / 실리프팅", d: "처진 피부를 당겨 탄력 있는 얼굴 윤곽을 만드는 시술입니다." },
      { n: "색소 · 잡티 · 모공", d: "색소 침착과 잡티, 넓어진 모공을 개선하는 맞춤 피부 치료입니다." },
      { n: "레이저 토닝", d: "레이저로 색소를 서서히 분해해 맑고 균일한 피부톤을 만드는 시술입니다." },
      { n: "스킨부스터", d: "피부 속 수분과 영양을 채워 피부 결과 탄력을 개선하는 시술입니다." },
      { n: "물광주사", d: "히알루론산을 피부에 주입해 촉촉하고 빛나는 피부를 만드는 시술입니다." },
      { n: "주베룩 / 리쥬란", d: "피부 스스로의 재생을 유도해 잔주름과 피부 결을 개선하는 시술입니다." },
      { n: "히알루론산 필러", d: "볼륨이 필요한 부위를 자연스럽게 채워 균형 잡힌 인상을 만듭니다." },
      { n: "영구문신", d: "눈썹 등 얼굴 부위의 반영구·영구 문신 시술입니다." },
      { n: "보톡스", d: "주름 개선과 얼굴 윤곽 관리를 위한 보툴리눔 톡신 시술입니다." },
    ] } ] },
  { key: "plastic", no: 3, title: "성형외과",
    desc: "자연스러운 아름다움을 위한 정교한 성형 수술을 제공합니다.",
    groups: [ { tags: [
      { n: "눈 성형", d: "쌍꺼풀, 눈매교정 등 인상에 맞는 자연스러운 눈매를 만드는 수술입니다." },
      { n: "코 성형", d: "얼굴 전체의 균형에 맞는 코 라인을 디자인하는 수술입니다." },
      { n: "가슴 성형", d: "개인의 체형에 맞춘 자연스러운 가슴 성형 수술입니다." },
      { n: "모발이식", d: "자연스러운 헤어라인 복원을 위한 모발이식 수술입니다." },
      { n: "상안검 / 하안검", d: "처진 눈꺼풀과 눈밑 처짐을 개선해 또렷한 눈매를 만드는 수술입니다." },
      { n: "리프팅", d: "처진 얼굴 라인을 당겨 젊고 탄력 있는 인상을 만드는 수술입니다." },
      { n: "여성 성형 (질 성형)", d: "여성의 건강과 자신감 회복을 위한 여성 성형 수술입니다." },
    ] } ] },
  { key: "urology", no: 4, title: "비뇨기과",
    desc: "남성 건강을 위한 전문 비뇨기과 진료입니다.",
    groups: [
      { h: "전립선 클리닉", tags: [
        { n: "전립선 질환", d: "전립선 관련 질환 전반의 정확한 진단과 맞춤 치료를 제공합니다." },
        { n: "전립선 비대증", d: "배뇨 불편을 유발하는 전립선 비대증을 진단하고 치료합니다." },
        { n: "전립선염", d: "급성·만성 전립선염의 원인을 찾아 맞춤 치료를 제공합니다." },
        { n: "전립선암", d: "전립선암의 조기 발견을 위한 검진과 전문 상담을 제공합니다." },
        { n: "전립선 검사", d: "PSA 검사 등으로 전립선 건강 상태를 정밀하게 확인합니다." },
      ] },
      { h: "남성 클리닉", tags: [
        { n: "남성수술", d: "남성 건강과 자신감 회복을 위한 수술 프로그램입니다." },
        { n: "음경확대술", d: "개인 상태에 맞춘 안전한 확대 수술을 제공합니다." },
        { n: "조루수술", d: "조루 개선을 위한 수술적 치료입니다." },
        { n: "성기능 장애", d: "원인 진단부터 치료까지 성기능 장애를 통합적으로 관리합니다." },
      ] },
    ],
    note: "※ 비뇨기과 상세 정보는 전용 홈페이지에서 확인하실 수 있습니다. (별도 홈페이지 연결 예정)" },
  { key: "esthetic", no: 5, title: "에스테틱",
    desc: "전문 관리사의 손길로 몸과 마음의 균형을 되찾는 프리미엄 케어입니다.",
    groups: [ { tags: [
      { n: "페이스 관리", d: "피부 타입에 맞춘 얼굴 집중 케어 프로그램입니다." },
      { n: "등 관리", d: "등 부위의 트러블과 피부 결을 관리하는 프로그램입니다." },
      { n: "다리 관리", d: "부기와 피로를 풀어주는 다리 집중 케어입니다." },
      { n: "전신 관리", d: "전신의 균형과 컨디션을 관리하는 토탈 케어 프로그램입니다." },
      { n: "앞면 / 뒷면 관리", d: "필요한 부위를 선택해 받는 부위별 집중 케어입니다." },
      { n: "메디컬 마사지", d: "의료적 관점에서 설계된 전문 마사지 케어입니다." },
    ] } ] },
  { key: "toenail", no: 6, title: "내성발톱",
    desc: "통증 없이 일상으로 — 내성발톱의 원인부터 치료, 재발 방지까지 관리합니다.",
    groups: [ { tags: ["내성발톱 교정 · 치료"] } ] },
  { key: "scalp", no: 7, title: "두피케어",
    desc: "건강한 모발은 건강한 두피에서 시작됩니다. 두피 상태 진단 후 맞춤 관리를 제공합니다.",
    groups: [ { tags: ["두피 진단 · 케어 프로그램"] } ] },
  { key: "lymph", no: 8, title: "림프해독",
    desc: "림프 순환을 촉진하여 체내 노폐물 배출과 면역력 관리를 돕습니다.",
    groups: [ { tags: ["림프해독 마사지"] } ] },
  { key: "worldtour", no: 9, title: "월드투어",
    desc: "해외 방문 고객을 위한 메디컬 투어 프로그램입니다.",
    groups: [],
    note: "※ 월드투어 상세 안내는 전용 페이지에서 확인하실 수 있습니다. (별도 페이지 연결 예정)" },
  { key: "quantum", no: 10, title: "퀀텀 양자 진료치료",
    desc: "첨단 퀀텀 양자 기술을 활용한 진단 및 치료 프로그램입니다. 자세한 내용은 내원 상담 시 안내해 드립니다.",
    groups: [ { tags: ["퀀텀 양자 진단", "퀀텀 양자 치료"] } ] },
];
const svcHref = s => `${s.key}`;

/* 대메뉴 4개: [대표링크, 라벨, 하위]. 하위가 "mega"면 진료안내(10개 분야),
   아니면 [컬럼링크, 컬럼제목, [[링크, 항목], ...]] 배열 → 메뉴별 메가 패널로 렌더 */
const NAV_ITEMS = [
  ["about", "의원소개", [
    ["about", "소개·인사말", [["about#greeting", "인사말"], ["about#values", "진료 철학"]]],
    ["location", "오시는 길", [["location#map", "위치·지도"], ["location#transport", "대중교통 안내"]]],
  ]],
  ["services", "진료안내", "mega"],
  ["notice", "커뮤니티", [
    ["notice", "공지·소식", [["notice#list", "공지사항"], ["notice#video", "유튜브 영상"]]],
    ["gallery", "갤러리", [["gallery", "병원 갤러리"]]],
    ["faq", "자주 묻는 질문", [["faq", "FAQ"]]],
  ]],
  ["contact", "문의·예약", [
    ["contact", "문의하기", [["contact#form", "문의 양식"], ["mailto:mdmiraecellclinic@gmail.com", "이메일 문의"]]],
    ["reserve", "진료 예약", [["reserve#form", "온라인 예약 신청"], ["tel:027768768", "전화 예약 02-776-8768"]]],
  ]],
];

const TEL = "02-776-8768";
const EMAIL = "mdmiraecellclinic@gmail.com";
const ADDR = "서울특별시 중구 퇴계로 123, 7층 명동미래셀의원";

document.getElementById("site-header").innerHTML = `
<div class="top-bar"><div class="container">
  <a href="tel:${TEL.replace(/-/g, "")}">☎ ${TEL}</a>
  <a href="mailto:${EMAIL}">✉ ${EMAIL}</a>
</div></div>
<header class="site"><div class="container nav-wrap">
  <a class="brand" href="./"><img class="logo-img" src="images/logo.svg?v=2" alt="명동미래셀의원"></a>
  <nav class="main" id="main-nav"><ul>
    ${NAV_ITEMS.map(([href, label, sub], mi) => {
      /* .sub는 모바일 메뉴 전용 — 데스크톱은 메뉴별 메가 패널이 뜸 */
      const mobileLinks = sub === "mega"
        ? SERVICES.map(s => [svcHref(s), s.title])
        : sub.map(([h, l]) => [h, l]);
      return `<li data-mi="${mi}"><a href="${href}">${label}<span class="caret">▼</span></a>
        <ul class="sub">${mobileLinks.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join("")}</ul></li>`;
    }).join("")}
  </ul></nav>
  <a class="nav-cta" href="reserve">진료 예약</a>
  <button id="menu-btn" aria-label="메뉴 열기">☰</button>
</div>
${NAV_ITEMS.map(([href, label, sub], mi) => {
  const cols = sub === "mega"
    ? SERVICES.map(s => {
        const items = s.groups.flatMap((g, gi) => g.tags.map((t, ti) =>
          typeof t === "object" ? [`${svcHref(s)}#t${gi}-${ti}`, t.n] : [svcHref(s), t]));
        return `<div class="mega-col"><h5><a href="${svcHref(s)}">${s.title}</a></h5>
          ${items.map(([h, l]) => `<a href="${h}">${l}</a>`).join("")}</div>`;
      }).join("")
    : sub.map(([ch, ct, items]) => `<div class="mega-col"><h5><a href="${ch}">${ct}</a></h5>
        ${items.map(([h, l]) => `<a href="${h}">${l}</a>`).join("")}</div>`).join("");
  return `<div class="mega" data-mi="${mi}"><div class="mega-cols">${cols}</div></div>`;
}).join("")}
</header>`;

document.getElementById("site-footer").innerHTML = `
<footer class="site"><div class="container">
  <div class="cols">
    <div>
      <a class="brand" href="./" style="margin-bottom:16px"><img src="images/logo.svg?v=2" alt="명동미래셀의원" style="height:44px;filter:brightness(0) invert(1)"></a>
      <p style="margin-top:14px">${ADDR}<br>대표자 박종윤 · Tel ${TEL} · ${EMAIL}</p>
      <div class="sns">
        <a href="#" aria-label="유튜브" title="YouTube">▶</a>
        <a href="#" aria-label="인스타그램" title="Instagram">◉</a>
        <a href="#" aria-label="블로그" title="Blog">B</a>
        <a href="#" aria-label="카카오톡 채널" title="KakaoTalk">K</a>
      </div>
    </div>
    <div><h4>진료 안내</h4><ul>
      ${SERVICES.slice(0, 4).map(s => `<li><a href="${svcHref(s)}">${s.title}</a></li>`).join("")}
    </ul></div>
    <div><h4>바로가기</h4><ul>
      <li><a href="reserve">진료 예약</a></li>
      <li><a href="contact">문의하기</a></li>
      <li><a href="location">오시는 길</a></li>
      <li><a href="notice">공지·소식</a></li>
      <li><a href="faq">자주 묻는 질문</a></li>
    </ul></div>
  </div>
  <div class="fine">
    <span>© ${new Date().getFullYear()} 명동미래셀의원. All rights reserved.</span>
    <span>본 사이트의 콘텐츠는 의료광고 심의 기준을 준수합니다.</span>
  </div>
</div></footer>
<div class="quick">
  <a class="tel" href="tel:${TEL.replace(/-/g, "")}" title="전화 걸기" aria-label="전화 걸기">☎</a>
  <a class="rsv" href="reserve" title="진료 예약" aria-label="진료 예약">✎</a>
</div>`;

/* ---------- 진료 분야 개별 페이지 렌더링 (<main id="svc-page" data-svc="키">) ---------- */
const svcPage = document.getElementById("svc-page");
if (svcPage) {
  const cur = SERVICES.find(s => s.key === svcPage.dataset.svc);
  if (cur) {
    document.title = `${cur.title} | 명동미래셀의원`;
    svcPage.innerHTML = `
    <div class="page-hero">
      <p class="crumb">HOME &gt; 진료안내 &gt; ${cur.title}</p>
      <h1>${cur.title}</h1>
      <p>${cur.desc}</p>
    </div>
    <div class="container svc-layout">
      <aside class="svc-side"><ul>
        ${SERVICES.map(s => `<li><a href="${svcHref(s)}" class="${s.key === cur.key ? "on" : ""}">${s.no}. ${s.title}</a></li>`).join("")}
      </ul></aside>
      <div class="svc-main">
        <section class="svc-sec">
          <h2>${cur.no}. ${cur.title}</h2>
          <p class="desc">${cur.desc}</p>
          ${cur.groups.map((g, gi) => {
            const hasDesc = g.tags.some(t => typeof t === "object");
            if (!hasDesc) {
              return `<div class="svc-group">
                ${g.h ? `<h4>${g.h}</h4>` : ""}
                <ul class="tags">${g.tags.map(t => `<li>${t}</li>`).join("")}</ul>
              </div>`;
            }
            return `<div class="svc-group" data-tabgroup="${gi}">
              ${g.h ? `<h4>${g.h}</h4>` : ""}
              <div class="tab-bar">${g.tags.map((t, ti) =>
                `<button type="button" class="tab-btn${ti === 0 ? " on" : ""}" data-tab="${gi}-${ti}">${t.n}</button>`).join("")}</div>
              ${g.tags.map((t, ti) =>
                `<div class="tab-panel${ti === 0 ? " on" : ""}" data-panel="${gi}-${ti}"><h5>${t.n}</h5><p>${t.d}</p></div>`).join("")}
            </div>`;
          }).join("")}
          ${cur.note ? `<p class="svc-note">${cur.note}</p>` : ""}
        </section>
        <div style="background:var(--green-soft);border-radius:16px;padding:34px;text-align:center">
          <h3 style="font-size:20px;margin-bottom:8px">${cur.title} 진료가 궁금하신가요?</h3>
          <p style="color:var(--gray);margin-bottom:20px">전문 의료진이 자세히 상담해 드립니다. ☎ ${TEL}</p>
          <a class="btn btn-green" href="reserve">상담 예약하기</a>
        </div>
      </div>
    </div>`;
    svcPage.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const group = btn.closest("[data-tabgroup]");
        group.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("on", b === btn));
        group.querySelectorAll(".tab-panel").forEach(p => p.classList.toggle("on", p.dataset.panel === btn.dataset.tab));
      });
    });
    /* 메가 메뉴에서 #t그룹-탭 해시로 들어오면 해당 탭을 열고 그 위치로 스크롤 */
    const openHashTab = () => {
      const m = location.hash.match(/^#t(\d+)-(\d+)$/);
      if (!m) return;
      const btn = svcPage.querySelector(`.tab-btn[data-tab="${m[1]}-${m[2]}"]`);
      if (btn) {
        btn.click();
        /* 페이지 로드 완료 후 스크롤 (일찍 호출하면 브라우저 스크롤 복원이 덮어씀) */
        const go = () => setTimeout(() => btn.scrollIntoView({ block: "center" }), 100);
        if (document.readyState === "complete") go();
        else window.addEventListener("load", go, { once: true });
      }
    };
    openHashTab();
    window.addEventListener("hashchange", openHashTab);
  }
}

/* 진료안내 허브 페이지 카드 목록 (<div id="svc-index">) */
const svcIndex = document.getElementById("svc-index");
if (svcIndex) {
  svcIndex.innerHTML = SERVICES.map(s => `
    <a class="card" href="${svcHref(s)}">
      <div class="icon">${s.no}</div>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
      <span class="more">자세히 보기 →</span>
    </a>`).join("");
}

/* 현재 페이지가 속한 대메뉴 활성화 */
/* 로컬(.html 직접 접속)과 Pages(확장자 없음) 모두 대응 */
const here = (location.pathname.split("/").pop() || "index").replace(/\.html$/, "");
document.querySelectorAll("nav.main > ul > li").forEach(li => {
  const links = [...li.querySelectorAll("a")].map(a => a.getAttribute("href"));
  if (links.includes(here)) li.querySelector("a").classList.add("active");
});

/* 모바일 메뉴 */
document.getElementById("menu-btn").addEventListener("click", () => {
  document.getElementById("main-nav").classList.toggle("open");
});
/* 모바일: 대메뉴 텍스트는 페이지 이동, ▼ 아이콘은 세부항목 펼침/접힘 */
document.querySelectorAll("nav.main > ul > li > a").forEach(a => {
  a.addEventListener("click", e => {
    if (!window.matchMedia("(max-width:768px)").matches) return;
    if (!e.target.closest(".caret")) return; /* 텍스트 클릭 → 그대로 이동 */
    e.preventDefault();
    const li = a.parentElement;
    const wasOpen = li.classList.contains("open");
    li.parentElement.querySelectorAll("li.open").forEach(o => o.classList.remove("open"));
    if (!wasOpen) li.classList.add("open");
  });
});

/* 메뉴별 메가 패널: 대메뉴에 올리면 그 메뉴의 패널만 열리고,
   헤더+패널 영역을 벗어나거나 패널 안 링크를 클릭하면 닫힘 */
const siteHeader = document.querySelector("header.site");
const megaPanels = [...siteHeader.querySelectorAll(".mega")];
const openMega = mi => megaPanels.forEach(m => m.classList.toggle("on", m.dataset.mi === mi));
document.querySelectorAll("nav.main > ul > li").forEach(li =>
  li.addEventListener("mouseenter", () => openMega(li.dataset.mi)));
siteHeader.addEventListener("mouseleave", () => openMega(null));
megaPanels.forEach(m => m.addEventListener("click", e => {
  /* 같은 페이지 내 해시 이동은 리로드가 없어 패널이 남으므로, 클릭 즉시 닫는다 */
  if (e.target.closest("a")) openMega(null);
}));

/* 문의/예약 폼: 서버 없이 메일 클라이언트로 전송 (ponytail: 백엔드 확정 전 임시 — Formspree/자체 API 연결 시 교체) */
function mailtoSubmit(form, subject) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const d = new FormData(form);
    const body = [...d.entries()].map(([k, v]) => `${k}: ${v}`).join("\n");
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
const cf = document.getElementById("contact-form");
if (cf) mailtoSubmit(cf, "[홈페이지 문의] 명동미래셀의원");
const rf = document.getElementById("reserve-form");
if (rf) mailtoSubmit(rf, "[진료 예약 신청] 명동미래셀의원");
