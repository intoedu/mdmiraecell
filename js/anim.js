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

  /* ---------- 커서를 따라다니는 빛 ----------
     카드 위에 마우스를 올리면 커서 자리에서 빛이 번집니다.

     · 마우스가 있는 기기에서만 켭니다. 손가락에는 커서가 없습니다.
     · 듣는 자리는 문서 하나뿐입니다. 카드마다 달면 수십 개가 됩니다.
     · 좌표 계산은 한 프레임에 한 번만 합니다. 마우스는 1초에 백 번도
       움직이는데 그때마다 화면을 다시 그리면 버벅입니다.
     · 빛이 켜진 카드는 언제나 하나뿐이라, 다시 그리는 곳도 하나입니다. */
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fine) {
    /* 어디에 빛을 켤지 — HTML 을 고치지 않고 여기서 정합니다.
       .card 는 홈·의원소개·오시는 길·진료 분야 페이지에 두루 쓰입니다.
       관리자 패널(admin.html)은 이 파일을 아예 불러오지 않으므로 빠집니다.
       갤러리 사진(.gal img)은 넣지 않았습니다. <img> 같은 요소에는 브라우저가
       가상 요소를 그리지 않아 빛이 아예 나타나지 않습니다. */
    var SPOT = [".card", ".info-strip .info-item", ".board a",
                ".faq details, .accordion details"];
    var spots = [];
    SPOT.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add("spot");
        spots.push({ el: el, a: 0 });
      });
    });

    if (spots.length) {
      /* 빛은 화면에 하나뿐이고, 카드들은 그 빛을 나눠 받습니다.
         그래서 커서가 카드 사이 빈 곳에 있어도 양옆 카드의 마주 보는
         가장자리가 밝아지고, 빛이 카드를 건너 이어져 보입니다.

         카드마다 좌표를 따로 넣는 이유: 그라데이션 자리는 그 카드 기준이라
         같은 화면 지점을 가리키려면 카드마다 값이 달라야 합니다.
         카드 밖의 값도 그대로 넣습니다 — 그래야 가장자리만 밝아집니다. */
      var FALL = 200;            /* 카드 바깥으로 이만큼까지 빛이 닿습니다 */
      var lastX = null, lastY = null, raf = 0;

      var frame = function () {
        raf = 0;
        if (lastX === null) return;

        /* 읽기를 먼저 몰아서 하고 쓰기를 나중에 합니다.
           번갈아 하면 브라우저가 계산을 여러 번 다시 합니다. */
        var i, rects = [];
        for (i = 0; i < spots.length; i++) rects[i] = spots[i].el.getBoundingClientRect();

        for (i = 0; i < spots.length; i++) {
          var s = spots[i], r = rects[i];
          /* 커서에서 카드까지의 거리 — 카드 안이면 0 */
          var dx = lastX < r.left ? r.left - lastX : (lastX > r.right ? lastX - r.right : 0);
          var dy = lastY < r.top ? r.top - lastY : (lastY > r.bottom ? lastY - r.bottom : 0);
          var d = Math.sqrt(dx * dx + dy * dy);
          var a = d >= FALL ? 0 : 1 - d / FALL;
          a = a * a;               /* 멀어질수록 더 빨리 어두워지게 */

          if (a === 0 && s.a === 0) continue;   /* 멀리 있는 카드는 건드리지 않습니다 */
          s.a = a;
          s.el.style.setProperty("--spot-a", a.toFixed(3));
          s.el.style.setProperty("--mx", (lastX - r.left).toFixed(1) + "px");
          s.el.style.setProperty("--my", (lastY - r.top).toFixed(1) + "px");
        }
      };

      /* 한 프레임에 한 번만 계산합니다. 마우스도 스크롤도 1초에 수십 번 일어납니다. */
      var queue = function () { if (!raf) raf = requestAnimationFrame(frame); };

      document.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        document.body.classList.remove("spots-out");
        lastX = e.clientX; lastY = e.clientY;
        queue();
      }, { passive: true });

      /* 커서가 멈춰 있어도 화면이 움직이면 카드가 커서 밑을 지나갑니다 */
      window.addEventListener("scroll", queue, { passive: true });
      window.addEventListener("resize", queue, { passive: true });

      /* 창 밖으로 나가면 부드럽게 꺼 둡니다. 안 그러면 마지막 자리에 빛이 남습니다. */
      document.addEventListener("pointerleave", function () {
        lastX = lastY = null;
        document.body.classList.add("spots-out");
        spots.forEach(function (s) { s.a = 0; s.el.style.setProperty("--spot-a", "0"); });
      });
    }
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
