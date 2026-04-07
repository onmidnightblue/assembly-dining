# Assembly Dining

길도 모르고 어디에 뭐가 있는지 모르는 (저같은) 여의도 신입을 위한 맛집 가이드
P.S. 국회 앞 한정입니다.

<br><br>

### ✨ Features

- **음식점 정보 조회** — 공공데이터포털 API 연동으로 영업 등록되어 있는 업체 정보 제공
- **메뉴 기반 퀵 필터** — #제육볶음 #칼국수 #국밥 등 대표 메뉴로 필터링
- **네이버지도 표시** — 시각적으로 위치를 바로 알 수 있도록 네이버지도 API 연동
- **익명 한줄평** - '여기 진짜 쟌맛임. 완전 추천' 같은 후기를 남길 수 있는 닉네임+비밀번호 입력 기능

<br><br>

### 🏃 Getting Started

1. .env 파일을 생성하고, 아래 항목을 입력해야 합니다.

```
# 공공데이터포털 API Key
GOVERNMENT_API_KEY = 'YOUR_API_KEY_HERE'

# 네이버지도 API Key
NAVER_API_KEY = 'YOUR_API_KEY_HERE'
```

<br>

2. 간단한 명령어로 개발 환경을 실행할 수 있습니다.

```
npm install
npm run dev
```

<br><br>

### 🔨 Tech Stack

- Framework: `Next.js`
- Language: `TypeScript`
- state: `TanStack Query`
- API: `공공데이터포털 (일반음식점 인허가 정보)`
