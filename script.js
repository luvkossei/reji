function searchProduct() {
  const input = document.getElementById("searchBox").value.trim();
  const category = document.querySelector('input[name="category"]:checked').value;
  const resultDiv = document.getElementById("result");

  const file = category === "meals" ? "meals.json" : "drinks.json";

  fetch(file)
    .then(response => response.json())
    .then(data => {
      const keys = Object.keys(data);
      const normalizedInput = input.toLowerCase();
      const matchedKey = keys.find(key => key.toLowerCase() === normalizedInput);

      if (matchedKey) {
        resultDiv.textContent = `${matchedKey} の価格は ${data[matchedKey]}円です。`;
      } else {
        // 類似商品候補を表示
        const similarItems = keys
          .map(key => ({
            name: key,
            score: getSimilarity(normalizedInput, key.toLowerCase())
          }))
          .filter(item => item.score > 0.3) // 類似度がある程度あるものだけ
          .sort((a, b) => b.score - a.score)
          .slice(0, 3); // 上位3件まで

        if (similarItems.length > 0) {
          const suggestionText = similarItems.map(item => `・${item.name}`).join("<br>");
          resultDiv.innerHTML = `該当する商品が見つかりませんでした。<br>もしかして:<br>${suggestionText}`;
        } else {
          resultDiv.textContent = "該当する商品が見つかりませんでした。";
        }
      }
    })
    .catch(error => {
      resultDiv.textContent = "データの読み込みに失敗しました。";
      console.error(error);
    });
}

// 簡易的な類似度関数（Jaccard-like）
function getSimilarity(str1, str2) {
  const set1 = new Set(str1);
  const set2 = new Set(str2);
  const intersection = new Set([...set1].filter(c => set2.has(c)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}
