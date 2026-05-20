# 🧗 ClimbMate AI — 클라이밍 센터 AI 고객 응대 챗봇

> AI + RAG + SaaS 활용 구조를 보여주는 NCP 교육용 데모 프로젝트

## 📋 프로젝트 소개

클라이밍 센터 고객 응대를 위한 AI 챗봇 데모입니다. 사용자 질문에 RAG 기반으로 답변하며, 음성 인식·번역·OCR 등 SaaS 기능 데모를 포함합니다.

### 주요 기능
- 🤖 **AI 챗봇** — RAG + LLM 기반 지능형 고객 응대
- 📊 **관리자 대시보드** — 회원 정보, 지점 정보, 가격표 조회
- 🎙️ **음성 입출력** — STT/TTS 데모
- 🌐 **다국어 번역** — 외국인 고객 응대 데모
- 📄 **OCR 회원등록** — 신분증 스캔 자동 등록 데모

### 시스템 아키텍처
```
사용자(브라우저)
  → Next.js 프론트 UI
    → Next.js API Route
      → RAG 서버 (문서 검색)
      → PostgreSQL (데이터 조회)
      → 로컬 LLM (답변 생성)
    → 응답 반환
```

## 🚀 시작하기

### 필수 조건
- Node.js 18+
- npm 9+

### 설치 및 실행

```bash
# 1. 프로젝트 디렉토리로 이동
cd climbing-chatbot

# 2. 의존성 설치
npm install

# 3. 환경변수 설정
cp .env.example .env.local

# 4. 환경변수 수정 (필요 시)
# .env.local 파일을 열어 DB, RAG, LLM 서버 주소를 수정

# 5. 개발 서버 실행
npm run dev
```

http://localhost:3000 으로 접속하세요.

### 환경변수 설정

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `DATABASE_URL` | PostgreSQL 연결 문자열 | `postgresql://user:password@localhost:5432/climbing` |
| `RAG_API_URL` | RAG 서버 API 주소 | `http://localhost:8000/query` |
| `LLM_API_URL` | 로컬 LLM 서버 API 주소 | `http://localhost:11434/api/chat` |
| `LLM_MODEL` | LLM 모델명 (Ollama 기준) | `llama3` |

> ⚠️ DB, RAG, LLM 서버가 없어도 앱은 정상 동작합니다. Mock 데이터로 자동 폴백됩니다.

## 📁 프로젝트 구조

```
climbing-chatbot/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (사이드바)
│   ├── page.tsx                # 메인 대시보드
│   ├── globals.css             # 디자인 시스템
│   ├── chat/page.tsx           # AI 챗봇 페이지
│   ├── admin/page.tsx          # 관리자 데이터 페이지
│   ├── demo/page.tsx           # SaaS 기능 데모 페이지
│   ├── api/
│   │   ├── chat/route.ts       # 챗봇 대화 API
│   │   ├── members/route.ts    # 회원 정보 API
│   │   ├── gym-info/route.ts   # 센터 정보 API
│   │   ├── ocr/route.ts        # OCR 데모 API
│   │   ├── translate/route.ts  # 번역 데모 API
│   │   └── voice/route.ts      # 음성 데모 API
│   └── components/
│       └── Sidebar.tsx         # 사이드바 네비게이션
├── lib/
│   ├── mock-data.ts            # Mock 데이터 (DB 폴백용)
│   ├── db.ts                   # PostgreSQL 연결 유틸
│   └── api-client.ts           # RAG/LLM 서버 호출 유틸
├── .env.example                # 환경변수 템플릿
└── README.md
```

## 📡 API 명세

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/chat` | 챗봇 대화 (RAG → LLM → 응답) |
| GET | `/api/members` | 회원 목록 조회 |
| GET | `/api/gym-info` | 센터 정보 + 가격표 조회 |
| POST | `/api/ocr` | OCR 회원등록 (데모) |
| POST | `/api/translate` | 번역 (데모) |
| POST | `/api/voice` | 음성 STT/TTS (데모) |

## 🗄️ DB 테이블

```sql
CREATE TABLE gyms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  location VARCHAR(50),
  address TEXT,
  phone VARCHAR(20),
  open_time VARCHAR(10),
  close_time VARCHAR(10)
);

CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  phone VARCHAR(20),
  membership_type VARCHAR(20),
  start_date DATE,
  end_date DATE,
  payment_status VARCHAR(10)
);

CREATE TABLE prices (
  id SERIAL PRIMARY KEY,
  title VARCHAR(50),
  price INTEGER,
  description TEXT
);

CREATE TABLE faq_documents (
  id SERIAL PRIMARY KEY,
  category VARCHAR(30),
  title VARCHAR(100),
  content TEXT
);
```

## ☁️ NCP 서버 배포 가이드

### 1. NCP 서버 준비

```bash
# Ubuntu 서버 기준
# Node.js 18+ 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 설치 (프로세스 매니저)
sudo npm install -g pm2
```

### 2. 프로젝트 배포

```bash
# 프로젝트 업로드 (scp 또는 git clone)
git clone <your-repo-url>
cd climbing-chatbot

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
nano .env.local  # 실제 서버 주소로 수정

# 프로덕션 빌드
npm run build

# PM2로 실행
pm2 start npm --name "climbmate" -- start
pm2 save
pm2 startup
```

### 3. NCP 배포 시 주의사항

| 항목 | 주의사항 |
|------|----------|
| **포트** | Next.js 기본 포트 3000. NCP ACG(보안 그룹)에서 3000 포트 열기 필요 |
| **환경변수** | `.env.local`에 실제 DB/RAG/LLM 서버 주소 입력. 내부망 IP 사용 권장 |
| **DB 연결** | NCP Cloud DB for PostgreSQL 사용 시, VPC 내부 IP로 연결 |
| **방화벽** | RAG/LLM 서버가 별도 서버라면 내부망 통신 허용 설정 |
| **도메인** | NCP Global DNS + SSL 인증서로 HTTPS 적용 가능 |
| **리버스 프록시** | Nginx로 80/443 → 3000 리버스 프록시 설정 권장 |

### 4. Nginx 리버스 프록시 설정 (선택)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📄 라이선스

NCP 교육용 데모 프로젝트
