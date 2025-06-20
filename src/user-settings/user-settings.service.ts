import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { supabase } from "../utils/supabase-client";

export interface UserSettings {
  id: string;
  user_id: string;
  notify_signup: boolean;
  notify_maturity: boolean;
  notify_birthday: boolean;
  preferred_channel: string;
  created_at: string;
}

export interface UpdateUserSettingsDto {
  notify_signup?: boolean;
  notify_maturity?: boolean;
  notify_birthday?: boolean;
  preferred_channel?: string;
}

@Injectable()
export class UserSettingsService {
  private readonly logger = new Logger(UserSettingsService.name);
  private table = "user_settings";

  async getUserSettings(userId: string): Promise<UserSettings> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        this.logger.error(
          `사용자 설정 조회 실패: ${userId} - ${error.message}`
        );
        throw new NotFoundException("사용자 설정을 찾을 수 없습니다.");
      }

      return data as UserSettings;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error("사용자 설정 조회 중 오류:", error);
      throw new NotFoundException("사용자 설정 조회 중 오류가 발생했습니다.");
    }
  }

  async updateUserSettings(
    userId: string,
    updateDto: UpdateUserSettingsDto
  ): Promise<UserSettings> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .update(updateDto)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        this.logger.error(
          `사용자 설정 업데이트 실패: ${userId} - ${error.message}`
        );
        throw new NotFoundException("사용자 설정 업데이트에 실패했습니다.");
      }

      this.logger.log(`사용자 설정 업데이트 완료: ${userId}`);
      return data as UserSettings;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error("사용자 설정 업데이트 중 오류:", error);
      throw new NotFoundException(
        "사용자 설정 업데이트 중 오류가 발생했습니다."
      );
    }
  }

  async createUserSettings(userId: string): Promise<UserSettings> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .insert({
          user_id: userId,
          notify_signup: true,
          notify_maturity: true,
          notify_birthday: true,
          preferred_channel: "kakao",
        })
        .select()
        .single();

      if (error) {
        this.logger.error(
          `사용자 설정 생성 실패: ${userId} - ${error.message}`
        );
        throw error;
      }

      this.logger.log(`사용자 설정 생성 완료: ${userId}`);
      return data as UserSettings;
    } catch (error) {
      this.logger.error("사용자 설정 생성 중 오류:", error);
      throw error;
    }
  }
}
