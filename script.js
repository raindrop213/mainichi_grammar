const grammarFile = 'mainichi/grammar.json';
let grammarData = null; // 全局变量，用于存储预处理后的数据

// 页面加载完成后，加载 JSON 数据并默认显示 "五十音順"
window.onload = () => {
  fetch(grammarFile)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const rawData = Array.isArray(data) && data.length > 0 ? data[0].grammar : null;
      if (!rawData || !Array.isArray(rawData)) {
        throw new Error('Invalid data structure: grammar data not found');
      }
      grammarData = preprocessData(rawData); // 预处理数据
      loadTopCategory('五十音順'); // 默认加载五十音順
    })
    .catch(error => console.error('Error loading grammar file:', error));
};

// 预处理数据
function preprocessData(grammarList) {
  const processed = {
    '五十音順': {}, // 五十音順数据
    'レベル順': {}, // レベル順数据
    '敬語': {}, // 敬語数据
  };

  grammarList.forEach(item => {
    const topTitle = item.top_title;

    // 初始化对应分类的对象
    if (!processed[topTitle]) {
      processed[topTitle] = {};
    }

    // 将数据按 category 分类存储
    if (!processed[topTitle][item.category]) {
      processed[topTitle][item.category] = [];
    }
    processed[topTitle][item.category].push(item);
  });

  return processed;
}

// 顶部导航栏点击事件
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const topTitle = event.target.dataset.type;
    loadTopCategory(topTitle); // 加载对应顶部分类
  });
});

// 加载顶部分类内容
function loadTopCategory(topTitle) {
  if (!grammarData || !grammarData[topTitle]) {
    console.error(`No data available for ${topTitle}`);
    return;
  }

  const content = document.getElementById('content');
  content.innerHTML = ''; // 清空内容区域

  const categoryData = grammarData[topTitle];
  Object.keys(categoryData).forEach(category => {
    const section = document.createElement('section');
    const heading = document.createElement('h2');
    heading.textContent = category; // 分类标题
    section.appendChild(heading);

    const list = document.createElement('ul');
    const items = categoryData[category];
    items.forEach(item => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<a href="${item.link}" target="_blank">${item.name} (${item.level})</a>`;
      list.appendChild(listItem);
    });

    section.appendChild(list);
    content.appendChild(section);
  });
}
