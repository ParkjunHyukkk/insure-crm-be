// Supabase 클라이언트를 생성합니다.
import { createClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '../config/supabase.config';

// 환경 변수에서 Supabase 설정을 로드합니다.
const config = SupabaseConfig();

// 모든 서비스에서 사용할 Supabase 인스턴스
export const supabase = createClient(config.supabaseUrl, config.supabaseKey);
