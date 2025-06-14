import { http } from "@/utils/http";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

export interface ApiResource {
  id: string;
  http_method: string;
  path_pattern: string;
  display_name: string;
  description: string | null;
  required_permission_keys: string[] | null;
  is_active: boolean;
  auto_registered: boolean;
  module_tag: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiResourceDetail extends ApiResource {
  validation?: any;
  usage_stats?: any;
  related_resources?: ApiResource[];
}

export interface ModuleStats {
  [key: string]: {
    resource_count: number;
    method_distribution: { [key: string]: number };
    active_count: number;
    inactive_count: number;
  };
}

export interface ApiResourcesStats {
  modules: ModuleStats;
  total_resources: number;
  active_resources: number;
  inactive_resources: number;
}

export const getApiResources = (params?: {
  page?: number;
  page_size?: number;
  q?: string;
  http_method?: string;
  module_tag?: string;
  is_active?: boolean;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}) => {
  return http.request<ApiResponse<PaginatedResponse<ApiResource>>>(
    "get",
    "/api/v1/api-resources",
    { params }
  );
};

export const getApiResourceById = (id: string) => {
  return http.request<ApiResponse<ApiResourceDetail>>(
    "get",
    `/api/v1/api-resources/${id}`
  );
};

export const getApiResourcesModuleStats = () => {
  return http.request<ApiResponse<ApiResourcesStats>>(
    "get",
    "/api/v1/api-resources/stats/modules"
  );
};
