// signup.js - 통합된 JavaScript 파일

// const baseUrl = 'https://api.wenivops.co.kr/';
const baseUrl = 'https://api.wenivops.co.kr/services/open-market/';

// DOM 요소들
let buyerForm, sellerForm, buyerButton, sellerButton;
let signupContainer, privacyContainer;

// 유효성 검사 함수들
const validation = {
  username: (value) => value.length >= 4 && value.length <= 20,
  password: (value) => {
    // 8자 이상, 영소문자 포함 체크
    const hasMinLength = value.length >= 8;
    const hasLowerCase = /[a-z]/.test(value);
    return hasMinLength && hasLowerCase;
  },
  name: (value) => {
    // 이름은 중복 가능, 2자 이상만 체크
    return value.trim().length >= 2;
  },
  phoneNumber: (phone) => /^010[0-9]{7,8}$/.test(phone.replace(/[^0-9]/g, ''))
};

// 에러 메시지 표시/제거
function showError(inputElement, message) {
  clearError(inputElement);
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message text-red-500 text-xs mt-1';
  errorDiv.textContent = message;
  inputElement.parentElement.appendChild(errorDiv);
  inputElement.classList.add('border-red-500');
}

function clearError(inputElement) {
  const errorMessage = inputElement.parentElement.querySelector('.error-message');
  if (errorMessage) errorMessage.remove();
  inputElement.classList.remove('border-red-500');
}

// 탭 전환 기능
function switchTab(clickedTab) {
  const tabs = document.querySelectorAll('.tab-btn');
  
  // 탭 스타일 변경
  tabs.forEach(tab => {
    tab.classList.remove('bg-white', 'text-gray-800');
    tab.classList.add('bg-gray-100', 'text-gray-600');
  });

  clickedTab.classList.remove('bg-gray-100', 'text-gray-600');
  clickedTab.classList.add('bg-white', 'text-gray-800');

  // 폼 전환
  if (clickedTab.dataset.tab === 'buyer') {
    buyerForm.classList.remove('hidden');
    sellerForm.classList.add('hidden');
  } else {
    buyerForm.classList.add('hidden');
    sellerForm.classList.remove('hidden');
  }
}

// 개인정보처리방침 페이지로 이동
function showPrivacyPage() {
  signupContainer.classList.add('hidden');
  privacyContainer.classList.remove('hidden');
}

// 회원가입 완료 (개인정보처리방침 페이지에서 호출)
function completeSignup() {
  alert('HODU 회원가입이 완료되었습니다!\n이전 페이지로 돌아갑니다.');
  goToPreviousPage();
}

// 버튼 상태 업데이트
function updateButtonState(form, button) {
  const inputs = form.querySelectorAll('input[required]');
  const termsCheckbox = form.querySelector('input[type="checkbox"]');
  let isValid = true;

  // 모든 필수 입력 필드 확인
  inputs.forEach(input => {
    if (input.type === 'checkbox') return;
    if (!input.value.trim()) {
      isValid = false;
    }
  });

  // 약관 동의 확인
  if (!termsCheckbox.checked) {
    isValid = false;
  }

  // 버튼 스타일 변경
  if (isValid) {
    button.classList.remove('bg-gray-400');
    button.classList.add('bg-green-500', 'hover:bg-green-600');
    button.disabled = false;
  } else {
    button.classList.remove('bg-green-500', 'hover:bg-green-600');
    button.classList.add('bg-gray-400');
    button.disabled = true;
  }
}

// 폼 유효성 검사
function validateForm(form) {
  const formData = new FormData(form);
  let isValid = true;
  let errors = [];

  // 아이디 검사
  const username = formData.get('username');
  if (!validation.username(username)) {
    errors.push('아이디는 4-20자로 입력해주세요.');
    isValid = false;
  }

  // 비밀번호 검사
  const password = formData.get('password');
  if (!validation.password(password)) {
    errors.push('비밀번호는 8자 이상이며 영소문자를 포함해야 합니다.');
    isValid = false;
  }

  // 비밀번호 확인
  const passwordConfirm = formData.get('password_confirm');
  if (password !== passwordConfirm) {
    errors.push('비밀번호가 일치하지 않습니다.');
    isValid = false;
  }

  // 이름 검사 (중복 허용)
  const name = formData.get('name');
  if (!validation.name(name)) {
    errors.push('이름을 2자 이상 입력해주세요. (이름은 중복 가능합니다)');
    isValid = false;
  }

  // 전화번호 검사
  const phoneNumber = formData.get('phone_first') + formData.get('phone_middle') + formData.get('phone_last');
  if (!validation.phoneNumber(phoneNumber)) {
    errors.push('전화번호는 010으로 시작하는 10-11자리 숫자여야 합니다.');
    isValid = false;
  }

  // 약관 동의
  const termsAgree = formData.get('terms_agree');
  if (!termsAgree) {
    errors.push('이용약관에 동의해주세요.');
    isValid = false;
  }

  if (!isValid) {
    alert(errors.join('\n'));
  }

  return isValid;
}

