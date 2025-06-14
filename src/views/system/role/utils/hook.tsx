import { reactive, ref, onMounted, h, type Ref } from "vue";
import { message } from "@/utils/message";
import type { PaginationProps } from "@pureadmin/table";
import {
  ElMessageBox,
  ElButton,
  ElPopconfirm,
  ElTag,
  type TableInstance
} from "element-plus";
import { formatDateTime } from "@/utils/dateTime";
import { addDialog } from "@/components/ReDialog";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { deviceDetection } from "@pureadmin/utils";

// 图标
import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import Key from "~icons/ep/key";

// API 导入
import {
  getAdminRoles,
  createAdminRole,
  updateAdminRole,
  deleteAdminRole,
  assignPermissionKeysToRole,
  getRolePermissionKeys,
  type AdminRole,
  type CreateAdminRoleRequest,
  type UpdateAdminRoleRequest
} from "@/api/system/roles";
import {
  getHierarchicalPermissionTree,
  type HierarchicalPermissionNode
} from "@/api/system/permissions";

// 类型导入
import type {
  RoleFormProps,
  PermissionConfigFormProps,
  PermissionTreeItem
} from "./types";
import RoleForm from "../form/index.vue";
import PermissionConfigForm from "../form/permission-config.vue";

export const useRoleManagement = (_tableRef?: Ref<TableInstance>) => {
  // 搜索表单状态
  const form = reactive({
    q: ""
  });

  // 数据列表
  const dataList = ref<AdminRole[]>([]);

  // 加载状态
  const loading = ref(false);

  // 选中的行
  const selectedRows = ref<AdminRole[]>([]);

  // 分页配置
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 50, 100]
  });

  // 权限配置表单数据
  const _permissionFormData = reactive<PermissionConfigFormProps>({
    role: {} as AdminRole,
    permissionTreeData: [],
    checkedPermissionKeys: [],
    loadingPermissions: false
  });

  // 权限配置相关引用（已移除，现在通过组件ref获取）

  // 按钮样式
  const buttonClass = deviceDetection() ? "w-full" : "";

  // 表格列配置
  const columns: TableColumnList = [
    {
      label: "勾选列",
      type: "selection",
      width: 55,
      align: "left",
      headerAlign: "left",
      reserveSelection: true
    },
    {
      label: "序号",
      type: "index",
      width: 70,
      align: "center"
    },
    {
      label: "角色名称",
      prop: "role_name",
      width: 150,
      align: "left",
      cellRenderer: ({ row }) => (
        <ElTag type="primary" size="small">
          {row.role_name}
        </ElTag>
      )
    },
    {
      label: "显示名称",
      prop: "display_name",
      width: 150,
      align: "left",
      showOverflowTooltip: true
    },
    {
      label: "描述",
      prop: "description",
      minWidth: 200,
      align: "left",
      showOverflowTooltip: true,
      cellRenderer: ({ row }) => row.description || "-"
    },
    {
      label: "创建时间",
      prop: "created_at",
      width: 180,
      align: "center",
      formatter: ({ created_at }) => formatDateTime(created_at)
    },
    {
      label: "更新时间",
      prop: "updated_at",
      width: 180,
      align: "center",
      formatter: ({ updated_at }) => formatDateTime(updated_at)
    },
    {
      label: "操作",
      fixed: "right",
      width: 280,
      cellRenderer: ({ row, props }) => (
        <div class="flex items-center justify-center space-x-2">
          <ElButton
            class="reset-margin"
            link
            type="primary"
            size={props.size}
            icon={useRenderIcon(EditPen)}
            onClick={() => openDialog("编辑", row)}
          >
            编辑
          </ElButton>
          <ElButton
            class="reset-margin"
            link
            type="success"
            size={props.size}
            icon={useRenderIcon(Key)}
            onClick={() => openPermissionDialog(row)}
          >
            权限配置
          </ElButton>
          <ElPopconfirm
            title={`是否确认删除角色${row.display_name}？`}
            onConfirm={() => handleDelete(row)}
          >
            {{
              reference: () => (
                <ElButton
                  class="reset-margin"
                  link
                  type="danger"
                  size={props.size}
                  icon={useRenderIcon(Delete)}
                >
                  删除
                </ElButton>
              )
            }}
          </ElPopconfirm>
        </div>
      )
    }
  ];

  // 基础方法
  function resetForm() {
    form.q = "";
  }

  async function onSearch() {
    loading.value = true;
    try {
      const params = {
        page: pagination.currentPage,
        page_size: pagination.pageSize,
        q: form.q || undefined
      };
      const { data } = await getAdminRoles(params);
      dataList.value = data.items;
      pagination.total = data.total;
    } catch (error) {
      console.error("获取角色列表失败:", error);
      message("获取角色列表失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  function handleSelectionChange(selection: AdminRole[]) {
    selectedRows.value = selection;
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  // 对话框操作
  function openDialog(title = "新增角色", row?: Partial<AdminRole>) {
    const formData: RoleFormProps = {
      id: row?.id,
      role_name: row?.role_name ?? "",
      display_name: row?.display_name ?? "",
      description: row?.description ?? ""
    };

    let formComponentRef: any = null;

    addDialog({
      title,
      props: {
        formData
      },
      width: "600px",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => {
        return h(RoleForm, {
          formData,
          ref: (el: any) => {
            formComponentRef = el;
          }
        });
      },
      beforeSure: done => {
        if (!formComponentRef) {
          message("表单组件未找到", { type: "error" });
          return;
        }

        formComponentRef.validate(async (valid: boolean) => {
          if (valid) {
            const curData = formComponentRef.getFormData();
            try {
              if (curData.id) {
                // 编辑
                const updateData: UpdateAdminRoleRequest = {
                  display_name: curData.display_name,
                  description: curData.description
                };
                await updateAdminRole(curData.id, updateData);
                message("角色更新成功", { type: "success" });
              } else {
                // 新增
                const createData: CreateAdminRoleRequest = {
                  role_name: curData.role_name,
                  display_name: curData.display_name,
                  description: curData.description
                };
                await createAdminRole(createData);
                message("角色创建成功", { type: "success" });
              }
              done();
              onSearch();
            } catch (error) {
              console.error("保存角色失败:", error);
              message("保存角色失败", { type: "error" });
            }
          }
        });
      }
    });
  }

  // 权限配置对话框
  function openPermissionDialog(row: AdminRole) {
    const formData = reactive<PermissionConfigFormProps>({
      role: row,
      permissionTreeData: [],
      checkedPermissionKeys: [],
      loadingPermissions: true
    });

    let permissionFormRef: any = null;

    addDialog({
      title: `配置权限 - ${row.display_name}`,
      props: {
        formData
      },
      width: "800px",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => {
        return h(PermissionConfigForm, {
          formData,
          ref: (el: any) => {
            permissionFormRef = el;
          }
        });
      },
      beforeSure: (done, { options }) => {
        const curData = options.props.formData as PermissionConfigFormProps;

        // 如果是超级管理员（*权限），不允许修改
        if (curData.checkedPermissionKeys.includes("*")) {
          message("超级管理员权限不允许修改", { type: "warning" });
          done();
          return;
        }

        if (!permissionFormRef) {
          message("权限配置组件未找到", { type: "error" });
          return;
        }

        const treeRef = permissionFormRef.getRef();
        if (!treeRef) {
          message("权限树组件未初始化", { type: "error" });
          return;
        }

        try {
          // 获取选中的节点ID（只获取权限节点，过滤掉分类节点）
          const checkedNodeIds = treeRef.getCheckedKeys() as string[];
          const permissionNodeIds = checkedNodeIds.filter(id => {
            return (
              typeof id === "string" && !id.toString().startsWith("category_")
            );
          });

          // 获取选中节点的permission_key（不再自动转换为*）
          const selectedPermissionKeys = getCheckedPermissionKeysWithoutStar(
            curData.permissionTreeData,
            permissionNodeIds
          );

          // 保存权限配置
          assignPermissionKeysToRole(curData.role.id, {
            permission_keys: selectedPermissionKeys
          })
            .then(() => {
              message("权限配置保存成功", { type: "success" });
              done();
            })
            .catch(error => {
              console.error("保存权限配置失败:", error);
              message("保存权限配置失败", { type: "error" });
            });
        } catch (error) {
          console.error("保存权限配置失败:", error);
          message("保存权限配置失败", { type: "error" });
        }
      }
    });

    // 异步加载权限数据
    loadPermissionData(formData);
  }

  // 加载权限数据
  async function loadPermissionData(formData: PermissionConfigFormProps) {
    formData.loadingPermissions = true;
    try {
      const [{ data: permissionTreeData }, { data: checkedPermissionKeys }] =
        await Promise.all([
          getHierarchicalPermissionTree(),
          getRolePermissionKeys(formData.role.id)
        ]);

      const permissionTree = convertToPermissionTree(permissionTreeData);

      formData.permissionTreeData = permissionTree;
      formData.checkedPermissionKeys = getNodeIdsByPermissionKeys(
        permissionTree,
        checkedPermissionKeys
      );
    } catch (error) {
      console.error("加载权限数据失败:", error);
      message("加载权限数据失败", { type: "error" });
    } finally {
      formData.loadingPermissions = false;
    }
  }

  function convertToPermissionTree(
    nodes: HierarchicalPermissionNode[]
  ): PermissionTreeItem[] {
    return nodes.map(node => {
      const treeItem: PermissionTreeItem = {
        id: node.id,
        display_name: node.display_name,
        description: node.description,
        permission_key: node.key,
        type: node.node_type === "category" ? "category" : "permission",
        children: []
      };

      if (node.children && node.children.length > 0) {
        treeItem.children = node.children.map(child => ({
          id: child.id,
          display_name: child.display_name,
          description: child.description,
          permission_key: child.permission_key,
          type: "permission" as const,
          children: []
        }));
      }

      return treeItem;
    });
  }

  function getNodeIdsByPermissionKeys(
    tree: PermissionTreeItem[],
    permissionKeys: string[]
  ): string[] {
    const result: string[] = [];

    const traverse = (nodes: PermissionTreeItem[]) => {
      if (!nodes) return;

      for (const node of nodes) {
        if (
          node.type === "permission" &&
          node.permission_key &&
          permissionKeys.includes(node.permission_key)
        ) {
          result.push(node.id);
        }

        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      }
    };

    traverse(tree);
    return result;
  }

  // 获取所有选中节点的permission_key（不自动转换为*）
  function getCheckedPermissionKeysWithoutStar(
    tree: PermissionTreeItem[],
    checkedNodeIds: string[]
  ): string[] {
    const checkedKeys = new Set<string>();
    const nodeMap = new Map<string, PermissionTreeItem>();

    const traverse = (nodes: PermissionTreeItem[]) => {
      nodes.forEach(node => {
        nodeMap.set(node.id, node);
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    traverse(tree);

    checkedNodeIds.forEach(id => {
      const node = nodeMap.get(id);
      if (node && node.type === "permission" && node.permission_key) {
        checkedKeys.add(node.permission_key);
      }
    });

    return Array.from(checkedKeys);
  }

  // 删除操作
  function handleDelete(row: AdminRole) {
    message(`您删除了角色: ${row.display_name}`, { type: "success" });
    ElMessageBox.confirm(
      `确认删除角色 "${row.display_name}" 吗？`,
      "删除确认",
      {
        type: "warning"
      }
    )
      .then(async () => {
        try {
          await deleteAdminRole(row.id);
          message("删除成功", { type: "success" });
          onSearch();
        } catch (error) {
          console.error("删除角色失败:", error);
          message("删除角色失败", { type: "error" });
        }
      })
      .catch(() => {
        // 用户取消删除
      });
  }

  function handleBatchDelete() {
    if (selectedRows.value.length === 0) {
      message("请选择要删除的角色", { type: "warning" });
      return;
    }

    ElMessageBox.confirm(
      `确认删除选中的 ${selectedRows.value.length} 个角色吗？`,
      "批量删除确认",
      {
        type: "warning"
      }
    )
      .then(async () => {
        try {
          const deletePromises = selectedRows.value.map(row =>
            deleteAdminRole(row.id)
          );
          await Promise.all(deletePromises);
          message("批量删除成功", { type: "success" });
          selectedRows.value = [];
          onSearch();
        } catch (error) {
          console.error("批量删除角色失败:", error);
          message("批量删除角色失败", { type: "error" });
        }
      })
      .catch(() => {
        // 用户取消删除
      });
  }

  // 生命周期
  onMounted(() => {
    onSearch();
  });

  return {
    form,
    dataList,
    loading,
    selectedRows,
    pagination,
    columns,
    buttonClass,
    resetForm,
    onSearch,
    handleSelectionChange,
    handleSizeChange,
    handleCurrentChange,
    openDialog,
    openPermissionDialog,
    handleDelete,
    handleBatchDelete
  };
};
