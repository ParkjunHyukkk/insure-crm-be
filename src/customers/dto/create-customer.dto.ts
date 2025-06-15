// 고객 생성 시 사용되는 DTO
import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  // 고객 이름
  name: string;

  @IsString()
  @IsNotEmpty()
  // 전화번호
  phone: string;

  @IsEmail()
  @IsOptional()
  // 이메일(선택)
  email?: string;
}
