interface FormItemProps {
  categoryOptions: Array<{
    value: string | null;
    label: string;
    children?: any[];
  }>;
  category_key: string;
  display_name: string;
  description: string;
  parent_id: string | null;
  sort_order: number;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
