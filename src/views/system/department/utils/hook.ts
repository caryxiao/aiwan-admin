import { ref, reactive, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { formatDateTime } from "@/utils/dateTime";
import {
  getDepartmentsTreeAll,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  batchDeleteDepartments,
  type Department,
  type CreateDepartmentRequest,
  type UpdateDepartmentRequest
} from "@/api/system/departments";

export function useDepartment() {
  // 加载状态
  const loading = ref(false);
  const submitLoading = ref(false);

  // 表格数据
  const tableData = ref<Department[]>([]);
  const selectedRows = ref<Department[]>([]);

  // 搜索相关
  const searchValue = ref("");
  const searchForm = reactive({
    search: ""
  });

  // 分页配置（树状表格不需要分页，但保留以兼容组件）
  const pagination = reactive({
    page: 1,
    pageSize: 20,
    total: 0
  });

  // 对话框相关
  const dialogVisible = ref(false);
  const dialogTitle = ref("新增部门");
  const isEdit = ref(false);
  const currentRow = ref<Department | null>(null);

  // 表单数据
  const formData = reactive({
    name: "",
    code: "",
    parent_id: null as string | null,
    description: "",
    sort_order: 0,
    status: true
  });

  // 计算属性
  const hasSelection = computed(() => selectedRows.value.length > 0);

  // 级联选择器的部门选项列表（排除当前编辑项的子级，避免循环引用）
  const departmentOptions = computed(() => {
    if (!Array.isArray(tableData.value)) {
      return [];
    }

    // 将树状数据转换为级联选择器格式
    const convertToOptions = (
      data: Department[],
      excludeIds: string[] = []
    ): any[] => {
      const filteredData = data.filter(item => !excludeIds.includes(item.id));

      return filteredData.map(item => {
        const option: any = {
          value: item.id,
          label: item.name
        };

        // 如果有子级，递归处理
        if (item.children && item.children.length > 0) {
          option.children = convertToOptions(item.children, excludeIds);
        }

        return option;
      });
    };

    // 获取当前项的所有子级ID（仅在编辑模式下需要）
    const getChildrenIds = (parentId: string, data: Department[]): string[] => {
      const children = data.filter(item => item.parent_id === parentId);
      const childrenIds = children.map(child => child.id);
      children.forEach(child => {
        childrenIds.push(...getChildrenIds(child.id, data));
      });
      return childrenIds;
    };

    // 确定需要排除的ID列表
    let excludeIds: string[] = [];
    if (isEdit.value && currentRow.value) {
      excludeIds = [
        currentRow.value.id,
        ...getChildrenIds(currentRow.value.id, tableData.value)
      ];
    }

    // 统一使用convertToOptions函数，确保数据格式一致
    const result = convertToOptions(tableData.value, excludeIds);

    // 添加一个顶级选项，表示无父级
    return [
      {
        value: null,
        label: "无上级部门（顶级部门）"
      },
      ...result
    ];
  });

  // 获取数据
  const fetchData = async () => {
    try {
      loading.value = true;
      const params = {
        q: searchForm.search || undefined
      };

      const response = await getDepartmentsTreeAll(params);

      if (response.success) {
        // tree接口返回的是树状结构数据，不需要分页
        tableData.value = response.data || [];
        pagination.total = response.data?.length || 0;
      } else {
        ElMessage.error(response.message || "获取部门列表失败");
      }
    } catch (error) {
      console.error("获取部门列表失败:", error);
      ElMessage.error("获取部门列表失败");
    } finally {
      loading.value = false;
    }
  };

  // 搜索
  const handleSearch = (searchText?: string) => {
    if (searchText !== undefined) {
      searchForm.search = searchText;
      searchValue.value = searchText;
    }
    fetchData();
  };

  // 重置搜索
  const handleResetSearch = () => {
    searchForm.search = "";
    searchValue.value = "";
    fetchData();
  };

  // 树状表格不需要分页，保留这些函数以避免组件报错
  const handlePageChange = (_page: number) => {
    // 树状表格不需要分页
  };

  const handlePageSizeChange = (_size: number) => {
    // 树状表格不需要分页
  };

  // 选择变化
  const handleSelectionChange = (selection: Department[]) => {
    selectedRows.value = selection;
  };

  // 刷新
  const refresh = () => {
    fetchData();
  };

  // 重置表单
  const resetForm = () => {
    formData.name = "";
    formData.code = "";
    formData.parent_id = null;
    formData.description = "";
    formData.sort_order = 0;
    formData.status = true;
  };

  // 打开新增对话框
  const openCreateDialog = () => {
    resetForm();
    dialogTitle.value = "新增部门";
    isEdit.value = false;
    currentRow.value = null;
    dialogVisible.value = true;
  };

  // 打开编辑对话框
  const openEditDialog = (row: Department) => {
    formData.name = row.name;
    formData.code = row.code;
    formData.parent_id = row.parent_id;
    formData.description = row.description || "";
    formData.sort_order = row.sort_order;
    formData.status = row.status;

    dialogTitle.value = "编辑部门";
    isEdit.value = true;
    currentRow.value = row;
    dialogVisible.value = true;
  };

  // 关闭对话框
  const closeDialog = () => {
    dialogVisible.value = false;
    // 重置编辑状态
    setTimeout(() => {
      isEdit.value = false;
      currentRow.value = null;
      resetForm();
    }, 300);
  };

  // 提交表单
  const handleSubmit = async (submitFormData: any) => {
    try {
      submitLoading.value = true;

      const requestData: CreateDepartmentRequest | UpdateDepartmentRequest = {
        name: submitFormData.name,
        code: submitFormData.code,
        parent_id: submitFormData.parent_id,
        description: submitFormData.description,
        sort_order: submitFormData.sort_order,
        status: submitFormData.status
      };

      let response;
      if (isEdit.value && currentRow.value) {
        response = await updateDepartment(currentRow.value.id, requestData);
      } else {
        response = await createDepartment(
          requestData as CreateDepartmentRequest
        );
      }

      if (response.success) {
        ElMessage.success(isEdit.value ? "部门更新成功" : "部门创建成功");
        closeDialog();
        fetchData();
      } else {
        ElMessage.error(
          response.message || (isEdit.value ? "部门更新失败" : "部门创建失败")
        );
      }
    } catch (error) {
      console.error("提交部门数据失败:", error);
      ElMessage.error(isEdit.value ? "部门更新失败" : "部门创建失败");
    } finally {
      submitLoading.value = false;
    }
  };

  // 删除部门
  const handleDelete = async (row: Department) => {
    try {
      await ElMessageBox.confirm(
        `确定要删除部门 "${row.name}" 吗？此操作不可恢复。`,
        "删除确认",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );

      const response = await deleteDepartment(row.id);
      if (response.success) {
        ElMessage.success("部门删除成功");
        fetchData();
      } else {
        ElMessage.error(response.message || "部门删除失败");
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("删除部门失败:", error);
        ElMessage.error("部门删除失败");
      }
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRows.value.length === 0) {
      ElMessage.warning("请选择要删除的部门");
      return;
    }

    try {
      await ElMessageBox.confirm(
        `确定要删除选中的 ${selectedRows.value.length} 个部门吗？此操作不可恢复。`,
        "批量删除确认",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );

      const ids = selectedRows.value.map(row => row.id);
      const response = await batchDeleteDepartments(ids);

      if (response.success) {
        ElMessage.success("批量删除成功");
        selectedRows.value = [];
        fetchData();
      } else {
        ElMessage.error(response.message || "批量删除失败");
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("批量删除部门失败:", error);
        ElMessage.error("批量删除失败");
      }
    }
  };

  return {
    // 状态
    loading,
    submitLoading,
    tableData,
    selectedRows,
    searchValue,
    pagination,
    dialogVisible,
    dialogTitle,
    isEdit,
    formData,
    currentRow,

    // 计算属性
    hasSelection,
    departmentOptions,

    // 工具函数
    formatDateTime,

    // 方法
    fetchData,
    handleSearch,
    handleResetSearch,
    handlePageChange,
    handlePageSizeChange,
    handleSelectionChange,
    refresh,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    handleSubmit,
    handleDelete,
    handleBatchDelete
  };
}
