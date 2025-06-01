import { http } from "@/utils/http";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

// 用户管理相关类型（基于API文档）
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  full_name?: string | null;
  is_active: boolean;
  mfa_enabled: boolean;
  totp_setup_at?: string | null;
  preferred_language_code?: string | null;
  preferred_timezone?: string | null;
  last_login_at?: string | null;
  last_login_ip?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAdminUserRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string | null;
  is_active?: boolean | null;
}

export interface UpdateAdminUserRequest {
  username?: string;
  email?: string;
  password?: string;
  full_name?: string | null;
  is_active?: boolean;
}

// 用户管理API
export const getAdminUsers = (params?: {
  page?: number;
  page_size?: number;
  search?: string;
}) => {
  return http.request<ApiResponse<PaginatedResponse<AdminUser>>>(
    "get",
    "/api/v1/admin-users",
    {
      params
    }
  );
};

export const createAdminUser = (data: CreateAdminUserRequest) => {
  return http.request<ApiResponse<AdminUser>>("post", "/api/v1/admin-users", {
    data
  });
};

export const updateAdminUser = (id: string, data: UpdateAdminUserRequest) => {
  return http.request<ApiResponse<AdminUser>>(
    "put",
    `/api/v1/admin-users/${id}`,
    {
      data
    }
  );
};

export const deleteAdminUser = (id: string) => {
  return http.request<ApiResponse<null>>("delete", `/api/v1/admin-users/${id}`);
};

export const getAdminUser = (id: string) => {
  return http.request<ApiResponse<AdminUser>>(
    "get",
    `/api/v1/admin-users/${id}`
  );
};