// 실시간 유효성 검사 설정
function setupRealTimeValidation(form) {
  const inputs = form.querySelectorAll('input');
  
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      clearError(input);
      updateButtonState(form, form.id === 'buyerForm' ? buyerButton : sellerButton);
    });

    input.addEventListener('blur', () => {
      const value = input.value.trim();
      
      if (input.name === 'username' && value && !validation.username(value)) {
        showError(input, '아이디는 4-20자의 영문, 숫자만 사용 가능합니다.');
      } else if (input.name === 'password' && value && !validation.password(value)) {
        showError(input, '비밀번호는 8자 이상이며 영소문자를 포함해야 합니다.');
      } else if (input.name === 'password_confirm' && value) {
        const password = form.querySelector('input[name="password"]').value;
        if (value !== password) {
          showError(input, '비밀번호가 일치하지 않습니다.');
        }
      } else if (input.name === 'name' && value && !validation.name(value)) {
        showError(input, '이름은 2자 이상 입력해주세요. (중복 가능)');
      }
    });
  });

  // 전화번호 숫자만 입력
  const phoneInputs = form.querySelectorAll('input[name="phone_middle"], input[name="phone_last"]');
  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
  });

  // 체크박스 이벤트
  const checkbox = form.querySelector('input[type="checkbox"]');
  checkbox.addEventListener('change', () => {
    updateButtonState(form, form.id === 'buyerForm' ? buyerButton : sellerButton);
  });
}

// 중복 확인 (임시 - 실제 중복확인 API가 없는 경우)
async function checkDuplicate(username, button) {
  if (!username.trim()) {
    alert('아이디를 입력해주세요.');
    return;
  }

  if (!validation.username(username)) {
    alert('아이디는 4-20자의 영문, 숫자만 사용 가능합니다.');
    return;
  }

  button.disabled = true;
  button.textContent = '확인중...';

  try {
    // 임시 중복 확인 로직 (실제 API 대신)
    // 개발 단계에서는 단순히 성공으로 처리
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기 (로딩 시뮬레이션)
    
    // 임시: 특정 아이디들은 중복으로 처리
    const duplicateIds = ['admin', 'test', 'user', 'hodu'];
    
    if (duplicateIds.includes(username.toLowerCase())) {
      alert('이미 사용중인 아이디입니다.');
    } else {
      alert('사용 가능한 아이디입니다.');
    }

    /* 
    // 실제 중복확인 API가 있다면 이렇게 사용:
    const response = await fetch(`${baseUrl}accounts/check-username/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username })
    });

    const data = await response.json();
    
    if (response.ok) {
      if (data.is_available) {
        alert('사용 가능한 아이디입니다.');
      } else {
        alert('이미 사용중인 아이디입니다.');
      }
    } else {
      throw new Error('중복 확인 실패');
    }
    */
    
  } catch (error) {
    console.error('중복 확인 오류:', error);
    alert('중복 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
  } finally {
    button.disabled = false;
    button.textContent = '중복확인';
  }
}

// 회원가입 API 호출
async function submitSignup(formData, userType) {
  const data = {
    username: formData.get('username'),
    password: formData.get('password'),
    name: formData.get('name'),
    phone_number: formData.get('phone_first') + formData.get('phone_middle') + formData.get('phone_last')
  };

  // 판매자의 경우 추가 필드
  if (userType === 'seller') {
    data.business_number = formData.get('business_number');
    data.store_name = formData.get('store_name');
  }

  console.log('📤 전송할 데이터:', data);

  try {
    const endpoint = userType === 'buyer' ? 'buyer/signup/' : 'seller/signup/';
    const response = await fetch(`${baseUrl}accounts/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    const result = await response.json();
    console.log('✅ 회원가입 성공:', result);
    
    // 회원가입 성공 시 자동 로그인 시도
    await autoLogin(data.username, data.password, userType);
    
  } catch (error) {
    console.error('❌ 회원가입 실패:', error);
    
    let errorMessage = '회원가입 중 오류가 발생했습니다.';
    
    if (error.username) {
      errorMessage = `아이디 오류: ${error.username[0]}`;
    } else if (error.password) {
      errorMessage = `비밀번호 오류: ${error.password[0]}`;
    } else if (error.name) {
      errorMessage = `이름 오류: ${error.name[0]}`;
    } else if (error.phone_number) {
      errorMessage = `전화번호 오류: ${error.phone_number[0]}`;
    } else if (error.business_number) {
      errorMessage = `사업자등록번호 오류: ${error.business_number[0]}`;
    } else if (error.store_name) {
      errorMessage = `스토어명 오류: ${error.store_name[0]}`;
    }
    
    alert(errorMessage);
  }
}

// 자동 로그인 함수
async function autoLogin(username, password, userType) {
  try {
    console.log('🔄 자동 로그인 시도 중...');
    
    const loginData = {
      username: username,
      password: password,
      login_type: userType.toUpperCase() // 'BUYER' 또는 'SELLER'
    };

    const response = await fetch(`${baseUrl}accounts/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });

    if (!response.ok) {
      throw new Error('자동 로그인 실패');
    }

    const loginResult = await response.json();
    console.log('✅ 자동 로그인 성공:', loginResult);

    // 토큰 저장 (localStorage에 저장)
    if (loginResult.token) {
      localStorage.setItem('authToken', loginResult.token);
      localStorage.setItem('userType', userType);
      localStorage.setItem('userData', JSON.stringify(loginResult.user || {}));
    }

    // 성공 메시지 후 이전 페이지로 이동
    alert('🎉 회원가입과 로그인이 완료되었습니다!\n이전 페이지로 돌아갑니다.');
    
    // 이전 페이지로 돌아가기
    goToPreviousPage();

  } catch (error) {
    console.error('❌ 자동 로그인 실패:', error);
    
    // 자동 로그인 실패 시에도 회원가입은 성공했으므로 개인정보처리방침 페이지 표시
    alert('회원가입은 완료되었지만 자동 로그인에 실패했습니다.\n수동으로 로그인해주세요.');
    showPrivacyPage();
  }
}

