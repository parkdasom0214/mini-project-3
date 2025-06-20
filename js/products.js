import { checkLoginStatus } from '../utils/tokenStorage.js';
import { fetchProductList } from '../api/productsApi.js';

document.addEventListener('DOMContentLoaded', async () => {
  const { isLoggedIn, user } = checkLoginStatus();

  // 로그인 여부에 따른 버튼 처리 (존재할 때만)
  const logoutBtn = document.getElementById('logout-button');
  const loginBtn = document.getElementById('login-button');

  if (isLoggedIn) {
    console.log(`${user.username}님 환영합니다!`);
    if (logoutBtn) logoutBtn.style.display = 'block';
    if (loginBtn) loginBtn.style.display = 'none';
  } else {
    console.log('비로그인 사용자입니다.');
    if (loginBtn) loginBtn.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }

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
