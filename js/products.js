import { autoLoginCheck } from '../utils/tokenStorage.js';
import { fetchProductList } from '../api/productsApi.js';

// DOM이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', async () => {
  // ✅ 로그인 상태 확인
  const isLoggedIn = await autoLoginCheck();

  if (!isLoggedIn) {
    alert('로그인이 필요합니다.');
    window.location.href = '/login.html';
    return; // 아래 코드 실행하지 않음
  }

  // ✅ 로그인 상태면 상품 리스트 로딩 시작
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
        window.location.href = `../detail.html?id=${productId}`;
      });

      productList.appendChild(productCard);
    });

  } catch (error) {
    console.error("상품 불러오기 실패:", error);
  }
});
