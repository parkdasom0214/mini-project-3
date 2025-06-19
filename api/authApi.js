import { BASE_URL } from './config.js';
import { 
  saveTokens, 
  getAccessToken, 
  getRefreshToken, 
  clearAllTokens,
  startTokenRefreshScheduler 
} from '../utils/tokenStorage.js';

// ✅ 아이디 중복 확인 API
// - username(아이디)을 받아 POST 요청으로 중복 여부 확인
export async function checkUsername(username) {
  const res = await fetch(`${BASE_URL}accounts/check-username/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }) // JSON 형식으로 전송
  });
  return await res.json(); // 응답 데이터를 JSON으로 반환
}

// ✅ 회원가입 API
// - 사용자 정보(data)와 회원 유형(userType: buyer/seller)을 받아 요청
export async function signup(data, userType) {
  // 회원 유형에 따라 엔드포인트 결정
  const endpoint = userType === 'buyer' ? 'buyer/signup/' : 'seller/signup/';
  
  // 회원가입 요청 보내기
  const res = await fetch(`${BASE_URL}accounts/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  const result = await res.json();
  
  // 실패 시 에러로 throw
  if (!res.ok) throw result;
  
  return result; // 성공 응답 반환
}

// ✅ 로그인 API
export async function login(username, password) {
  const res = await fetch(`${BASE_URL}accounts/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  const result = await res.json();
  
  if (res.ok) {
    // JWT 토큰들을 저장하고 자동 갱신 스케줄러 시작
    saveTokens(result.access, result.refresh, result.user);
    startTokenRefreshScheduler();
    
    return { success: true, user: result.user };
  } else {
    return { success: false, error: result.error };
  }
}

// ✅ Access Token 갱신 API
export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('Refresh token이 없습니다');
  }
  
  const res = await fetch(`${BASE_URL}accounts/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken })
  });
  
  if (res.ok) {
    const result = await res.json();
    // 새 Access Token만 업데이트
    localStorage.setItem('access_token', result.access);
    return result.access;
  } else {
    // Refresh token도 만료된 경우 로그아웃 처리
    clearAllTokens();
    throw new Error('토큰 갱신 실패 - 다시 로그인하세요');
  }
}

// ✅ 인증이 필요한 API 요청 함수
// - 자동으로 토큰 첨부하고 401 에러 시 토큰 갱신 후 재시도
export async function apiRequest(url, options = {}) {
  let accessToken = getAccessToken();
  
  // 기본 헤더 설정
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  // 토큰이 있으면 Authorization 헤더 추가
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  let res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers
  });
  
  // 401 에러 (토큰 만료) 시 자동으로 토큰 갱신 후 재시도
  if (res.status === 401 && accessToken) {
    try {
      accessToken = await refreshAccessToken();
      headers['Authorization'] = `Bearer ${accessToken}`;
      
      // 토큰 갱신 후 다시 요청
      res = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers
      });
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      // 로그인 페이지로 리다이렉트 등 처리
    }
  }
  
  return res;
}