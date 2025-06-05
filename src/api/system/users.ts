import { http } from "@/utils/http";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  full_name?: string | null;
  is_active: boolean;
  mfa_enabled: boolean;
  last_login_at?: string | null;
  last_login_ip?: string | null;
  created_at: string;
  updated_at: string;
  department_id?: string | null;
  department_name?: string | null;
  roles?: { id: string; display_name: string }[]; // 添加角色信息
}

export interface CreateAdminUserRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string | null;
  is_active?: boolean | null;
  mfa_enabled?: boolean;
  department_id?: string | null;
  role_ids?: string[]; // 添加角色ID用于创建和更新
}

export interface UpdateAdminUserRequest {
  username?: string;
  email?: string;
  password?: string;
  full_name?: string | null;
  is_active?: boolean;
  mfa_enabled?: boolean;
  department_id?: string | null;
  role_ids?: string[]; // 添加角色ID用于创建和更新
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

export const resetAdminUserPassword = (id: string, new_password: string) => {
  return http.request<ApiResponse<null>>(
    "put",
    `/api/v1/admin-users/${id}/reset-password`,
    {
      data: { new_password }
    }
  );
};

// 分配用户角色
export const assignRolesToUser = (
  userId: string,
  data: { role_names: string[] }
) => {
  return http.request<ApiResponse<null>>(
    "put",
    `/api/v1/admin-users/${userId}/roles`,
    {
      data
    }
  );
};

// 获取用户角色
export const getUserRoles = (userId: string) => {
  return http.request<ApiResponse<{ user_id: string; roles: string[] }>>(
    "get",
    `/api/v1/admin-users/${userId}/roles`
  );
};
