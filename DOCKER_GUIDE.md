# 🐳 Docker를 활용한 프론트엔드 테스트 가이드

## 📋 사전 준비사항

### 1. Docker 설치

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 설치
- Docker 및 Docker Compose 설치 확인:
  ```bash
  docker --version
  docker-compose --version
  ```

### 2. 환경변수 설정

⚠️ **중요**: 실제 API 키는 절대 Git에 올리지 마세요!

1. 환경변수 파일 복사:

   ```bash
   cp .env.example .env
   ```

2. `.env` 파일을 열어서 실제 값으로 수정:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your_actual_supabase_anon_key_here
   FRONTEND_URL=http://localhost:3001
   NODE_ENV=production
   ```

## 🚀 Docker 실행 방법

### 방법 1: Docker Compose 사용 (권장)

1. **백엔드 서버 시작**

   ```bash
   docker-compose up -d
   ```

2. **로그 확인**

   ```bash
   docker-compose logs -f insure-crm-api
   ```

3. **서버 상태 확인**

   ```bash
   curl http://localhost:3000/customers
   ```

4. **서버 중지**
   ```bash
   docker-compose down
   ```

### 방법 2: Docker 직접 사용

1. **이미지 빌드**

   ```bash
   docker build -t insure-crm-backend .
   ```

2. **컨테이너 실행**

   ```bash
   docker run -d \
     --name insure-crm-backend \
     -p 3000:3000 \
     -e SUPABASE_URL=https://gpsshxesxmgutynhilvo.supabase.co \
     -e SUPABASE_KEY=your-supabase-anon-key \
     -e FRONTEND_URL=http://localhost:3001 \
     insure-crm-backend
   ```

3. **컨테이너 중지**
   ```bash
   docker stop insure-crm-backend
   docker rm insure-crm-backend
   ```

## 📡 API 접속 정보

### 기본 정보

- **Base URL**: `http://localhost:3000`
- **Content-Type**: `application/json`
- **CORS**: 프론트엔드 URL 허용됨

### 주요 엔드포인트

```
🔐 인증 API
POST /auth/register      - 회원가입
POST /auth/login         - 로그인
POST /auth/refresh       - 토큰 재발급
GET  /auth/token-info    - 토큰 정보 조회

👥 고객 관리 API
GET  /customers          - 고객 목록 조회
POST /customers          - 고객 생성
GET  /customers/:id      - 고객 상세 조회

📋 계약 관리 API
GET  /contracts          - 계약 목록 조회
POST /contracts          - 계약 생성
```

## 🔧 개발 환경 설정

### 프론트엔드에서 API 호출 예시

```javascript
// 기본 설정
const API_BASE_URL = "http://localhost:3000";

// 로그인 예시
const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

// 인증이 필요한 API 호출 예시
const getCustomers = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/customers`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.json();
};
```

## 🐛 트러블슈팅

### 1. 포트 충돌 해결

```bash
# 포트 사용 프로세스 확인
netstat -ano | findstr :3000

# 강제 중지
docker-compose down --remove-orphans
```

### 2. 환경변수 문제

- `.env` 파일이 올바른 위치에 있는지 확인
- 환경변수 값에 따옴표 없이 입력했는지 확인

### 3. CORS 에러

- `FRONTEND_URL`이 올바르게 설정되었는지 확인
- 프론트엔드 개발 서버 URL과 일치하는지 확인

### 4. 헬스체크 실패

```bash
# 컨테이너 상태 확인
docker-compose ps

# 상세 로그 확인
docker-compose logs insure-crm-api
```

## 📚 추가 정보

- **API 문서**: `api-documentation.txt` 참고
- **Postman 컬렉션**: 프로젝트 루트에서 Import 가능
- **환경별 설정**: `docker-compose.override.yml`로 커스터마이징 가능
