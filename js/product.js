// 상품 정보
const PRODUCT = {
  name: '덤보넘 게맨지 무릎 담요',
  price: 17500,
  maxQuantity: 999
};

// DOM 요소들
let quantityInput, minusBtn, plusBtn, totalQuantity, displayTotalPrice, totalPrice;
let buyNowBtn, addToCartBtn;

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
  // DOM 요소 선택
  quantityInput = document.getElementById('quantityInput');
  minusBtn = document.getElementById('minusBtn');
  plusBtn = document.getElementById('plusBtn');
  totalQuantity = document.getElementById('totalQuantity');
  displayTotalPrice = document.getElementById('displayTotalPrice');
  totalPrice = document.getElementById('totalPrice');
  buyNowBtn = document.getElementById('buyNowBtn');
  addToCartBtn = document.getElementById('addToCartBtn');
  // 초기화
  init();
});

// 초기화 함수
function init() {
  updateDisplay();
  bindEvents();
  initTabs();
}

// 이벤트 바인딩
fnction bindEvents() {
  // 수량 증가 버튼
  plusBtn.addEventListener('click', increaseQuantity);
  
  // 수량 감소 버튼
  minusBtn.addEventListener('click', decreaseQuantity);
  
  // 수량 입력 필드
  quantityInput.addEventListener('input', handleQuantityInput);
  quantityInput.addEventListener('blur', validateQuantityInput);
  
  // 구매 버튼들
  buyNowBtn.addEventListener('click', handleBuyNow);
  addToCartBtn.addEventListener('click', handleAddToCart);
}

// 수량 증가
function increaseQuantity() {
  const currentQuantity = parseInt(quantityInput.value);
  const newQuantity = Math.min(currentQuantity + 1, PRODUCT.maxQuantity);
  
  quantityInput.value = newQuantity;
  updateDisplay();
}

// 수량 감소
function decreaseQuantity() {
  const currentQuantity = parseInt(quantityInput.value);
  const newQuantity = Math.max(currentQuantity - 1, 1);
  
  quantityInput.value = newQuantity;
  updateDisplay();
}

// 수량 입력 처리
function handleQuantityInput(e) {
  
  // 숫자가 아닌 문자 제거
  value = value.replace(/[^0-9]/g, '');
  
  // 빈 값 처리
  if (value === '') {
      e.target.value = '';
      return;
  }
  
  // 범위 체크
  let numValue = parseInt(value);
  if (numValue > PRODUCT.maxQuantity) {
      numValue = PRODUCT.maxQuantity;
  } else if (numValue < 1) {
      numValue = 1;
  }
  
  e.target.value = numValue;
  updateDisplay();
}

// 수량 입력 유효성 검사 (포커스 아웃 시)
function validateQuantityInput(e) {
  let value = parseInt(e.target.value);
  
  if (isNaN(value) || value < 1) {
      value = 1;
  } else if (value > PRODUCT.maxQuantity) {
      value = PRODUCT.maxQuantity;
  }
  
  e.target.value = value;
  updateDisplay();
}

// 화면 업데이트
function updateDisplay() {
  const quantity = parseInt(quantityInput.value) || 1;
  const total = PRODUCT.price * quantity;
  
  // 버튼 상태 업데이트
  minusBtn.disabled = quantity <= 1;
  plusBtn.disabled = quantity >= PRODUCT.maxQuantity;
  
  // 총 수량 표시
  totalQuantity.textContent = `총 수량 ${quantity}개`;
  
  // 총 금액 표시 (천 단위 콤마)
  displayTotalPrice.textContent = formatPrice(total) + '원';
  totalPrice.textContent = formatPrice(total);
}

// 가격 포맷팅 (천 단위 콤마)
function formatPrice(price) {
  return price.toLocaleString('ko-KR');
}

// 바로 구매 처리
function handleBuyNow() {
  const quantity = parseInt(quantityInput.value);
  const totalAmount = PRODUCT.price * quantity;
  
  console.log('바로 구매:', {
      product: PRODUCT.name,
      quantity: quantity,
      unitPrice: PRODUCT.price,
      totalAmount: totalAmount
  });
  
  alert(`${PRODUCT.name}\n수량: ${quantity}개\n총 금액: ${formatPrice(totalAmount)}원\n\n바로 구매를 진행합니다.`);
  
  // 실제 구매 페이지로 이동하는 코드
  // window.location.href = `/order?product=${encodeURIComponent(PRODUCT.name)}&quantity=${quantity}`;
}

// 장바구니 추가 처리
function handleAddToCart() {
  const quantity = parseInt(quantityInput.value);
  
  console.log('장바구니 추가:', {
      product: PRODUCT.name,
      quantity: quantity,
      unitPrice: PRODUCT.price
  });
  
  alert(`${PRODUCT.name}\n수량: ${quantity}개\n\n장바구니에 추가되었습니다.`);
  
  // 실제 장바구니 API 호출 코드
  // addToCartAPI(PRODUCT.id, quantity);
}

// 탭 기능 초기화
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const targetTab = this.dataset.tab;
      
      // 모든 탭 버튼에서 active 클래스 제거
      tabBtns.forEach(tab => tab.classList.remove('active'));
      
      // 모든 탭 패널 숨김
      tabPanels.forEach(panel => panel.classList.remove('active'));
      
      // 클릭된 탭 버튼 활성화
      this.classList.add('active');
      
      // 해당 탭 패널 표시
      const targetPanel = document.getElementById(targetTab);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

// 장바구니 API 호출 (예시)
function addToCartAPI(productId, quantity) {
  // 실제 API 호출 코드
  /*
  fetch('/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productId: productId,
      quantity: quantity
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('장바구니에 추가되었습니다.');
    } else {
      alert('장바구니 추가에 실패했습니다.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('오류가 발생했습니다.');
  });
  */
}