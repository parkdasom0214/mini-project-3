// config.js - 애플리케이션 설정 파일

// API 관련 설정
export const BASE_URL = "https://api.wenivops.co.kr/services/open-market/";

// 기타 설정들
export const CONFIG = {
  // API 설정
  API: {
    BASE_URL: "https://api.wenivops.co.kr/services/open-market/",
    TIMEOUT: 10000, // 10초
    RETRY_COUNT: 3
  },
  
  // 페이지 설정
  PAGES: {
    LOGIN: "./login.html",
    MAIN: "../index.html",
    CART: "./cart.html",
    MYPAGE: "./mypage.html"
  },
  
  // 기본값들
  DEFAULTS: {
    PRODUCT_IMAGE: "https://via.placeholder.com/600x600/cccccc/666666?text=No+Image",
    SHIPPING_METHOD: "DELIVERY",
    MIN_QUANTITY: 1,
    MAX_QUANTITY: 999
  },
  
  // 메시지
  MESSAGES: {
    LOADING: "로딩 중...",
    NO_PRODUCT: "상품 정보를 찾을 수 없습니다.",
    LOGIN_REQUIRED: "로그인이 필요한 서비스입니다.",
    API_ERROR: "서버 연결에 실패했습니다."
  }
};

// 환경별 설정 (개발/운영)
export const ENV_CONFIG = {
  development: {
    API_BASE_URL: "https://api.wenivops.co.kr/services/open-market/",
    DEBUG: true,
    LOG_LEVEL: 'debug'
  },
  production: {
    API_BASE_URL: "https://api.wenivops.co.kr/services/open-market/",
    DEBUG: false,
    LOG_LEVEL: 'error'
  }
};

// 현재 환경 감지 (간단한 방법)
const getCurrentEnvironment = () => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname.includes('dev') 
    ? 'development' 
    : 'production';
};

export const CURRENT_ENV = getCurrentEnvironment();
export const CURRENT_CONFIG = ENV_CONFIG[CURRENT_ENV];