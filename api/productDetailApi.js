import { BASE_URL, CONFIG } from './config.js';

// 상품 상세 API
class ProductDetailAPI {
  // URL에서 상품 ID 추출
  getProductIdFromURL() {
    const id = new URLSearchParams(window.location.search).get("id");
    return id ? parseInt(id) : null;
  }

  // 상품 조회
  async fetchProduct(productId) {
    if (!productId) {
      return { success: false, shouldRedirect: true };
    }

    try {
      const response = await fetch(`${BASE_URL}products/${productId}/`, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      }

      if (response.status === 404) {
        return { success: false, error: "상품을 찾을 수 없습니다." };
      }

      throw new Error(`HTTP ${response.status}`);

    } catch (error) {
      console.error("API 오류:", error);
      return { success: false, error: "서버 연결 실패" };
    }
  }

  // 더미 데이터
  getDummyProduct() {
    return {
      id: 1,
      name: "샘플 상품",
      info: "샘플 상품 설명입니다.",
      image: "https://via.placeholder.com/600x600/10b981/ffffff?text=Sample",
      price: 29900,
      shipping_method: "PARCEL",
      shipping_fee: 3000,
      stock: 10,
      seller: {
        username: "sample_seller",
        name: "샘플 판매자",
        phone_number: "010-1234-5678",
        user_type: "SELLER",
        company_registration_number: "123-45-67890",
        store_name: "샘플 스토어"
      },
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-15T12:30:00Z"
    };
  }

  // 메인 조회 함수
  async getProductDetail() {
    const productId = this.getProductIdFromURL();
    const result = await this.fetchProduct(productId);
    
    if (result.shouldRedirect) {
      alert("잘못된 접근입니다.");
      return null;
    }
    
    if (result.success) {
      return { product: result.data, isDummy: false };
    }
    
    console.warn("API 실패, 더미 데이터 사용:", result.error);
    return { 
      product: this.getDummyProduct(), 
      isDummy: true, 
      error: result.error 
    };
  }
}

export default new ProductDetailAPI();