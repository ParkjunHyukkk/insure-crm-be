// 고객 데이터 처리를 담당하는 서비스
import { Injectable, NotFoundException } from '@nestjs/common';
import { supabase } from '../utils/supabase-client';
import { Customer } from './interfaces/customer.interface';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  private table = 'customers';

  // 고객 생성
  async create(dto: CreateCustomerDto): Promise<Customer> {
    const { data, error } = await supabase.from(this.table).insert(dto).select().single();
    if (error) throw error;
    return data as Customer;
  }

  // 모든 고객 조회
  async findAll(): Promise<Customer[]> {
    const { data, error } = await supabase.from(this.table).select();
    if (error) throw error;
    return data as Customer[];
  }

  // ID로 고객 한 명 조회
  async findOne(id: string): Promise<Customer> {
    const { data, error } = await supabase.from(this.table).select().eq('id', id).single();
    if (error) throw new NotFoundException(error.message);
    if (!data) throw new NotFoundException('Customer not found');
    return data as Customer;
  }

  // 고객 정보 수정
  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const { data, error } = await supabase
      .from(this.table)
      .update(dto)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Customer;
  }

  // 고객 삭제
  async remove(id: string): Promise<void> {
    const { error } = await supabase.from(this.table).delete().eq('id', id);
    if (error) throw error;
  }
}
