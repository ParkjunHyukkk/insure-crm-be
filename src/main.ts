// NestJS 애플리케이션 부트스트랩 파일
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
// 전역 예외 필터 등록
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
// .env 파일 로드
import "dotenv/config";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  // 로깅 레벨을 debug로 설정
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule, {
    logger: ["debug", "error", "warn", "log"],
  });
  // 전역으로 예외 필터를 적용합니다.
  app.useGlobalFilters(new HttpExceptionFilter());
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
