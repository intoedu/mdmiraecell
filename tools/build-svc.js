/* ============================================================
   진료 상세 본문 번역 조립기
   ------------------------------------------------------------
   i18n-src/<언어>/<진료키>.json  →  js/svc-<언어>.js

   쓰는 법:  node tools/build-svc.js
   번역 파일을 고치신 뒤 이 한 줄만 실행하시면 됩니다.

   · 파일이 없는 진료 분야는 그냥 빠집니다. 그 분야는 한국어로 나옵니다.
   · 칸(hero·intro·groups·outro·cta·note)도 하나씩 따로 봅니다.
     일부만 번역돼 있어도 나머지는 한국어가 나옵니다.
   ============================================================ */
const fs = require("fs");
const path = require("path");

const LANGS = ["en", "zh", "ja", "ru"];
const ORDER = ["stemcell","derma","plastic","urology","esthetic",
               "toenail","scalp","lymph","worldtour","quantum"];

/* 한국어 원본에서 구조(그룹 수·항목 수)를 읽어 대조합니다.
   번호가 어긋나면 메뉴의 바로가기 주소(#t0-1 같은 것)가 엉킵니다. */
const main = fs.readFileSync(path.join(__dirname, "..", "js", "main.js"), "utf8");
const KO = eval(main.slice(main.indexOf("const SERVICES"), main.indexOf("const svcHref")) + "; SERVICES");
const koBy = Object.fromEntries(KO.map(v => [v.key, v]));

let problems = 0;

for (const lang of LANGS) {
  const dir = path.join(__dirname, "..", "i18n-src", lang);
  const out = {};
  let chars = 0;

  for (const key of ORDER) {
    const f = path.join(dir, key + ".json");
    if (!fs.existsSync(f)) continue;

    let v;
    try { v = JSON.parse(fs.readFileSync(f, "utf8")); }
    catch (e) { console.log(`❌ ${lang}/${key}.json 읽기 실패: ${e.message}`); problems++; continue; }

    /* 구조 대조 */
    const ko = koBy[key];
    if (v.groups) {
      if (v.groups.length !== ko.groups.length) {
        console.log(`❌ ${lang}/${key}: 그룹 수가 다릅니다 (한국어 ${ko.groups.length} / 번역 ${v.groups.length})`);
        problems++;
      } else {
        v.groups.forEach((g, gi) => {
          const kt = ko.groups[gi].tags.length, vt = (g.tags || []).length;
          if (kt !== vt) {
            console.log(`❌ ${lang}/${key} 그룹${gi}: 항목 수가 다릅니다 (한국어 ${kt} / 번역 ${vt})`);
            problems++;
          }
        });
      }
    }

    /* 한글이 섞여 들어갔는지 검사합니다.
       번역하다 한 글자씩 빠뜨리는 일이 실제로 생깁니다.
       (사람 이름·주소 등 일부러 남긴 한글이 있으면 "ko:" 를 앞에 붙이십시오) */
    const raw = JSON.stringify(v);

    /* 그 언어에 있어서는 안 되는 문자가 섞였는지 봅니다.
       한글을 빠뜨리는 일도, 다른 언어 문장이 끼어드는 일도 실제로 생깁니다. */
    const SCRIPTS = {
      hangul:   /[가-힣]+/g,                       // 한글
      kana:     /[\u3040-\u30ff]+/g,               // 히라가나·가타카나
      cyrillic: /[\u0400-\u04ff]+/g,               // 키릴
    };
    const FORBIDDEN = {                            // 언어별로 나오면 안 되는 문자
      en: ["hangul", "kana", "cyrillic"],
      zh: ["hangul", "kana", "cyrillic"],
      ja: ["hangul", "cyrillic"],                  // 가나는 당연히 허용
      ru: ["hangul", "kana"],                      // 키릴은 당연히 허용
    };
    for (const name of FORBIDDEN[lang]) {
      const hit = raw.match(SCRIPTS[name]);
      if (!hit) continue;
      const uniq = [...new Set(hit)].slice(0, 8);
      console.log(`⚠ ${lang}/${key}: ${name} 문자가 섞여 있습니다 → ${uniq.join(", ")}${hit.length > 8 ? " …" : ""}`);
      problems++;
    }

    out[key] = v;
    chars += raw.length;
  }

  const done = Object.keys(out);
  const js =
`/* 명동미래셀의원 · 진료 상세 본문 (${lang})
   ------------------------------------------------------------
   이 파일은 자동으로 만들어집니다. 직접 고치지 마십시오.
   고치실 곳:  i18n-src/${lang}/<진료키>.json
   다시 만들기: node tools/build-svc.js

   ⚠ 참고용 번역입니다. 정본은 한국어입니다.
      의료 문구는 원문보다 강하게 옮기지 마십시오. */
window.MIRAE_SVC = ${JSON.stringify(out, null, 1)};
`;
  const target = path.join(__dirname, "..", "js", `svc-${lang}.js`);
  fs.writeFileSync(target, js);
  console.log(`${lang}: ${done.length}/${ORDER.length}개 분야 · ${(js.length/1024).toFixed(0)}KB  [${done.join(", ") || "없음"}]`);
}

console.log(problems ? `\n❌ 구조 문제 ${problems}건 — 위 내용을 고쳐 주십시오` : "\n✅ 구조 이상 없음");
process.exit(problems ? 1 : 0);
