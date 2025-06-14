import { http } from "@/utils/http";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

// 权限定义相关类型（基于API文档）
export interface DefinedPermission {
  id: string;
  permission_key: string;
  display_name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDefinedPermissionRequest {
  permission_key: string;
  display_name: string;
  description?: string | null;
}

export interface UpdateDefinedPermissionRequest {
  permission_key?: string;
  display_name?: string;
  description?: string | null;
}

// 权限组相关类型
export interface PermissionGroup {
  id: string;
  group_key: string;
  display_name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PermissionGroupDetail extends PermissionGroup {
  permission_ids: string[];
}

export interface CreatePermissionGroupRequest {
  group_key: string;
  display_name: string;
  description?: string;
  sort_order?: number;
}

export interface UpdatePermissionGroupRequest {
  group_key?: string;
  display_name?: string;
  description?: string;
  sort_order?: number;
}

// 分层权限节点（用于权限分配界面）
export interface HierarchicalPermissionLeaf {
  id: string;
  permission_key: string;
  display_name: string;
  description: string | null;
}

export interface HierarchicalPermissionNode {
  id: string;
  node_type: "category" | "permission";
  key: string;
  display_name: string;
  description: string | null;
  children: HierarchicalPermissionLeaf[];
}

// 只读权限树节点
export interface PermissionNodeInfo {
  id: string;
  permission_key: string;
  display_name: string;
  description: string | null;
}

export interface ReadOnlyPermissionTreeNode {
  category_id: string;
  category_key: string;
  category_name: string;
  category_description: string | null;
  permissions: PermissionNodeInfo[];
}

// 权限定义管理API
export const getDefinedPermissions = (params?: {
  page?: number;
  page_size?: number;
  q?: string;
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

export const batchDeleteDefinedPermissions = (ids: string[]) => {
  return http.request<ApiResponse<null>>(
    "delete",
    "/api/v1/permissions/defined/batch",
    { data: { ids } }
  );
};

export const getDefinedPermission = (id: string) => {
  return http.request<ApiResponse<DefinedPermission>>(
    "get",
    `/api/v1/permissions/defined/${id}`
  );
};

// 权限树 API
/**
 * 获取层级结构的权限树，用于权限分配
 */
export const getHierarchicalPermissionTree = () => {
  return http.request<ApiResponse<HierarchicalPermissionNode[]>>(
    "get",
    "/api/v1/permissions/hierarchical-tree"
  );
};

/**
 * 获取只读的权限列表树，用于展示
 */
export const getReadOnlyPermissionTree = () => {
  return http.request<ApiResponse<ReadOnlyPermissionTreeNode[]>>(
    "get",
    "/api/v1/permissions/tree"
  );
};

// 权限组管理API
export const getPermissionGroups = (params?: {
  page?: number;
  page_size?: number;
  q?: string;
}) => {
  return http.request<ApiResponse<PaginatedResponse<PermissionGroup>>>(
    "get",
    "/api/v1/permission-groups",
    { params }
  );
};

export const createPermissionGroup = (data: CreatePermissionGroupRequest) => {
  return http.request<ApiResponse<PermissionGroup>>(
    "post",
    "/api/v1/permission-groups",
    { data }
  );
};

export const getPermissionGroup = (id: string) => {
  return http.request<ApiResponse<PermissionGroupDetail>>(
    "get",
    `/api/v1/permission-groups/${id}`
  );
};

export const updatePermissionGroup = (
  id: string,
  data: UpdatePermissionGroupRequest
) => {
  return http.request<ApiResponse<PermissionGroup>>(
    "put",
    `/api/v1/permission-groups/${id}`,
    { data }
  );
};

export const deletePermissionGroup = (id: string) => {
  return http.request<ApiResponse<null>>(
    "delete",
    `/api/v1/permission-groups/${id}`
  );
};

export const getPermissionGroupPermissions = (groupId: string) => {
  return http.request<ApiResponse<string[]>>(
    "get",
    `/api/v1/permission-groups/${groupId}/permissions`
  );
};

export const setPermissionGroupPermissions = (
  groupId: string,
  data: { permission_ids: string[] }
) => {
  return http.request<ApiResponse<null>>(
    "post",
    `/api/v1/permission-groups/${groupId}/permissions`,
    { data }
  );
};
