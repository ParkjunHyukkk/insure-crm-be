// Supabase 관련 환경 변수 설정을 반환합니다.
export const SupabaseConfig = () => ({
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_KEY || '',
});
