// 회원가입 시 사용자 정보 저장
// - localStorage에 사용자 정보 영구 보관 (브라우저 닫아도 유지)
function register(email, name) {
  const user = { email, name, registerDate: new Date().toISOString() };
  // 각 사용자별로 정보 저장 (key: 'user_이메일')
  localStorage.setItem('user_' + email, JSON.stringify(user));
  alert("회원가입 완료!");
}

// 로그인 - 페이지 이동해도 로그인 상태 유지
// - localStorage만 사용해서 브라우저 닫았다 켜도 로그인 유지
function login(email) {
  // 가입된 사용자인지 확인
  const saved = localStorage.getItem('user_' + email);
  if (!saved) return alert("회원 정보 없음");

  const user = JSON.parse(saved);
  
  // 현재 로그인된 사용자 정보를 localStorage에 저장
  // - 페이지 새로고침, 다른 페이지 이동해도 계속 유지됨
  localStorage.setItem('currentUser', email);
  localStorage.setItem('isLoggedIn', 'true');
  
  alert(`${user.name}님 로그인 성공!`);
}

// 페이지 진입 시 로그인 여부 확인
// - 모든 페이지에서 호출해서 로그인 상태 체크
// - 로그인했으면 사용자 정보 표시, 안했으면 로그인 요구
function checkLogin() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const email = localStorage.getItem('currentUser');
  
  // 두 정보가 모두 있어야 로그인 상태로 인정
  if (isLoggedIn === 'true' && email) {
    const saved = localStorage.getItem('user_' + email);
    if (saved) {
      const user = JSON.parse(saved);
      console.log("현재 로그인 중:", user.name, "(" + email + ")");
      return user; // 로그인된 사용자 정보 리턴
    }
  }
  
  console.log("로그인 필요");
  return null; // 로그인 안된 상태
}

// 로그아웃
// - localStorage에서 로그인 관련 정보만 삭제 (회원정보는 유지)
function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('currentUser');
  alert("로그아웃 되었습니다");
}