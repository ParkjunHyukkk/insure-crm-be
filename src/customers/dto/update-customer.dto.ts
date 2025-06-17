// 고객 수정 시 사용되는 DTO
import { PartialType } from "@nestjs/mapped-types";
import { CreateCustomerDto } from "./create-customer.dto";
import { IsOptional, IsString, IsBoolean, IsDate } from "class-validator";
import { Type } from "class-transformer";

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @IsString()
  @IsOptional()
  name?: string; // 고객 이름

  @IsString()
  @IsOptional()
  phone?: string; // 전화번호

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  birth_date?: Date; // 생년월일

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  signup_date?: Date; // 가입일

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  maturity_date?: Date; // 만기일

  @IsBoolean()
  @IsOptional()
  auto_payment?: boolean; // 자동결제 여부

  @IsString()
  @IsOptional()
  memo?: string; // 메모
}
