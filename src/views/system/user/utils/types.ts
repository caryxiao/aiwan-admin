export interface FormItemProps {
  /** 用户ID（编辑时使用） */
  id?: number;
  /** 用户名 */
  username: string;
  /** 邮箱 */
  email: string;
  /** 姓名 */
  full_name: string;
  /** 密码 */
  password: string;
  /** 部门ID */
  department_id: number | null;
  /** 是否激活 */
  is_active: boolean;
  /** 是否启用多因子认证 */
  mfa_enabled: boolean;
  /** 部门选项 */
  departmentOptions: Array<{
    value: number | null;
    label: string;
    children?: any[];
  }>;
}

/** 角色分配表单属性 */
export interface AssignRoleFormProps {
  /** 用户名 */
  username: string;
  /** 姓名 */
  full_name: string;
  /** 角色ID列表 */
  roleIds: string[];
  /** 角色选项 */
  roleOptions: Array<{
    id: string;
    role_name: string;
    display_name: string;
    description?: string;
  }>;
  /** 角色加载状态 */
  loadingRoles: boolean;
}

interface FormProps {
  formInline?: FormItemProps;
  formData: FormItemProps;
}

interface RoleFormItemProps {
  username: string;
  full_name: string;
  /** 角色列表 */
  roleOptions: any[];
  /** 选中的角色列表 */
  ids: Record<number, unknown>[];
}

interface RoleFormProps {
  formInline: RoleFormItemProps;
}

export type { FormProps, RoleFormItemProps, RoleFormProps };
