import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { supabase } from "../utils/supabase-client";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import {
  AuthUser,
  AuthResponse,
  TokenInfo,
} from "./interfaces/auth-user.interface";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, name } = registerDto;

    try {
      // Supabase 회원가입 (이메일 인증 활성화)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${
            process.env.FRONTEND_URL || "http://localhost:3000"
          }/auth/verify-email`, // 이메일 인증 활성화
          data: {
            name,
          },
        },
      });

      if (error) {
        this.logger.error("회원가입 실패:");
        this.logger.error(`에러 메시지: ${error.message}`);
        this.logger.error(`에러 코드: ${error.status || "N/A"}`);
        this.logger.error("전체 에러 객체:", error);

        if (error.message.includes("already registered")) {
          throw new ConflictException("이미 등록된 이메일입니다.");
        }
        throw new BadRequestException(error.message);
      }

      if (!data.user) {
        throw new BadRequestException("회원가입에 실패했습니다.");
      }

      // user_settings 테이블에 기본 설정 생성
      await this.createUserSettings(data.user.id);

      this.logger.log(`새 사용자 등록: ${email} (ID: ${data.user.id})`);

      // 이메일 인증이 필요한 경우 (session이 null)
      if (!data.session) {
        this.logger.warn(`이메일 인증 대기 중: ${email}`);
        return {
          user: {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name,
            created_at: data.user.created_at,
            last_sign_in_at: data.user.last_sign_in_at,
          },
          access_token: null,
          refresh_token: null,
          needEmailVerification: true,
        };
      }

      // 이메일 인증 없이 바로 로그인 가능한 경우
      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name,
          created_at: data.user.created_at,
          last_sign_in_at: data.user.last_sign_in_at,
        },
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        needEmailVerification: false,
        expires_at: data.session.expires_at,
        expires_in: data.session.expires_in,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error("회원가입 중 예상치 못한 오류:", error);
      throw new BadRequestException("회원가입 중 오류가 발생했습니다.");
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        this.logger.warn(`로그인 실패: ${email} - ${error.message}`);
        throw new UnauthorizedException(
          "이메일 또는 비밀번호가 올바르지 않습니다."
        );
      }

      if (!data.user || !data.session) {
        throw new UnauthorizedException("로그인에 실패했습니다.");
      }

      this.logger.log(`사용자 로그인: ${email} (ID: ${data.user.id})`);

      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name,
          created_at: data.user.created_at,
          last_sign_in_at: data.user.last_sign_in_at,
        },
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
        expires_in: data.session.expires_in,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error("로그인 중 예상치 못한 오류:", error);
      throw new UnauthorizedException("로그인 중 오류가 발생했습니다.");
    }
  }

  async logout(token: string): Promise<void> {
    try {
      const { error } = await supabase.auth.admin.signOut(token);

      if (error) {
        this.logger.warn("로그아웃 중 오류:", error.message);
        throw new BadRequestException("로그아웃에 실패했습니다.");
      }

      this.logger.log("사용자 로그아웃 완료");
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error("로그아웃 중 예상치 못한 오류:", error);
      throw new BadRequestException("로그아웃 중 오류가 발생했습니다.");
    }
  }

  async getProfile(userId: string): Promise<AuthUser> {
    try {
      const { data, error } = await supabase.auth.admin.getUserById(userId);

      if (error || !data.user) {
        this.logger.warn(`사용자 조회 실패: ${userId} - ${error?.message}`);
        throw new NotFoundException("사용자를 찾을 수 없습니다.");
      }

      return {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name,
        created_at: data.user.created_at,
        last_sign_in_at: data.user.last_sign_in_at,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error("프로필 조회 중 예상치 못한 오류:", error);
      throw new BadRequestException("프로필 조회 중 오류가 발생했습니다.");
    }
  }

  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto
  ): Promise<AuthUser> {
    try {
      const updateData: any = {};

      if (updateUserDto.name) {
        updateData.data = { name: updateUserDto.name };
      }

      if (updateUserDto.password) {
        updateData.password = updateUserDto.password;
      }

      const { data, error } = await supabase.auth.admin.updateUserById(
        userId,
        updateData
      );

      if (error || !data.user) {
        this.logger.error(
          `프로필 업데이트 실패: ${userId} - ${error?.message}`
        );
        throw new BadRequestException("프로필 업데이트에 실패했습니다.");
      }

      this.logger.log(`프로필 업데이트 완료: ${userId}`);

      return {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name,
        created_at: data.user.created_at,
        last_sign_in_at: data.user.last_sign_in_at,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error("프로필 업데이트 중 예상치 못한 오류:", error);
      throw new BadRequestException("프로필 업데이트 중 오류가 발생했습니다.");
    }
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "email",
      });

      if (error) {
        this.logger.error(`이메일 인증 실패: ${error.message}`);
        throw new BadRequestException("이메일 인증에 실패했습니다.");
      }

      if (!data.user) {
        throw new BadRequestException("유효하지 않은 인증 토큰입니다.");
      }

      this.logger.log(
        `이메일 인증 완료: ${data.user.email} (ID: ${data.user.id})`
      );

      return {
        message: "이메일 인증이 완료되었습니다. 이제 로그인할 수 있습니다.",
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error("이메일 인증 중 예상치 못한 오류:", error);
      throw new BadRequestException("이메일 인증 중 오류가 발생했습니다.");
    }
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${
            process.env.FRONTEND_URL || "http://localhost:3000"
          }/auth/verify-email`,
        },
      });

      if (error) {
        this.logger.error(`인증 이메일 재전송 실패: ${error.message}`);
        throw new BadRequestException("인증 이메일 재전송에 실패했습니다.");
      }

      this.logger.log(`인증 이메일 재전송: ${email}`);

      return {
        message: "인증 이메일이 재전송되었습니다. 이메일을 확인해주세요.",
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error("인증 이메일 재전송 중 예상치 못한 오류:", error);
      throw new BadRequestException(
        "인증 이메일 재전송 중 오류가 발생했습니다."
      );
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenInfo> {
    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error || !data.session) {
        this.logger.warn(`토큰 재발급 실패: ${error?.message}`);
        throw new UnauthorizedException("유효하지 않은 리프레시 토큰입니다.");
      }

      this.logger.log(`토큰 재발급 완료: ${data.user?.email}`);

      return {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
        expires_in: data.session.expires_in,
        token_type: "Bearer",
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error("토큰 재발급 중 예상치 못한 오류:", error);
      throw new BadRequestException("토큰 재발급 중 오류가 발생했습니다.");
    }
  }

  async getTokenInfo(accessToken: string): Promise<{
    user: AuthUser;
    expires_at: number;
    expires_in: number;
  }> {
    try {
      const { data, error } = await supabase.auth.getUser(accessToken);

      if (error || !data.user) {
        this.logger.warn(`토큰 정보 조회 실패: ${error?.message}`);
        throw new UnauthorizedException("유효하지 않은 액세스 토큰입니다.");
      }

      // JWT 페이로드에서 만료 시간 추출
      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const expiresAt = payload.exp;
        const now = Math.floor(Date.now() / 1000);
        const expiresIn = Math.max(0, expiresAt - now); // 음수 방지

        this.logger.debug(
          `토큰 만료 정보: expires_at=${expiresAt}, expires_in=${expiresIn}`
        );

        return {
          user: {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name,
            created_at: data.user.created_at,
            last_sign_in_at: data.user.last_sign_in_at,
          },
          expires_at: expiresAt,
          expires_in: expiresIn,
        };
      } catch (payloadError) {
        this.logger.error("JWT 페이로드 파싱 실패:", payloadError);
        // 페이로드 파싱 실패 시 기본값 반환
        return {
          user: {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name,
            created_at: data.user.created_at,
            last_sign_in_at: data.user.last_sign_in_at,
          },
          expires_at: 0,
          expires_in: 0,
        };
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error("토큰 정보 조회 중 예상치 못한 오류:", error);
      throw new BadRequestException("토큰 정보 조회 중 오류가 발생했습니다.");
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { email } = resetPasswordDto;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${
          process.env.FRONTEND_URL || "http://localhost:3000"
        }/auth/reset-password`,
      });

      if (error) {
        this.logger.error(`비밀번호 재설정 실패: ${email} - ${error.message}`);
        throw new BadRequestException("비밀번호 재설정 요청에 실패했습니다.");
      }

      this.logger.log(`비밀번호 재설정 이메일 발송: ${email}`);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error("비밀번호 재설정 중 예상치 못한 오류:", error);
      throw new BadRequestException("비밀번호 재설정 중 오류가 발생했습니다.");
    }
  }

  private async createUserSettings(userId: string): Promise<void> {
    try {
      const { error } = await supabase.from("user_settings").insert({
        user_id: userId,
        notify_signup: true,
        notify_maturity: true,
        notify_birthday: true,
        preferred_channel: "kakao",
      });

      if (error) {
        this.logger.warn(`사용자 설정 생성 실패: ${userId} - ${error.message}`);
        // 설정 생성 실패는 회원가입을 막지 않음
      } else {
        this.logger.debug(`사용자 설정 생성 완료: ${userId}`);
      }
    } catch (error) {
      this.logger.error("사용자 설정 생성 중 오류:", error);
    }
  }
}
