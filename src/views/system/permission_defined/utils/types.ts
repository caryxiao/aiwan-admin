import type { PaginationProps } from "@pureadmin/table";

/** 权限定义 */
export interface DefinedPermission {
  id: string;
  permission_key: string;
  display_name: string;
  description?: string;
  category_id: string;
  category_display_name?: string;
  category_path_names?: string[];
  created_at: string;
  updated_at: string;
}

/** 权限分类节点 */
export interface PermissionCategoryNode {
  category_id: string;
  category_name: string;
  parent_category_id?: string;
  permissions: PermissionTreeItem[];
  children_categories: PermissionCategoryNode[];
}

/** 权限树项 */
export interface PermissionTreeItem {
  id: string;
  permission_key: string;
  display_name: string;
  description: string;
}

/** 表单项属性 */
export interface FormItemProps {
  permission_key: string;
  display_name: string;
  description?: string;
  category_id: string;
}

/** 创建权限定义请求 */
export interface CreateDefinedPermissionRequest {
  permission_key: string;
  display_name: string;
  description?: string;
  category_id: string;
}

/** 更新权限定义请求 */
export interface UpdateDefinedPermissionRequest {
  permission_key?: string;
  display_name?: string;
  description?: string;
  category_id?: string;
}

/** 搜索表单 */
export interface SearchFormProps {
  permission_key?: string;
  display_name?: string;
  category_id?: string;
}

/** 表格数据项 */
export interface TableDataItem extends DefinedPermission {
  /** 表格行的唯一标识 */
  _rowKey?: string;
  /** 是否展开子项 */
  _expanded?: boolean;
  /** 子项列表 */
  children?: TableDataItem[];
  /** 层级深度 */
  _level?: number;
  /** 是否为分类节点 */
  _isCategory?: boolean;
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/** 表格配置 */
export interface TableConfig {
  /** 表格数据 */
  dataList: TableDataItem[];
  /** 加载状态 */
  loading: boolean;
  /** 分页配置 */
  pagination: PaginationProps;
  /** 搜索表单 */
  searchForm: SearchFormProps;
}

/** 对话框配置 */
export interface DialogConfig {
  /** 是否显示 */
  visible: boolean;
  /** 对话框标题 */
  title: string;
  /** 表单数据 */
  formInline: FormItemProps;
  /** 是否为编辑模式 */
  isEdit: boolean;
  /** 编辑的权限ID */
  editId?: string;
}
