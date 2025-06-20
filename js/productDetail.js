import productDetailAPI from '../api/productDetailApi.js';

class ProductDetail {
  constructor() {
    this.product = null;
    this.unitPrice = 0;
    this.isLoggedIn = false;
  }

  // 초기화
  async init() {
    try {
      this.showLoading();
      
      const result = await productDetailAPI.getProductDetail();
      if (!result) return;

      this.product = result.product;
      this.unitPrice = result.product.price;
      
      this.render();
      this.bindEvents();
      this.hideLoading();

      if (result.isDummy) {
        alert(`API 연결 실패\n샘플 데이터를 표시합니다.`);
      }
      
    } catch (error) {
      console.error("초기화 실패:", error);
      this.hideLoading();
      alert("페이지 로드 실패");
    }
  }

  // 로딩 제어
  showLoading() {
    document.getElementById("loading")?.classList.remove("hidden");
  }

  hideLoading() {
    document.getElementById("loading")?.classList.add("hidden");
  }

  // 렌더링
  render() {
    const p = this.product;
    
    // 기본 정보
    this.setText("#productName", p.name);
    this.setHTML("#productPrice", `${p.price.toLocaleString()}<span class="text-lg font-normal">원</span>`);
    this.setText("#sellerInfo", p.seller.store_name);
    
    // 이미지
    const img = document.querySelector("#productImage");
    if (img) {
      img.src = p.image;
      img.alt = p.name;
    }

    // 배송 정보
    const shipping = p.shipping_method === "DELIVERY" ? "직접배송" : "택배배송";
    const fee = p.shipping_fee === 0 ? "무료배송" : `${p.shipping_fee.toLocaleString()}원`;
    const stock = p.stock > 0 ? ` | 재고: ${p.stock}개` : " | 품절";
    this.setText("#shippingInfo", `${shipping} / ${fee}${stock}`);

    // 상세 정보
    this.setHTML("#productDetail", p.info);
    document.title = p.name;
    
    this.updateTotalPrice();
  }

  // 총 가격 업데이트
  updateTotalPrice() {
    const quantity = parseInt(document.getElementById("quantity")?.value) || 1;
    const total = quantity * this.unitPrice;
    
    this.setText("#totalQuantity", `총 수량 ${quantity}개`);
    this.setText("#totalPrice", `${total.toLocaleString()}원`);
  }

  // 이벤트 바인딩
  bindEvents() {
    // 수량 조절
    document.getElementById("increaseBtn")?.addEventListener("click", () => {
      const input = document.getElementById("quantity");
      if (input) {
        input.value = parseInt(input.value) + 1;
        this.updateTotalPrice();
      }
    });

    document.getElementById("decreaseBtn")?.addEventListener("click", () => {
      const input = document.getElementById("quantity");
      if (input) {
        const val = parseInt(input.value);
        if (val > 1) {
          input.value = val - 1;
          this.updateTotalPrice();
        }
      }
    });

    // 수량 제한
let maxStock = product.stock; // ✅ 상품 상세 API에서 받은 재고 수량
const increaseBtn = document.getElementById("increaseBtn");
const decreaseBtn = document.getElementById("decreaseBtn");
const input = document.getElementById("quantity");

increaseBtn?.addEventListener("click", () => {
  if (input) {
    const val = parseInt(input.value);
    if (val < maxStock) {
      input.value = val + 1;
      this.updateTotalPrice();
    }
    // 버튼 상태 업데이트
    toggleButtonState();
  }
});

decreaseBtn?.addEventListener("click", () => {
  if (input) {
    const val = parseInt(input.value);
    if (val > 1) {
      input.value = val - 1;
      this.updateTotalPrice();
    }
    // 버튼 상태 업데이트
    toggleButtonState();
  }
});

// 👉 버튼 비활성화 상태 업데이트 함수
function toggleButtonState() {
  const val = parseInt(input.value);
  increaseBtn.disabled = val >= maxStock;
  decreaseBtn.disabled = val <= 1;
}


    // 구매/장바구니
    document.getElementById("purchaseBtn")?.addEventListener("click", () => {
      if (!this.isLoggedIn) {
        this.showLoginModal();
        return;
      }
      this.handlePurchase();
    });

    document.getElementById("cartBtn")?.addEventListener("click", () => {
      if (!this.isLoggedIn) {
        this.showLoginModal();
        return;
      }
      this.handleCart();
    });

    // 탭
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.switchTab(e.target.dataset.tab, e.target);
      });
    });

    // 모달
    document.getElementById("closeModalBtn")?.addEventListener("click", () => this.closeModal());
    document.getElementById("cancelLoginBtn")?.addEventListener("click", () => this.closeModal());
    document.getElementById("confirmLoginBtn")?.addEventListener("click", () => {
      window.location.href = CONFIG.PAGES.LOGIN;
    });
  }

  // 구매 처리
  handlePurchase() {
    const quantity = parseInt(document.getElementById("quantity")?.value) || 1;
    const total = quantity * this.unitPrice;
    alert(`구매: ${this.product.name}\n수량: ${quantity}개\n금액: ${total.toLocaleString()}원`);
  }

  // 장바구니 처리
  handleCart() {
    const quantity = parseInt(document.getElementById("quantity")?.value) || 1;
    alert(`장바구니 추가: ${this.product.name}\n수량: ${quantity}개`);
  }

  // 탭 전환
  switchTab(tabName, btn) {
    document.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".tab-btn").forEach(el => {
      el.classList.remove("text-green-500", "border-b-2", "border-green-500");
      el.classList.add("text-gray-500");
    });

    document.getElementById(tabName)?.classList.remove("hidden");
    btn.classList.remove("text-gray-500");
    btn.classList.add("text-green-500", "border-b-2", "border-green-500");
  }

  // 모달 제어
  showLoginModal() {
    document.getElementById("loginModal")?.classList.remove("hidden");
  }

  closeModal() {
    document.getElementById("loginModal")?.classList.add("hidden");
  }

  // 유틸리티
  setText(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  }

  setHTML(selector, html) {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = html;
  }
}

// 초기화
document.addEventListener("DOMContentLoaded", () => {
  new ProductDetail().init();
});