// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function () {
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
      loginForm.action = tabType === 'seller' ? '/seller/login' : '/buyer/login';
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

  // 로그인 처리
import { login } from '../api/authApi';

async function handleLogin(userId, password, userType) {
  const urlParams = new URLSearchParams(window.location.search);
  const redirectTo = urlParams.get('redirect') || '/';

  try {
    const { ok, result } = await login(userId, password);  // ← API 호출만 남김

    if (ok && result.access) {
      localStorage.setItem('accessToken', result.access);
      localStorage.setItem('refreshToken', result.refresh);
      window.location.href = redirectTo;
    } else {
      showLoginError(result.message || '아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  } catch (error) {
    console.error('로그인 요청 실패:', error);
    showLoginError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}

  // 로그인 폼 제출
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
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
});
