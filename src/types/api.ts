// 通用API响应类型定义

// 通用API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  timestamp: string;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

// 基础响应类型（不包含data字段）
export interface BaseResponse {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
}

// 列表响应类型
export type ListResponse<T> = ApiResponse<T[]>;

// 详情响应类型
export type DetailResponse<T> = ApiResponse<T>;

// 分页列表响应类型
export type PaginatedListResponse<T> = ApiResponse<PaginatedResponse<T>>;
