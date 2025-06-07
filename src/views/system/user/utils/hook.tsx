import { reactive, ref, onMounted, h, computed } from "vue";
import { ElMessage, ElMessageBox, ElSwitch } from "element-plus";
import { formatDateTime } from "@/utils/dateTime";
import { addDialog } from "@/components/ReDialog";

import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  resetAdminUserPassword,
  getUserRoles,
  type AdminUser,
  type CreateAdminUserRequest,
  type UpdateAdminUserRequest
} from "@/api/system/users";
import { assignRolesToUser } from "@/api/system";
import { message } from "@/utils/message";
import { deviceDetection } from "@pureadmin/utils";
import {
  getDepartmentsTreeAll,
  type Department
} from "@/api/system/departments";
import { getAdminRoles, type AdminRole } from "@/api/system/roles";
import UserForm from "../form/index.vue";
import PasswordResetForm from "../form/password.vue";
import AssignRoleForm from "../form/assign-role.vue";

export function useUser() {
  // 搜索表单状态
  const form = reactive({
    status: "",
    search: ""
  });

  // 表单引用已移至各自的对话框函数中

  // 数据列表
  const dataList = ref<AdminUser[]>([]);

  // 加载状态
  const loading = ref(false);

  // 状态切换加载状态
  const switchLoadMap = ref<Record<number, { loading: boolean }>>({});

  // 部门数据
  const departmentOptions = ref<Department[]>([]);

  // 角色数据
  const roleOptions = ref<AdminRole[]>([]);

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
      label: "用户名",
      prop: "username",
      width: 120,
      align: "left"
    },
    {
      label: "邮箱",
      prop: "email",
      width: 200,
      align: "left",
      showOverflowTooltip: true
    },
    {
      label: "姓名",
      prop: "full_name",
      width: 120,
      align: "left",
      showOverflowTooltip: true
    },
    {
      label: "部门",
      prop: "department_name",
      width: 150,
      align: "left",
      showOverflowTooltip: true
    },
    {
      label: "状态",
      prop: "is_active",
      width: 100,
      align: "center",
      cellRenderer: ({ row, props }) => {
        return h(ElSwitch, {
          size: props.size === "small" ? "small" : "default",
          loading: switchLoadMap.value[row.id]?.loading,
          modelValue: row.is_active,
          activeValue: true,
          inactiveValue: false,
          activeText: "启用",
          inactiveText: "禁用",
          inlinePrompt: true,
          onChange: () => handleStatusChange(row)
        });
      }
    },
    {
      label: "多因子认证",
      prop: "mfa_enabled",
      width: 120,
      align: "center",
      cellRenderer: ({ row }) => {
        return h(
          "el-tag",
          {
            type: row.mfa_enabled ? "success" : "info"
          },
          row.mfa_enabled ? "已启用" : "未启用"
        );
      }
    },
    {
      label: "创建时间",
      prop: "created_at",
      width: 180,
      formatter: (row: AdminUser) => formatDateTime(row.created_at)
    },
    {
      label: "更新时间",
      prop: "updated_at",
      width: 180,
      formatter: (row: AdminUser) => formatDateTime(row.updated_at)
    },
    {
      label: "操作",
      prop: "operation",
      width: 280,
      fixed: "right",
      slot: "operation"
    }
  ];

  // 选中的行数据
  const selectedRows = ref<AdminUser[]>([]);

  // 重置搜索表单
  const resetForm = () => {
    form.status = "";
    form.search = "";
    onSearch();
  };

  // 搜索
  const onSearch = async () => {
    try {
      loading.value = true;
      const params: any = {};

      if (form.status !== "") {
        params.is_active = form.status;
      }
      if (form.search) {
        params.search = form.search;
      }

      const { data } = await getAdminUsers(params);
      dataList.value = data.items || [];
    } catch (error) {
      console.error("获取用户列表失败:", error);
      ElMessage.error("获取用户列表失败");
    } finally {
      loading.value = false;
    }
  };

  // 获取部门列表
  const fetchDepartments = async () => {
    try {
      const res = await getDepartmentsTreeAll();
      if (res.data) {
        departmentOptions.value = res.data;
      }
    } catch (error) {
      console.error("获取部门列表失败:", error);
    }
  };

  // 获取角色列表
  const fetchRoles = async () => {
    try {
      const res = await getAdminRoles({ page_size: 1000 }); // 获取所有角色
      if (res.data?.items) {
        roleOptions.value = res.data.items;
      }
    } catch (error) {
      console.error("获取角色列表失败:", error);
    }
  };

  // 选择变化
  const handleSelectionChange = (selection: AdminUser[]) => {
    selectedRows.value = selection;
  };

  // 是否有选中行
  const hasSelection = computed(() => selectedRows.value.length > 0);

  // 状态切换
  const handleStatusChange = async (row: AdminUser) => {
    if (!switchLoadMap.value[row.id]) {
      switchLoadMap.value[row.id] = { loading: false };
    }

    switchLoadMap.value[row.id].loading = true;

    try {
      const params: UpdateAdminUserRequest = {
        email: row.email,
        full_name: row.full_name || "",
        is_active: row.is_active,
        mfa_enabled: row.mfa_enabled,
        department_id: row.department_id
      };

      await updateAdminUser(String(row.id), params);
      ElMessage.success(`${row.is_active ? "启用" : "禁用"}用户成功`);
    } catch (error) {
      // 恢复原状态
      row.is_active = !row.is_active;
      console.error("更新用户状态失败:", error);
      ElMessage.error("更新用户状态失败");
    } finally {
      switchLoadMap.value[row.id].loading = false;
    }
  };

  // 格式化部门选项
  const formatDepartmentOptions = (departments: Department[]): any[] => {
    return departments.map(dept => ({
      value: dept.id,
      label: dept.name,
      children:
        dept.children && dept.children.length > 0
          ? formatDepartmentOptions(dept.children)
          : undefined
    }));
  };

  // 打开对话框
  const openDialog = (title = "新增用户", row?: AdminUser) => {
    const userFormRef = ref();
    const departmentCascaderOptions = [
      {
        value: null,
        label: "无部门"
      },
      ...formatDepartmentOptions(departmentOptions.value)
    ];

    const formData = {
      departmentOptions: departmentCascaderOptions,
      id: row?.id ?? undefined,
      username: row?.username ?? "",
      email: row?.email ?? "",
      full_name: row?.full_name ?? "",
      password: "",
      department_id: row?.department_id ?? null,
      is_active: row?.is_active ?? true,
      mfa_enabled: row?.mfa_enabled ?? false
    };

    addDialog({
      title,
      props: {
        formInline: formData
      },
      width: "600px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(UserForm, {
          ref: userFormRef,
          formInline: null
        }),
      beforeSure: (done, { options: _options }) => {
        const formInstance = userFormRef.value?.getRef();
        if (!formInstance) {
          ElMessage.error("表单引用获取失败");
          return;
        }

        formInstance.validate(async (valid: boolean) => {
          if (valid) {
            try {
              const curData = userFormRef.value?.getFormData();
              if (!curData) {
                ElMessage.error("获取表单数据失败");
                return;
              }

              if (row) {
                // 编辑用户
                const params: UpdateAdminUserRequest = {
                  email: curData.email,
                  full_name: curData.full_name || null,
                  is_active: curData.is_active,
                  mfa_enabled: curData.mfa_enabled,
                  department_id: curData.department_id || null
                };
                await updateAdminUser(String(row.id), params);
                ElMessage.success("更新用户成功");
              } else {
                // 创建用户
                const params: CreateAdminUserRequest = {
                  username: curData.username,
                  email: curData.email,
                  password: curData.password,
                  full_name: curData.full_name || null,
                  is_active: curData.is_active,
                  mfa_enabled: curData.mfa_enabled,
                  department_id: curData.department_id || null
                };
                await createAdminUser(params);
                ElMessage.success("创建用户成功");
              }

              done();
              onSearch();
            } catch (error) {
              console.error("操作失败:", error);
              ElMessage.error(row ? "更新用户失败" : "创建用户失败");
            }
          }
        });
      }
    });
  };

  // 打开重置密码对话框
  const openPasswordDialog = (row: AdminUser) => {
    const passwordFormRef = ref();
    const formData = {
      password: "",
      confirmPassword: ""
    };

    addDialog({
      title: `重置用户 ${row.username} 的密码`,
      props: {
        formInline: formData
      },
      width: "400px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(PasswordResetForm, {
          ref: passwordFormRef,
          formInline: null
        }),
      beforeSure: (done, { options: _options }) => {
        const formInstance = passwordFormRef.value?.getRef();
        if (!formInstance) {
          ElMessage.error("表单引用获取失败");
          return;
        }

        formInstance.validate(async (valid: boolean) => {
          if (valid) {
            try {
              const curData = passwordFormRef.value?.getFormData();
              if (!curData) {
                ElMessage.error("获取表单数据失败");
                return;
              }
              await resetAdminUserPassword(String(row.id), curData.password);
              ElMessage.success("重置密码成功");
              done();
            } catch (error) {
              console.error("重置密码失败:", error);
              ElMessage.error("重置密码失败");
            }
          }
        });
      }
    });
  };

  // 获取用户已分配的角色
  const fetchUserRoles = async (userId: string) => {
    try {
      const response = await getUserRoles(userId);
      return response.data?.roles ?? [];
    } catch (error) {
      console.error("获取用户角色失败:", error);
      return [];
    }
  };

  // 打开分配角色对话框
  const openAssignRoleDialog = async (row: AdminUser) => {
    // 获取用户已分配的角色ID列表
    const assignedRoleIds = await fetchUserRoles(row.id);
    const assignRoleFormRef = ref();

    addDialog({
      title: `分配 ${row.username} 用户的角色`,
      props: {
        username: row?.username ?? "",
        full_name: row?.full_name ?? "",
        roleOptions: roleOptions.value ?? [],
        roleIds: assignedRoleIds,
        loadingRoles: false
      },
      width: "400px",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(AssignRoleForm, {
          ref: assignRoleFormRef,
          username: row?.username ?? "",
          full_name: row?.full_name ?? "",
          roleOptions: roleOptions.value ?? [],
          roleIds: assignedRoleIds,
          loadingRoles: false
        }),
      beforeSure: (done, { options: _options }) => {
        const formInstance = assignRoleFormRef.value;
        const formRef = formInstance?.getRef();

        if (!formRef) {
          message("获取表单引用失败", { type: "error" });
          return;
        }

        // 使用Element Plus的表单验证，验证规则已在assignRoleRules中定义
        formRef.validate((valid: boolean) => {
          if (valid) {
            // 验证通过，执行提交逻辑
            const curData = formInstance?.getFormData();
            console.log("选中的角色IDs", curData?.roleIds);

            if (!curData) {
              message("获取表单数据失败", { type: "error" });
              return;
            }

            // 调用角色分配接口
            // 将角色ID转换为角色名称
            const roleNames = curData.roleIds.map(roleId => {
              const role = curData.roleOptions.find(r => r.id === roleId);
              return role ? role.role_name : roleId.toString();
            });

            assignRolesToUser(row.id, {
              role_names: roleNames
            })
              .then(() => {
                message("角色分配成功", { type: "success" });
                done(); // 关闭弹框
                onSearch(); // 刷新表格数据
              })
              .catch(error => {
                console.error("角色分配失败:", error);
                message(`角色分配失败: ${error.message || "未知错误"}`, {
                  type: "error"
                });
              });
          }
          // 验证失败时，Element Plus会自动显示错误信息，不需要手动处理
        });
      }
    });
  };

  // 删除用户
  const handleDelete = async (row: AdminUser) => {
    try {
      await deleteAdminUser(String(row.id));
      ElMessage.success("删除用户成功");
      onSearch();
    } catch (error) {
      console.error("删除用户失败:", error);
      ElMessage.error("删除用户失败");
    }
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRows.value.length === 0) {
      ElMessage.warning("请选择要删除的用户");
      return;
    }

    ElMessageBox.confirm(
      `确认删除选中的 ${selectedRows.value.length} 个用户吗？`,
      "批量删除确认",
      {
        type: "warning"
      }
    ).then(async () => {
      try {
        const deletePromises = selectedRows.value.map(row =>
          deleteAdminUser(String(row.id))
        );
        await Promise.all(deletePromises);
        ElMessage.success("批量删除成功");
        onSearch();
      } catch (error) {
        console.error("批量删除失败:", error);
        ElMessage.error("批量删除失败");
      }
    });
  };

  // 初始化
  onMounted(() => {
    onSearch();
    fetchDepartments();
    fetchRoles();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    selectedRows,
    switchLoadMap,
    hasSelection,
    handleSelectionChange,
    resetForm,
    onSearch,
    openDialog,
    openPasswordDialog,
    openAssignRoleDialog,
    handleDelete,
    handleBatchDelete
  };
}
