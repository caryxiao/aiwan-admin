// 权限表单项类型
export interface FormItemProps {
  permission_key: string;
  display_name: string;
  description: string;
  category_id: string;
}

// 权限分类节点类型
export interface PermissionCategoryNode {
  category_id: string;
  category_name: string;
  children_categories?: PermissionCategoryNode[];
}
