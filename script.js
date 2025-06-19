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
        resultDiv.textContent = "該当する商品が見つかりません。";
      }
    })
    .catch(error => {
      resultDiv.textContent = "データの読み込みに失敗しました。";
      console.error(error);
    });
}
