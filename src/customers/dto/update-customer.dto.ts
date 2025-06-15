// 고객 수정 시 사용되는 DTO
import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @IsString()
  @IsOptional()
  // 이름(선택)
  name?: string;

  @IsString()
  @IsOptional()
  // 전화번호(선택)
  phone?: string;

  @IsEmail()
  @IsOptional()
  // 이메일(선택)
  email?: string;
}
