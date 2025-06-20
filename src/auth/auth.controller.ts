import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  ValidationPipe,
  Logger,
  Query,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./guards/auth.guard";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { ResponseUtil } from "../common/utils/response.util";
import { ApiResponse } from "../common/interfaces/api-response.interface";
import {
  AuthUser,
  AuthResponse,
  TokenInfo,
} from "./interfaces/auth-user.interface";

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto
  ): Promise<ApiResponse<AuthResponse>> {
    this.logger.debug(`회원가입 요청: ${registerDto.email}`);

    try {
      const result = await this.authService.register(registerDto);
      return ResponseUtil.success(result, "회원가입이 완료되었습니다.");
    } catch (error) {
      this.logger.error("회원가입 중 에러:", error);
      throw error;
    }
  }

  @Post("login")
  async login(
    @Body(ValidationPipe) loginDto: LoginDto
  ): Promise<ApiResponse<AuthResponse>> {
    this.logger.debug(`로그인 요청: ${loginDto.email}`);

    try {
      const result = await this.authService.login(loginDto);
      return ResponseUtil.success(result, "로그인이 완료되었습니다.");
    } catch (error) {
      this.logger.error("로그인 중 에러:", error);
      throw error;
    }
  }

  @Post("logout")
  @UseGuards(AuthGuard)
  async logout(@Request() req): Promise<ApiResponse<null>> {
    const token = req.headers.authorization?.split(" ")[1];

    try {
      await this.authService.logout(token);
      return ResponseUtil.success(null, "로그아웃이 완료되었습니다.");
    } catch (error) {
      this.logger.error("로그아웃 중 에러:", error);
      throw error;
    }
  }

  @Get("profile")
  @UseGuards(AuthGuard)
  async getProfile(@Request() req): Promise<ApiResponse<AuthUser>> {
    const userId = req.user.id;

    try {
      const profile = await this.authService.getProfile(userId);
      return ResponseUtil.success(profile, "프로필 조회가 완료되었습니다.");
    } catch (error) {
      this.logger.error("프로필 조회 중 에러:", error);
      throw error;
    }
  }

  @Put("profile")
  @UseGuards(AuthGuard)
  async updateProfile(
    @Request() req,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto
  ): Promise<ApiResponse<AuthUser>> {
    const userId = req.user.id;

    try {
      const updatedProfile = await this.authService.updateProfile(
        userId,
        updateUserDto
      );
      return ResponseUtil.success(
        updatedProfile,
        "프로필이 업데이트되었습니다."
      );
    } catch (error) {
      this.logger.error("프로필 업데이트 중 에러:", error);
      throw error;
    }
  }

  @Post("reset-password")
  async resetPassword(
    @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto
  ): Promise<ApiResponse<null>> {
    this.logger.debug(`비밀번호 재설정 요청: ${resetPasswordDto.email}`);

    try {
      await this.authService.resetPassword(resetPasswordDto);
      return ResponseUtil.success(
        null,
        "비밀번호 재설정 이메일이 발송되었습니다."
      );
    } catch (error) {
      this.logger.error("비밀번호 재설정 중 에러:", error);
      throw error;
    }
  }

  @Get("verify-email")
  async verifyEmail(
    @Query("token") token: string
  ): Promise<ApiResponse<{ message: string }>> {
    this.logger.debug(`이메일 인증 요청: ${token}`);

    try {
      const result = await this.authService.verifyEmail(token);
      return ResponseUtil.success(result, "이메일 인증이 완료되었습니다.");
    } catch (error) {
      this.logger.error("이메일 인증 중 에러:", error);
      throw error;
    }
  }

  @Post("resend-verification")
  async resendVerificationEmail(
    @Body("email") email: string
  ): Promise<ApiResponse<{ message: string }>> {
    this.logger.debug(`인증 이메일 재전송 요청: ${email}`);

    try {
      const result = await this.authService.resendVerificationEmail(email);
      return ResponseUtil.success(result, "인증 이메일이 재전송되었습니다.");
    } catch (error) {
      this.logger.error("인증 이메일 재전송 중 에러:", error);
      throw error;
    }
  }

  @Post("refresh")
  async refreshToken(
    @Body(ValidationPipe) refreshTokenDto: RefreshTokenDto
  ): Promise<ApiResponse<TokenInfo>> {
    this.logger.debug("토큰 재발급 요청");

    try {
      const result = await this.authService.refreshToken(
        refreshTokenDto.refresh_token
      );
      return ResponseUtil.success(result, "토큰이 재발급되었습니다.");
    } catch (error) {
      this.logger.error("토큰 재발급 중 에러:", error);
      throw error;
    }
  }

  @Get("token-info")
  @UseGuards(AuthGuard)
  async getTokenInfo(@Request() req): Promise<
    ApiResponse<{
      user: AuthUser;
      expires_at: number;
      expires_in: number;
    }>
  > {
    const token = req.headers.authorization?.split(" ")[1];

    try {
      const result = await this.authService.getTokenInfo(token);
      return ResponseUtil.success(result, "토큰 정보 조회가 완료되었습니다.");
    } catch (error) {
      this.logger.error("토큰 정보 조회 중 에러:", error);
      throw error;
    }
  }
}
