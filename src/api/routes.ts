import { http } from "@/utils/http";
import type { ApiResponse } from "@/types/api";
// 菜单树节点类型定义
export interface AdminMenuTreeItem {
  id: string;
  parent_id?: string;
  menu_type: "CATALOG" | "MENU" | "BUTTON";
  path?: string;
  name?: string;
  component?: string;
  redirect?: string;
  meta: {
    title: string;
    icon?: string;
    show_link: boolean;
    rank: number;
    show_parent?: boolean;
    keep_alive?: boolean;
    frame_src?: string;
    frame_loading?: boolean;
    transition?: {
      name?: string;
      enter_transition?: string;
      leave_transition?: string;
    };
    hidden_tag?: boolean;
    dynamic_level?: number;
    active_path?: string;
    authority?: string[];
  };
  children: AdminMenuTreeItem[];
  permission_key?: string;
  status?: string;
  remark?: string;
  created_at?: string;
  updated_at?: string;
}

export const getAsyncRoutes = () => {
  return http.request<ApiResponse<AdminMenuTreeItem[]>>(
    "get",
    "/api/v1/auth/me/menus"
  );
};
