// header.js - 드롭다운이 통합된 완전한 헤더 템플릿

// 헤더 템플릿 생성 함수
function createHeaderTemplate(options = {}) {
  const config = {
    logoText: '호두 오픈마켓',
    logoUrl: `${getBasePath()}/index.html`,
    searchAction: '/search',
    searchPlaceholder: '상품을 검색해보세요',
    cartUrl: '#',
    cartText: '장바구니',
    cartIcon: `${getBasePath()}/images/icon-shopping-cart.svg`,
    loginUrl: `${getBasePath()}/login.html`,
    loginText: '마이페이지',
    loginIcon: `${getBasePath()}/images/icon-user.svg?v=2`,
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
        <div class="login-container">
          <a href="${config.loginUrl}" class="login">
            <img src="${config.loginIcon}" alt="" />${config.loginText}
          </a>
          <div class="dropdown-menu">
            <div class="dropdown-item" data-action="mypage">
              <span class="dropdown-text">마이페이지</span>
            </div>
            <div class="dropdown-item" data-action="logout">
              <span class="dropdown-text">로그아웃</span>
            </div>
          </div>
        </div>
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
    this.dropdownMenu = null;
    this.loginContainer = null;
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
    this.addDropdownStyles();
    this.bindEvents(targetElement);
    this.initDropdown(targetElement);
    this.updateUserMenu();
  }

  // 드롭다운 스타일 추가
  addDropdownStyles() {
    if (document.getElementById('dropdown-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'dropdown-styles';
    style.textContent = `
      .login-container {
        position: relative;
        display: inline-block;
      }

      .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        min-width: 150px;
        z-index: 1000;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.2s ease;
        pointer-events: none;
        display: none;
      }

      .dropdown-menu.show {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
        display: block !important;
      }

      .dropdown-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        cursor: pointer;
        transition: background-color 0.2s;
        border-bottom: 1px solid #f0f0f0;
      }

      .dropdown-item:last-child {
        border-bottom: none;
      }

      .dropdown-item:hover {
        background-color: #f8f9fa;
      }

      .dropdown-icon {
        font-size: 16px;
      }

      .dropdown-text {
        font-size: 14px;
        color: #333;
        font-weight: 500;
      }

      .dropdown-item:hover .dropdown-text {
        color: #4CAF50;
      }

      .login-container.active .login {
        background-color: #f0f8ff;
        border-radius: 4px;
      }

      /* 로그인 상태일 때만 드롭다운 표시 */
      .login-container:not(.logged-in) .dropdown-menu {
        display: none !important;
      }
    `;
    
    document.head.appendChild(style);
  }

  // 드롭다운 초기화
  initDropdown(container) {
    this.loginContainer = container.querySelector('.login-container');
    this.dropdownMenu = container.querySelector('.dropdown-menu');

    if (!this.loginContainer || !this.dropdownMenu) {
      return;
    }

    // 드롭다운 이벤트 바인딩
    this.bindDropdownEvents();
  }

  // 드롭다운 이벤트 바인딩
  bindDropdownEvents() {
    if (!this.loginContainer || !this.dropdownMenu) {
      return;
    }

    // 로그인 링크 클릭 시 드롭다운 토글 (로그인 상태일 때만)
    const loginLink = this.loginContainer.querySelector('.login');
    loginLink.addEventListener('click', (e) => {
      if (this.isLoggedIn) {
        e.preventDefault();
        e.stopPropagation();
        this.toggleDropdown();
      } else {
        this.onLoginClick(e);
      }
    });

    // 드롭다운 메뉴 아이템 클릭 이벤트
    this.dropdownMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = e.target.closest('.dropdown-item');
      if (item) {
        const action = item.getAttribute('data-action');
        this.handleDropdownAction(action);
        this.hideDropdown();
      }
    });

    // 외부 클릭 시 드롭다운 숨김
    document.addEventListener('click', (e) => {
      if (this.loginContainer && !this.loginContainer.contains(e.target)) {
        this.hideDropdown();
      }
    });

    // ESC 키로 드롭다운 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideDropdown();
      }
    });
  }

  // 드롭다운 토글
  toggleDropdown() {
    if (!this.isLoggedIn) return;
    
    if (this.dropdownMenu.classList.contains('show')) {
      this.hideDropdown();
    } else {
      this.showDropdown();
    }
  }

  // 드롭다운 표시
  showDropdown() {
    if (!this.isLoggedIn) return;
    
    this.dropdownMenu.style.display = 'block';
    setTimeout(() => {
      this.dropdownMenu.classList.add('show');
    }, 10);
    
    this.loginContainer.classList.add('active');
  }

  // 드롭다운 숨김
  hideDropdown() {
    this.dropdownMenu.classList.remove('show');
    this.loginContainer.classList.remove('active');
    
    setTimeout(() => {
      if (!this.dropdownMenu.classList.contains('show')) {
        this.dropdownMenu.style.display = 'none';
      }
    }, 200);
  }

  // 드롭다운 액션 처리
  handleDropdownAction(action) {
    switch (action) {
      case 'mypage':
        window.location.href = this.options.mypageUrl || './mypage.html';
        break;
      case 'logout':
        this.handleLogout();
        break;
      default:
        console.log('알 수 없는 액션:', action);
    }
  }

  // 로그아웃 처리
  handleLogout() {
    if (confirm('로그아웃 하시겠습니까?')) {
      this.logout();
      alert('로그아웃되었습니다.');
      window.location.href = this.options.loginUrl || './login.html';
    }
  }

  // 이벤트 바인딩
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

    // 로고 클릭 이벤트
    const logoLink = container.querySelector('h1 a');
    if (logoLink) {
      logoLink.addEventListener('click', (e) => {
        this.onLogoClick(e);
      });
    }
  }

  // 검색 이벤트 핸들러
  onSearch(query, event) {
    console.log('검색:', query);
  }

  // 장바구니 클릭 이벤트 핸들러
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
    const loginContainer = document.querySelector('.login-container');
    
    if (!loginLink || !loginContainer) return;

    if (this.isLoggedIn && this.userData) {
      // 로그인 상태
      const userName = this.userData.name || this.userData.username || '사용자';
      loginLink.innerHTML = `
        <img src="${this.options.loginIcon || '/images/icon-user.svg'}" alt="" />
        ${userName}님
      `;
      loginLink.href = '#';
      loginLink.title = '마이페이지';
      loginContainer.classList.add('logged-in');
    } else {
      // 로그아웃 상태
      loginLink.innerHTML = `
        <img src="${this.options.loginIcon || '/images/icon-user.svg'}" alt="" />
        ${this.options.loginText || '로그인'}
      `;
      loginLink.href = this.options.loginUrl || '../login.html';
      loginLink.title = '로그인';
      loginContainer.classList.remove('logged-in');
      this.hideDropdown();
    }
  }

  // 로그인/마이페이지 클릭 이벤트 핸들러
  onLoginClick(event) {
    console.log('로그인/마이페이지 클릭');
  }

  // 로고 클릭 이벤트 핸들러
  onLogoClick(event) {
    console.log('로고 클릭');
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

// 자동 로그인 상태 확인
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

function getBasePath() {
  const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  return isLocal ? '' : '/mini-project-3';
}