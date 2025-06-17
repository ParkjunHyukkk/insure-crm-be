// 고객 API 요청을 처리하는 컨트롤러
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Logger,
  Put,
} from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { ResponseUtil } from "../common/utils/response.util";
import { ApiResponse } from "../common/interfaces/api-response.interface";
import { Customer } from "./interfaces/customer.interface";

@Controller("customers")
export class CustomersController {
  private readonly logger = new Logger(CustomersController.name);

  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async findAll(): Promise<ApiResponse<Customer[]>> {
    this.logger.debug("GET /customers 요청 받음");
    try {
      const customers = await this.customersService.findAll();
      this.logger.debug(`${customers.length}명의 고객 데이터 반환`);
      return ResponseUtil.success(customers);
    } catch (error) {
      this.logger.error("고객 목록 조회 중 에러:", error);
      throw error;
    }
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<ApiResponse<Customer>> {
    // 특정 고객 상세 조회
    const customer = await this.customersService.findOne(id);
    return ResponseUtil.success(customer);
  }

  @Post()
  async create(
    @Body() createCustomerDto: CreateCustomerDto
  ): Promise<ApiResponse<Customer>> {
    // 고객 생성
    const customer = await this.customersService.create(createCustomerDto);
    return ResponseUtil.success(customer, "고객 생성 성공");
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateCustomerDto: UpdateCustomerDto
  ): Promise<ApiResponse<Customer>> {
    // 고객 정보 수정
    const customer = await this.customersService.update(id, updateCustomerDto);
    return ResponseUtil.success(customer, "고객 정보 수정 성공");
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<ApiResponse<null>> {
    // 고객 삭제
    await this.customersService.remove(id);
    return ResponseUtil.success(null, "고객 삭제 성공");
  }
}
