// 계약 API 요청을 처리하는 컨트롤러
import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  findAll() {
    // 모든 계약 조회
    return this.contractsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // 특정 계약 조회
    return this.contractsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateContractDto) {
    // 계약 생성
    return this.contractsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateContractDto) {
    // 계약 수정
    return this.contractsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // 계약 삭제
    return this.contractsService.remove(id);
  }
}
