// ✅ API 기본 주소 설정
const baseUrl = 'https://api.wenivops.co.kr/services/open-market/';


// ✅ 아이디 중복 확인 API
// - username(아이디)을 받아 POST 요청으로 중복 여부 확인
export async function checkUsername(username) {
  const res = await fetch(`${baseUrl}accounts/check-username/`, {
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
  const res = await fetch(`${baseUrl}accounts/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  // 실패 시 에러로 throw
  if (!res.ok) throw result;

  return result; // 성공 응답 반환
}


// ✅ 로그인 시도 API
// - 다양한 방식으로 로그인 시도할 수 있도록 loginData 인자로 받음
export async function tryLogin(loginData) {
  const res = await fetch(`${baseUrl}accounts/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData)
  });

  const result = await res.json();

  // 성공 여부와 응답 데이터 함께 반환
  return { ok: res.ok, result };
}
