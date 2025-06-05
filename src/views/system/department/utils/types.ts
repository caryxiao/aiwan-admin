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

// 表格列类型
export interface TableColumnProps {
  type?: string;
  label?: string;
  prop?: string;
  width?: string | number;
  minWidth?: string | number;
  fixed?: string | boolean;
  align?: "left" | "center" | "right";
  slot?: string;
  hide?: boolean;
  cellRenderer?: (scope: { row: any }) => JSX.Element;
}

// 表格列列表类型
export type TableColumnList = TableColumnProps[];
