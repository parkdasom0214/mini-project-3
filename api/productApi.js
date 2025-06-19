// productApi.js
import { BASE_URL } from './config.js';

// 상품 목록 불러오기 함수
export async function fetchProductList() {
  const response = await fetch(`${BASE_URL}products`);
  if (!response.ok) {
    throw new Error('상품 목록을 불러오는 데 실패했습니다.');
  }
  return await response.json();
}