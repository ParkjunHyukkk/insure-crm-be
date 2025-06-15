// NestJS 애플리케이션 부트스트랩 파일
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// 전역 예외 필터 등록
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
// .env 파일 로드
import 'dotenv/config';

async function bootstrap() {
  // 애플리케이션 인스턴스 생성
  const app = await NestFactory.create(AppModule);
  // 전역으로 예외 필터를 적용합니다.
  app.useGlobalFilters(new HttpExceptionFilter());
  // 포트 3000번에서 서버 실행
  await app.listen(3000);
}

bootstrap();
