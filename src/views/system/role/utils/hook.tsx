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
  getPermissionGroupOptions,
  getRolePermissionGroups,
  setRolePermissionGroups,
  type AdminRole,
  type CreateAdminRoleRequest,
  type UpdateAdminRoleRequest
} from "@/api/system/roles";

// 类型导入
import type { RoleFormProps, PermissionGroupConfigFormProps } from "./types";
import RoleForm from "../form/index.vue";
import PermissionGroupConfigForm from "../form/permission-group-config.vue";

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
            权限组配置
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

  // 权限组配置对话框
  function openPermissionDialog(row: AdminRole) {
    const formData = reactive<PermissionGroupConfigFormProps>({
      role: row,
      permissionGroupOptions: [],
      checkedPermissionGroupIds: [],
      loadingPermissionGroups: true
    });

    let permissionFormRef: any = null;

    addDialog({
      title: `配置权限组 - ${row.display_name}`,
      props: {
        formData
      },
      width: "1000px",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => {
        return h(PermissionGroupConfigForm, {
          formData,
          ref: (el: any) => {
            permissionFormRef = el;
          },
          "onUpdate:checkedPermissionGroupIds": (value: string[]) => {
            formData.checkedPermissionGroupIds = value;
          }
        });
      },
      beforeSure: (done, { options }) => {
        const curData = options.props
          .formData as PermissionGroupConfigFormProps;

        // 检查是否为超级管理员
        const isSuperAdmin =
          curData.role.role_name === "super_admin" ||
          curData.role.role_name === "超级管理员" ||
          curData.permissionGroupOptions.some(group => group.group_key === "*");

        if (isSuperAdmin) {
          // 对于超级管理员，直接关闭对话框
          message("超级管理员权限配置为只读模式", { type: "info" });
          done();
          return;
        }

        if (!permissionFormRef) {
          message("权限组配置组件未找到", { type: "error" });
          return;
        }

        try {
          // 获取选中的权限组ID
          const selectedPermissionGroupIds =
            permissionFormRef.getCheckedPermissionGroupIds();

          // 检查是否包含全权限组
          const hasAllPermissions = selectedPermissionGroupIds.some(id => {
            const group = curData.permissionGroupOptions.find(g => g.id === id);
            return group && group.group_key === "*";
          });

          if (hasAllPermissions) {
            ElMessageBox.confirm(
              `您正在为角色 "${curData.role.display_name}" 分配全部权限，这将使该角色成为超级管理员。确认继续吗？`,
              "超级管理员权限确认",
              {
                type: "warning",
                confirmButtonText: "确认分配",
                cancelButtonText: "取消",
                showCancelButton: true,
                dangerouslyUseHTMLString: true,
                message: `
                  <div>
                    <p><strong>警告：</strong>此操作将赋予角色系统最高权限！</p>
                    <p>超级管理员将拥有：</p>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                      <li>完整的系统访问权限</li>
                      <li>所有用户和角色管理权限</li>
                      <li>系统配置和维护权限</li>
                    </ul>
                  </div>
                `
              }
            )
              .then(() => {
                savePermissionGroups(curData, selectedPermissionGroupIds, done);
              })
              .catch(() => {
                console.log("用户取消分配超级管理员权限");
              });
          } else {
            // 普通权限组保存确认
            const selectedCount = selectedPermissionGroupIds.length;
            ElMessageBox.confirm(
              `确认为角色 "${curData.role.display_name}" 分配 ${selectedCount} 个权限组吗？`,
              "权限组配置确认",
              {
                type: "warning",
                confirmButtonText: "确认保存",
                cancelButtonText: "取消",
                showCancelButton: true
              }
            )
              .then(() => {
                savePermissionGroups(curData, selectedPermissionGroupIds, done);
              })
              .catch(() => {
                console.log("用户取消保存权限组配置");
              });
          }
        } catch (error) {
          console.error("保存权限组配置失败:", error);
          message("保存权限组配置失败，请稍后重试", { type: "error" });
        }
      }
    });

    // 抽取保存权限组的逻辑
    function savePermissionGroups(
      curData: PermissionGroupConfigFormProps,
      selectedPermissionGroupIds: string[],
      done: Function
    ) {
      setRolePermissionGroups(curData.role.id, {
        permission_group_ids: selectedPermissionGroupIds
      })
        .then(() => {
          const selectedCount = selectedPermissionGroupIds.length;
          message(
            `权限组配置保存成功！已为角色分配 ${selectedCount} 个权限组`,
            { type: "success" }
          );
          done();
        })
        .catch(error => {
          console.error("保存权限组配置失败:", error);
          message("保存权限组配置失败，请稍后重试", { type: "error" });
        });
    }

    // 异步加载权限组数据
    loadPermissionGroupData(formData);
  }

  // 加载权限组数据
  async function loadPermissionGroupData(
    formData: PermissionGroupConfigFormProps
  ) {
    formData.loadingPermissionGroups = true;
    try {
      const [{ data: permissionGroupOptions }, { data: rolePermissionGroups }] =
        await Promise.all([
          getPermissionGroupOptions(),
          getRolePermissionGroups(formData.role.id)
        ]);

      // 验证并设置权限组选项
      formData.permissionGroupOptions = Array.isArray(permissionGroupOptions)
        ? permissionGroupOptions
        : [];

      // 验证并提取权限组ID数组
      let checkedIds: string[] = [];
      console.log("原始角色权限组数据:", rolePermissionGroups);

      if (Array.isArray(rolePermissionGroups)) {
        // 直接是数组
        checkedIds = rolePermissionGroups.map(group => group.id);
      } else if (
        rolePermissionGroups &&
        typeof rolePermissionGroups === "object"
      ) {
        // 如果返回的是单个对象或其他结构，尝试提取
        const groupsData = rolePermissionGroups as any;
        if (
          "permission_groups" in groupsData &&
          Array.isArray(groupsData.permission_groups)
        ) {
          // API返回格式: { permission_groups: [...] }
          checkedIds = groupsData.permission_groups.map(
            (group: any) => group.id
          );
        } else if ("items" in groupsData && Array.isArray(groupsData.items)) {
          // 分页格式: { items: [...] }
          checkedIds = groupsData.items.map((group: any) => group.id);
        } else if ("data" in groupsData && Array.isArray(groupsData.data)) {
          // 通用格式: { data: [...] }
          checkedIds = groupsData.data.map((group: any) => group.id);
        }
      }

      formData.checkedPermissionGroupIds = checkedIds;

      console.log("权限组选项:", formData.permissionGroupOptions);
      console.log("已选中的权限组ID:", formData.checkedPermissionGroupIds);
      console.log("解析后的选中权限组数量:", checkedIds.length);
    } catch (error) {
      console.error("加载权限组数据失败:", error);
      message("加载权限组数据失败，请稍后重试", { type: "error" });
      // 确保即使出错也有默认值
      formData.permissionGroupOptions = [];
      formData.checkedPermissionGroupIds = [];
    } finally {
      formData.loadingPermissionGroups = false;
    }
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
