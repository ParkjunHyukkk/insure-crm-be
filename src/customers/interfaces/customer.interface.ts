// 고객 엔터티 인터페이스 정의
export interface Customer {
  id: string; // 고객 고유 ID (UUID)
  name: string; // 고객 이름
  phone: string; // 전화번호
  birth_date: Date; // 생년월일
  signup_date: Date; // 가입일
  maturity_date: Date; // 만기일
  auto_payment: boolean; // 자동결제 여부
  memo: string; // 메모
  created_at: Date; // 생성일시
  updated_at: Date; // 수정일시
}
