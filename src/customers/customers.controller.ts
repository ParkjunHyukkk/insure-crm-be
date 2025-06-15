// 고객 API 요청을 처리하는 컨트롤러
import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll() {
    // 모든 고객 목록 조회
    return this.customersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // 특정 고객 상세 조회
    return this.customersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCustomerDto) {
    // 고객 생성
    return this.customersService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    // 고객 정보 수정
    return this.customersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // 고객 삭제
    return this.customersService.remove(id);
  }
}
