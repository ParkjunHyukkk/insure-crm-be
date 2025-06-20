import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  ValidationPipe,
  Logger,
} from "@nestjs/common";
import {
  UserSettingsService,
  UpdateUserSettingsDto,
} from "./user-settings.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { ResponseUtil } from "../common/utils/response.util";
import { ApiResponse } from "../common/interfaces/api-response.interface";

@Controller("user-settings")
@UseGuards(AuthGuard)
export class UserSettingsController {
  private readonly logger = new Logger(UserSettingsController.name);

  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Get()
  async getUserSettings(@CurrentUser() user: any): Promise<ApiResponse<any>> {
    this.logger.debug(`사용자 설정 조회 요청: ${user.id}`);

    try {
      const settings = await this.userSettingsService.getUserSettings(user.id);
      return ResponseUtil.success(
        settings,
        "사용자 설정 조회가 완료되었습니다."
      );
    } catch (error) {
      this.logger.error("사용자 설정 조회 중 에러:", error);
      throw error;
    }
  }

  @Put()
  async updateUserSettings(
    @CurrentUser() user: any,
    @Body(ValidationPipe) updateDto: UpdateUserSettingsDto
  ): Promise<ApiResponse<any>> {
    this.logger.debug(`사용자 설정 업데이트 요청: ${user.id}`);

    try {
      const settings = await this.userSettingsService.updateUserSettings(
        user.id,
        updateDto
      );
      return ResponseUtil.success(
        settings,
        "사용자 설정이 업데이트되었습니다."
      );
    } catch (error) {
      this.logger.error("사용자 설정 업데이트 중 에러:", error);
      throw error;
    }
  }
}
