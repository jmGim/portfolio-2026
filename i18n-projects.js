/* ==============================================
   i18n helpers for project cards / modal (KO <-> EN)
   - Loaded after projects-en.js, before the main inline script.
   - getLang() reads localStorage directly so it is safe to call
     before `currentLang` is declared in index.html.
=============================================== */
const getLang = () => localStorage.getItem('portfolio-lang') || 'ko';

const UI = {
  ko: {
    period: '기간', hw: '하드웨어', target: '지원 직무',
    role: '💼 담당 역할', arch: '🏗️ 시스템 구성',
    detail: '📌 핵심 구현 및 동작 원리', verif: '📊 동작 조건 및 검증 근거',
    ts: '🔧 트러블 슈팅 (Troubleshooting)', tsSimple: '🔧 트러블슈팅 / 오차 검증 경험',
    symptom: '증상:', cause: '원인 분석:', fix: '해결 및 개선:',
    cap: '💡 개인 역량 요약:',
    matrixEyebrow: n => 'All ' + n + ' Projects Overview', matrixTitle: 'Project Matrix',
    cols: ['프로젝트', '핵심 스택', '주요 역할', '대표 문제해결'],
    detailAria: '상세 보기'
  },
  en: {
    period: 'Period', hw: 'Hardware', target: 'Target Role',
    role: '💼 Role & Responsibilities', arch: '🏗️ System Architecture',
    detail: '📌 Key Implementation & How It Works', verif: '📊 Operating Conditions & Verification',
    ts: '🔧 Troubleshooting', tsSimple: '🔧 Troubleshooting / Error Verification',
    symptom: 'Symptom:', cause: 'Root Cause:', fix: 'Fix & Improvement:',
    cap: '💡 Capability Summary:',
    matrixEyebrow: n => 'All ' + n + ' Projects Overview', matrixTitle: 'Project Matrix',
    cols: ['Project', 'Core Stack', 'Key Role', 'Representative Problem Solving'],
    detailAria: 'view details'
  }
};
const ui = () => UI[getLang()] || UI.ko;

/* [해결] 등 한국어 배지 라벨의 영문 표기 */
const TS_LABEL_EN = {
  '해결': 'Fixed', '개선': 'Improved', '최적화': 'Optimized', '배움': 'Learned',
  '성과': 'Result', '강점': 'Strength', '분석': 'Analysis', '설계': 'Design',
  '보안': 'Security', '운영': 'Ops', '자동화': 'Automation', '신뢰성': 'Reliability'
};
const tsLabel = ko => getLang() === 'en' ? (TS_LABEL_EN[ko] || ko) : ko;

/* 현재 언어에 맞는 프로젝트 객체 (영문 필드가 없으면 한국어로 폴백) */
function localizeProject(key) {
  const p = projects[key];
  const e = getLang() === 'en' && window.projectsEn && window.projectsEn[key];
  if (!e) return p;
  const o = Object.assign({}, p, e);
  const mergeByIndex = (base, over) => base.map((x, i) => Object.assign({}, x, (over && over[i]) || {}));
  if (e.detailSections && p.detailSections) o.detailSections = mergeByIndex(p.detailSections, e.detailSections);
  if (e.troubleDetail && p.troubleDetail) o.troubleDetail = mergeByIndex(p.troubleDetail, e.troubleDetail);
  if (e.links && p.links) o.links = p.links.map(([l, u], i) => [e.links[i] || l, u]);
  return o;
}

/* 언어 전환 시 카드 텍스트를 제자리에서 갱신 (reveal 애니메이션 상태 유지) */
function refreshCards() {
  document.querySelectorAll('.project-card[data-project]').forEach(card => {
    const p = localizeProject(card.dataset.project);
    card.querySelector('.project-card-title').textContent = p.title;
    card.querySelector('.project-card-brief').textContent = p.brief;
    card.querySelector('.project-card-img').alt = p.title;
    const max = card.classList.contains('project-card--main') ? 6 : 4;
    card.querySelector('.project-card-tags').innerHTML = p.tags.slice(0, max).map(t => `<span class="tag-mini">${t}</span>`).join('');
    card.setAttribute('aria-label', p.title + ' ' + ui().detailAria);
  });
}
