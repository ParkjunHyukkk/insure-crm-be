export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  last_sign_in_at?: string;
}

export interface AuthResponse {
  user: AuthUser;
  access_token: string | null;
  refresh_token: string | null;
  needEmailVerification?: boolean;
  expires_at?: number; // Unix timestamp
  expires_in?: number; // seconds
}

export interface TokenInfo {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
  token_type: string;
}
