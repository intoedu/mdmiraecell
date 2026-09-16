/* ============================================================
   상담·예약 폼 전송
   폼은 데이터베이스에 직접 접근하지 않습니다.
   Supabase Edge Function(submit-consultation)으로만 보냅니다.
   ============================================================ */
(function () {
  const cfg = window.MIRAE_CONFIG || {};
  const form = document.querySelector("form[data-consult-form]");
  if (!form) return;

  const kind = form.dataset.consultForm; // "reserve" | "contact"
  const btn = form.querySelector("button[type=submit]");
  const btnLabel = btn ? btn.textContent : "";
  const box = document.getElementById("form-result");

  /* ---------- 캡차 ---------- */
  let turnstileId = null;
  if (cfg.TURNSTILE_SITE_KEY) {
    const holder = document.createElement("div");
    holder.id = "turnstile-holder";
    holder.style.margin = "4px 0 18px";
    form.insertBefore(holder, form.querySelector(".form-note"));

    window.onTurnstileReady = function () {
      turnstileId = window.turnstile.render("#turnstile-holder", {
        sitekey: cfg.TURNSTILE_SITE_KEY,
        language: "ko",
      });
    };
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileReady&render=explicit";
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }

  /* ---------- 안내 메시지 ---------- */
  function say(kindOfMsg, html) {
    if (!box) return;
    box.className = "form-result " + kindOfMsg;
    box.innerHTML = html;
    box.hidden = false;
    box.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  const MESSAGES = {
    name_invalid: "성함을 정확히 입력해 주십시오.",
    phone_invalid: "연락처 형식을 확인해 주십시오. (예: 010-0000-0000)",
    email_invalid: "이메일 주소를 확인해 주십시오.",
    date_invalid: "희망 날짜를 확인해 주십시오.",
    date_required: "희망 날짜를 선택해 주십시오.",
    message_required: "문의 내용을 입력해 주십시오.",
    consent_required: "개인정보 수집·이용에 동의해 주셔야 접수가 가능합니다.",
    captcha_failed: "자동입력 방지 확인에 실패했습니다. 잠시 후 다시 시도해 주십시오.",
    rate_limited: "짧은 시간에 여러 번 접수하셨습니다. 잠시 후 다시 시도해 주시거나 전화로 연락 주십시오.",
    origin_not_allowed: "접수 경로를 확인할 수 없습니다. 홈페이지 주소로 다시 접속해 주십시오.",
  };

  function failHtml(code) {
    const tel = cfg.TEL || "02-776-8768";
    const msg = MESSAGES[code] || "접수 중 문제가 발생했습니다.";
    return `<b>접수되지 않았습니다.</b><br>${msg}<br>
      <span class="sub">계속 같은 문제가 생기면 <a href="tel:${tel.replace(/-/g, "")}">${tel}</a> 로 전화 주십시오.</span>`;
  }

  /* ---------- 전송 ---------- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (btn && btn.disabled) return;

    if (!cfg.SUPABASE_URL) {
      say("bad", failHtml("not_configured"));
      console.error("MIRAE_CONFIG.SUPABASE_URL 이 비어 있습니다. docs/SETUP.md 참고");
      return;
    }

    const d = new FormData(form);
    const payload = {
      kind,
      name: d.get("name") || "",
      phone: d.get("phone") || "",
      email: d.get("email") || "",
      preferred_date: d.get("preferred_date") || "",
      preferred_time: d.get("preferred_time") || "",
      topic: d.get("topic") || "",
      message: d.get("message") || "",
      consent_privacy: d.get("consent_privacy") === "on",
      consent_sensitive: d.get("consent_sensitive") === "on",
      website: d.get("website") || "", // 허니팟
      source_page: location.pathname,
      referrer: document.referrer || "",
      turnstile_token: turnstileId !== null ? window.turnstile.getResponse(turnstileId) : "",
    };

    if (!payload.consent_privacy) {
      say("bad", failHtml("consent_required"));
      return;
    }

    if (btn) { btn.disabled = true; btn.textContent = "접수 중입니다…"; }
    if (box) box.hidden = true;

    try {
      const res = await fetch(
        `${cfg.SUPABASE_URL}/functions/v1/${cfg.SUBMIT_FUNCTION || "submit-consultation"}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            apikey: cfg.SUPABASE_ANON_KEY || "",
            Authorization: `Bearer ${cfg.SUPABASE_ANON_KEY || ""}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const out = await res.json().catch(() => ({}));

      if (res.ok && out.ok) {
        const tel = cfg.TEL || "02-776-8768";
        form.innerHTML = `
          <div class="form-done">
            <div class="mark">✓</div>
            <h3>${kind === "reserve" ? "예약 신청이 접수되었습니다" : "문의가 접수되었습니다"}</h3>
            <p>확인 후 남겨 주신 연락처로 담당자가 연락드리겠습니다.<br>
               진료시간 내 접수 건은 당일, 이후 접수 건은 다음 진료일에 연락드립니다.</p>
            <p class="tel">급하신 경우 <a href="tel:${tel.replace(/-/g, "")}">${tel}</a></p>
          </div>`;
        return;
      }

      say("bad", failHtml(out.error));
    } catch (err) {
      console.error(err);
      say("bad", failHtml("network"));
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = btnLabel; }
      if (turnstileId !== null && window.turnstile) window.turnstile.reset(turnstileId);
    }
  });
})();
