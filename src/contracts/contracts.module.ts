// 계약 기능을 제공하는 모듈
import { Module } from '@nestjs/common';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';

@Module({
  // 컨트롤러와 서비스를 모듈에 등록합니다.
  controllers: [ContractsController],
  providers: [ContractsService],
})
export class ContractsModule {}
