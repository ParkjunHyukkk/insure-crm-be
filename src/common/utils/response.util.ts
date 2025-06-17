import { ApiResponse } from "../interfaces/api-response.interface";

export class ResponseUtil {
  static success<T>(
    data: T,
    message: string = "데이터 조회 성공"
  ): ApiResponse<T> {
    return {
      status: "success",
      message,
      data,
    };
  }

  static error(message: string): ApiResponse<null> {
    return {
      status: "error",
      message,
      data: null,
    };
  }
}
