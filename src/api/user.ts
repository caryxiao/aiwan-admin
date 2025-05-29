import { http } from "@/utils/http";

export type UserResult = {
  success: boolean;
  code: string;
  message: string;
  data: {
    /** 访问令牌 (Access Token) */
    access_token: string;
    /** 刷新令牌 (Refresh Token) */
    refresh_token: string;
    /** 令牌类型，通常为 'Bearer' */
    token_type: string;
    /** 访问令牌的过期时间戳 (Unix timestamp, seconds since epoch) */
    access_token_expires_at: number;
  };
  timestamp: string;
};

export type RefreshTokenRequest = {
  refresh_token: string;
};

export type RefreshTokenResult = {
  success: boolean;
  code: string;
  message: string;
  data: {
    /** 新的访问令牌 (Access Token) */
    access_token: string;
    /** 令牌类型，通常为 'Bearer' */
    token_type: string;
    /** 新访问令牌的过期时间戳 (Unix timestamp, 自 epoch 以来的秒数) */
    access_token_expires_at: number;
  };
  timestamp: string;
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "/api/v1/auth/login", { data });
};

/** 刷新`token` */
export const refreshTokenApi = (data: RefreshTokenRequest) => {
  return http.request<RefreshTokenResult>(
    "post",
    "/api/v1/auth/refresh-token",
    {
      data
    }
  );
};
