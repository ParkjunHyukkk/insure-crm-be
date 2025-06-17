// 고객 생성 시 사용되는 DTO
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsDate,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  // 고객 이름
  name: string;

  @IsString()
  @IsNotEmpty()
  // 전화번호
  phone: string;

  @IsDate()
  @Type(() => Date)
  birth_date: Date; // 생년월일

  @IsDate()
  @Type(() => Date)
  signup_date: Date; // 가입일

  @IsDate()
  @Type(() => Date)
  maturity_date: Date; // 만기일

  @IsBoolean()
  @IsOptional()
  auto_payment?: boolean; // 자동결제 여부 (선택)

  @IsString()
  @IsOptional()
  memo?: string; // 메모 (선택)
}
