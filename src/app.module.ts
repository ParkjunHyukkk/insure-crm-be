// 애플리케이션의 루트 모듈을 정의합니다.
import { Module } from "@nestjs/common";
// 환경 변수 로드를 위한 ConfigModule 사용
import { ConfigModule } from "@nestjs/config";
// 인증 관련 모듈
import { AuthModule } from "./auth/auth.module";
// 고객 관련 모듈
import { CustomersModule } from "./customers/customers.module";
// 계약 관련 모듈
import { ContractsModule } from "./contracts/contracts.module";
// 사용자 설정 관련 모듈
import { UserSettingsModule } from "./user-settings/user-settings.module";

@Module({
  imports: [
    // 애플리케이션 전역에서 환경 변수를 사용하도록 설정합니다.
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserSettingsModule,
    CustomersModule,
    ContractsModule,
  ],
})
export class AppModule {}
