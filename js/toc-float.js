/* 文章右上方浮动目录（一级标题），可点跳转；点 ➖ 收起为一行标题栏。2026-11-09 */
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
      history.replaceState(null, '', '#' + h.id);
    });
    li.appendChild(a);
    list.appendChild(li);
    return a;
  });

  panel.appendChild(head);
  panel.appendChild(list);
  document.body.appendChild(panel);

  /* 收起 / 展开：只收起列表，标题栏留在右上角 */
  var collapsed = false;
  try {
    collapsed = window.localStorage.getItem(STORE_KEY) === '1';
  } catch (e) {}

  function render() {
    panel.classList.toggle('is-collapsed', collapsed);
    btn.textContent = collapsed ? '＋' : '➖';
    btn.setAttribute('aria-expanded', String(!collapsed));
    btn.setAttribute('aria-label', collapsed ? '展开目录' : '收起目录');
  }

  render();

  btn.addEventListener('click', function () {
    collapsed = !collapsed;
    render();
    try {
      window.localStorage.setItem(STORE_KEY, collapsed ? '1' : '0');
    } catch (e) {}
  });

  /* 桌面才浮出来；手机上会挡住正文，直接不显示 */
  function fit() {
    panel.style.display = window.innerWidth >= 1100 ? '' : 'none';
  }

  fit();
  window.addEventListener('resize', fit, { passive: true });
  window.addEventListener('orientationchange', fit, { passive: true });

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
