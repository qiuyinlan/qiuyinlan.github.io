/* 文章浮动目录（一级标题）：右上角图标圆钮 ⇄ 玻璃面板。2026-11-09 */
(function () {
  'use strict';

  var article = document.querySelector('article.md-text') || document.querySelector('article');
  if (!article) return;

  var heads = Array.prototype.slice
    .call(article.querySelectorAll('h2'))
    .filter(function (h) {
      return h.id && h.textContent.trim();
    });
  if (heads.length < 2) return; // 标题太少，不值得浮出来

  var STORE_KEY = 'toc-float:collapsed';

  /* ---------- 目录面板 ---------- */
  var panel = document.createElement('nav');
  panel.className = 'toc-float';
  panel.setAttribute('aria-label', '文章目录');

  var head = document.createElement('div');
  head.className = 'toc-float__head';

  var title = document.createElement('span');
  title.className = 'toc-float__title';
  title.textContent = '本文目录';

  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'toc-float__btn';
  closeBtn.setAttribute('aria-label', '收起目录');
  closeBtn.textContent = '➖';

  head.appendChild(title);
  head.appendChild(closeBtn);

  var list = document.createElement('ol');
  list.className = 'toc-float__list';

  var links = heads.map(function (h) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.setAttribute('href', '#' + h.id);
    a.textContent = h.textContent.trim();
    a.title = h.textContent.trim();
    a.addEventListener('click', function (ev) {
      ev.preventDefault();
      var top = h.getBoundingClientRect().top + window.pageYOffset - 88;
      window.scrollTo({ top: top < 0 ? 0 : top, behavior: 'smooth' });
      history.replaceState(null, '', '#' + h.id);
      // 手机上点完自动收起，别挡着正文
      if (window.innerWidth < 1100) {
        collapsed = true;
        save();
        render();
      }
    });
    li.appendChild(a);
    list.appendChild(li);
    return a;
  });

  panel.appendChild(head);
  panel.appendChild(list);

  /* ---------- 右上角图标圆钮 ---------- */
  var circle = document.createElement('button');
  circle.type = 'button';
  circle.className = 'toc-circle';
  circle.setAttribute('aria-label', '展开目录');
  circle.innerHTML =
    '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +
    '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h9"/>' +
    '</svg>';

  document.body.appendChild(panel);
  document.body.appendChild(circle);

  /* 默认收起（右上角就是那个圆钮）；用户点开过就记住 */
  var collapsed = true;
  try {
    var saved = window.localStorage.getItem(STORE_KEY);
    if (saved !== null) collapsed = saved === '1';
  } catch (e) {}

  function save() {
    try {
      window.localStorage.setItem(STORE_KEY, collapsed ? '1' : '0');
    } catch (e) {}
  }

  function render() {
    if (collapsed) {
      panel.style.display = 'none';
      circle.style.display = 'flex';
    } else {
      panel.style.display = '';
      circle.style.display = 'none';
    }
    closeBtn.setAttribute('aria-expanded', String(!collapsed));
  }

  closeBtn.addEventListener('click', function () {
    collapsed = true;
    save();
    render();
  });

  circle.addEventListener('click', function () {
    collapsed = false;
    save();
    render();
  });

  render();
  window.addEventListener('resize', render, { passive: true });

  /* 滚动高亮当前小节 */
  var ticking = false;

  function highlight() {
    ticking = false;
    var current = 0;
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].getBoundingClientRect().top <= 120) current = i;
    }
    for (var j = 0; j < links.length; j++) {
      links[j].classList.toggle('is-active', j === current);
    }
  }

  window.addEventListener(
    'scroll',
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(highlight);
    },
    { passive: true }
  );

  highlight();
})();
