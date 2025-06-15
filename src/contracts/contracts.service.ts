// 계약 데이터 처리를 담당하는 서비스
import { Injectable, NotFoundException } from '@nestjs/common';
import { supabase } from '../utils/supabase-client';
import { Contract } from './interfaces/contract.interface';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractsService {
  private table = 'contracts';

  // 계약 생성
  async create(dto: CreateContractDto): Promise<Contract> {
    const { data, error } = await supabase.from(this.table).insert(dto).select().single();
    if (error) throw error;
    return data as Contract;
  }

  // 모든 계약 조회
  async findAll(): Promise<Contract[]> {
    const { data, error } = await supabase.from(this.table).select();
    if (error) throw error;
    return data as Contract[];
  }

  // ID로 계약 조회
  async findOne(id: string): Promise<Contract> {
    const { data, error } = await supabase.from(this.table).select().eq('id', id).single();
    if (error) throw new NotFoundException(error.message);
    if (!data) throw new NotFoundException('Contract not found');
    return data as Contract;
  }

  // 계약 수정
  async update(id: string, dto: UpdateContractDto): Promise<Contract> {
    const { data, error } = await supabase
      .from(this.table)
      .update(dto)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Contract;
  }

  // 계약 삭제
  async remove(id: string): Promise<void> {
    const { error } = await supabase.from(this.table).delete().eq('id', id);
    if (error) throw error;
  }
}
