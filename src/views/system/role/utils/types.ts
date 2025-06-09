import type { AdminRole } from "@/api/system/roles";

/** 角色表单属性 */
export interface RoleFormProps {
  /** 角色ID（编辑时使用） */
  id?: string;
  /** 角色名称 */
  role_name: string;
  /** 显示名称 */
  display_name: string;
  /** 描述 */
  description?: string;
  /** 表单引用 */
  formRef?: any;
}

/** 权限配置表单属性 */
export interface PermissionConfigFormProps {
  /** 角色信息 */
  role: AdminRole;
  /** 权限树数据 */
  permissionTreeData: PermissionTreeItem[];
  /** 已选中的权限键 */
  checkedPermissionKeys: string[];
  /** 已选中的节点ID */
  checkedNodeIds?: string[];
  /** 权限加载状态 */
  loadingPermissions: boolean;
}

/** 权限树节点 */
export interface PermissionTreeItem {
  /** 节点ID */
  id: string;
  /** 显示名称 */
  display_name: string;
  /** 描述信息 */
  description?: string;
  /** 权限键（仅权限节点有） */
  permission_key?: string;
  /** 节点类型 */
  type: "category" | "permission";
  /** 子节点 */
  children?: PermissionTreeItem[];
  /** 是否禁用 */
  disabled?: boolean;
}

/** 搜索表单 */
export interface SearchForm {
  /** 搜索关键词 */
  search: string;
}
