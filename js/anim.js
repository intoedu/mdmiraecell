/* ============================================================
   명동미래셀의원 · 동작(애니메이션) 제어
   ------------------------------------------------------------
   · main.js 가 헤더·푸터·진료 페이지를 그린 뒤에 실행됩니다.
     (그래서 페이지 맨 아래, main.js 다음에 불러옵니다)
   · 어떤 요소를 움직일지는 여기서 한 번에 정합니다.
     페이지를 새로 만들어도 HTML을 고칠 필요가 없습니다.
   · 기기에서 '동작 줄이기'를 켜신 분에게는 아무것도 하지 않습니다.
   ============================================================ */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 페이지 진입 ---------- */
  function ready() { document.body.classList.add("ready"); }
  if (document.readyState === "complete" || document.readyState === "interactive") {
    requestAnimationFrame(ready);
  } else {
    document.addEventListener("DOMContentLoaded", function () { requestAnimationFrame(ready); });
  }

  if (reduced) return; /* 여기서부터는 움직임이므로 그만둡니다 */

  /* ---------- 히어로 배경 광점 ----------
     HTML을 건드리지 않고 여기서 넣습니다. 장식 전용이라 읽어 줄 필요가 없습니다. */
  var hero = document.querySelector(".hero");
  if (hero) {
    ["g1", "g2"].forEach(function (cls) {
      var d = document.createElement("span");
      d.className = "glow " + cls;
      d.setAttribute("aria-hidden", "true");
      hero.appendChild(d);
    });
  }

  /* ---------- 등장시킬 요소 정하기 ----------
     [선택자, 효과, 묶음으로 순차 등장할지] */
  var TARGETS = [
    [".sec-head", "reveal", false],
    [".grid > .card", "reveal", true],
    [".info-strip .info-item", "reveal", true],
    [".board li", "reveal", true],
    [".about-visual", "reveal-left", false],
    [".about-txt", "reveal-right", false],
    [".svc-article", "reveal", false],
    [".svc-side", "reveal-left", false],
    [".svc-sec > h2, .svc-sec > .desc", "reveal", false],
    [".gal .ph, .gal img", "reveal-zoom", true],
    [".map-frame", "reveal-zoom", false],
    [".addr-box > *", "reveal", true],
    [".form-wrap", "reveal", false],
    [".faq-list > details, .accordion > details", "reveal", true],
    [".tags > li", "reveal", true],
    [".step-list > li", "reveal", true],
    ["section.block > .container > .btns", "reveal", false],
  ];

  var STAGGER = 0.09; /* 초 단위. 너무 길면 굼떠 보입니다 */

  TARGETS.forEach(function (t) {
    var nodes = document.querySelectorAll(t[0]);
    var group = null, idx = 0;
    nodes.forEach(function (el) {
      if (el.dataset.revealed) return;     /* 두 규칙에 걸린 요소는 한 번만 */
      el.dataset.revealed = "1";
      el.classList.add(t[1]);
      if (t[2]) {
        /* 같은 부모끼리 순서대로 지연 */
        if (el.parentElement !== group) { group = el.parentElement; idx = 0; }
        el.style.setProperty("--d", (idx * STAGGER).toFixed(2) + "s");
        idx++;
      }
    });
  });

  /* ---------- 화면에 들어오면 켜기 ---------- */
  var watched = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-zoom");

  if (!("IntersectionObserver" in window)) {
    /* 오래된 브라우저 — 그냥 전부 보여 줍니다 */
    watched.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);           /* 한 번만. 오르내릴 때마다 깜빡이면 피곤합니다 */
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    watched.forEach(function (el) { io.observe(el); });

    /* 처음부터 화면 안에 있던 요소는 관찰이 늦을 수 있어 한 번 더 확인 */
    setTimeout(function () {
      watched.forEach(function (el) {
        if (el.classList.contains("in")) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("in");
      });
    }, 900);
  }

  /* ---------- 헤더: 스크롤하면 얇아지기 ---------- */
  var header = document.querySelector("header.site");
  if (header) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        header.classList.toggle("scrolled", window.scrollY > 40);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 숫자 세기 ----------
     <span class="countup" data-to="10">10</span> 형태면 0부터 올라갑니다. */
  var counters = document.querySelectorAll(".countup[data-to]");
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target;
        var to = parseFloat(el.dataset.to) || 0;
        var dur = 1100, t0 = null;
        var step = function (ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);   /* 끝에서 부드럽게 멈춤 */
          el.textContent = Math.round(to * eased).toLocaleString("ko-KR");
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }
})();
