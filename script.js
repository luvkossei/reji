let productData = {};

fetch('product.json')
  .then(response => response.json())
  .then(data => {
    productData = data;
  })
  .catch(error => {
    console.error('商品データの読み込みに失敗しました:', error);
  });

function searchProduct() {
  const input = document.getElementById("searchBox").value.trim();
  const resultDiv = document.getElementById("result");

  if (productData[input]) {
    resultDiv.textContent = `${input} の価格は ${productData[input]}円です。`;
  } else {
    resultDiv.textContent = "該当する商品が見つかりません。";
  }
}
