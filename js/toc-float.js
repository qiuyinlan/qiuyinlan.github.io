/* 文章右上方浮动目录（一级标题），可点跳转，➖ 可收起。2026-11-09 */
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

  var panel = document.createElement('nav');
  panel.className = 'toc-float';
  panel.setAttribute('aria-label', '文章目录');

  var head = document.createElement('div');
  head.className = 'toc-float__head';

  var title = document.createElement('span');
  title.className = 'toc-float__title';
  title.textContent = '本文目录';

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'toc-float__btn';
  btn.setAttribute('aria-label', '收起目录');

  head.appendChild(title);
  head.appendChild(btn);

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
      panel.classList.remove('toc-float--overlay');
      if (window.innerWidth < 1100) panel.style.display = 'none';
      history.replaceState(null, '', '#' + h.id);
    });
    li.appendChild(a);
    list.appendChild(li);
    return a;
  });

  panel.appendChild(head);
  panel.appendChild(list);

  var fab = document.createElement('button');
  fab.type = 'button';
  fab.className = 'toc-fab';
  fab.setAttribute('aria-label', '打开目录');
  fab.textContent = '目录';
  fab.addEventListener('click', function () {
    var open = panel.classList.toggle('toc-float--overlay');
    panel.style.display = open ? 'block' : 'none';
  });

  document.body.appendChild(panel);
  document.body.appendChild(fab);

  /* ---- 收起 / 展开，记住状态 ---- */
  function renderCollapsed(collapsed) {
    panel.classList.toggle('is-collapsed', collapsed);
    btn.textContent = collapsed ? '＋' : '➖';
    btn.setAttribute('aria-expanded', String(!collapsed));
    btn.setAttribute('aria-label', collapsed ? '展开目录' : '收起目录');
  }

  var collapsed = false;
  try {
    collapsed = window.localStorage.getItem(STORE_KEY) === '1';
  } catch (e) {}
  renderCollapsed(collapsed);

  btn.addEventListener('click', function () {
    collapsed = !panel.classList.contains('is-collapsed');
    renderCollapsed(collapsed);
    try {
      window.localStorage.setItem(STORE_KEY, collapsed ? '1' : '0');
    } catch (e) {}
  });

  /* ---- 宽度自适应：够宽就贴在右上，不够宽收成圆钮 ---- */
  function fit() {
    var rect = article.getBoundingClientRect();
    var gutter = window.innerWidth - rect.right - 24;
    var wide = window.innerWidth >= 1180 && gutter >= 248;
    if (wide) {
      panel.style.display = '';
      panel.classList.remove('toc-float--overlay');
      fab.style.display = 'none';
    } else {
      panel.classList.remove('toc-float--overlay');
      panel.style.display = 'none';
      fab.style.display = 'flex';
    }
  }

  fit();
  window.addEventListener('resize', fit, { passive: true });
  window.addEventListener('orientationchange', fit, { passive: true });

  /* ---- 滚动高亮当前小节 ---- */
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
