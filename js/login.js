// 로그인 처리
import { login } from '../api/authApi.js';

console.log("✅ login.js 실행됨");

document.addEventListener('DOMContentLoaded', function () {
  console.log("✅ DOM 완전히 로딩됨");

  const tabs = document.querySelectorAll('.tab');
  const userIdInput = document.getElementById('userId');
  const passwordInput = document.getElementById('password');
  const loginForm = document.querySelector('.login-form');

  // 탭 전환 기능
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      const tabType = this.dataset.tab;
      clearLoginError();
    });
  });

  // 로그인 에러 메시지 표시
  function showLoginError(message = '아이디 또는 비밀번호가 일치하지 않습니다.') {
    clearLoginError();

    let errorDiv = document.querySelector('.login-error');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'login-error';
      errorDiv.style.cssText = `
        color: #ff4444;
        font-size: 14px;
        text-align: center;
        margin: 10px 0;
        padding: 10px;
        background-color: #fff5f5;
        border: 1px solid #ffcccc;
        border-radius: 4px;
      `;
      const loginButton = document.querySelector('.login-button');
      loginButton.parentNode.insertBefore(errorDiv, loginButton);
    }

    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    userIdInput.classList.add('error');
    passwordInput.classList.add('error');
  }

  // 에러 메시지 제거
  function clearLoginError() {
    const errorDiv = document.querySelector('.login-error');
    if (errorDiv) errorDiv.style.display = 'none';
    userIdInput.classList.remove('error');
    passwordInput.classList.remove('error');
  }

  // 로그인 시도
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log("📌 submit 이벤트 발생함");

    const userId = userIdInput.value.trim();
    const password = passwordInput.value.trim();
    const activeTab = document.querySelector('.tab.active').dataset.tab;

    if (!userId) {
      showLoginError('아이디를 입력해주세요.');
      userIdInput.focus();
      return;
    }

    if (!password) {
      showLoginError('비밀번호를 입력해주세요.');
      passwordInput.focus();
      return;
    }

    clearLoginError();
    handleLogin(userId, password, activeTab);
  });

  // 입력 시 에러 제거
  [userIdInput, passwordInput].forEach(input => {
    input.addEventListener('input', clearLoginError);
    input.addEventListener('focus', clearLoginError);
  });

  // 로그인 처리 함수
  async function handleLogin(userId, password, userType) {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectTo = urlParams.get('redirect') || '/';

    try {
      const { success, user } = await login(userId, password);

console.log("✅ login API 응답 user:", user);

if (success) {
  // ✅ 로그인 상태 저장
  localStorage.setItem('authToken', user.token);  // 또는 적절한 토큰 필드
  localStorage.setItem('userData', JSON.stringify(user));
  localStorage.setItem('userType', userType);

  // ✅ 페이지 이동
  window.location.href = redirectTo;
}
 else {
        showLoginError('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('로그인 요청 실패:', error);
      showLoginError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }
});
