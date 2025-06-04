import { http } from "@/utils/http";

// 部门数据类型定义
export interface Department {
  id: string;
  name: string;
  parent_id: string | null;
  code: string;
  description: string;
  sort_order: number;
  status: boolean;
  created_at: string;
  updated_at: string;
  children?: Department[];
}

// 创建部门请求参数
export interface CreateDepartmentRequest {
  name: string;
  parent_id?: string | null;
  code: string;
  description?: string;
  sort_order?: number;
  status?: boolean;
}

// 更新部门请求参数
export interface UpdateDepartmentRequest {
  name?: string;
  parent_id?: string | null;
  code?: string;
  description?: string;
  sort_order?: number;
  status?: boolean;
}

// 部门列表查询参数
export interface DepartmentListParams {
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  q?: string;
  name?: string;
  code?: string;
  parent_id?: string;
  status?: boolean;
}

// 部门树查询参数
export interface DepartmentTreeParams {
  q?: string;
  name?: string;
  code?: string;
  status?: boolean;
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  timestamp: string;
}

// 分页响应数据
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

/**
 * 获取部门树形列表（所有数据）
 */
export function getDepartmentsTreeAll(params?: DepartmentTreeParams) {
  return http.request<ApiResponse<Department[]>>(
    "get",
    "/api/v1/departments/tree/all",
    { params }
  );
}

/**
 * 获取部门树形列表（分页）
 */
export function getDepartmentsTree(params?: DepartmentTreeParams) {
  return http.request<ApiResponse<Department[]>>(
    "get",
    "/api/v1/departments/tree",
    { params }
  );
}

/**
 * 获取部门列表（分页）
 */
export function getDepartmentsList(params?: DepartmentListParams) {
  return http.request<ApiResponse<PaginatedResponse<Department>>>(
    "get",
    "/api/v1/departments",
    { params }
  );
}

/**
 * 创建部门
 */
export function createDepartment(data: CreateDepartmentRequest) {
  return http.request<ApiResponse<Department>>("post", "/api/v1/departments", {
    data
  });
}

/**
 * 更新部门
 */
export function updateDepartment(id: string, data: UpdateDepartmentRequest) {
  return http.request<ApiResponse<Department>>(
    "put",
    `/api/v1/departments/${id}`,
    { data }
  );
}

/**
 * 删除部门
 */
export function deleteDepartment(id: string) {
  return http.request<ApiResponse<null>>("delete", `/api/v1/departments/${id}`);
}

/**
 * 批量删除部门
 */
export function batchDeleteDepartments(ids: string[]) {
  return http.request<ApiResponse<null>>(
    "delete",
    "/api/v1/departments/batch",
    { data: { ids } }
  );
}
