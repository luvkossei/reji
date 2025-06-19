let currentData = {};

function getCategoryFile() {
  const category = document.querySelector('input[name="category"]:checked').value;
  return category === "meals" ? "meals.json" : "drinks.json";
}

function fetchData(callback) {
  const file = getCategoryFile();
  fetch(file)
    .then(response => response.json())
    .then(data => {
      currentData = data;
      if (callback) callback();
    })
    .catch(error => {
      document.getElementById("result").textContent = "データの読み込みに失敗しました。";
      console.error(error);
    });
}

function searchProduct(productName) {
  const input = productName || document.getElementById("searchBox").value.trim();
  const resultDiv = document.getElementById("result");

  const keys = Object.keys(currentData);
  const normalizedInput = input.toLowerCase();
  const matchedKey = keys.find(key => key.toLowerCase() === normalizedInput);

  if (matchedKey) {
    resultDiv.textContent = `${matchedKey} の価格は ${currentData[matchedKey]}円です。`;
    clearSuggestions();
  } else {
    // 類似候補を表示
    const similarItems = keys
      .map(key => ({
        name: key,
        score: getSimilarity(normalizedInput, key.toLowerCase())
      }))
      .filter(item => item.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (similarItems.length > 0) {
      const suggestionHTML = similarItems.map(item =>
        `<div class="suggestion-item" onclick="onSuggestionClick('${item.name}')">・${item.name}</div>`
      ).join("");
      resultDiv.innerHTML = `該当する商品が見つかりませんでした。<br>もしかして:<br>${suggestionHTML}`;
    } else {
      resultDiv.textContent = "該当する商品が見つかりませんでした。";
    }
  }
}

function getSimilarity(str1, str2) {
  const set1 = new Set(str1);
  const set2 = new Set(str2);
  const intersection = new Set([...set1].filter(c => set2.has(c)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

function onSuggestionClick(name) {
  document.getElementById("searchBox").value = name;
  searchProduct(name);
}

function showSuggestions() {
  const input = document.getElementById("searchBox").value.trim().toLowerCase();
  const suggestionsDiv = document.getElementById("suggestions");

  if (!input || Object.keys(currentData).length === 0) {
    suggestionsDiv.innerHTML = "";
    return;
  }

  const matches = Object.keys(currentData)
    .filter(key => key.toLowerCase().includes(input))
    .slice(0, 5);

  suggestionsDiv.innerHTML = matches.map(name =>
    `<div class="suggestion-item" onclick="onSuggestionClick('${name}')">${name}</div>`
  ).join("");
}

function clearSuggestions() {
  document.getElementById("suggestions").innerHTML = "";
}

// 初期データ読み込み
document.querySelectorAll('input[name="category"]').forEach(radio => {
  radio.addEventListener('change', () => {
    fetchData(); // カテゴリが変わったら読み直し
    clearSuggestions();
    document.getElementById("result").textContent = "";
  });
});

fetchData(); // 初期表示時に読み込み
