import type { AdminMenu } from "@/api/system/menus";

// 菜单树节点接口
export interface MenuTreeNode {
  id: string;
  title: string;
  children?: MenuTreeNode[];
}

// 表单项属性接口
export interface FormItemProps extends AdminMenu {
  menuTreeData?: MenuTreeNode[];
}

// 表单组件Props接口
export interface FormProps {
  formInline: FormItemProps;
}
