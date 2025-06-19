// 메인페이지 상품 리스트 연동

      // 상품 API의 기본 URL 설정
      import { fetchProductList } from '../api/productsApi.js';

      
// DOM이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // ✅ 상품 리스트 API 호출
    const data = await fetchProductList();

    // ✅ 상품 카드를 삽입할 요소 선택
    const productList = document.querySelector("#product-list");

    // 만약 product-list가 없다면 경고 출력 후 종료
    if (!productList) {
      console.error("product-list 요소를 찾을 수 없습니다!");
      return;
    }

    // ✅ 받아온 상품 리스트를 반복 처리
    data.results.forEach(product => {
      // 각 상품을 나타낼 div 생성
      const productCard = document.createElement("div");
      productCard.className = "product-card";

      // 상품 ID 저장 및 클릭 가능한 커서 설정
      productCard.setAttribute("data-product-id", product.id);
      productCard.style.cursor = "pointer";

      // 상품 정보를 HTML로 삽입
      productCard.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">${product.price.toLocaleString()}원</p>
        </div>
      `;

      // ✅ 상품 클릭 시 상세페이지로 이동
      productCard.addEventListener("click", function () {
        const productId = this.getAttribute("data-product-id");
        window.location.href = `../detail.html?id=${productId}`;
      });

      // ✅ 완성된 상품 카드를 product-list에 추가
      productList.appendChild(productCard);
    });

  } catch (error) {
    // 에러 발생 시 콘솔에 출력
    console.error("상품 불러오기 실패:", error);
  }
});