// 이전 페이지로 돌아가는 함수
function goToPreviousPage() {
  // URL 파라미터에서 이전 페이지 정보 확인
  const urlParams = new URLSearchParams(window.location.search);
  const returnUrl = urlParams.get('returnUrl');
  
  if (returnUrl) {
    // returnUrl이 있으면 해당 페이지로 이동
    window.location.href = decodeURIComponent(returnUrl);
  } else if (document.referrer && !document.referrer.includes('/signup')) {
    // referrer가 있고 회원가입 페이지가 아니면 이전 페이지로
    window.history.back();
  } else {
    // 그 외의 경우 메인페이지로
    window.location.href = '/';
  }
}

// 페이지 로드 시 이전 페이지 정보 저장
function saveReferrerInfo() {
  // 이전 페이지 정보를 sessionStorage에 저장
  if (document.referrer && !sessionStorage.getItem('signupReferrer')) {
    sessionStorage.setItem('signupReferrer', document.referrer);
  }
}

// 사업자등록번호 자동 포맷팅
function formatBusinessNumber(input) {
  let value = input.value.replace(/[^0-9]/g, '');
  if (value.length >= 3 && value.length < 5) {
    value = value.substring(0, 3) + '-' + value.substring(3);
  } else if (value.length >= 5) {
    value = value.substring(0, 3) + '-' + value.substring(3, 5) + '-' + value.substring(5, 10);
  }
  input.value = value;
}

// 폼 검증 및 이벤트 설정
function setupFormValidation(form, button) {
  const inputs = form.querySelectorAll('input[required]');
  const termsCheckbox = form.querySelector('input[type="checkbox"]');

  // 입력 필드 이벤트 리스너
  inputs.forEach(input => {
    if (input.type !== 'checkbox') {
      input.addEventListener('input', () => updateButtonState(form, button));
    }
  });

  // 체크박스 이벤트 리스너
  termsCheckbox.addEventListener('change', () => updateButtonState(form, button));

  // 중복확인 버튼 기능
  const duplicateCheckBtns = form.querySelectorAll('button[type="button"]');
  duplicateCheckBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const input = this.parentElement.querySelector('input');
      if (input.value.trim()) {
        if (this.textContent.includes('중복확인')) {
          checkDuplicate(input.value, this);
        } else if (this.textContent.includes('인증')) {
          alert('사업자 등록번호 인증이 완료되었습니다.');
        }
      } else {
        if (this.textContent.includes('중복확인')) {
          alert('아이디를 입력해주세요.');
        } else if (this.textContent.includes('인증')) {
          alert('사업자 등록번호를 입력해주세요.');
        }
      }
    });
  });

  // 폼 제출 처리
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 유효성 검사
    if (validateForm(this)) {
      const formData = new FormData(this);
      const userType = this.id === 'buyerForm' ? 'buyer' : 'seller';
      submitSignup(formData, userType);
    }
  });

  // 초기 상태 설정
  updateButtonState(form, button);
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
  // 이전 페이지 정보 저장
  saveReferrerInfo();
  
  // DOM 요소 참조
  buyerForm = document.getElementById('buyerForm');
  sellerForm = document.getElementById('sellerForm');
  buyerButton = document.getElementById('buyerSignupButton');
  sellerButton = document.getElementById('sellerSignupButton');
  signupContainer = document.getElementById('signupContainer');
  privacyContainer = document.getElementById('privacyContainer');

  // 탭 버튼 이벤트 설정
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => switchTab(button));
  });

  // 완료 버튼 이벤트 설정
  const completeButton = document.getElementById('completeButton');
  if (completeButton) {
    completeButton.addEventListener('click', completeSignup);
  }

  // 두 폼 모두 설정
  setupFormValidation(buyerForm, buyerButton);
  setupFormValidation(sellerForm, sellerButton);

  // 실시간 유효성 검사 설정
  setupRealTimeValidation(buyerForm);
  setupRealTimeValidation(sellerForm);

  // 사업자 등록번호 자동 하이픈 추가
  const businessNumberInput = document.querySelector('#sellerForm input[name="business_number"]');
  if (businessNumberInput) {
    businessNumberInput.addEventListener('input', function(e) {
      formatBusinessNumber(e.target);
    });
  }
});