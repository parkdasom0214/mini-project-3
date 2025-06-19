// 토큰 자동 갱신 스케줄러
let tokenRefreshInterval = null;

// ✅ 토큰 저장
export function saveTokens(accessToken, refreshToken, userInfo) {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  localStorage.setItem('user_info', JSON.stringify(userInfo));
  localStorage.setItem('isLoggedIn', 'true');
}

// ✅ 토큰 조회
export function getAccessToken() {
  return localStorage.getItem('access_token');
}

export function getRefreshToken() {
  return localStorage.getItem('refresh_token');
}

export function getUserInfo() {
  const userInfo = localStorage.getItem('user_info');
  return userInfo ? JSON.parse(userInfo) : null;
}

// ✅ 로그인 상태 확인
export function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const accessToken = getAccessToken();
  const userInfo = getUserInfo();
  
  if (isLoggedIn === 'true' && accessToken && userInfo) {
    return {
      isLoggedIn: true,
      user: userInfo,
      token: accessToken
    };
  }
  
  return { isLoggedIn: false };
}

// ✅ 모든 토큰 삭제 (로그아웃)
export function clearAllTokens() {
  // 자동 토큰 갱신 스케줄러 중지
  stopTokenRefreshScheduler();
  
  // JWT 관련 모든 정보 삭제
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_info');
  localStorage.removeItem('isLoggedIn');
  
  console.log('로그아웃 완료');
}

// ✅ JWT 토큰 만료 확인
export function isTokenExpired(token) {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    return payload.exp < currentTime;
  } catch (error) {
    return true; // 파싱 에러 시 만료된 것으로 처리
  }
}

// ✅ 토큰 갱신 필요 여부 확인 (5분 - 30초 = 4분 30초 후)
export function shouldRefreshToken(accessToken) {
  if (!accessToken) return true;
  
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const timeLeft = payload.exp - currentTime;
    
    // 30초 전에 미리 갱신 (5분 - 30초 = 4분 30초)
    return timeLeft < 30;
  } catch (error) {
    return true;
  }
}

// ✅ 사용자 권한 확인
export function getUserType() {
  const userInfo = getUserInfo();
  return userInfo ? userInfo.user_type : null; // "BUYER" | "SELLER"
}

// ✅ 권한별 페이지 접근 제어
export function requireAuth(requiredUserType = null) {
  const loginStatus = checkLoginStatus();
  
  if (!loginStatus.isLoggedIn) {
    alert('로그인이 필요합니다');
    // window.location.href = '/login';
    return false;
  }
  
  if (requiredUserType && loginStatus.user.user_type !== requiredUserType) {
    alert('접근 권한이 없습니다');
    return false;
  }
  
  return true;
}

// ✅ 자동 토큰 갱신 스케줄러 시작 (4분마다 체크)
export function startTokenRefreshScheduler() {
  // 기존 스케줄러가 있으면 제거
  if (tokenRefreshInterval) {
    clearInterval(tokenRefreshInterval);
  }
  
  // 4분마다 토큰 상태 체크 (5분 수명이므로 여유 있게)
  tokenRefreshInterval = setInterval(async () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    
    if (!accessToken || !refreshToken) {
      stopTokenRefreshScheduler();
      return;
    }
    
    // Refresh Token이 만료되었는지 체크 (1일 수명)
    if (isTokenExpired(refreshToken)) {
      console.log('Refresh token 만료 - 로그아웃 처리');
      clearAllTokens();
      return;
    }
    
    // Access Token 갱신이 필요한지 체크
    if (shouldRefreshToken(accessToken)) {
      try {
        console.log('Access token 자동 갱신 중...');
        // 동적 import로 순환 참조 방지
        const { refreshAccessToken } = await import('./authApi.js');
        await refreshAccessToken();
        console.log('Access token 갱신 완료');
      } catch (error) {
        console.error('자동 토큰 갱신 실패:', error);
        clearAllTokens();
      }
    }
  }, 4 * 60 * 1000); // 4분마다 실행
}

// ✅ 자동 토큰 갱신 스케줄러 중지
export function stopTokenRefreshScheduler() {
  if (tokenRefreshInterval) {
    clearInterval(tokenRefreshInterval);
    tokenRefreshInterval = null;
  }
}

// ✅ 자동 로그인 체크 (페이지 로드 시 실행)
export async function autoLoginCheck() {
  const loginStatus = checkLoginStatus();
  
  if (!loginStatus.isLoggedIn) {
    return false;
  }
  
  const refreshToken = getRefreshToken();
  
  // Refresh Token이 만료되었으면 로그아웃
  if (isTokenExpired(refreshToken)) {
    console.log('Refresh token 만료 - 로그아웃 처리');
    clearAllTokens();
    return false;
  }
  
  // Access token이 만료되었으면 갱신 시도
  if (isTokenExpired(loginStatus.token)) {
    try {
      // 동적 import로 순환 참조 방지
      const { refreshAccessToken } = await import('./authApi.js');
      await refreshAccessToken();
    } catch (error) {
      console.error('자동 로그인 실패:', error);
      clearAllTokens();
      return false;
    }
  }
  
  // 자동 로그인 성공 시 토큰 갱신 스케줄러 시작
  startTokenRefreshScheduler();
  
  return true;
}