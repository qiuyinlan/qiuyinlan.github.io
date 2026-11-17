// 分类页面顶部添加项目分类切换器
(function() {
  if (!document.querySelector('.category-page')) return;
  
  const currentPath = window.location.pathname;
  
  // 项目分类列表
  const categories = [
    { name: '全部', url: '/categories/' },
    { name: '💪 身体', url: '/categories/身体/' },
    { name: '🏋️ 动作', url: '/categories/身体/动作/' },
    { name: '📓 笔记', url: '/categories/身体/笔记/' },
    { name: '📔 日记', url: '/categories/身体/日记/' },
    { name: '💬 IM', url: '/categories/IM/' },
    { name: '📋 pilot', url: '/categories/pilot/' },
    { name: '📖 算法', url: '/categories/算法/' },
    { name: '📝 八股', url: '/categories/八股/' },
    { name: '✍️ 随笔', url: '/categories/随笔/' },
  ];
  
  const filter = document.createElement('div');
  filter.className = 'category-filter';
  
  categories.forEach(cat => {
    const link = document.createElement('a');
    link.href = cat.url;
    link.textContent = cat.name;
    
    // 判断是否当前分类
    const isCurrent = currentPath === cat.url || 
                      (cat.url === '/categories/' && currentPath === '/categories/');
    if (isCurrent) {
      link.classList.add('active');
    }
    
    filter.appendChild(link);
  });
  
  const postList = document.querySelector('.post-list.post');
  if (postList) {
    postList.parentNode.insertBefore(filter, postList);
  }
})();
