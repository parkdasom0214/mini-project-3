import { checkLoginStatus } from '../utils/tokenStorage.js';
import { fetchProductList } from '../api/productsApi.js';

document.addEventListener('DOMContentLoaded', async () => {
  // ✅ 로그인 여부 확인 (단순 확인만)
  const { isLoggedIn, user } = checkLoginStatus();

  if (isLoggedIn) {
    console.log('✅ 로그인 사용자:', user.username);
    // 👉 로그인 사용자 전용 UI 표시, 환영 메시지 등
  }

  // ✅ 로그인 여부와 상관없이 상품 목록 불러오기
  try {
    const data = await fetchProductList();

    const productList = document.querySelector("#product-list");
    if (!productList) {
      console.error("product-list 요소를 찾을 수 없습니다!");
      return;
    }

    data.results.forEach(product => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.setAttribute("data-product-id", product.id);
      productCard.style.cursor = "pointer";

      productCard.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">${product.price.toLocaleString()}원</p>
        </div>
      `;

      productCard.addEventListener("click", function () {
        const productId = this.getAttribute("data-product-id");
        window.location.href = \`../detail.html?id=\${productId}\`;
      });

      productList.appendChild(productCard);
    });

  } catch (error) {
    console.error("상품 불러오기 실패:", error);
  }
});
