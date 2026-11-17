// 在分类页/首页显示字数统计 + 日期格式化 + 分类颜色
(function() {
  const postCards = document.querySelectorAll('.post-card.post');
  
  postCards.forEach(card => {
    const excerpt = card.querySelector('.excerpt');
    const meta = card.querySelector('.meta.cap');
    const timeEl = meta?.querySelector('time');
    const breadcrumb = card.querySelector('.breadcrumb span');
    
    // 获取分类名称
    let categoryName = '';
    if (breadcrumb) {
      categoryName = breadcrumb.textContent.trim().split('/')[0].trim();
      // 给卡片添加分类 class
      if (categoryName) {
        card.classList.add('cat-' + categoryName);
      }
    }
    
    if (!excerpt || !meta || !timeEl) return;
    // 已经加过就跳过，避免字数重复显示
    if (meta.querySelector('.wordcount')) return;
    
    // 格式化日期：从 ISO 格式转成 MM 月 DD 日
    const datetime = timeEl.getAttribute('datetime');
    if (datetime) {
      const date = new Date(datetime);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      timeEl.textContent = month + '月' + day + '日';
    }
    
    // 从摘要估算字数（摘要通常是文章开头 200 字左右）
    // 实际字数 ≈ 摘要字数 × (全文长度 / 摘要长度)
    // 这里简单用摘要字数 × 10 估算
    const text = excerpt.textContent || excerpt.innerText || '';
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    const excerptWords = chineseChars + englishWords;
    
    // 估算全文字数（假设摘要是全文的 1/10）
    const estimatedTotal = excerptWords > 0 ? excerptWords * 10 : 0;
    
    if (estimatedTotal > 0) {
      const wordcount = document.createElement('span');
      wordcount.className = 'cap wordcount';
      wordcount.textContent = estimatedTotal + '字';
      meta.appendChild(wordcount);
    }
  });
})();
