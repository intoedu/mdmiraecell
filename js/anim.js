/* ============================================================
   명동미래셀의원 · 동작(애니메이션) 제어
   ------------------------------------------------------------
   · main.js 가 헤더·푸터·진료 페이지를 그린 뒤에 실행됩니다.
     (그래서 페이지 맨 아래, main.js 다음에 불러옵니다)
   · 어떤 요소를 움직일지는 여기서 한 번에 정합니다.
     페이지를 새로 만들어도 HTML을 고칠 필요가 없습니다.
   · 움직임은 Motion(motion.dev, js/vendor/motion.js)으로 그립니다.
     그 파일을 못 불러온 경우에도 예전 방식(CSS 전환)으로 똑같이 보입니다.
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

  /* ---------- 첫 화면 글씨 순서 ----------
     예전 홈페이지(Anti-aging Therapy 화면)처럼
     큰 제목 글자가 하나씩 떠오르고 → 설명이 천천히 올라오고 → 단추가 돌아 열립니다.
     홈 큰 제목은 다 나온 뒤 잠시 머물렀다가 사라지고 다시 한 글자씩 나옵니다(LOOP).
     움직임은 CSS(css/anim.css 의 .seq 규칙)가 그리고, 여기서는 글자를 쪼개고 순서만 정합니다. */
  var LOOP = true;  /* 홈 큰 제목을 되풀이할지 — false 로 바꾸면 처음 한 번만 나옵니다 */
  var HOLD = 5;     /* 제목이 다 나온 뒤 머무는 시간(초) — 예전 홈페이지와 같습니다 */
  var introUntil = 0; /* 첫 화면 순서가 끝나는 시각. 그 전에 보이는 아래쪽 요소는 이때까지 기다립니다 */

  /* 글자를 하나씩 <span> 으로 나눕니다. 줄바꿈(<br>)은 그대로 두고,
     낱말은 한 덩어리로 묶어 낱말 가운데서 줄이 갈리지 않게 합니다.
     화면 읽기 프로그램에는 쪼개지 않은 문장을 따로 읽어 줍니다. */
  function splitChars(el) {
    if (el.dataset.split) return 0;
    var n = 0;
    var vis = document.createElement("span");
    vis.setAttribute("aria-hidden", "true");
    (function walk(from, into) {
      Array.prototype.forEach.call(from.childNodes, function (c) {
        if (c.nodeType === 3) {
          c.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { into.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span");
            w.className = "split-w";
            Array.from(part).forEach(function (ch) {
              var s = document.createElement("span");
              s.className = "split-ch";
              s.style.setProperty("--i", n++);
              s.textContent = ch;
              w.appendChild(s);
            });
            into.appendChild(w);
          });
        } else if (c.nodeType === 1) {
          var copy = c.cloneNode(false);
          into.appendChild(copy);
          if (c.tagName !== "BR") walk(c, copy);
        }
      });
    })(el, vis);
    if (!n) return 0;
    var sr = document.createElement("span");
    sr.className = "sr-only";
    /* 줄바꿈(<br>) 자리는 띄어 읽도록 빈칸으로 바꿉니다 — 그대로 두면 '되살리는건강한'처럼 붙습니다 */
    var plain = el.cloneNode(true);
    plain.querySelectorAll("br").forEach(function (br) { br.replaceWith(" "); });
    sr.textContent = plain.textContent.replace(/\s+/g, " ").trim();
    el.textContent = "";
    el.appendChild(sr);
    el.appendChild(vis);
    el.dataset.split = "1";
    el.classList.add("split");
    return n;
  }

  /* 여러 요소에 등장 시각(--at)과 길이(--dur)를 적고 효과 이름표를 붙입니다 */
  function cue(els, cls, at, dur, step) {
    Array.prototype.forEach.call(els, function (el, i) {
      el.classList.add(cls);
      el.style.setProperty("--at", (at + i * (step || 0)).toFixed(2) + "s");
      if (dur) el.style.setProperty("--dur", dur + "s");
    });
  }

  /* 제목 글자를 켭니다. 꺼진 자세를 화면이 한 번 그린 뒤에 켜야 전환이 일어납니다. */
  function lightUp(h) {
    requestAnimationFrame(function () { requestAnimationFrame(function () { h.classList.add("on"); }); });
  }

  function heroIntro() {
    /* ① 홈 첫 화면 */
    var hero = document.querySelector(".hero");
    var box = hero && hero.querySelector(".container");
    var h = box && box.querySelector("h1");
    if (h) {
      var n = splitChars(h);
      if (n) {
        box.classList.add("seq");
        /* 글자 사이 간격 — 글자가 많은 언어(영어 등)도 2초 안에 다 나오게 줄입니다 */
        var stag = Math.min(0.085, 1.9 / n);
        var AT = 0.55;
        var hEnd = AT + (n - 1) * stag + 0.55;
        h.style.setProperty("--stag", stag.toFixed(3) + "s");
        h.style.setProperty("--at", AT + "s");
        cue(box.querySelectorAll(".eyebrow"), "seq-rise", 0.15, 1.2);
        cue(box.querySelectorAll(":scope > p"), "seq-rise", hEnd - 0.2, 1.8);
        cue(box.querySelectorAll(".btns > *"), "seq-flip", hEnd + 0.5, 0, 0.22);
        introUntil = performance.now() + (hEnd + 0.7) * 1000;
        lightUp(h);

        if (LOOP) {
          var visible = true;
          if ("IntersectionObserver" in window) {
            new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(hero);
          }
          var again = (n - 1) * stag + 0.65;  /* 다시 나올 때 걸리는 시간 */
          var wait = function (sec) {
            setTimeout(function tick() {
              /* 화면 밖이거나 다른 탭을 보고 계시면 쉬었다가 돌아오면 이어 갑니다 */
              if (!visible || document.hidden) { setTimeout(tick, 1000); return; }
              h.classList.remove("on");                 /* 모든 글자가 함께 사라지고 */
              setTimeout(function () {
                h.style.setProperty("--at", "0.1s");
                h.classList.add("on");                  /* 다시 한 글자씩 */
                wait(again + HOLD);
              }, 800);
            }, sec * 1000);
          };
          wait(hEnd + HOLD);
        }
      }
    }

    /* ② 하위 페이지 상단 띠 — 같은 순서로, 한 번만 */
    var ph = document.querySelector(".page-hero");
    var ph1 = ph && ph.querySelector("h1");
    if (ph1) {
      var m = splitChars(ph1);
      if (m) {
        ph.classList.add("seq");
        var pst = Math.min(0.07, 1.2 / m);
        var pAt = 0.3;
        var pEnd = pAt + (m - 1) * pst + 0.55;
        ph1.style.setProperty("--stag", pst.toFixed(3) + "s");
        ph1.style.setProperty("--at", pAt + "s");
        cue(ph.querySelectorAll(".crumb"), "seq-rise", 0.08, 1);
        cue(ph.querySelectorAll(":scope > p:not(.crumb)"), "seq-rise", pEnd - 0.15, 1.4);
        cue(ph.querySelectorAll(".btns > *"), "seq-flip", pEnd + 0.4, 0, 0.2);
        introUntil = Math.max(introUntil, performance.now() + pEnd * 1000);
        lightUp(ph1);
      }
    }
  }

  /* 번역(js/i18n.js)이 제목을 바꿔 넣은 뒤에 쪼개야 합니다. i18n 도 이 시점에 일하므로
     그보다 늦게 등록된 이 처리가 뒤에 돕니다. */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", heroIntro);
  } else {
    heroIntro();
  }

  var M = window.Motion;
  var hasMotion = !!(M && M.animate && M.inView && M.scroll);
  /* 좁은 화면에서는 좌우 등장을 위아래로 바꿉니다. 가로로 밀리면 화면이 흔들려 보입니다. */
  var narrow = window.matchMedia("(max-width: 768px)").matches;

  /* ---------- 등장시킬 요소 정하기 ----------
     [선택자, 효과, 묶음으로 순차 등장할지]
     위에 적은 규칙이 먼저입니다. 이미 고른 요소의 안쪽이나 바깥쪽은 다시 고르지 않습니다.
     (상자와 그 안의 글줄이 같이 흐려졌다 나타나면 두 번 깜빡이는 것처럼 보입니다) */
  var TARGETS = [
    /* 섹션 제목 — 영문 꼬리표·제목·설명이 좌우에서 번갈아 들어옵니다(예전 홈페이지의 fade-left/right) */
    [".sec-head > *", "alt-lr", true],
    /* 카드 줄 — 위·아래에서 번갈아 엇갈려 들어옵니다(예전 홈페이지의 fade-down/up) */
    [".grid > .card", "alt-ud", true],
    [".info-strip .info-item", "alt-ud", true],
    [".board li", "reveal", true],
    [".about-visual", "reveal-left", false],
    [".about-txt", "reveal-right", false],
    [".doc-flex > .doc-photo", "reveal-left", false],
    [".doc-flex > div", "reveal-right", false],
    [".lang-notice", "reveal", false],
    [".svc-article", "reveal", false],
    [".svc-side", "reveal-left", false],
    [".svc-sec > h2, .svc-sec > .desc", "reveal", false],
    /* 진료 페이지 본문 — 탭 제목·탭 단추, 그리고 설명을 문단 단위로 */
    [".svc-group > h4, .svc-group > .tab-bar", "reveal", false],
    [".tab-panel > h5", "reveal", false],
    [".tab-desc > *", "reveal", true],
    [".svc-sec > :not(.svc-group)", "reveal", false],
    [".svc-main > div", "reveal", false],
    [".gal .ph, .gal img", "reveal-zoom", true],
    [".map-frame", "reveal-zoom", false],
    [".video-wrap", "reveal-zoom", false],
    [".addr-box > *", "reveal", true],
    [".form-wrap", "reveal", false],
    [".faq > details, .faq-list > details, .accordion > details", "reveal", true],
    [".tags > li", "reveal", true],
    [".step-list > li", "reveal", true],
    ["section.block > .container > .btns", "reveal", false],
    /* 이름표(class) 없이 단추만 담은 줄 — 홈의 '전체 소식 보기', 진료안내의 상담 단추 */
    ["section.block > .container > div:not([class])", "reveal", false],
  ];

  var STAGGER = 0.22; /* 초 단위. 예전 홈페이지(0.3초)처럼 '하나씩' 보이도록 넉넉히 둡니다 */
  var MAX_DELAY = 1.1; /* 한 묶음이 아무리 길어도 이 이상 기다리게 하지 않습니다 */

  /* 효과별 출발 자세 — 도착 자세는 모두 '제자리'입니다 */
  var FROM = {
    "reveal":       "translateY(56px)",
    "reveal-down":  "translateY(-56px)",
    "reveal-left":  narrow ? "translateY(56px)" : "translateX(-70px)",
    "reveal-right": narrow ? "translateY(56px)" : "translateX(70px)",
    "reveal-zoom":  "scale(0.92)",
  };
  var REST = {
    "reveal": "translateY(0px)", "reveal-down": "translateY(0px)",
    "reveal-left": narrow ? "translateY(0px)" : "translateX(0px)",
    "reveal-right": narrow ? "translateY(0px)" : "translateX(0px)", "reveal-zoom": "scale(1)",
  };

  /* 천천히 다가와 부드럽게 멈추는 곡선. 튕김 없이 차분하게 — 예전 홈페이지처럼 1초 남짓 */
  var EASE = [0.25, 0.46, 0.45, 0.94];
  var DUR = 1.1;

  /* 번갈아 쓰는 효과 — 형제 사이 순번으로 정합니다.
     위·아래: 첫째는 위에서, 둘째는 아래에서 … / 좌·우: 첫째는 오른쪽에서, 둘째는 왼쪽에서 … */
  function resolveFx(el, fx) {
    if (fx !== "alt-ud" && fx !== "alt-lr") return fx;
    var k = Array.prototype.indexOf.call(el.parentElement.children, el) % 2;
    if (fx === "alt-ud") return k ? "reveal" : "reveal-down";
    return k ? "reveal-left" : "reveal-right";
  }

  var picked = [];   /* [요소, 효과, 묶음 여부] */
  TARGETS.forEach(function (t) {
    document.querySelectorAll(t[0]).forEach(function (el) {
      if (el.dataset.revealed) return;     /* 두 규칙에 걸린 요소는 한 번만 */
      if (el.parentElement && el.parentElement.closest("[data-revealed]")) return;
      if (el.querySelector("[data-revealed]")) return;
      if (el.closest("#site-header, #site-footer")) return;
      el.dataset.revealed = "1";
      picked.push([el, resolveFx(el, t[1]), t[2]]);
    });
  });

  /* 섹션 제목의 밑줄은 CSS 가 그립니다(.sec-head.in). 꼬리표(.tag)가 나올 때 함께 긋습니다. */
  function underline(el, on, delay) {
    var head = el.parentElement;
    if (!head || !head.classList.contains("sec-head") || !el.classList.contains("tag")) return;
    head.style.setProperty("--d", (delay || 0).toFixed(2) + "s");
    head.classList.toggle("in", on);
  }

  if (hasMotion) {
    document.documentElement.classList.add("has-motion");

    /* 처음에는 투명하게만 숨겨 둡니다. 화면은 아직 투명(body.ready 전)이라 깜빡이지 않습니다.
       자리를 미리 옮겨 두지는 않습니다 — 아래로 밀어 둔 요소는 '화면에 들어왔는지' 판단이
       어긋나, 화면 맨 아래 줄(안내 띠 등)이 끝내 나타나지 않는 일이 생깁니다.
       출발 자리는 움직이기 시작할 때 Motion 이 잡습니다. */
    picked.forEach(function (p) { p[0].style.opacity = "0"; });

    /* ---------- 화면에 들어오면 떠오르기 ----------
       같은 순간에 함께 들어온 형제들끼리만 순서를 매깁니다.
       (예전처럼 목록 전체에서 순번을 매기면 아래쪽 카드는 한참 늦게 나옵니다) */
    var effectOf = new Map(), stagOf = new Map();
    picked.forEach(function (p) { effectOf.set(p[0], p[1]); stagOf.set(p[0], p[2]); });

    var pending = [], flushQueued = false;
    var flush = function () {
      flushQueued = false;
      var batch = pending; pending = [];
      batch.sort(function (a, b) {
        return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });
      /* 첫 화면 글씨가 아직 나오는 중이면, 그 아래 보이는 요소(안내 띠 등)는 끝날 때까지 기다립니다 */
      var wait = Math.max(0, (introUntil - performance.now()) / 1000);
      var counter = new Map();
      batch.forEach(function (el) {
        var fx = effectOf.get(el);
        var delay = wait;
        if (stagOf.get(el)) {
          var n = counter.get(el.parentElement) || 0;
          counter.set(el.parentElement, n + 1);
          delay += Math.min(n * STAGGER, MAX_DELAY);
        }
        el.style.setProperty("--d", delay.toFixed(2) + "s");
        el.classList.add("in");
        underline(el, true, delay);

        var token = el._rv = (el._rv || 0) + 1;
        var a1 = M.animate(el, { opacity: [0, 1] }, { duration: DUR, delay: delay, ease: EASE });
        var a2 = M.animate(el, { transform: [FROM[fx], REST[fx]] }, { duration: DUR + 0.1, delay: delay, ease: EASE });
        el._anims = [a1, a2];
        a2.then(function () {
          /* 다 끝나면 손을 뗍니다. 남겨 두면 카드에 마우스를 올렸을 때
             CSS 의 떠오르는 효과(:hover)를 이 값이 막아 버립니다.
             Motion 이 끝난 뒤 다음 화면을 그릴 때 마지막 값을 한 번 더 적어 넣으므로,
             두 프레임 뒤에 지워야 실제로 지워집니다. (setTimeout 0 으로는 다시 덮여
             카드에 마우스를 올려도 떠오르지 않았습니다 — 재어 보고 고쳤습니다) */
          requestAnimationFrame(function () { requestAnimationFrame(function () {
            if (el._rv !== token) return;   /* 그사이 다시 숨겨졌으면 건드리지 않습니다 */
            el.style.transform = "";
            el.style.opacity = "";
          }); });
        });
      });
    };

    /* 숨겨 둔 요소만 떠오릅니다. 처음엔 모두 숨겨져 있습니다. */
    picked.forEach(function (p) { p[0]._hidden = true; });

    M.inView(picked.map(function (p) { return p[0]; }), function (el) {
      if (el._hidden) {
        el._hidden = false;
        pending.push(el);
        if (!flushQueued) { flushQueued = true; requestAnimationFrame(flush); }
      }
      /* 예전 홈페이지처럼, 위로 올라갔다가 다시 내려오면 또 한 번 나타납니다.
         단, 요소가 화면 '아래'로 빠져나갔을 때(=위로 되돌아 올라갔을 때)만 다시 숨깁니다.
         화면 위로 지나간 요소까지 숨기면, 거꾸로 올라올 때마다 깜빡여 피곤합니다. */
      return function (entry) {
        /* 화면 밖 아래로 완전히 내려갔을 때만입니다. 막 떠오르기 시작한 요소는 출발 자리(아래 56px)
           때문에 잠깐 '빠져나간' 것으로 잡힐 수 있는데, 그때 숨기면 끝내 나타나지 않습니다. */
        if (entry.boundingClientRect.top <= window.innerHeight) return;
        el._rv = (el._rv || 0) + 1;
        (el._anims || []).forEach(function (a) { a.stop(); });
        el._hidden = true;
        el.classList.remove("in");
        underline(el, false);
        el.style.opacity = "0";
        el.style.transform = "";
      };
    }, { margin: "0px 0px -10% 0px", amount: 0.08 });

    scrollLinked();
  } else {
    /* ---------- Motion 을 못 불러왔을 때 — 예전 CSS 방식 ---------- */
    var group = null, idx = 0;
    picked.forEach(function (p) {
      var el = p[0];
      el.classList.add(p[1]);
      if (p[2]) {
        if (el.parentElement !== group) { group = el.parentElement; idx = 0; }
        el.style.setProperty("--d", (idx * 0.2).toFixed(2) + "s");
        idx++;
      }
    });

    var watched = picked.map(function (p) { return p[0]; });
    if (!("IntersectionObserver" in window)) {
      watched.forEach(function (el) { el.classList.add("in"); underline(el, true, 0); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("in");
          underline(e.target, true, parseFloat(e.target.style.getPropertyValue("--d")) || 0);
          io.unobserve(e.target);
        });
      }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
      watched.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- 스크롤에 맞춰 움직이기 (Motion 전용) ----------
     스크롤 위치에 따라 값이 정해지므로, 올리면 되돌아가고 내리면 다시 갑니다.
     transform·opacity 만 움직입니다. 이 둘은 화면을 다시 배치하지 않아 부드럽습니다.
     지원하는 브라우저에서는 Motion 이 브라우저 자체 스크롤 타임라인에 맡겨
     자바스크립트가 바쁠 때도 끊기지 않습니다. */
  function scrollLinked() {
    var lin = { ease: "linear" };

    /* ① 맨 위의 읽기 진행 막대 — 페이지를 얼마나 읽었는지 가늘게 보여 줍니다 */
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    M.scroll(M.animate(bar, { transform: ["scaleX(0)", "scaleX(1)"] }, lin));

    /* ② 홈 히어로 — 배경은 천천히, 글씨는 살짝 빨리 위로 빠지며 옅어집니다.
       배경을 미리 조금 키워 두어(1.18배) 내려가도 위쪽 가장자리가 드러나지 않습니다.
       글자 하나하나는 CSS 등장 효과가 맡고 있어서, 감싸는 상자를 움직입니다. */
    var hero = document.querySelector(".hero");
    if (hero) {
      var heroRange = { target: hero, offset: ["start start", "end start"] };
      /* 바깥 상자만 움직입니다. 안의 사진은 CSS 가 따로 천천히 흔듭니다(leaf-sway). */
      hero.querySelectorAll(".hero-media").forEach(function (bg) {
        M.scroll(M.animate(bg, { transform: ["translateY(0%) scale(1.18)", "translateY(9%) scale(1.18)"] }, lin), heroRange);
      });
      var heroBox = hero.querySelector(".container");
      if (heroBox) {
        M.scroll(M.animate(heroBox, { transform: ["translateY(0px)", "translateY(-56px)"], opacity: [1, 0.25] }, lin), heroRange);
      }
    }

    /* ③ 하위 페이지 상단 띠의 배경 사진·무늬 — 같은 원리로 조금 느리게 */
    var pageHero = document.querySelector(".page-hero");
    if (pageHero) {
      pageHero.querySelectorAll(".photo-bg, .motif-bg").forEach(function (bg) {
        M.scroll(M.animate(bg, { transform: ["translateY(0%) scale(1.24)", "translateY(11%) scale(1.24)"] }, lin),
          { target: pageHero, offset: ["start start", "end start"] });
      });
    }

    /* ④ 소개 그림 — 틀은 그대로 두고 안의 그림만 천천히 흘러갑니다(창 너머를 보는 느낌) */
    document.querySelectorAll(".about-visual img.motif").forEach(function (img) {
      M.scroll(M.animate(img, { transform: ["translateY(-6%) scale(1.14)", "translateY(6%) scale(1.14)"] }, lin),
        { target: img.parentElement, offset: ["start end", "end start"] });
    });
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
    /* 누르면 이동하는 것에만 켭니다. 안내만 하는 카드(<div class="card">)와
       초록 안내 띠(진료 상담·오시는 길 등)는 버튼이 아니라서 빛을 주지 않습니다. */
    var SPOT = ["a.card", ".board a",
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
  var showNum = function (el, v) { el.textContent = Math.round(v).toLocaleString("ko-KR"); };
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target;
        var to = parseFloat(el.dataset.to) || 0;
        if (hasMotion) {
          /* 끝에서 부드럽게 멈춤 */
          M.animate(0, to, { duration: 1.1, ease: [0.33, 1, 0.68, 1], onUpdate: function (v) { showNum(el, v); } });
          return;
        }
        var dur = 1100, t0 = null;
        var step = function (ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          showNum(el, to * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }
})();
