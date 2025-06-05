interface FormItemProps {
  id?: number;
  /** 用于判断是`新增`还是`修改` */
  title: string;
  username: string;
  email: string;
  full_name: string;
  password?: string;
  is_active: boolean;
  mfa_enabled: boolean;
  department_id?: string | null;
  department_name?: string | null;
  roles?: string[];
  permissions?: string[];
  last_login_at?: string;
  created_at?: string;
  updated_at?: string;
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

export type { FormItemProps, FormProps, RoleFormItemProps, RoleFormProps };
