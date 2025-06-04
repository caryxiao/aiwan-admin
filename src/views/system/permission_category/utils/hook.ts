import { ref, reactive, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { formatDateTime } from "@/utils/dateTime";
// import { handleTree } from "@/utils/tree"; // 暂时注释掉未使用的导入
import {
  getPermissionCategoriesTree,
  createPermissionCategory,
  updatePermissionCategory,
  deletePermissionCategory,
  type PermissionCategory,
  type CreatePermissionCategoryRequest,
  type UpdatePermissionCategoryRequest
} from "@/api/system/permissions";

// 构建树形结构并排除指定的节点（暂时注释掉未使用的函数）
// const buildTree = (
//   data: PermissionCategory[],
//   excludeIds: string[] = []
// ): PermissionCategory[] => {
//   if (!Array.isArray(data)) {
//     return [];
//   }

//   // 过滤掉需要排除的节点
//   const filteredData = data.filter(item => !excludeIds.includes(item.id));

//   // 递归过滤子节点
//   const filterChildren = (
//     items: PermissionCategory[]
//   ): PermissionCategory[] => {
//     return items
//       .filter(item => !excludeIds.includes(item.id))
//       .map(item => ({
//         ...item,
//         children: item.children ? filterChildren(item.children) : []
//       }));
//   };

//   return filterChildren(filteredData);
// };

export function usePermissionCategory() {
  // 加载状态
  const loading = ref(false);
  const submitLoading = ref(false);

  // 表格数据
  const tableData = ref<PermissionCategory[]>([]);
  const selectedRows = ref<PermissionCategory[]>([]);

  // 搜索相关
  const searchValue = ref("");
  const searchForm = reactive({
    search: ""
  });

  // 分页配置
  const pagination = reactive({
    page: 1,
    pageSize: 20,
    total: 0
  });

  // 对话框相关
  const dialogVisible = ref(false);
  const dialogTitle = ref("新增分类");
  const isEdit = ref(false);
  const currentRow = ref<PermissionCategory | null>(null);

  // 表单数据
  const formData = reactive({
    category_key: "",
    display_name: "",
    description: "",
    parent_id: null as string | null,
    sort_order: 0
  });

  // 计算属性
  const hasSelection = computed(() => selectedRows.value.length > 0);

  // 级联选择器的分类选项列表（排除当前编辑项的子级，避免循环引用）
  const categoryOptions = computed(() => {
    if (!Array.isArray(tableData.value)) {
      return [];
    }

    // 将树状数据转换为级联选择器格式
    const convertToOptions = (
      data: PermissionCategory[],
      excludeIds: string[] = []
    ): any[] => {
      const filteredData = data.filter(item => !excludeIds.includes(item.id));

      return filteredData.map(item => {
        const option: any = {
          value: item.id,
          label: item.display_name
        };

        // 如果有子级，递归处理
        if (item.children && item.children.length > 0) {
          option.children = convertToOptions(item.children, excludeIds);
        }

        return option;
      });
    };

    // 获取当前项的所有子级ID（仅在编辑模式下需要）
    const getChildrenIds = (
      parentId: string,
      data: PermissionCategory[]
    ): string[] => {
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
        label: "无父级（顶级分类）"
      },
      ...result
    ];
  });

  // 获取数据
  const fetchData = async () => {
    try {
      loading.value = true;
      const params = {
        search: searchForm.search || undefined
      };

      const response = await getPermissionCategoriesTree(params);

      if (response.success) {
        // tree接口返回的是树状结构数据，不需要分页
        tableData.value = response.data?.items || [];
        pagination.total = response.data?.total || 0;
      } else {
        ElMessage.error(response.message || "获取权限分类列表失败");
      }
    } catch (error) {
      console.error("获取权限分类列表失败:", error);
      ElMessage.error("获取权限分类列表失败");
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
  const handleSelectionChange = (selection: PermissionCategory[]) => {
    selectedRows.value = selection;
  };

  // 刷新
  const refresh = () => {
    fetchData();
  };

  // 初始化表单数据
  const initFormData = () => {
    Object.assign(formData, {
      category_key: "",
      display_name: "",
      description: "",
      parent_id: null,
      sort_order: 0
    });
  };

  // 打开新增对话框
  const openCreateDialog = () => {
    initFormData();
    dialogTitle.value = "新增分类";
    isEdit.value = false;
    currentRow.value = null;
    dialogVisible.value = true;
  };

  // 打开编辑对话框
  const openEditDialog = (row: PermissionCategory) => {
    Object.assign(formData, {
      category_key: row.category_key,
      display_name: row.display_name,
      description: row.description || "",
      parent_id: row.parent_id,
      sort_order: row.sort_order
    });
    dialogTitle.value = "编辑分类";
    isEdit.value = true;
    currentRow.value = row;
    dialogVisible.value = true;
  };

  // 关闭对话框
  const closeDialog = () => {
    dialogVisible.value = false;
    initFormData();
    currentRow.value = null;
    isEdit.value = false;
  };

  // 提交表单
  const handleSubmit = async (data: typeof formData) => {
    try {
      submitLoading.value = true;

      if (isEdit.value && currentRow.value) {
        // 更新
        const updateData: UpdatePermissionCategoryRequest = {
          category_key: data.category_key,
          display_name: data.display_name,
          description: data.description,
          parent_id: data.parent_id,
          sort_order: data.sort_order
        };

        const response = await updatePermissionCategory(
          currentRow.value.id,
          updateData
        );

        if (response.success) {
          ElMessage.success("更新分类成功");
          closeDialog();
          fetchData();
        } else {
          ElMessage.error(response.message || "更新分类失败");
        }
      } else {
        // 创建
        const createData: CreatePermissionCategoryRequest = {
          category_key: data.category_key,
          display_name: data.display_name,
          description: data.description,
          parent_id: data.parent_id,
          sort_order: data.sort_order
        };

        const response = await createPermissionCategory(createData);

        if (response.success) {
          ElMessage.success("创建分类成功");
          closeDialog();
          fetchData();
        } else {
          ElMessage.error(response.message || "创建分类失败");
        }
      }
    } catch (error) {
      console.error("提交表单失败:", error);
      ElMessage.error(isEdit.value ? "更新分类失败" : "创建分类失败");
    } finally {
      submitLoading.value = false;
    }
  };

  // 删除单个
  const handleDelete = async (row: PermissionCategory) => {
    try {
      await ElMessageBox.confirm(
        `确定要删除分类 "${row.display_name}" 吗？`,
        "删除确认",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );

      const response = await deletePermissionCategory(row.id);

      if (response.success) {
        ElMessage.success("删除分类成功");
        fetchData();
      } else {
        ElMessage.error(response.message || "删除分类失败");
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("删除分类失败:", error);
        ElMessage.error("删除分类失败");
      }
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRows.value.length === 0) {
      ElMessage.warning("请选择要删除的分类");
      return;
    }

    try {
      await ElMessageBox.confirm(
        `确定要删除选中的 ${selectedRows.value.length} 个分类吗？`,
        "批量删除确认",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );

      const deletePromises = selectedRows.value.map(row =>
        deletePermissionCategory(row.id)
      );

      const results = await Promise.allSettled(deletePromises);

      const successCount = results.filter(
        result => result.status === "fulfilled" && result.value.success
      ).length;

      if (successCount === selectedRows.value.length) {
        ElMessage.success(`成功删除 ${successCount} 个分类`);
      } else {
        ElMessage.warning(
          `删除了 ${successCount}/${selectedRows.value.length} 个分类`
        );
      }

      selectedRows.value = [];
      fetchData();
    } catch (error) {
      if (error !== "cancel") {
        console.error("批量删除分类失败:", error);
        ElMessage.error("批量删除分类失败");
      }
    }
  };

  return {
    // 响应式数据
    loading,
    submitLoading,
    tableData,
    selectedRows,
    searchValue,
    searchForm,
    pagination,
    dialogVisible,
    dialogTitle,
    isEdit,
    currentRow,
    formData,

    // 计算属性
    hasSelection,
    categoryOptions,

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
    handleBatchDelete,
    formatDateTime
  };
}
