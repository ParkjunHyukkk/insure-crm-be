// 계약 수정 시 사용되는 DTO
import { PartialType } from '@nestjs/mapped-types';
import { CreateContractDto } from './create-contract.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateContractDto extends PartialType(CreateContractDto) {
  @IsString()
  @IsOptional()
  // 고객 ID(선택)
  customerId?: string;

  @IsString()
  @IsOptional()
  // 계약 내용(선택)
  details?: string;
}
