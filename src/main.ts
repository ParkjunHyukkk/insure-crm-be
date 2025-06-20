// NestJS 애플리케이션 부트스트랩 파일
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
// 전역 예외 필터 등록
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
// .env 파일 로드
import "dotenv/config";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  // 로깅 레벨을 debug로 설정
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule, {
    logger: ["debug", "error", "warn", "log"],
  });

  // 전역으로 예외 필터를 적용합니다.
  app.useGlobalFilters(new HttpExceptionFilter());

  // 전역 유효성 검사 파이프를 적용합니다.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // CORS 설정 - 개발 환경에서 유연하게 설정
  const frontendUrls = [
    process.env.FRONTEND_URL || "http://localhost:3001",
    "http://localhost:3000", // 백엔드 자체 테스트
    "http://localhost:3001", // 일반적인 React 개발 서버
    "http://localhost:5173", // Vite 개발 서버
    "http://localhost:4200", // Angular 개발 서버
  ];

  app.enableCors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : frontendUrls,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Auth endpoints available at: http://localhost:${port}/auth`);
}

bootstrap();
