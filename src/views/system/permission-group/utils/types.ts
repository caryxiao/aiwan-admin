export interface PermissionGroupFormProps {
  id?: string;
  group_key: string;
  display_name: string;
  description: string;
  sort_order: number;
}

export interface AssignPermissionFormProps {
  groupId: string;
  onClose: () => void;
}
