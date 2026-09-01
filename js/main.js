/* 공통 헤더/푸터 주입 — 페이지마다 복사하지 않도록 한 곳에서 관리 */

/* ---------- 진료/프로그램 데이터 (10개 분야 — 내용 수정은 여기서) ----------
   항목: 문자열이면 이름만, {n, d}면 탭 클릭 시 d 설명이 표시됨 */
const SERVICES = [
  { key: "stemcell", no: 1, title: "줄기세포",
    desc: "내 몸의 세포로, 내 몸을 되살립니다. 본인의 지방과 혈액에서 재생을 담당하는 세포를 분리·활성화하여 다시 적용합니다.",
    hero: `<p><b>내 몸의 세포로, 내 몸을 되살립니다.</b></p>
      <p>명동미래셀의원은 환자 본인의 지방과 혈액에서 재생을 담당하는 세포를 직접 분리하고, 활성화하여, 다시 본인에게 적용합니다.<br>남의 세포도, 외부에서 들여온 제품도 아닙니다.</p>
      <div class="btns"><a class="btn btn-light" href="reserve">상담 예약하기</a><a class="btn btn-line" href="location">진료시간 · 오시는 길</a></div>`,
    intro: `
    <div class="svc-article">
      <h3>명동미래셀의 줄기세포는 이렇게 만들어집니다</h3>
      <p class="sub-cap">MIRAE STEM CELL — 채취부터 적용까지 4단계</p>
      <ol class="step-list">
        <li><b>채취 — 내 몸에서 얻습니다</b>소량의 지방을 흡입해 채취합니다. 필요한 양은 많지 않으며, 국소마취 하에 진행합니다. 사용되는 세포는 처음부터 끝까지 환자 본인의 것입니다.</li>
        <li><b>분리 — 지방 속에서 줄기세포만 골라냅니다</b>채취한 지방 안에는 지방세포, 혈관세포, 그리고 줄기세포가 섞여 있습니다. 초음파와 원심분리를 이용해 이 가운데 재생을 담당하는 세포 층만 분리해 냅니다. 의학 용어로는 이 층을 '기질혈관분획(SVF)'이라고 부릅니다.</li>
        <li><b>활성화 — MCT 공정으로 세포를 깨웁니다</b>분리한 줄기세포에 MCT 활성화 공정을 적용합니다. 세포 안에는 미토콘드리아라는 '발전소'가 있는데, 이 발전소가 활발할수록 세포도 활발하게 일합니다. MCT는 이 발전소를 자극해 세포가 일할 준비를 갖추게 하는 단계입니다.<br>같은 줄기세포라도 어떤 상태로 몸에 들어가느냐가 중요합니다. 명동미래셀이 이 단계를 따로 두는 이유입니다.</li>
        <li><b>적용 — 필요한 곳에 돌려드립니다</b>활성화된 본인의 줄기세포를 목적 부위에 적용합니다. 피부, 관절, 두피 등 상담에서 결정된 부위와 목적에 맞는 방식으로 진행합니다.</li>
      </ol>
      <div class="callout">
        <b>왜 이 네 단계가 중요한가요?</b>
        <p>'줄기세포 시술'이라는 이름은 같아도, 어디서 얻어(①) 어떻게 분리하고(②) 어떤 상태로 만들어(③) 어디에 넣는지(④)에 따라 전혀 다른 시술이 됩니다. 시술을 비교하실 때 이 네 가지를 물어보시면 됩니다. 명동미래셀은 네 단계 모두를 설명해 드립니다.</p>
      </div>
    </div>
    <div class="svc-article">
      <h3>명동미래셀을 선택하시는 이유</h3>
      <div class="grid c3" style="margin-top:18px">
        <div class="card"><h3>내 것만 씁니다</h3><p>본원의 지방줄기세포·PRP·PRF 시술에 쓰이는 재료는 모두 환자 본인의 조직과 혈액입니다. 다른 사람의 세포나 외부 제품을 넣지 않기 때문에, 남의 조직에 대한 거부 반응을 걱정하실 필요가 없습니다.</p></div>
        <div class="card"><h3>줄기세포를 오래 다뤄온 의료진</h3><p>박종윤 원장은 제대혈은행 은행장과 제대혈 자문교수를 지냈고, 한국줄기세포학회 정회원입니다. 줄기세포를 보관·관리하는 쪽과, 진료 현장에서 사용하는 쪽을 모두 경험한 의료진이 직접 상담합니다.</p></div>
        <div class="card"><h3>하루 안에</h3><p>채취부터 적용까지 한 번의 방문으로 진행하는 것을 원칙으로 합니다. 여러 번 병원을 오가실 필요가 없습니다.</p></div>
      </div>
    </div>
    <div class="svc-article">
      <h3>줄기세포, 어렵지 않습니다</h3>
      <p>우리 몸의 세포는 크게 두 종류로 나눌 수 있습니다.</p>
      <p>하나는 <b>'일하는 세포'</b>입니다. 피부세포는 피부를 이루고, 연골세포는 관절을 이룹니다. 각자 맡은 일이 정해져 있습니다.</p>
      <p>다른 하나가 <b>'줄기세포'</b>입니다. 아직 무엇이 될지 정해지지 않은 세포입니다. 필요한 곳에 가서 피부세포도 되고, 뼈세포도 되고, 연골세포도 됩니다. 몸이 손상되었을 때 그 자리를 메우는 수리 담당인 셈입니다.</p>
      <p>문제는 나이가 들수록 이 수리 담당 세포의 수와 활력이 함께 줄어든다는 점입니다. 20대에는 며칠이면 아물던 상처가 50대에는 몇 주씩 걸리는 이유가 여기에 있습니다.</p>
      <p><b>줄기세포 치료는, 내 몸 어딘가에 아직 남아 있는 이 수리 담당 세포를 모아서 가장 필요한 곳으로 다시 보내주는 시술입니다.</b></p>
      <h4>줄기세포는 어디서 얻나요?</h4>
      <p>성인의 몸에서 얻을 수 있는 곳은 크게 세 군데입니다.</p>
      <table>
        <thead><tr><th>얻는 곳</th><th>어떻게 얻나요</th><th>한마디로</th></tr></thead>
        <tbody>
          <tr><td>지방</td><td>소량의 지방을 흡입</td><td>가장 많이, 가장 부담 없이 얻을 수 있습니다</td></tr>
          <tr><td>골수</td><td>엉덩뼈에서 골수를 뽑음</td><td>연구가 가장 오래 쌓였지만, 채취할 때 통증이 있습니다</td></tr>
          <tr><td>제대혈</td><td>아기가 태어날 때 탯줄에서</td><td>그때만 얻을 수 있어, 미리 보관해 둔 경우에만 쓸 수 있습니다</td></tr>
        </tbody>
      </table>
      <p>명동미래셀은 이 가운데 <b>지방유래 줄기세포</b>를 중심으로 진료합니다. 채취 부담이 적으면서 한 번에 얻을 수 있는 양이 가장 많기 때문입니다.</p>
    </div>`,
    groups: [
      { h: "자가 혈액 재생 치료", lead: `<div class="callout">
          <b>먼저 알아두세요 — PRP·PRF는 '줄기세포'가 아닙니다</b>
          <p>많이 혼동하시는 부분이라 먼저 말씀드립니다.</p>
          <ul>
            <li><b>줄기세포 치료</b>는 재생을 담당하는 세포 자체를 모아서 넣는 것입니다.</li>
            <li><b>PRP·PRF</b>는 세포가 아니라, 내 혈액 속의 혈소판과 성장인자를 모아서 넣는 것입니다. 세포에게 "일을 시작하라"고 신호를 보내는 쪽에 가깝습니다.</li>
          </ul>
          <p>둘 다 내 몸에서 나온 것을 쓴다는 점은 같지만, 넣는 것이 다릅니다. 목적에 따라 선택하거나, 함께 활용합니다.</p>
        </div>`, tags: [
        { n: "PRP (혈소판 풍부 혈장)", d: `
          <h6>어떤 시술인가요?</h6>
          <p>채혈한 혈액을 원심분리기에 돌리면 층이 나뉩니다. 이 가운데 혈소판이 진하게 모인 층만 뽑아내어 필요한 부위에 주사합니다. 채혈부터 주사까지 대개 한 자리에서 끝납니다.</p>
          <h6>왜 효과를 기대하나요?</h6>
          <p>혈소판 안에는 상처가 났을 때 회복을 지휘하는 성장인자가 들어 있습니다. PRP는 이 성장인자를 정상 혈액의 3~5배 농도로 모은 것으로 알려져 있습니다. 몸이 알아서 보내주기를 기다리는 대신, 회복이 필요한 자리에 직접 넣어주는 것입니다.</p>
          <h6>이런 분께 권해드립니다</h6>
          <ul>
            <li>팔꿈치 · 어깨 · 무릎의 통증이 오래 지속되는 분</li>
            <li>피부 탄력과 결을 개선하고 싶은 분</li>
            <li>모발이 가늘어지는 것이 고민인 분</li>
          </ul>
          <h6>알아두실 점</h6>
          <ul>
            <li>PRP는 자가 혈액에서 만든 제제로, 줄기세포 제제와는 구분됩니다.</li>
            <li>효과의 정도와 지속 기간은 부위와 개인 상태에 따라 차이가 있습니다. 모든 분께 같은 결과가 나타나지는 않습니다.</li>
            <li>내·외측 상과염(테니스엘보 · 골프엘보)에는 건강보험이 적용되는 경우가 있습니다. 적용 여부는 진료 상담에서 안내해 드립니다.</li>
          </ul>` },
        { n: "PRF (혈소판 풍부 피브린)", d: `
          <h6>어떤 시술인가요?</h6>
          <p>PRP와 출발은 같습니다. 다만 혈액이 굳지 않게 하는 약(항응고제)을 전혀 넣지 않고 채혈 직후 바로 원심분리합니다. 그러면 혈액이 스스로 굳으면서 젤리 같은 그물망이 만들어지는데, 이 그물망 안에 혈소판과 성장인자가 담겨 있는 것이 PRF입니다.</p>
          <h6>PRP와 무엇이 다른가요?</h6>
          <table>
            <thead><tr><th></th><th>PRP</th><th>PRF</th></tr></thead>
            <tbody>
              <tr><td>항응고제</td><td>넣습니다</td><td>넣지 않습니다</td></tr>
              <tr><td>형태</td><td>액체 — 주사합니다</td><td>젤 · 막 형태 (주사형도 있습니다)</td></tr>
              <tr><td>성장인자가 나오는 방식</td><td>넣자마자 한 번에</td><td>그물망에서 천천히</td></tr>
              <tr><td>비유하자면</td><td>물을 한 번에 붓는 것</td><td>물을 머금은 스펀지를 두는 것</td></tr>
            </tbody>
          </table>
          <p>PRF가 '2세대 혈소판 농축물'이라 불리는 이유가 바로 이 서서히 방출되는 성질 때문입니다.</p>
          <h6>이런 분께 권해드립니다</h6>
          <ul>
            <li>한 번의 시술로 효과가 오래 이어지기를 바라는 분</li>
            <li>첨가물 없이 순수하게 내 혈액만 쓰는 방식을 선호하는 분</li>
            <li>재생이 필요한 부위에 얹어 쓰는 형태가 적합한 경우</li>
          </ul>
          <h6>알아두실 점</h6>
          <p>내 혈액만으로 만들기 때문에 이물 반응이나 감염 전파의 위험이 낮은 편입니다. 다만 개인과 시술에 따라 결과의 차이는 있을 수 있습니다.</p>` },
      ] },
      { h: "줄기세포 치료", tags: [
        { n: "지방유래 줄기세포", d: `
          <p><b>명동미래셀의 주력 진료</b></p>
          <h6>어떤 시술인가요?</h6>
          <p>소량의 지방을 흡입해 그 안에서 줄기세포를 분리한 뒤, MCT 활성화 공정을 거쳐 본인에게 적용합니다. 위에서 보신 4단계가 바로 이 시술입니다.</p>
          <h6>왜 지방인가요?</h6>
          <p>지방조직은 우리 몸에서 줄기세포를 가장 많이, 가장 부담 없이 얻을 수 있는 곳입니다.</p>
          <ul>
            <li>골수에서 뽑는 것보다 채취가 훨씬 간편합니다.</li>
            <li>한 번에 얻을 수 있는 세포의 양이 많습니다.</li>
            <li>골수에서 얻은 세포보다 잘 자라고, 노화가 늦은 편입니다.</li>
          </ul>
          <h6>이런 분께 권해드립니다</h6>
          <ul>
            <li>피부 탄력 · 주름 등 전반적인 안티에이징을 원하시는 분</li>
            <li>관절의 불편함이 오래되신 분</li>
            <li>지방이식 · 성형과 함께 재생 효과를 고려하시는 분</li>
          </ul>
          <h6>알아두실 점</h6>
          <p>지방에서 얻은 줄기세포는 "이것만이 줄기세포다"라고 딱 잘라 구분하는 기준이 학계에서 아직 완전히 확립되지 않았습니다. 그래서 실제로는 줄기세포를 포함한 여러 세포가 함께 사용됩니다. 어떤 분께 어떤 방식이 적합한지는 진료 상담에서 개별적으로 판단해 드립니다.</p>` },
        { n: "골수유래 줄기세포", d: `
          <h6>어떤 시술인가요?</h6>
          <p>엉덩뼈(장골능)에서 골수를 뽑아 원심분리로 농축한 뒤 사용합니다. 이 농축물을 BMAC이라고 부릅니다.</p>
          <h6>특징</h6>
          <ul>
            <li>가장 먼저 알려진 줄기세포로, 연구가 가장 많이 쌓여 있습니다.</li>
            <li>채취할 때 통증이 있고, 한 번에 얻을 수 있는 양이 지방보다 적습니다.</li>
          </ul>
          <h6>제도적으로 인정된 부분</h6>
          <p>무릎 골관절염 환자에 대한 골수 흡인 농축물 관절강내 주사는 2023년 7월 신의료기술로 등재되었습니다(보건복지부 고시 제2023-128호). 평가에서 기존 히알루론산 관절강내 주사와 유사한 수준의 통증 완화 및 기능 개선 효과가 확인되었습니다.</p>` },
        { n: "제대혈유래 줄기세포", d: `
          <h6>제대혈이 무엇인가요?</h6>
          <p>아기가 태어나 탯줄을 자른 뒤, 태반과 탯줄의 혈관에 남아 있는 아기의 혈액입니다. 이 안에는 두 종류의 줄기세포가 들어 있습니다.</p>
          <ul>
            <li><b>조혈모세포</b> — 피를 만드는 줄기세포입니다. 백혈병, 재생불량빈혈 등의 이식 치료에 쓰입니다.</li>
            <li><b>중간엽줄기세포</b> — 여러 조직으로 분화할 수 있어 세포치료에 활용됩니다.</li>
          </ul>
          <h6>꼭 알아두실 점</h6>
          <ul>
            <li>제대혈은 아기가 태어나는 그 순간에만 얻을 수 있습니다. 그래서 출산 시 미리 보관해 두신 경우에만 본인과 가족이 사용하실 수 있습니다.</li>
            <li>국내 제대혈은 「제대혈 관리 및 연구에 관한 법률」에 따라 허가받은 제대혈은행이 채취 · 검사 · 보관 · 공급을 관리합니다. 아무 곳에서나 다룰 수 있는 것이 아닙니다.</li>
          </ul>` },
      ] },
    ],
    outro: `
    <div class="svc-article">
      <h3>시술은 이렇게 진행됩니다</h3>
      <ol class="step-list">
        <li><b>상담</b>원장 진료. 목표와 부위, 시술 적합 여부를 확인하고 예상 횟수와 비용을 안내해 드립니다.</li>
        <li><b>채취</b>목적에 따라 지방 또는 혈액을 채취합니다. 지방 채취는 국소마취 하에 진행합니다.</li>
        <li><b>처리</b>분리와 활성화 공정을 진행합니다. 이 시간 동안 편히 쉬시면 됩니다.</li>
        <li><b>적용</b>준비된 세포를 목적 부위에 적용합니다.</li>
        <li><b>안내</b>시술 후 주의사항과 경과 관찰 일정을 안내해 드립니다.</li>
      </ol>
      <p class="fine-note">※ 시술 종류와 부위에 따라 소요 시간이 달라질 수 있습니다. 정확한 일정은 상담에서 안내해 드립니다.</p>
    </div>
    <div class="svc-article">
      <h3>자주 묻는 질문</h3>
      <div class="faq" style="margin-top:18px">
        <details><summary>남의 세포가 들어가나요?</summary><div class="a">아닙니다. 본원의 지방줄기세포 · PRP · PRF 시술은 모두 환자 본인의 조직과 혈액만 사용합니다.</div></details>
        <details><summary>많이 아픈가요?</summary><div class="a">지방 채취는 국소마취 하에 진행합니다. 채혈은 일반 혈액검사와 같은 수준입니다. 골수 채취는 상대적으로 불편감이 있는 편이라, 상담에서 미리 충분히 설명해 드립니다.</div></details>
        <details><summary>효과는 언제부터 느껴지나요?</summary><div class="a">부위와 개인에 따라 다릅니다. 재생은 시간이 걸리는 과정이라, 시술 직후보다는 몇 주에 걸쳐 서서히 나타나는 경우가 일반적입니다. "며칠 만에 확실히 달라진다"는 설명은 어느 병원에서 들으시더라도 신중하게 판단하시는 것이 좋습니다.</div></details>
        <details><summary>한 번만 받으면 되나요?</summary><div class="a">목적과 상태에 따라 다릅니다. 상담에서 예상 횟수와 간격을 먼저 말씀드린 뒤 진행합니다.</div></details>
        <details><summary>부작용은 없나요?</summary><div class="a">모든 시술에는 위험이 있습니다. 본인의 조직을 쓰기 때문에 거부 반응 위험은 낮은 편이지만, 채취 부위의 멍 · 부기 · 통증이나 주사 부위의 일시적인 반응이 있을 수 있습니다. "부작용이 전혀 없다"는 설명은 신뢰하기 어렵습니다.</div></details>
        <details><summary>건강보험이 적용되나요?</summary><div class="a">대부분 비급여입니다. 다만 PRP는 내·외측 상과염에, 골수 흡인 농축물 관절강내 주사는 무릎 골관절염에 대해 제도적으로 인정된 범위가 있습니다. 개별 적용 여부는 상담에서 확인해 드립니다.</div></details>
        <details><summary>PRP와 줄기세포 중 무엇이 더 좋은가요?</summary><div class="a">'더 좋은 것'이 아니라 '다른 것'입니다. PRP는 회복 신호를 보내는 쪽, 줄기세포는 일할 세포 자체를 넣는 쪽입니다. 목적에 따라 하나를 선택하거나 함께 활용합니다.</div></details>
        <details><summary>나이가 많아도 받을 수 있나요?</summary><div class="a">나이가 들수록 줄기세포의 수와 활력이 줄어드는 것은 사실입니다. 그래서 시술 전에 개인의 상태를 먼저 확인한 뒤 적합 여부를 판단합니다.</div></details>
        <details><summary>어떤 질환이든 다 좋아지나요?</summary><div class="a">아닙니다. 줄기세포는 만능이 아닙니다. 서로 다른 질환은 각각 다른 접근이 필요합니다. 상담에서 이 시술이 적합한지, 다른 치료가 더 나은지 솔직하게 말씀드립니다.</div></details>
        <details><summary>결정을 서둘러야 하나요?</summary><div class="a">전혀 그렇지 않습니다. 충분히 알아보고 결정하십시오. 필요하시다면 다른 의료기관의 의견을 함께 들으셔도 좋습니다.</div></details>
      </div>
    </div>
    <div class="svc-article svc-consent">
      <h3>본원이 먼저 말씀드리는 것들</h3>
      <p>재생의료 시술은 설명을 충분히 듣고 결정하셔야 하는 진료입니다. 본원은 시술에 앞서 아래 내용을 먼저 말씀드립니다. 이 항목들은 어느 의료기관에서 상담을 받으시더라도 확인하실 권리가 있는 내용입니다.</p>
      <ul>
        <li>이 시술이 해당 상태의 표준 치료인지, 그리고 어떤 다른 방법이 있는지</li>
        <li>사용되는 세포를 어디에서 얻고, 어떻게 분리하며, 어떤 경로로 넣는지</li>
        <li>기대할 수 있는 구체적인 효과와, 그 효과를 무엇으로 확인하는지</li>
        <li>시술의 위험과 있을 수 있는 부작용, 그리고 발생했을 때의 대응</li>
        <li>이 시술을 뒷받침하는 근거와, 국가 기관의 승인·심의 여부</li>
        <li>총 비용과 추가로 발생할 수 있는 비용</li>
        <li>시술 후 경과를 얼마나, 어떻게 지켜보는지</li>
      </ul>
      <p>궁금하신 점은 무엇이든 물어보셔도 좋습니다. 충분히 이해하신 뒤에 결정하시는 것이 가장 좋은 진료의 시작입니다.</p>
    </div>
    <div class="svc-article">
      <div class="faq">
        <details><summary style="font-size:15px">더 알아보기 — 중간엽줄기세포의 학술적 정의</summary><div class="a">
          국제세포치료학회(ISCT)는 중간엽줄기세포(Mesenchymal Stem/Stromal Cell, MSC)를 다음 세 가지 최소 기준으로 정의합니다.
          <ol style="margin-top:10px;padding-left:20px;line-height:1.8">
            <li>표준 배양 조건에서 플라스틱 표면에 부착할 것</li>
            <li>CD105 · CD73 · CD90 양성이고, CD45 · CD34 · CD14(또는 CD11b) · CD79a(또는 CD19) · HLA-DR 음성일 것</li>
            <li>시험관 내에서 골모세포 · 지방세포 · 연골모세포로 분화할 수 있을 것</li>
          </ol>
        </div></details>
      </div>
    </div>`,
    cta: `
      <h3 style="font-size:20px;margin-bottom:8px">어떤 방법이 맞는지, 함께 정하시면 됩니다</h3>
      <p style="color:var(--gray);margin-bottom:14px">PRP가 맞는 분도, 줄기세포가 맞는 분도, 지금은 다른 치료가 먼저인 분도 계십니다.<br>상태를 먼저 보고 솔직하게 말씀드리는 것부터 시작합니다.</p>
      <p style="color:var(--ink);font-weight:700;margin-bottom:4px">☎ 02-776-8768&nbsp;&nbsp;|&nbsp;&nbsp;진료시간 : 월·화·수·금 10:00~19:00 / 토 09:00~14:00</p>
      <p style="color:var(--gray);font-size:13.5px;margin-bottom:20px">※ 목요일 · 일요일 · 공휴일 휴진 / 점심시간 13:00~14:00 (토요일은 점심시간 없이 진료)</p>
      <a class="btn btn-green" href="reserve">상담 예약하기</a>` },
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
      ${cur.hero || `<p>${cur.desc}</p>`}
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
              ${g.lead || ""}
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
          ${cur.cta || `<h3 style="font-size:20px;margin-bottom:8px">${cur.title} 진료가 궁금하신가요?</h3>
          <p style="color:var(--gray);margin-bottom:20px">전문 의료진이 자세히 상담해 드립니다. ☎ ${TEL}</p>
          <a class="btn btn-green" href="reserve">상담 예약하기</a>`}
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
