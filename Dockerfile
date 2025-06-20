# Node.js 18 Alpine 이미지 사용
FROM node:18-alpine

# curl 설치 (헬스체크용)
RUN apk add --no-cache curl

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일들 복사
COPY package*.json ./

# 의존성 설치 (dev dependencies 포함, 빌드용)
RUN npm ci

# 소스 코드 복사
COPY . .

# TypeScript 빌드
RUN npm run build

# production dependencies만 재설치 (이미지 크기 최적화)
RUN npm ci --only=production && npm cache clean --force

# 포트 노출
EXPOSE 3000

# 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/customers || exit 1

# 애플리케이션 실행
CMD ["npm", "run", "start:prod"] 