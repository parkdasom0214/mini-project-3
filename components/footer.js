// footer.js - 간단한 푸터

function initFooter(selector) {
  const footerHTML = `
    <footer style="background-color: #f3f4f6; border-top: 1px solid #e5e7eb">
      <div style="max-width: 1280px; margin: 0 auto; padding: 48px 16px">
        <!-- 상단 링크 섹션 -->
        <div style="margin-bottom: 32px">
          <ul style="display: flex; flex-wrap: wrap; gap: 24px; font-size: 14px; list-style: none; padding: 0; margin: 0;">
            <li><a href="#" style="color: #4b5563; text-decoration: none">회사소개</a></li>
            <li><a href="#" style="color: #4b5563; text-decoration: none">이용약관</a></li>
            <li><a href="#" style="color: #4b5563; text-decoration: none; font-weight: 600">개인정보처리방침</a></li>
            <li><a href="#" style="color: #4b5563; text-decoration: none">고객센터</a></li>
          </ul>
        </div>

        <!-- 회사 정보 -->
        <div style="display: flex; flex-direction: column; gap: 12px">
          <div style="font-size: 32px; font-weight: bold; color: #10b981; margin-bottom: 16px;">
            HODU
          </div>

          <div style="font-size: 14px; color: #4b5563">
            <p style="margin: 4px 0"><span style="font-weight: 500">대표:</span> 박다솜</p>
            <p style="margin: 4px 0"><span style="font-weight: 500">사업자등록번호:</span> 123-45-67890</p>
            <p style="margin: 4px 0"><span style="font-weight: 500">주소:</span> 서울특별시 마포구 어딘가 123</p>
            <p style="margin: 4px 0"><span style="font-weight: 500">전화:</span> 02-123-4567</p>
            <p style="margin: 4px 0"><span style="font-weight: 500">이메일:</span> help@hodu.co.kr</p>
          </div>

          <!-- 고객센터 정보 -->
          <div style="margin-top: 24px">
            <h3 style="font-size: 14px; font-weight: 500; color: #111827; margin-bottom: 8px;">
              고객센터
            </h3>
            <p style="font-size: 24px; font-weight: bold; color: #111827; margin: 0;">
              1588-1234
            </p>
            <p style="font-size: 14px; color: #4b5563; margin: 4px 0 0 0">
              평일 09:00 ~ 18:00 (점심시간 12:00 ~ 13:00 제외)
            </p>
          </div>
        </div>

        <!-- 하단 저작권 -->
        <div style="border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 24px">
          <p style="font-size: 14px; color: #6b7280; text-align: center; margin: 0">
            © 2025 호두 All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  `;
  
  document.querySelector(selector).innerHTML = footerHTML;
}

// 전역에 함수 등록
window.initFooter = initFooter;