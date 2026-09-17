/* ============================================================
   명동미래셀의원 · 다국어
   ------------------------------------------------------------
   불러오는 순서: lang.js → i18n.js → main.js → anim.js
   (main.js 가 헤더를 그릴 때 이미 번역이 준비돼 있어야 합니다)

   쓰는 법
   · 자바스크립트 안에서 :  T("nav.cta", "진료 예약")
   · HTML 안에서          :  <h1 data-i18n="home.title">진료 예약 신청</h1>
     - 속성을 번역하려면   :  data-i18n-attr="placeholder:form.name.ph"
     - 줄바꿈이 들어가면    :  data-i18n-html="home.h1"
   · 번역이 없으면 한국어 원문이 그대로 나옵니다. 절대 비어 보이지 않습니다.
   ============================================================ */
(function () {
  "use strict";

  var PACKS = window.MIRAE_LANGS || {};
  var DEFAULT = "ko";
  var STORE = "mirae_lang";

  /* ---------- 어떤 언어로 보여 줄지 정하기 ----------
     1) 주소의 ?lang=  2) 지난번 선택  3) 브라우저 설정  4) 한국어 */
  function pick() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q && PACKS[q]) return q;

    try {
      var saved = localStorage.getItem(STORE);
      if (saved && PACKS[saved]) return saved;
    } catch (e) { /* 사생활 보호 모드 등 — 무시하고 넘어갑니다 */ }

    var prefs = navigator.languages || [navigator.language || ""];
    for (var i = 0; i < prefs.length; i++) {
      var code = String(prefs[i]).toLowerCase();
      if (code.indexOf("ko") === 0) return "ko";
      if (code.indexOf("zh") === 0) return "zh";
      if (code.indexOf("ja") === 0) return "ja";
      if (code.indexOf("ru") === 0) return "ru";
      if (code.indexOf("en") === 0) return "en";
    }
    return DEFAULT;
  }

  var lang = pick();
  var pack = PACKS[lang] || {};
  var dict = pack.s || {};

  /* 문서 언어를 표시합니다. 화면 낭독기와 검색엔진이 이걸 봅니다. */
  document.documentElement.setAttribute("lang", pack.htmlLang || lang);

  /* ---------- 번역 조회 ---------- */
  function T(key, fallback) {
    if (lang === "ko") return fallback !== undefined ? fallback : key;
    var v = dict[key];
    return (v === undefined || v === "") ? (fallback !== undefined ? fallback : key) : v;
  }
  window.T = T;

  /* ---------- 진료 분야 이름·요약 ----------
     main.js 의 SERVICES(한국어 원문)를 건드리지 않고 덮어씁니다. */
  function svc(key, field, fallback) {
    return T("svc." + key + (field === "title" ? "" : "." + field), fallback);
  }
  window.TSVC = svc;

  /* ---------- 진료 상세 본문 번역 불러오기 ----------
     본문은 분량이 커서 언어팩과 따로 두었습니다(js/svc-<언어>.js).
     진료 상세 페이지에서, 한국어가 아닐 때만 한 개 불러옵니다.

     document.write 를 쓰는 이유: main.js 가 본문을 그리기 전에
     번역이 준비돼 있어야 하기 때문입니다. 나중에 비동기로 받아
     다시 그리면 한국어가 한 번 번쩍 보였다 바뀝니다.
     같은 서버(same-origin)의 작은 파일이라 브라우저가 막지 않습니다. */
  function loadSvcPack() {
    if (lang === "ko") return;
    if (document.readyState !== "loading") return;   /* 이미 다 읽은 뒤면 늦었습니다 */
    if (!document.getElementById("svc-page")) return;
    document.write(
      '<scr' + 'ipt src="js/svc-' + lang + '.js?v=' + (window.MIRAE_VER || "51") + '"></scr' + 'ipt>'
    );
  }
  loadSvcPack();

  /* ---------- HTML 안의 번역 적용 ---------- */
  function applyDom(root) {
    (root || document).querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = T(el.getAttribute("data-i18n"), null);
      if (v !== null) el.textContent = v;
    });

    /* 줄바꿈·굵은 글씨가 들어간 문구용. 언어팩에서만 오는 값이라 안전합니다. */
    (root || document).querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = T(el.getAttribute("data-i18n-html"), null);
      if (v !== null) el.innerHTML = v;
    });

    /* data-i18n-attr="placeholder:key, title:key2" */
    (root || document).querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var bits = pair.split(":");
        if (bits.length < 2) return;
        var attr = bits[0].trim(), key = bits.slice(1).join(":").trim();
        var v = T(key, null);
        if (v !== null) el.setAttribute(attr, v);
      });
    });

    /* 제목(브라우저 탭) */
    var tk = document.body && document.body.getAttribute("data-i18n-title");
    if (tk) {
      var tv = T(tk, null);
      if (tv !== null) document.title = tv + " | " + T("site.name", "명동미래셀의원");
    }
  }

  /* ---------- 언어 선택 버튼 ---------- */
  var ORDER = ["ko", "en", "zh", "ja", "ru"];

  function buildSwitcher() {
    var wrap = document.querySelector("header.site .nav-wrap");
    if (!wrap || wrap.querySelector(".lang-pick")) return;

    var codes = ORDER.filter(function (c) { return PACKS[c]; });
    if (codes.length < 2) return;

    var box = document.createElement("div");
    box.className = "lang-pick";
    box.innerHTML =
      '<button type="button" class="lang-btn" aria-haspopup="true" aria-expanded="false">' +
        '<span class="globe" aria-hidden="true">🌐</span>' +
        '<span class="cur">' + (pack.short || lang.toUpperCase()) + '</span>' +
      '</button>' +
      '<ul class="lang-list">' +
        codes.map(function (c) {
          return '<li><a href="?lang=' + c + '" data-lang="' + c + '"' +
            (c === lang ? ' class="on" aria-current="true"' : '') + '>' +
            (PACKS[c].name || c) + '</a></li>';
        }).join("") +
      '</ul>';

    /* 예약 버튼 왼쪽에 놓습니다 */
    var cta = wrap.querySelector(".nav-cta");
    if (cta) wrap.insertBefore(box, cta); else wrap.appendChild(box);

    var btn = box.querySelector(".lang-btn");
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = box.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function () {
      box.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });

    box.querySelectorAll("a[data-lang]").forEach(function (a) {
      a.addEventListener("click", function () {
        try { localStorage.setItem(STORE, a.dataset.lang); } catch (e) {}
        /* 주소로도 이동하므로 새로고침되어 번역이 적용됩니다 */
      });
    });
  }

  /* ---------- 검색엔진에 다른 언어판을 알려 주기 ---------- */
  function addHreflang() {
    var base = location.origin + location.pathname;
    Object.keys(PACKS).forEach(function (c) {
      var l = document.createElement("link");
      l.rel = "alternate";
      l.hreflang = PACKS[c].htmlLang || c;
      l.href = base + (c === DEFAULT ? "" : "?lang=" + c);
      document.head.appendChild(l);
    });
  }

  window.MIRAE_I18N = { lang: lang, pack: pack, t: T, apply: applyDom };

  /* ---------- 아직 번역되지 않은 페이지 안내 ----------
     <body data-ko-only> 가 붙은 페이지에서, 한국어가 아닐 때만 나옵니다.
     번역된 것처럼 보이게 두는 것보다 먼저 말씀드리는 편이 정직합니다. */
  function koOnlyNotice() {
    if (lang === "ko" || !document.body.hasAttribute("data-ko-only")) return;
    var hero = document.querySelector(".page-hero");
    if (!hero) return;

    var box = document.createElement("div");
    box.className = "lang-notice";
    box.innerHTML =
      "<b></b><span></span>" +
      '<a href="contact"></a>';
    box.querySelector("b").textContent = T("page.konly.h", "");
    box.querySelector("span").textContent = T("page.konly.p", "");
    box.querySelector("a").textContent = T("nav.contact.inquiry", "문의하기");
    hero.parentNode.insertBefore(box, hero.nextSibling);
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyDom();
    buildSwitcher();
    addHreflang();
    koOnlyNotice();
  });
})();
