import { http } from "@/utils/http";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

// 权限分类相关类型（基于API文档）
export interface PermissionCategory {
  id: string;
  category_key: string;
  display_name: string;
  description?: string | null;
  sort_order?: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePermissionCategoryRequest {
  category_key: string;
  display_name: string;
  description?: string | null;
  sort_order?: number;
}

export interface UpdatePermissionCategoryRequest {
  category_key?: string;
  display_name?: string;
  description?: string | null;
  sort_order?: number;
}

// 权限定义相关类型（基于API文档）
export interface DefinedPermission {
  id: string;
  permission_key: string;
  display_name: string;
  description?: string;
  category_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDefinedPermissionRequest {
  permission_key: string;
  display_name: string;
  description?: string | null;
  category_id?: string | null;
}

export interface UpdateDefinedPermissionRequest {
  permission_key?: string;
  display_name?: string;
  description?: string | null;
  category_id?: string | null;
}

// 权限分类管理API
export const getPermissionCategories = (params?: {
  page?: number;
  page_size?: number;
  search?: string;
}) => {
  return http.request<ApiResponse<PaginatedResponse<PermissionCategory>>>(
    "get",
    "/api/v1/permissions/categories",
    { params }
  );
};

export const createPermissionCategory = (
  data: CreatePermissionCategoryRequest
) => {
  return http.request<ApiResponse<PermissionCategory>>(
    "post",
    "/api/v1/permissions/categories",
    { data }
  );
};

export const updatePermissionCategory = (
  id: string,
  data: UpdatePermissionCategoryRequest
) => {
  return http.request<ApiResponse<PermissionCategory>>(
    "put",
    `/api/v1/permissions/categories/${id}`,
    { data }
  );
};

export const deletePermissionCategory = (id: string) => {
  return http.request<ApiResponse<null>>(
    "delete",
    `/api/v1/permissions/categories/${id}`
  );
};

export const getPermissionCategory = (id: string) => {
  return http.request<ApiResponse<PermissionCategory>>(
    "get",
    `/api/v1/permissions/categories/${id}`
  );
};

// 权限定义管理API
export const getDefinedPermissions = (params?: {
  page?: number;
  page_size?: number;
  search?: string;
  category_id?: string;
}) => {
  return http.request<ApiResponse<PaginatedResponse<DefinedPermission>>>(
    "get",
    "/api/v1/permissions/defined",
    { params }
  );
};

export const createDefinedPermission = (
  data: CreateDefinedPermissionRequest
) => {
  return http.request<ApiResponse<DefinedPermission>>(
    "post",
    "/api/v1/permissions/defined",
    { data }
  );
};

export const updateDefinedPermission = (
  id: string,
  data: UpdateDefinedPermissionRequest
) => {
  return http.request<ApiResponse<DefinedPermission>>(
    "put",
    `/api/v1/permissions/defined/${id}`,
    { data }
  );
};

export const deleteDefinedPermission = (id: string) => {
  return http.request<ApiResponse<null>>(
    "delete",
    `/api/v1/permissions/defined/${id}`
  );
};

export const getDefinedPermission = (id: string) => {
  return http.request<ApiResponse<DefinedPermission>>(
    "get",
    `/api/v1/permissions/defined/${id}`
  );
};
