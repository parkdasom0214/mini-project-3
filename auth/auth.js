// 회원가입 시 사용자 정보 저장
function register(email, password) {
  const user = { email, password };
  localStorage.setItem('user_' + email, JSON.stringify(user));
}

// 로그인 시 로그인 상태 유지
function login(email, password) {
  const saved = localStorage.getItem('user_' + email);
  if (!saved) return alert("회원 정보 없음");

  const user = JSON.parse(saved);
  if (user.password !== password) return alert("비밀번호 틀림");

  // 로그인 성공: 세션에 로그인 상태 저장
  sessionStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('currentUser', email);
  alert("로그인 성공!");
}

// 페이지 진입 시 로그인 여부 확인
function checkLogin() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  const email = localStorage.getItem('currentUser');
  if (isLoggedIn && email) {
    console.log("현재 로그인 중:", email);
  } else {
    console.log("로그인 필요");
  }
}
