import { checkUsername } from '../api/authApi.js';


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
    
    // 전화번호는 3개 필드 모두 입력되었는지 확인
    if (input.name && input.name.includes('phone')) {
      const phoneFirst = form.querySelector('input[name="phone_first"]')?.value || '';
      const phoneMiddle = form.querySelector('input[name="phone_middle"]')?.value || '';
      const phoneLast = form.querySelector('input[name="phone_last"]')?.value || '';
      
      if (!phoneFirst || !phoneMiddle || !phoneLast) {
        isValid = false;
      }
    } else {
      if (!input.value.trim()) {
        isValid = false;
      }
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
  
  // 필수 입력 필드 중 비어있는 경우 처리
  if (input.hasAttribute('required') && !value) {
    if (input.name === 'username') {
      showError(input, '필수 정보입니다');
    } else if (input.name === 'password') {
      showError(input, '필수 정보입니다');
    } else if (input.name === 'password_confirm') {
      showError(input, '필수 정보입니다');
    } else if (input.name === 'name') {
      showError(input, '필수 정보입니다');
    }
    return;
  }
  
  // 값이 있을 때 유효성 검사
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
    
  } catch (error) {
    console.error('중복 확인 오류:', error);
    alert('중복 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
  } finally {
    button.disabled = false;
    button.textContent = '중복확인';
  }
}

// 회원가입 처리 (API 호출 없이 UI만 처리)
function submitSignup(formData, userType) {
  const data = {
    username: formData.get('username'),
    password: formData.get('password'),
    name: formData.get('name'),
    phone_number: formData.get('phone_first') + formData.get('phone_middle') + formData.get('phone_last')
  };

  console.log('📤 입력된 데이터:', data);

  // API 호출 없이 바로 성공 처리
  console.log('✅ 회원가입 완료 (UI 전용)');
  
  // 개인정보처리방침 페이지로 이동
  showPrivacyPage();
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
        }
      } else {
        if (this.textContent.includes('중복확인')) {
          alert('아이디를 입력해주세요.');
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
      const userType = 'buyer'; // 구매자만 처리
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

  // 구매자 폼만 설정
  setupFormValidation(buyerForm, buyerButton);
  setupRealTimeValidation(buyerForm);
});