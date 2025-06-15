// 고객 관련 기능을 제공하는 모듈
import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

@Module({
  // 컨트롤러와 서비스를 모듈에 등록합니다.
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
