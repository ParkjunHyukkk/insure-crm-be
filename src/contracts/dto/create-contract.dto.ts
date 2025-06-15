// 계약 생성 시 사용되는 DTO
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateContractDto {
  @IsString()
  @IsNotEmpty()
  // 고객 ID
  customerId: string;

  @IsString()
  @IsNotEmpty()
  // 계약 세부 내용
  details: string;
}
