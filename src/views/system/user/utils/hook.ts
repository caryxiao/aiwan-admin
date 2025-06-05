import { ref, reactive, onMounted, computed, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { formatDateTime } from "@/utils/dateTime";
import { useTable } from "@/composables/useTable";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  resetAdminUserPassword,
  assignRolesToUser,
  type AdminUser,
  type CreateAdminUserRequest,
  type UpdateAdminUserRequest
} from "@/api/system/users";
import {
  getDepartmentsTreeAll,
  type Department
} from "@/api/system/departments";
import type { FormItemProps } from "./types";
import { formRules as getFormRules, passwordRules } from "./rule";

export function useUser() {
  // 搜索表单
  const searchForm = reactive({
    status: ""
  });

  // 密码表单
  const passwordForm = reactive({
    password: "",
    confirmPassword: ""
  });

  // 表单验证规则
  const formRules = computed(() => getFormRules(passwordForm, isEdit.value));

  // 使用 useTable 组合式函数
  const {
    loading,
    tableData,
    pagination,
    selectedRows: selectedUsers,
    searchValue,
    fetchData,
    handleSearch,
    handleResetSearch,
    handlePageChange,
    handlePageSizeChange,
    handleSelectionChange
  } = useTable<AdminUser>({
    fetchApi: getAdminUsers,
    tableConfig: {
      columns: [],
      showSelection: true,
      showIndex: true,
      stripe: true,
      border: true
    },
    searchConfig: {
      placeholder: "请输入用户名或邮箱",
      searchKey: "search"
    },
    transformData: data => data,
    onSuccess: (action, data) => {
      console.log(`${action} 操作成功:`, data);
    },
    onError: (action, error) => {
      console.error(`${action} 操作失败:`, error);
    }
  });

  // 状态切换加载状态
  const switchLoadMap = ref<Record<number, { loading: boolean }>>({});

  // 部门数据
  const departmentOptions = ref<Array<{ id: string; name: string }>>([]);
  const loadingDepartments = ref(false);

  // 获取部门列表
  const fetchDepartments = async () => {
    loadingDepartments.value = true;
    try {
      const res = await getDepartmentsTreeAll();
      console.log("部门API响应:", res);
      if (res.data) {
        // res.data 就是 Department[] 类型的数据
        departmentOptions.value = res.data;
        console.log("部门选项:", departmentOptions.value);
      }
    } catch (error) {
      console.error("获取部门列表失败:", error);
    } finally {
      loadingDepartments.value = false;
    }
  };

  // 将部门树扁平化为选项列表
  // flattenDepartmentTree 函数不再需要，因为我们将使用级联选择器
  // const flattenDepartmentTree = (
  //   departments: Department[]
  // ): Array<{ id: string; name: string }> => {
  //   const result: Array<{ id: string; name: string }> = [];
  //   const traverse = (items: Department[], prefix = "") => {
  //     items.forEach(item => {
  //       result.push({
  //         id: item.id,
  //         name: prefix + item.name
  //       });
  //       if (item.children && item.children.length > 0) {
  //         traverse(item.children, prefix + item.name + " / ");
  //       }
  //     });
  //   };
  //   traverse(departments);
  //   return result;
  // };

  // 注释掉这个onMounted，将fetchDepartments合并到下面的onMounted中
  // onMounted(() => {
  //   fetchDepartments();
  // });

  // 对话框相关
  const dialogVisible = ref(false);
  const dialogTitle = ref("新增用户");
  const isEdit = ref(false);
  const submitLoading = ref(false);
  const formRef = ref();
  const formData = reactive<FormItemProps>({
    title: "",
    username: "",
    email: "",
    full_name: "",
    password: "",
    department_id: null,
    department_name: null,
    is_active: true,
    mfa_enabled: false
  });

  // 密码重置相关
  const passwordDialogVisible = ref(false);
  const passwordSubmitLoading = ref(false);
  const passwordFormRef = ref();
  const currentPasswordUser = ref<AdminUser | null>(null);
  const assignRoleDialogVisible = ref(false);
  const currentAssignUser = ref<AdminUser | null>(null);

  // 刷新表格数据
  const refresh = () => {
    fetchData();
  };

  // 重置搜索
  const resetSearch = () => {
    handleResetSearch();
  };

  // 是否有选中行
  const hasSelection = computed(() => selectedUsers.value.length > 0);

  // 打开创建用户对话框
  const openCreateDialog = () => {
    dialogTitle.value = "新增用户";
    isEdit.value = false;

    // 先关闭对话框确保状态重置
    dialogVisible.value = false;

    // 完全重置表单数据，确保清除所有可能的编辑字段
    Object.keys(formData).forEach(key => {
      delete formData[key];
    });

    Object.assign(formData, {
      title: "新增用户",
      username: "",
      email: "",
      full_name: "",
      password: "",
      department_id: null,
      department_name: null,
      is_active: true,
      mfa_enabled: false
    });

    console.log("新增用户表单数据:", formData);

    // 在下一个tick中打开对话框，确保数据已重置
    nextTick(() => {
      dialogVisible.value = true;
      // 清除表单验证状态
      nextTick(() => {
        if (formRef.value && formRef.value.formRef) {
          formRef.value.formRef.clearValidate();
        }
      });
    });
  };

  // 打开编辑用户对话框
  const openEditDialog = (row: AdminUser) => {
    dialogTitle.value = "编辑用户";
    isEdit.value = true;

    // 确保对话框先关闭
    dialogVisible.value = false;

    // 直接设置编辑数据，不需要先重置
    Object.assign(formData, {
      id: row.id,
      title: "编辑用户",
      username: row.username,
      email: row.email,
      full_name: row.full_name || "",
      department_id: row.department_id || null,
      department_name: row.department_name,
      is_active: row.is_active,
      mfa_enabled: row.mfa_enabled
    });

    // 在下一个tick中打开对话框
    nextTick(() => {
      dialogVisible.value = true;
      // 清除可能存在的验证错误
      nextTick(() => {
        if (formRef.value && formRef.value.formRef) {
          formRef.value.formRef.clearValidate();
        }
      });
    });
  };

  // 关闭对话框
  const closeDialog = () => {
    dialogVisible.value = false;

    // 立即重置 formData，避免数据残留
    Object.assign(formData, {
      title: "",
      username: "",
      email: "",
      full_name: "",
      password: "",
      department_id: null,
      department_name: null,
      is_active: true,
      mfa_enabled: false
    });

    // 延迟重置表单，避免闪烁
    setTimeout(() => {
      if (formRef.value) {
        formRef.value.resetFields();
      }
    }, 300);
  };

  // 提交表单
  const handleSubmit = async (formValues: FormItemProps) => {
    submitLoading.value = true;
    try {
      console.log("准备提交的表单数据:", formValues);

      // 检查必填字段
      if (
        !isEdit.value &&
        (!formValues.username || !formValues.email || !formValues.password)
      ) {
        ElMessage.error("请填写所有必填字段");
        submitLoading.value = false;
        return;
      }

      if (isEdit.value && !formValues.email) {
        ElMessage.error("邮箱是必填字段");
        submitLoading.value = false;
        return;
      }

      // 确保空字符串被处理为空字符串而不是undefined
      const processedFullName =
        formValues.full_name === undefined ? "" : formValues.full_name;

      if (isEdit.value) {
        // 编辑用户
        const params: UpdateAdminUserRequest = {
          email: formValues.email,
          full_name: processedFullName,
          is_active: formValues.is_active,
          mfa_enabled: formValues.mfa_enabled,
          department_id: formValues.department_id
        };
        console.log("编辑用户参数:", params);
        await updateAdminUser(String(formValues.id), params);
        ElMessage.success("更新用户成功");
      } else {
        // 创建用户
        const params: CreateAdminUserRequest = {
          username: formValues.username,
          email: formValues.email,
          password: formValues.password as string,
          full_name: processedFullName,
          is_active: formValues.is_active,
          mfa_enabled: formValues.mfa_enabled,
          department_id: formValues.department_id
        };
        console.log("创建用户参数:", params);
        await createAdminUser(params);
        ElMessage.success("创建用户成功");
      }
      // 关闭对话框并刷新数据
      dialogVisible.value = false;
      refresh();
    } catch (error: any) {
      console.error("提交表单失败:", error);
      ElMessage.error(error.message || "操作失败，请重试");
    } finally {
      submitLoading.value = false;
    }
  };

  // 处理用户状态变更
  const handleStatusChange = async (row: AdminUser, index: number) => {
    // 设置当前行的加载状态
    switchLoadMap.value[index] = { loading: true };

    try {
      await updateAdminUser(row.id, {
        is_active: row.is_active
      });
      ElMessage.success(`${row.is_active ? "启用" : "禁用"}用户成功`);
    } catch (error: any) {
      console.error("更新用户状态失败:", error);
      ElMessage.error(error.message || "操作失败，请重试");
      // 恢复状态
      row.is_active = !row.is_active;
    } finally {
      // 清除加载状态
      switchLoadMap.value[index] = { loading: false };
    }
  };

  // 打开重置密码对话框
  const handleResetPassword = (row: AdminUser) => {
    currentPasswordUser.value = row;
    // 重置密码表单
    Object.assign(passwordForm, {
      password: "",
      confirmPassword: ""
    });
    passwordDialogVisible.value = true;
  };

  // 提交密码重置
  const handlePasswordSubmit = async (formData?: {
    password: string;
    confirmPassword: string;
  }) => {
    console.log("--- Entering handlePasswordSubmit ---");
    // 使用传入的表单数据或本地的passwordForm
    const passwordToUse = formData?.password || passwordForm.password;
    console.log("passwordForm.password:", passwordForm.password);
    console.log("formData?.password:", formData?.password);
    console.log("将使用的密码:", passwordToUse);

    if (!passwordFormRef.value) {
      console.log("passwordFormRef.value is null or undefined");
      ElMessage.error("表单引用未准备好");
      return;
    }

    try {
      console.log("Attempting to validate form...");
      // 访问组件实例中暴露的 passwordFormRef
      await passwordFormRef.value.passwordFormRef.validate();
      console.log("Form validation successful.");

      passwordSubmitLoading.value = true;
      try {
        if (!currentPasswordUser.value) {
          ElMessage.error("未选择用户");
          return;
        }
        await resetAdminUserPassword(
          String(currentPasswordUser.value.id),
          passwordToUse
        );
        ElMessage.success("重置密码成功");
        passwordDialogVisible.value = false;
        fetchData();
      } catch (error) {
        console.error("重置密码失败:", error);
        ElMessage.error("重置密码失败");
      } finally {
        passwordSubmitLoading.value = false;
      }
    } catch (error) {
      console.error("表单验证失败或异常:", error);
      ElMessage.error("请检查输入或表单验证异常");
    }
  };

  // 处理删除用户
  const handleDelete = (row: AdminUser) => {
    ElMessageBox.confirm(`确定要删除用户 ${row.username} 吗？`, "删除确认", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        try {
          await deleteAdminUser(row.id);
          ElMessage.success("删除用户成功");
          refresh();
        } catch (error: any) {
          console.error("删除用户失败:", error);
          ElMessage.error(error.message || "操作失败，请重试");
        }
      })
      .catch(() => {
        // 取消删除
      });
  };

  // 批量删除用户
  const handleBatchDelete = () => {
    if (selectedUsers.value.length === 0) {
      ElMessage.warning("请选择要删除的用户");
      return;
    }

    ElMessageBox.confirm(
      `确定要删除选中的 ${selectedUsers.value.length} 个用户吗？`,
      "批量删除确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    )
      .then(async () => {
        try {
          // 批量删除
          const promises = selectedUsers.value.map(user =>
            deleteAdminUser(user.id)
          );
          await Promise.all(promises);
          ElMessage.success("批量删除成功");
          refresh();
        } catch (error: any) {
          console.error("批量删除失败:", error);
          ElMessage.error(error.message || "操作失败，请重试");
        }
      })
      .catch(() => {
        // 取消删除
      });
  };

  // 导出用户数据
  const handleExport = () => {
    ElMessage.info("导出功能开发中");
  };

  // 处理分配角色
  const handleAssignRoles = (row: AdminUser) => {
    currentAssignUser.value = row;
    assignRoleDialogVisible.value = true;
  };

  // 处理分配角色提交
  const handleAssignRolesSubmit = async () => {
    // AssignRoleForm组件内部已经处理了API调用和成功提示
    // 这里只需要关闭对话框和刷新数据
    assignRoleDialogVisible.value = false;
    refresh();
  };

  // 初始化
  onMounted(() => {
    refresh();
    fetchDepartments(); // 确保部门数据在组件挂载时加载
  });

  return {
    // 响应式数据
    searchForm,
    loading,
    tableData,
    pagination,
    selectedUsers,
    searchValue,
    switchLoadMap,
    dialogVisible,
    dialogTitle,
    isEdit,
    submitLoading,
    formRef,
    formData,
    passwordDialogVisible,
    passwordSubmitLoading,
    passwordFormRef,
    passwordForm,
    currentPasswordUser,
    departmentOptions,
    assignRoleDialogVisible,
    currentAssignUser,
    handleAssignRoles,
    handleAssignRolesSubmit,
    loadingDepartments,

    // 验证规则
    formRules,
    passwordRules,

    // 计算属性
    hasSelection,
    isEditing: isEdit,

    // 方法
    fetchData,
    formatDateTime,
    refresh,
    handleSearch,
    handleResetSearch: resetSearch,
    handlePageChange,
    handlePageSizeChange,
    handleSelectionChange,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    handleSubmit,
    handleStatusChange,
    handleResetPassword,
    handlePasswordSubmit,
    handleDelete,
    handleBatchDelete,
    handleExport
  };
}
