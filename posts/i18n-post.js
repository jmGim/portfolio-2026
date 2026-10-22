/* ==============================================
   KO / EN toggle for posts/*.html
   - Translations live in posts-en.js (window.POSTS_EN[page][normalizedKoText] = EN innerHTML)
   - Language is shared with index.html through localStorage 'portfolio-lang'
   - The selector list must stay identical to the extractor used to build posts-en.js
=============================================== */
(function () {
  var SEL = 'h1,h2,h3,h4,p,li,dt,dd,th,td,figcaption,.code-header>span,.meta-row>span,.tag,.badge,.kicker,.timing-row>span';
  var KO = /[가-힣]/;
  var norm = function (t) { return t.replace(/\s+/g, ' ').trim(); };
  var page = location.pathname.split('/').pop();
  var dict = (window.POSTS_EN || {})[page] || {};
  var units = [];

  document.querySelectorAll(SEL + ',a').forEach(function (el) {
    if (el.closest('pre,script,style')) return;
    if (el.matches('a') && el.parentElement.closest(SEL)) return;   // links inside a block belong to the block
    if (el.querySelector(SEL)) return;                              // innermost block only
    var key = norm(el.textContent);
    if (!KO.test(key)) return;
    units.push({ el: el, ko: el.innerHTML, key: key });
  });

  var koTitle = document.title;
  var descMeta = document.querySelector('meta[name="description"]');
  var koDesc = descMeta ? descMeta.getAttribute('content') : '';
  var nav = document.querySelector('.tab-nav');
  var koNavLabel = nav ? nav.getAttribute('aria-label') : '';

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'lang-toggle';
  btn.className = 'post-lang-toggle';
  btn.title = 'KO / EN';
  var topbar = document.querySelector('.topbar');
  if (topbar) topbar.appendChild(btn);

  function getLang() { return localStorage.getItem('portfolio-lang') === 'en' ? 'en' : 'ko'; }

  function apply(lang) {
    var en = lang === 'en';
    units.forEach(function (u) { u.el.innerHTML = (en && dict[u.key]) ? dict[u.key] : u.ko; });
    document.title = (en && dict._title) ? dict._title : koTitle;
    if (descMeta) descMeta.setAttribute('content', (en && dict._desc) ? dict._desc : koDesc);
    if (nav) nav.setAttribute('aria-label', en ? 'Table of contents' : koNavLabel);
    document.documentElement.lang = en ? 'en' : 'ko';
    btn.textContent = en ? 'EN' : 'KO';                       // shows the current language
    btn.setAttribute('aria-label', en ? 'Switch language (current: English)' : '언어 전환 (현재: 한국어)');
  }

  btn.addEventListener('click', function () {
    var next = getLang() === 'ko' ? 'en' : 'ko';
    localStorage.setItem('portfolio-lang', next);
    apply(next);
  });

  apply(getLang());
})();
