interface FormItemProps {
  higherDeptOptions: Record<string, unknown>[];
  parent_id: string | number;
  name: string;
  code: string;
  description: string;
  sort_order: number;
  status: number;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
