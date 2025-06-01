// 菜单管理相关API
import { http } from "@/utils/http";
import type { ApiResponse } from "@/types/api";

export interface AdminMenu {
  id: string;
  parent_id?: string;
  menu_type: string;
  title: string;
  name?: string;
  path?: string;
  component?: string;
  permission_key?: string;
  icon?: string;
  sort_order: number;
  is_hidden: boolean;
  is_cache: boolean;
  is_external_link: boolean;
  external_link_url?: string;
  status: string;
  remark?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  children?: AdminMenu[];
}

// 菜单管理 API
export const getAdminMenus = () => {
  return http.request<ApiResponse<AdminMenu[]>>("get", "/api/v1/menus");
};

export const getAdminMenu = (id: string) => {
  return http.request<ApiResponse<AdminMenu>>("get", `/api/v1/menus/${id}`);
};

export const createAdminMenu = (data: Partial<AdminMenu>) => {
  return http.request<ApiResponse<AdminMenu>>("post", "/api/v1/menus", {
    data
  });
};

export const updateAdminMenu = (id: string, data: Partial<AdminMenu>) => {
  return http.request<ApiResponse<AdminMenu>>("put", `/api/v1/menus/${id}`, {
    data
  });
};

export const deleteAdminMenu = (id: string) => {
  return http.request<ApiResponse<null>>("delete", `/api/v1/menus/${id}`);
};

// 获取用户菜单（用于动态路由）
export const getUserMenus = () => {
  return http.request<ApiResponse<AdminMenu[]>>("get", "/api/v1/user-menus");
};
