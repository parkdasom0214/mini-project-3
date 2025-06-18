    <!-- 메인페이지 상품 리스트 연동 -->

      // 상품 API의 기본 URL 설정
      const baseUrl = "https://api.wenivops.co.kr/services/open-market/";

      // 'products' 엔드포인트로 GET 요청
      fetch(`${baseUrl}products`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);

          // product-list 섹션을 선택
          const productList = document.querySelector("#product-list");

          if (!productList) {
            console.error("product-list 요소를 찾을 수 없습니다!");
            return;
          }

          // 받아온 상품 리스트를 하나씩 순회
          data["results"].forEach((product) => {
            // 각 상품을 담을 div 요소 생성
            const productCard = document.createElement("div");
            productCard.className = "product-card";

            // ✅ 여기 2줄만 추가
            productCard.setAttribute("data-product-id", product.id);
            productCard.style.cursor = "pointer";

            // 상품 정보를 카드 형태로 작성
            productCard.innerHTML = `
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">${product.price.toLocaleString()}원</p>
          </div>
        `;

          // ✅ 여기 4줄만 추가
          productCard.addEventListener("click", function() {
            const productId = this.getAttribute("data-product-id");
            window.location.href = `../detail.html?id=${productId}`;
          });

            // 생성한 상품 카드를 product-list 섹션에 추가
            productList.appendChild(productCard);
          });
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
        });
