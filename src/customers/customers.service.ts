// 고객 데이터 처리를 담당하는 서비스
import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { supabase } from "../utils/supabase-client";
import { Customer } from "./interfaces/customer.interface";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);
  private table = "customers";

  // 고객 생성
  async create(dto: CreateCustomerDto): Promise<Customer> {
    const { data, error } = await supabase
      .from(this.table)
      .insert(dto)
      .select()
      .single();
    if (error) throw error;
    return data as Customer;
  }

  // 모든 고객 조회
  async findAll(): Promise<Customer[]> {
    this.logger.debug("고객 목록 조회 시작");

    try {
      // 쿼리 실행 전 Supabase 연결 상태 확인
      const { data: healthCheck, error: healthError } = await supabase
        .from("customers")
        .select("count");
      this.logger.debug("Supabase 연결 상태:", { healthCheck, healthError });

      // 실제 쿼리 실행 (스키마 명시)
      this.logger.debug("customers 테이블에서 모든 데이터 조회 시도");
      const { data, error } = await supabase.from("customers").select("*");

      if (error) {
        this.logger.error("조회 중 에러 발생:", error);
        throw new Error(`데이터 조회 실패: ${error.message}`);
      }

      this.logger.debug(`조회된 고객 수: ${data?.length ?? 0}`);
      if (data && data.length > 0) {
        this.logger.debug(
          "첫 번째 고객 데이터:",
          JSON.stringify(data[0], null, 2)
        );
      } else {
        this.logger.warn("조회된 고객 데이터가 없습니다.");

        // 테이블 정보 조회
        const { data: tableInfo, error: tableError } = await supabase
          .from("customers")
          .select("*")
          .limit(1);
        this.logger.debug("테이블 정보:", { tableInfo, tableError });
      }

      return data as Customer[];
    } catch (error) {
      this.logger.error("예상치 못한 에러 발생:", error);
      throw error;
    }
  }

  // ID로 고객 한 명 조회
  async findOne(id: string): Promise<Customer> {
    const { data, error } = await supabase
      .from(this.table)
      .select()
      .eq("id", id)
      .single();
    if (error) throw new NotFoundException(error.message);
    if (!data) throw new NotFoundException("Customer not found");
    return data as Customer;
  }

  // 고객 정보 수정
  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const { data, error } = await supabase
      .from(this.table)
      .update(dto)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Customer;
  }

  // 고객 삭제
  async remove(id: string): Promise<void> {
    const { error } = await supabase.from(this.table).delete().eq("id", id);
    if (error) throw error;
  }
}
