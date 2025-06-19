// header.js - 완전한 헤더 템플릿

// 헤더 템플릿 생성 함수
function createHeaderTemplate(options = {}) {
  const config = {
    logoText: '호두 오픈마켓',
    logoUrl: '../index.html',
    searchAction: '/search',
    searchPlaceholder: '상품을 검색해보세요',
    cartUrl: '#',
    cartText: '장바구니',
    cartIcon: '/images/icon-shopping-cart.png',
    loginUrl: './login.html',
    loginText: '마이페이지',
    loginIcon: '/images/icon-user.png',
    ...options
  };

  return `
    <div class="container">
      <h1><a href="${config.logoUrl}">${config.logoText}</a></h1>
      <form action="${config.searchAction}" method="GET" role="search">
        <label for="search" class="visually-hidden">상품 검색</label>
        <input type="text" id="search" name="q" placeholder="${config.searchPlaceholder}" />
        <button type="submit">검색</button>
      </form>
      <nav class="user-menu">
        <a href="${config.cartUrl}" class="cart">
          <img src="${config.cartIcon}" alt="" />${config.cartText}
        </a>
        <a href="${config.loginUrl}" class="login">
          <img src="${config.loginIcon}" alt="" />${config.loginText}
        </a>
      </nav>
    </div>
  `;
}

// 헤더 클래스
class Header {
  constructor(options = {}) {
    this.options = options;
    this.isLoggedIn = false;
    this.userData = null;
  }

  // 헤더 렌더링
  render(targetSelector) {
    const targetElement = typeof targetSelector === 'string' 
      ? document.querySelector(targetSelector) 
      : targetSelector;

    if (!targetElement) {
      console.error('헤더를 렌더링할 대상 요소를 찾을 수 없습니다:', targetSelector);
      return;
    }

    targetElement.innerHTML = createHeaderTemplate(this.options);
    this.bindEvents(targetElement);
    this.updateUserMenu();
  }

  // ✅ 이벤트 바인딩 (누락된 함수 추가)
  bindEvents(container) {
    // 검색 폼 이벤트
    const searchForm = container.querySelector('form[role="search"]');
    const searchInput = container.querySelector('#search');

    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        const query = searchInput.value.trim();
        if (!query) {
          e.preventDefault();
          alert('검색어를 입력해주세요.');
          searchInput.focus();
          return;
        }
        this.onSearch(query, e);
      });
    }

    // 장바구니 클릭 이벤트
    const cartLink = container.querySelector('.cart');
    if (cartLink) {
      cartLink.addEventListener('click', (e) => {
        if (cartLink.getAttribute('href') === '#') {
          e.preventDefault();
        }
        this.onCartClick(e);
      });
    }

    // 로그인/마이페이지 클릭 이벤트
    const loginLink = container.querySelector('.login');
    if (loginLink) {
      loginLink.addEventListener('click', (e) => {
        this.onLoginClick(e);
      });
    }

    // 로고 클릭 이벤트
    const logoLink = container.querySelector('h1 a');
    if (logoLink) {
      logoLink.addEventListener('click', (e) => {
        this.onLogoClick(e);
      });
    }
  }

  // ✅ 검색 이벤트 핸들러 (누락된 함수 추가)
  onSearch(query, event) {
    console.log('검색:', query);
    // 기본 동작: 폼 제출 허용
  }

  // ✅ 장바구니 클릭 이벤트 핸들러 (누락된 함수 추가)
  onCartClick(event) {
    if (!this.isLoggedIn) {
      event.preventDefault();
      alert('로그인이 필요한 서비스입니다.');
      window.location.href = this.options.loginUrl || './login.html';
      return;
    }

    if (event.target.closest('a').getAttribute('href') === '#') {
      alert('장바구니 기능은 준비 중입니다.');
    }
  }

  // 로그인 상태 업데이트
  updateLoginStatus(isLoggedIn, userData = null) {
    this.isLoggedIn = isLoggedIn;
    this.userData = userData;
    this.updateUserMenu();
  }

  // 사용자 메뉴 업데이트
  updateUserMenu() {
    const loginLink = document.querySelector('.login');
    if (!loginLink) return;

    if (this.isLoggedIn && this.userData) {
      // 로그인 상태
      const userName = this.userData.name || this.userData.username || '사용자';
      loginLink.innerHTML = `
        <img src="${this.options.loginIcon || '/images/icon-user.png'}" alt="" />
        ${userName}님
      `;
      loginLink.href = this.options.mypageUrl || './mypage.html';
      loginLink.title = '마이페이지';
    } else {
      // 로그아웃 상태
      loginLink.innerHTML = `
        <img src="${this.options.loginIcon || '/images/icon-user.png'}" alt="" />
        ${this.options.loginText || '마이페이지'}
      `;
      loginLink.href = this.options.loginUrl || './login.html';
      loginLink.title = '로그인';
    }
  }

  // 로그인/마이페이지 클릭 이벤트 핸들러
  onLoginClick(event) {
    console.log('로그인/마이페이지 클릭');
    // 기본 동작: 링크 이동 허용
  }

  // 로고 클릭 이벤트 핸들러
  onLogoClick(event) {
    console.log('로고 클릭');
    // 기본 동작: 링크 이동 허용
  }

  // 로그아웃
  logout() {
    this.isLoggedIn = false;
    this.userData = null;
    this.updateUserMenu();
    
    // 로컬 스토리지에서 인증 정보 제거
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
  }
}

// ✅ 자동 로그인 상태 확인 (누락된 함수 추가)
function checkAutoLogin() {
  try {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      const parsedUserData = JSON.parse(userData);
      updateHeaderLoginStatus(true, parsedUserData);
      return true;
    }
  } catch (error) {
    console.error('자동 로그인 확인 중 오류:', error);
  }
  return false;
}

// 간편 사용을 위한 전역 함수들
let globalHeader = null;

// 헤더 초기화 (가장 간단한 사용법)
function initHeader(targetSelector, options = {}) {
  globalHeader = new Header(options);
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      globalHeader.render(targetSelector);
    });
  } else {
    globalHeader.render(targetSelector);
  }
  
  return globalHeader;
}

// 헤더 생성 (옵션 포함)
function createHeader(targetSelector, options = {}) {
  return initHeader(targetSelector, options);
}

// 로그인 상태 업데이트 (전역 함수)
function updateHeaderLoginStatus(isLoggedIn, userData = null) {
  if (globalHeader) {
    globalHeader.updateLoginStatus(isLoggedIn, userData);
  }
}

// 로그아웃 (전역 함수)
function headerLogout() {
  if (globalHeader) {
    globalHeader.logout();
  }
}

// ES6 모듈 방식 export (필요시)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    Header, 
    createHeaderTemplate, 
    initHeader, 
    createHeader, 
    updateHeaderLoginStatus, 
    headerLogout,
    checkAutoLogin 
  };
}

// 브라우저 환경에서 전역 객체에 추가
if (typeof window !== 'undefined') {
  window.Header = Header;
  window.initHeader = initHeader;
  window.createHeader = createHeader;
  window.updateHeaderLoginStatus = updateHeaderLoginStatus;
  window.headerLogout = headerLogout;
  window.checkAutoLogin = checkAutoLogin;
}