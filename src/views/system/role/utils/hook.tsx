import { ref, reactive, onMounted, h, nextTick, type Ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { TableInstance } from "element-plus";
import { ElButton, ElPopconfirm, ElMessageBox } from "element-plus";
import { formatDateTime } from "@/utils/dateTime";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";
import { deviceDetection } from "@pureadmin/utils";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";
import Key from "~icons/ep/key";

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
  getPermissionTree,
  type PermissionCategoryNode
} from "@/api/system/permissions";

import type {
  RoleFormProps,
  PermissionConfigFormProps,
  PermissionTreeItem,
  SearchForm
} from "./types";
import RoleForm from "../form/index.vue";
import PermissionConfigForm from "../form/permission-config.vue";

export const useRoleManagement = (_tableRef?: Ref<TableInstance>) => {
  // 搜索表单状态
  const form = reactive<SearchForm>({
    search: ""
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
        <el-tag type="primary" size="small">
          {row.role_name}
        </el-tag>
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
    form.search = "";
  }

  async function onSearch() {
    loading.value = true;
    try {
      const params = {
        page: pagination.currentPage,
        page_size: pagination.pageSize,
        search: form.search || undefined
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
    try {
      formData.loadingPermissions = true;

      // 获取权限树数据
      const permissionTreeResponse = await getPermissionTree();
      const categoryNodes = permissionTreeResponse.data.tree;

      // 转换为前端树组件需要的格式
      formData.permissionTreeData = convertCategoryNodesToTree(categoryNodes);

      // 获取角色当前权限键
      const rolePermissionKeysResponse = await getRolePermissionKeys(
        formData.role.id
      );
      const permissionKeys = rolePermissionKeysResponse.data;
      formData.checkedPermissionKeys = permissionKeys;

      // 等待下一个tick后设置选中状态
      await nextTick();
      let checkedNodeIds: string[];

      // 如果权限包含*号，表示全选所有权限
      if (permissionKeys.includes("*")) {
        checkedNodeIds = getAllPermissionNodeIds(formData.permissionTreeData);
      } else {
        checkedNodeIds = getNodeIdsByPermissionKeys(
          formData.permissionTreeData,
          permissionKeys
        );
      }

      // 通过formData传递选中的节点ID
      formData.checkedNodeIds = checkedNodeIds;
    } catch (error) {
      console.error("获取权限数据失败:", error);
      message("获取权限数据失败", { type: "error" });
    } finally {
      formData.loadingPermissions = false;
    }
  }

  // 转换权限分类节点为树形结构
  function convertCategoryNodesToTree(
    nodes: PermissionCategoryNode[]
  ): PermissionTreeItem[] {
    const processNode = (node: PermissionCategoryNode): PermissionTreeItem => {
      // 创建分类节点
      const treeItem: PermissionTreeItem = {
        id: `category_${node.category_id}`,
        display_name:
          node.category_name ||
          `分类-${node.category_id?.slice(0, 8) || "unknown"}`,
        type: "category",
        children: []
      };

      // 添加权限项作为子节点
      if (node.permissions && node.permissions.length > 0) {
        const permissionNodes = node.permissions.map(permission => ({
          id: permission.id,
          permission_key: permission.permission_key,
          display_name: permission.display_name,
          type: "permission" as const,
          children: undefined
        }));
        treeItem.children!.push(...permissionNodes);
      }

      // 递归处理子分类
      if (node.children_categories && node.children_categories.length > 0) {
        const childCategories = node.children_categories.map(processNode);
        treeItem.children!.push(...childCategories);
      }

      return treeItem;
    };

    return nodes.map(processNode);
  }

  // 根据权限key获取节点ID
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

  // 获取所有权限节点的ID（用于全选）
  function getAllPermissionNodeIds(tree: PermissionTreeItem[]): string[] {
    const result: string[] = [];

    const traverse = (nodes: PermissionTreeItem[]) => {
      if (!nodes) return;

      for (const node of nodes) {
        if (node.type === "permission") {
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
    const permissionKeys: string[] = [];

    const traverse = (nodes: PermissionTreeItem[]) => {
      if (!nodes) return;

      for (const node of nodes) {
        if (
          node.type === "permission" &&
          node.permission_key &&
          checkedNodeIds.includes(node.id)
        ) {
          permissionKeys.push(node.permission_key);
        }

        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      }
    };

    traverse(tree);
    return permissionKeys;
  }

  // 删除操作
  function handleDelete(row: AdminRole) {
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
