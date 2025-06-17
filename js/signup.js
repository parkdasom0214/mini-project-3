// 구매자 회원가입 API 호출 함수
async function signupBuyer(userData) {
  const url = 'https://api.wenivops.co.kr/services/open-market/accounts/buyer/signup/';
  
  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
          console.log('회원가입 성공:', data);
          return { success: true, data };
      } else {
          console.error('회원가입 실패:', data);
          return { success: false, error: data };
      }
      
  } catch (error) {
      console.error('네트워크 오류:', error);
      return { success: false, error: error.message };
  }
}