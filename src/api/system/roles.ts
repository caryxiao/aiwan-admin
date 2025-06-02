import { http } from "@/utils/http";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

// 角色管理相关类型（基于API文档）
export interface AdminRole {
  id: string;
  role_name: string;
  display_name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAdminRoleRequest {
  role_name: string;
  display_name: string;
  description?: string | null;
}

export interface UpdateAdminRoleRequest {
  role_name?: string;
  display_name?: string;
  description?: string | null;
}

// 角色权限分配相关类型
export interface AssignPermissionsToRolePayload {
  permission_ids: string[];
}

// 新的权限分配载荷类型（使用permission_key）
export interface AssignPermissionKeysToRolePayload {
  permission_keys: string[];
}

// 角色管理API
export const getAdminRoles = (params?: {
  page?: number;
  page_size?: number;
  search?: string;
}) => {
  return http.request<ApiResponse<PaginatedResponse<AdminRole>>>(
    "get",
    "/api/v1/roles",
    {
      params
    }
  );
};

export const createAdminRole = (data: CreateAdminRoleRequest) => {
  return http.request<ApiResponse<AdminRole>>("post", "/api/v1/roles", {
    data
  });
};

export const updateAdminRole = (id: string, data: UpdateAdminRoleRequest) => {
  return http.request<ApiResponse<AdminRole>>("put", `/api/v1/roles/${id}`, {
    data
  });
};

export const deleteAdminRole = (id: string) => {
  return http.request<ApiResponse<null>>("delete", `/api/v1/roles/${id}`);
};

export const getAdminRole = (id: string) => {
  return http.request<ApiResponse<AdminRole>>("get", `/api/v1/roles/${id}`);
};

// 角色权限分配API
export const assignPermissionsToRole = (
  roleId: string,
  data: AssignPermissionsToRolePayload
) => {
  return http.request<ApiResponse<null>>(
    "post",
    `/api/v1/roles/${roleId}/permissions`,
    { data }
  );
};

// 获取角色权限
export const getRolePermissions = (roleId: string) => {
  return http.request<ApiResponse<string[]>>(
    "get",
    `/api/v1/roles/${roleId}/permissions`
  );
};

// 更新角色权限
export const updateRolePermissions = (
  roleId: string,
  data: AssignPermissionsToRolePayload
) => {
  return http.request<ApiResponse<null>>(
    "put",
    `/api/v1/roles/${roleId}/permissions`,
    { data }
  );
};

// 使用permission_keys的新权限分配API（基于最新API文档）
export const assignPermissionKeysToRole = (
  roleId: string,
  data: AssignPermissionKeysToRolePayload
) => {
  return http.request<ApiResponse<null>>(
    "post",
    `/api/v1/roles/${roleId}/permissions`,
    { data }
  );
};

// 获取角色权限键列表（基于最新API文档）
export const getRolePermissionKeys = (roleId: string) => {
  return http.request<ApiResponse<string[]>>(
    "get",
    `/api/v1/roles/${roleId}/permissions`
  );
};
