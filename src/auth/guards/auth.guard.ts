import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { Request } from "express";
import { supabase } from "../../utils/supabase-client";

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn("토큰이 제공되지 않았습니다.");
      throw new UnauthorizedException("토큰이 필요합니다.");
    }

    try {
      // Supabase JWT 토큰 검증
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (error || !user) {
        this.logger.warn("유효하지 않은 토큰:", error?.message);
        throw new UnauthorizedException("유효하지 않은 토큰입니다.");
      }

      // 요청 객체에 사용자 정보 추가
      request["user"] = user;
      this.logger.debug(`인증 성공 - 사용자 ID: ${user.id}`);

      return true;
    } catch (error) {
      this.logger.error("토큰 검증 중 오류:", error);
      throw new UnauthorizedException("토큰 검증에 실패했습니다.");
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
