// Supabase 클라이언트를 생성합니다.
import { createClient } from "@supabase/supabase-js";
import { Logger } from "@nestjs/common";
import "dotenv/config";

const logger = new Logger("SupabaseClient");

// 환경 변수에서 직접 Supabase 설정을 가져옵니다.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

logger.debug("Supabase URL:", supabaseUrl);
logger.debug("Supabase Key length:", supabaseKey?.length);

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase URL and Key must be provided in environment variables"
  );
}

// 모든 서비스에서 사용할 Supabase 인스턴스
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

// 연결 테스트
(async () => {
  try {
    logger.debug("Supabase 연결 테스트 시작...");
    const { data, error } = await supabase.from("customers").select("count");
    logger.debug("연결 테스트 결과:", { data, error });
  } catch (error) {
    logger.error("연결 테스트 중 에러 발생:", error);
  }
})();
