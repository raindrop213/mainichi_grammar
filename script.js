// Assuming the JSON data is stored as `grammarData`:
const grammarData = [
  {
    "name": "～あぐねる",
    "category": "あいうえお",
    "first": "あ",
    "level": "Ｎ０文法",
    "item": "n0-aguneru",
    "link": "https://mainichi-nonbiri.com/grammar/n0-aguneru/",
    "detail": ""
  },
  {
    "name": "～あげる／やる／差し上げる（さしあげる）",
    "category": "あいうえお",
    "first": "あ",
    "level": "Ｎ４文法",
    "item": "n4-ageru",
    "link": "https://mainichi-nonbiri.com/grammar/n4-ageru/",
    "detail": ""
  }
  // Add all other entries here
];

// Sort categories and prepare a mapping for display
const categories = {
  五十音順: "あいうえお",
  レベル順: ["Ｎ０文法", "Ｎ１文法", "Ｎ２文法", "Ｎ３文法", "Ｎ４文法", "Ｎ５文法"],
  敬語: ["尊敬語", "謙譲語Ⅰ・Ⅱ", "丁寧語"],
};

// Function to render items
function renderContent(categoryKey) {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = ""; // Clear existing content

  if (categoryKey === "五十音順") {
    const sortedItems = grammarData.filter(item => item.category === "あいうえお");
    sortedItems.forEach(item => {
      const listItem = document.createElement("div");
      listItem.innerHTML = `<a href="${item.link}" target="_blank">${item.name}</a>`;
      contentDiv.appendChild(listItem);
    });
  } else if (categoryKey === "レベル順") {
    categories[categoryKey].forEach(level => {
      const levelHeader = document.createElement("h3");
      levelHeader.textContent = level;
      contentDiv.appendChild(levelHeader);

      const levelItems = grammarData.filter(item => item.level === level);
      levelItems.forEach(item => {
        const listItem = document.createElement("div");
        listItem.innerHTML = `<a href="${item.link}" target="_blank">${item.name}</a>`;
        contentDiv.appendChild(listItem);
      });
    });
  } else if (categoryKey === "敬語") {
    categories[categoryKey].forEach(keigo => {
      const keigoHeader = document.createElement("h3");
      keigoHeader.textContent = keigo;
      contentDiv.appendChild(keigoHeader);

      // Add items dynamically if needed (currently no keigo-specific data in the JSON provided)
    });
  }
}

// Event listeners for navigation
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const categoryKey = e.target.dataset.type;
    renderContent(categoryKey);
  });
});

// Initial render
renderContent("五十音順");
