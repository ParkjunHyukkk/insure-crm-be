import { IsString, IsOptional, MinLength } from "class-validator";

export class UpdateUserDto {
  @IsString({ message: "이름은 문자열이어야 합니다." })
  @IsOptional()
  name?: string;

  @IsString({ message: "비밀번호는 문자열이어야 합니다." })
  @MinLength(6, { message: "비밀번호는 최소 6자 이상이어야 합니다." })
  @IsOptional()
  password?: string;
}
