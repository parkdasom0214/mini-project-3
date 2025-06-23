오픈마켓 미니 프로젝트

🗂 프로젝트 구조

MINI-PROJECT-3/
│
├── api/ # API 통신 관련 모듈
│ ├── authApi.js # 인증 관련 API
│ ├── config.js # API 기본 설정
│ ├── productDetailApi.js # 상품 상세 API
│ └── productsApi.js # 상품 목록 API
│
├── auth/ # 인증 관련 기능 디렉토리
│ └── auth.js # 로그인 유지
│
├── components/ # 공통 컴포넌트
│ ├── footer.js # 푸터 컴포넌트 -> js
│ └── header.js # 헤더 컴포넌트 -> js
│
├── css/ # 스타일 시트
│ ├── login.css # 로그인 페이지 스타일
│ ├── reset.css # CSS 초기화
│ └── style.css # 공통 스타일
│
├── images/ # 이미지 파일
│ ├── 아이콘 및 로고(svg/png)
│ └── 상품 이미지(product1~6.jpg)
│
├── js/ # 주요 페이지 기능 스크립트
│ ├── login.js # 로그인 페이지 기능
│ ├── productDetail.js # 상품 상세 페이지 기능
│ ├── products.js # 상품 목록 페이지 기능
│ └── signup.js # 회원가입 페이지 기능
│
├── utils/ # 유틸 함수
│ └── tokenStorage.js # 토큰 저장 및 처리 기능
│
├── 404.html # 404 에러 페이지 -> tailwind
├── detail.html # 상품 상세 페이지 -> tailwind
├── index.html # 메인 페이지 -> html+css
├── login.html # 로그인 페이지 -> tailwind
├── signup.html # 회원가입 페이지 -> tailwind
└── README.md # 프로젝트 설명 파일

💡 주요 기능

- 로그인 및 회원가입 기능 구현
- 상품 리스트 및 상세 페이지 구성
- 로컬 스토리지를 이용한 토큰 관리
- 공통 헤더/푸터 컴포넌트 분리 적용

✅ 사용 기술

- HTML / CSS / JavaScript (Vanilla JS) / tailwind
- 모듈화된 JS 파일 구조
- Fetch API 기반 비동기 통신
