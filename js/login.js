

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
		const tabs = document.querySelectorAll('.tab');
		const userIdInput = document.getElementById('userId');
		const passwordInput = document.getElementById('password');
		const loginForm = document.querySelector('.login-form');

		// 탭 전환 기능
		tabs.forEach(tab => {
				tab.addEventListener('click', function() {
						// 모든 탭에서 active 클래스 제거
						tabs.forEach(t => t.classList.remove('active'));
						
						// 클릭된 탭에 active 클래스 추가
						this.classList.add('active');
						
						// 선택된 탭 타입 확인
						const tabType = this.dataset.tab;
						
						// 폼 액션 URL 변경
						if (tabType === 'seller') {
								loginForm.action = '/seller/login';
						} else {
								loginForm.action = '/buyer/login';
						}
						
						// 탭 변경 시 에러 메시지 초기화
						clearLoginError();
				});
		});

		// 로그인 에러 메시지 표시
		function showLoginError(message = '아이디 또는 비밀번호가 일치하지 않습니다.') {
				// 기존 에러 메시지 제거
				clearLoginError();
				
				// 에러 메시지 div 생성 또는 가져오기
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
						
						// 로그인 버튼 위에 삽입
						const loginButton = document.querySelector('.login-button');
						loginButton.parentNode.insertBefore(errorDiv, loginButton);
				}
				
				errorDiv.textContent = message;
				errorDiv.style.display = 'block';
				
				// 입력 필드에 에러 스타일 적용
				userIdInput.classList.add('error');
				passwordInput.classList.add('error');
		}

		// 로그인 에러 메시지 제거
		function clearLoginError() {
				const errorDiv = document.querySelector('.login-error');
				if (errorDiv) {
						errorDiv.style.display = 'none';
				}
				
				// 입력 필드 에러 스타일 제거
				userIdInput.classList.remove('error');
				passwordInput.classList.remove('error');
		}

		// 서버 로그인 요청 처리
		async function handleLogin(userId, password, userType) {
				try {
						const response = await fetch(`/${userType}/login`, {
								method: 'POST',
								headers: {
										'Content-Type': 'application/json',
								},
								body: JSON.stringify({
										userId: userId,
										password: password
								})
						});
						
						const result = await response.json();
						
						if (response.ok && result.success) {
								// 로그인 성공
								window.location.href = result.redirectUrl || '/dashboard';
						} else {
								// 로그인 실패
								showLoginError(result.message || '아이디 또는 비밀번호가 일치하지 않습니다.');
						}
				} catch (error) {
						console.error('로그인 요청 실패:', error);
						showLoginError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
				}
		}

		// 테스트용 로그인 시뮬레이션 (실제 서버 없을 때)
		function simulateLogin(userId, password) {
				// 테스트 계정
				const testAccounts = {
						'testuser': 'test123',
						'admin': 'admin123'
				};
				
				setTimeout(() => {
						if (testAccounts[userId] && testAccounts[userId] === password) {
								alert('로그인 성공!');
								// window.location.href = '/dashboard';
						} else {
								showLoginError();
						}
				}, 500);
		}

		// 폼 제출 처리
		loginForm.addEventListener('submit', function(e) {
				e.preventDefault();
				
				const userId = userIdInput.value.trim();
				const password = passwordInput.value.trim();
				const activeTab = document.querySelector('.tab.active').dataset.tab;
				
				// 기본 유효성 검사
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
				
				// 에러 메시지 초기화
				clearLoginError();
				
				// 실제 서버 요청 (서버가 있을 때)
				// handleLogin(userId, password, activeTab);
				
				// 테스트용 시뮬레이션 (서버가 없을 때)
				simulateLogin(userId, password);
		});

		// 입력 필드 변경 시 에러 메시지 제거
		userIdInput.addEventListener('input', clearLoginError);
		passwordInput.addEventListener('input', clearLoginError);
		
		// 입력 필드 포커스 시 에러 메시지 제거
		userIdInput.addEventListener('focus', clearLoginError);
		passwordInput.addEventListener('focus', clearLoginError);
});

//로그인시 이전페이지로 이동 로직
document.getElementById('login-btn').addEventListener('click', async () => {
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;

	const urlParams = new URLSearchParams(window.location.search);
	const redirectTo = urlParams.get('redirect') || '/';

	const response = await fetch('https://api.wenivops.co.kr/services/open-market/accounts/login/', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, password })
	});

	const data = await response.json();

	if (response.ok) {
		localStorage.setItem('accessToken', data.access);
		localStorage.setItem('refreshToken', data.refresh);
		window.location.href = redirectTo;
	} else {
		alert(data.error || '로그인 실패');
	}
});
