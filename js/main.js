/* 공통 헤더/푸터 주입 — 페이지마다 복사하지 않도록 한 곳에서 관리 */

/* ---------- 진료/프로그램 데이터 (10개 분야 — 내용 수정은 여기서) ----------
   항목: 문자열이면 이름만, {n, d}면 탭 클릭 시 d 설명이 표시됨 */
const SERVICES = [
  { key: "stemcell", no: 1, title: "줄기세포",
    desc: "재생의학 기반의 줄기세포 치료로 손상된 조직의 회복과 건강한 세포 재생을 돕습니다.",
    intro: `<div class="svc-article">
      <h3>줄기세포란 무엇인가</h3>
      <p>줄기세포는 스스로 복제·증식하면서 여러 종류의 세포로 분화할 수 있는 능력을 가진 세포입니다. 성인의 몸에 남아 있는 성체줄기세포 가운데 재생의료에서 가장 널리 쓰이는 것이 중간엽줄기세포(Mesenchymal Stem/Stromal Cell, MSC)입니다.</p>
      <p>국제세포치료학회(ISCT)는 중간엽줄기세포를 다음 세 가지 최소 기준으로 정의합니다.</p>
      <ol>
        <li>표준 배양 조건에서 플라스틱 표면에 부착할 것</li>
        <li>CD105 · CD73 · CD90 양성이고, CD45 · CD34 · CD14(또는 CD11b) · CD79a(또는 CD19) · HLA-DR 음성일 것</li>
        <li>시험관 내에서 골모세포 · 지방세포 · 연골모세포로 분화할 수 있을 것</li>
      </ol>
      <p>이 기준을 만족하는 중간엽줄기세포는 골수, 지방조직, 제대혈 등 여러 조직에서 얻을 수 있으며, 어느 조직에서 채취하느냐에 따라 얻어지는 세포의 양과 특성이 달라집니다. 아래에서 각 치료별 특징을 안내해 드립니다.</p>
    </div>`,
    groups: [
      { h: "자가 혈액 재생 치료", tags: [
        { n: "PRP (혈소판 풍부 혈장)", d: `
          <p>환자 본인의 혈액을 채혈하여 원심분리한 뒤, 혈소판이 농축된 혈장 층만 분리한 제제입니다. 자가 혈액에서 혈소판을 추출한 농축액으로, 성장인자를 정상 혈액의 3~5배 함유하는 것으로 알려져 있습니다.</p>
          <h6>작용 원리</h6>
          <p>혈소판이 활성화되면서 저장되어 있던 성장인자와 사이토카인이 방출되어, 손상 부위의 치유 반응을 자극하는 것으로 설명됩니다.</p>
          <h6>주요 적용 분야</h6>
          <p>근골격계(건병증, 상과염, 관절염 등 통증 질환), 피부 재생 및 모발 분야에서 사용됩니다.</p>
          <p class="fine-note">※ PRP는 자가 혈액 유래 제제로 줄기세포 제제와는 구분되며, 효과의 정도와 지속 기간은 적용 부위와 개인 상태에 따라 다를 수 있습니다. 모든 사람에게 같은 효과가 나타나는 것은 아닙니다.</p>` },
        { n: "PRF (혈소판 풍부 피브린)", d: `
          <p>항응고제를 사용하지 않고 채혈 직후 즉시 원심분리하여, 몸 자체의 응고 경로가 작동하도록 만든 피브린 매트릭스(막·젤) 형태의 혈소판 농축물입니다. '2세대 혈소판 농축물'로 불립니다.</p>
          <h6>PRP와의 차이</h6>
          <ul>
            <li><b>항응고제</b> — PRP는 사용하지만, PRF는 사용하지 않습니다.</li>
            <li><b>형태</b> — PRP는 액상으로 주사하며, PRF는 피브린 그물망 형태의 막·젤입니다(주사형 파생형도 있음).</li>
            <li><b>성장인자 방출</b> — PRP는 활성화 직후 빠르게, PRF는 피브린 매트릭스에서 서서히 방출되는 것으로 보고됩니다.</li>
          </ul>
          <p class="fine-note">※ PRF는 자가 혈액에서 만들어지므로 이물 반응이나 감염 전파의 위험이 상대적으로 낮은 편입니다. 다만 개인 간·시술 간 결과의 편차가 있을 수 있습니다.</p>` },
      ] },
      { h: "줄기세포 치료", tags: [
        { n: "지방유래 줄기세포", d: `
          <p>지방흡입으로 얻은 지방조직을 처리하여 기질혈관분획(SVF)을 분리하고, 여기서 중간엽줄기세포를 얻습니다.</p>
          <h6>특성</h6>
          <ul>
            <li>골수유래 줄기세포에 비해 배양이 쉽고 증식 속도가 빠르며, 세포 노화가 상대적으로 늦습니다.</li>
            <li>채취가 비교적 간편하고 확보 가능한 양이 풍부합니다.</li>
          </ul>
          <p class="fine-note">※ 지방줄기세포는 명확한 표지인자가 아직 확립되어 있지 않아 혼합세포군을 사용하게 되는 경우가 많으며, 치료 적용 가능 여부는 진료 상담을 통해 개별적으로 안내해 드립니다.</p>` },
        { n: "골수유래 줄기세포", d: `
          <p>환자의 장골능(엉덩뼈)에서 골수를 흡인한 뒤 원심분리하여 농축한 것을 자가 골수 흡인 농축물(BMAC)이라 하며, 이를 주사하거나 별도로 배양하여 활용합니다.</p>
          <h6>특성</h6>
          <ul>
            <li>가장 먼저 알려진 성체줄기세포로, 연구 축적이 가장 많습니다.</li>
            <li>채취 시 통증이 있고 한 번에 많은 양을 얻기 어려우며, 증식 속도는 지방유래보다 느린 편입니다.</li>
          </ul>
          <p>자가 골수 흡인 농축물 관절강내 주사는 2023년 7월 신의료기술로 등재되었으며(보건복지부 고시 제2023-128호), 무릎 골관절염 환자에서 기존 히알루론산 관절강내 주사와 유사한 수준의 통증 완화 및 기능 개선 효과가 있는 것으로 평가되었습니다.</p>` },
        { n: "제대혈유래 줄기세포", d: `
          <p>제대혈은 신생아 분만 시 탯줄을 절단한 이후 태반과 탯줄의 혈관에 남아 있는 신생아의 혈액입니다.</p>
          <h6>포함된 세포</h6>
          <ul>
            <li><b>조혈모세포</b> — 백혈병, 재생불량빈혈 등 난치성 질환의 조혈모세포이식에 활용됩니다.</li>
            <li><b>중간엽줄기세포</b> — 다양한 조직으로 분화 가능하며 세포치료에 활용됩니다.</li>
          </ul>
          <p>국내 제대혈은 「제대혈 관리 및 연구에 관한 법률」에 따라 허가받은 제대혈은행이 채취·검사·보관·공급을 관리합니다.</p>
          <p class="fine-note">※ 제대혈유래 줄기세포는 분만 시에만 획득이 가능하다는 제약이 있습니다.</p>` },
      ] },
    ],
    outro: `<div class="svc-article svc-consent">
      <h3>시술 전 안내</h3>
      <p>본원은 재생의료 시술에 앞서 다음 사항을 충분히 설명해 드립니다. 아래 항목은 어느 의료기관에서 상담을 받으시더라도 확인하실 권리가 있는 내용입니다.</p>
      <ul>
        <li>이 시술이 해당 질환의 표준 치료인지, 그리고 어떤 대체 치료가 있는지</li>
        <li>사용되는 세포의 출처와, 세포를 어떻게 식별·분리·배양하고 어떤 경로로 투여하는지</li>
        <li>기대할 수 있는 구체적인 효과와, 그 효과를 무엇으로 측정하는지</li>
        <li>시술 자체의 위험과 즉각적·장기적 부작용, 부작용 발생 시의 대응과 책임 주체</li>
        <li>이 시술을 뒷받침하는 과학적 근거와 국가 규제기관의 승인·심의 여부</li>
        <li>총 비용과 추가로 발생할 수 있는 비용</li>
        <li>시술 후 장기 추적관찰 계획</li>
      </ul>
      <p>모든 시술에는 위험이 있습니다. 서로 다른 질환은 각각 다른 접근이 필요하며, 하나의 시술이 모든 질환의 해답이 될 수는 없습니다. 결정을 서두르실 필요는 없으며, 궁금하신 점은 진료 상담을 통해 충분히 확인하시기 바랍니다.</p>
    </div>` },
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
    desc: "내국인과 해외 방문 고객 모두를 위한 메디컬 투어 프로그램입니다.",
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
    ["about", "소개·인사말", [["about#greeting", "인사말"], ["about#doctor", "의료진 소개"], ["about#values", "진료 철학"]]],
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
    <span><a href="tel:${TEL.replace(/-/g, "")}">☎ ${TEL}</a> · <a href="mailto:${EMAIL}">✉ ${EMAIL}</a></span>
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
          ${cur.intro || ""}
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
                `<div class="tab-panel${ti === 0 ? " on" : ""}" data-panel="${gi}-${ti}"><h5>${t.n}</h5><div class="tab-desc">${t.d}</div></div>`).join("")}
            </div>`;
          }).join("")}
          ${cur.note ? `<p class="svc-note">${cur.note}</p>` : ""}
          ${cur.outro || ""}
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
