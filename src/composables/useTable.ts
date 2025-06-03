import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance } from "element-plus";

export interface TableColumn {
  prop: string;
  label: string;
  width?: string | number;
  minWidth?: string | number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  formatter?: (row: any, column: any, cellValue: any, index: number) => any;
  slot?: string;
}

export interface TableConfig {
  columns: TableColumn[];
  showSelection?: boolean;
  showIndex?: boolean;
  stripe?: boolean;
  border?: boolean;
  size?: "large" | "default" | "small";
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  pageSizes?: number[];
  layout?: string;
}

export interface SearchConfig {
  placeholder?: string;
  searchKey?: string;
}

export interface UseTableOptions<T = any> {
  // API 函数
  fetchApi: (params?: any) => Promise<any>;
  createApi?: (data: any) => Promise<any>;
  updateApi?: (id: string, data: any) => Promise<any>;
  deleteApi?: (id: string) => Promise<any>;

  // 配置
  tableConfig: TableConfig;
  searchConfig?: SearchConfig;

  // 回调函数
  onSuccess?: (action: string, data?: T) => void;
  onError?: (action: string, error: any) => void;

  // 其他选项
  immediate?: boolean;
  transformData?: (data: any) => T[];
}

export function useTable<T = any>(options: UseTableOptions<T>) {
  const {
    fetchApi,
    createApi,
    updateApi,
    deleteApi,
    tableConfig: _tableConfig,
    searchConfig,
    onSuccess,
    onError,
    immediate = true,
    transformData
  } = options;

  // 响应式数据
  const loading = ref(false);
  const tableData = ref<T[]>([]);
  const selectedRows = ref<T[]>([]);
  const searchValue = ref("");

  // 分页配置
  const pagination = reactive<PaginationConfig>({
    page: 1,
    pageSize: 10,
    total: 0,
    pageSizes: [10, 20, 50, 100],
    layout: "total, sizes, prev, pager, next, jumper"
  });

  // 表单相关
  const dialogVisible = ref(false);
  const dialogTitle = ref("");
  const dialogMode = ref<"create" | "edit">("create");
  const currentRow = ref<T | null>(null);
  const formRef = ref<FormInstance>();
  const formData = ref<any>({});
  const formLoading = ref(false);

  // 计算属性
  const hasSelection = computed(() => selectedRows.value.length > 0);
  const isEditing = computed(() => dialogMode.value === "edit");

  // 获取数据
  const fetchData = async (resetPage = false) => {
    if (resetPage) {
      pagination.page = 1;
    }

    loading.value = true;
    try {
      const params = {
        page: pagination.page,
        page_size: pagination.pageSize,
        ...(searchConfig?.searchKey &&
          searchValue.value && {
            [searchConfig.searchKey]: searchValue.value
          })
      };

      const response = await fetchApi(params);

      if (response.success) {
        const data = response.data;
        tableData.value = transformData
          ? transformData(data.items)
          : data.items;
        pagination.total = data.total;
        pagination.page = data.page;
        pagination.pageSize = data.page_size;
      } else {
        ElMessage.error(response.message || "获取数据失败");
        onError?.("fetch", response);
      }
    } catch (error) {
      console.error("获取数据失败:", error);
      ElMessage.error("获取数据失败");
      onError?.("fetch", error);
    } finally {
      loading.value = false;
    }
  };

  // 搜索
  const handleSearch = () => {
    fetchData(true);
  };

  // 重置搜索
  const handleResetSearch = () => {
    searchValue.value = "";
    fetchData(true);
  };

  // 分页变化
  const handlePageChange = (page: number) => {
    pagination.page = page;
    fetchData();
  };

  const handlePageSizeChange = (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    fetchData();
  };

  // 选择行
  const handleSelectionChange = (selection: T[]) => {
    selectedRows.value = selection;
  };

  // 刷新数据
  const refresh = () => {
    fetchData();
  };

  // 打开创建对话框
  const openCreateDialog = (initialData?: Partial<T>) => {
    dialogMode.value = "create";
    dialogTitle.value = "新增";
    formData.value = initialData || {};
    currentRow.value = null;
    dialogVisible.value = true;
  };

  // 打开编辑对话框
  const openEditDialog = (row: T) => {
    dialogMode.value = "edit";
    dialogTitle.value = "编辑";
    formData.value = { ...row };
    currentRow.value = row;
    dialogVisible.value = true;
  };

  // 关闭对话框
  const closeDialog = () => {
    dialogVisible.value = false;
    formData.value = {};
    currentRow.value = null;
    formRef.value?.resetFields();
  };

  // 提交表单
  const handleSubmit = async () => {
    if (!formRef.value) return;

    try {
      await formRef.value.validate();
      formLoading.value = true;

      let response;
      if (dialogMode.value === "create") {
        if (!createApi) {
          ElMessage.error("创建API未配置");
          return;
        }
        response = await createApi(formData.value);
      } else {
        if (!updateApi || !currentRow.value) {
          ElMessage.error("更新API未配置或当前行数据为空");
          return;
        }
        response = await updateApi(
          (currentRow.value as any).id,
          formData.value
        );
      }

      if (response.success) {
        ElMessage.success(
          dialogMode.value === "create" ? "创建成功" : "更新成功"
        );
        closeDialog();
        fetchData();
        onSuccess?.(dialogMode.value, response.data);
      } else {
        ElMessage.error(response.message || "操作失败");
        onError?.(dialogMode.value, response);
      }
    } catch (error) {
      console.error("提交失败:", error);
      ElMessage.error("操作失败");
      onError?.(dialogMode.value, error);
    } finally {
      formLoading.value = false;
    }
  };

  // 删除单个项目
  const handleDelete = async (row: T) => {
    if (!deleteApi) {
      ElMessage.error("删除API未配置");
      return;
    }

    try {
      await ElMessageBox.confirm("确定要删除这条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });

      const response = await deleteApi((row as any).id);

      if (response.success) {
        ElMessage.success("删除成功");
        fetchData();
        onSuccess?.("delete", row);
      } else {
        ElMessage.error(response.message || "删除失败");
        onError?.("delete", response);
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("删除失败:", error);
        ElMessage.error("删除失败");
        onError?.("delete", error);
      }
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (!deleteApi || selectedRows.value.length === 0) {
      ElMessage.warning("请选择要删除的记录");
      return;
    }

    try {
      await ElMessageBox.confirm(
        `确定要删除选中的 ${selectedRows.value.length} 条记录吗？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );

      const deletePromises = selectedRows.value.map(row =>
        deleteApi((row as any).id)
      );

      const responses = await Promise.all(deletePromises);
      const failedCount = responses.filter(res => !res.success).length;

      if (failedCount === 0) {
        ElMessage.success("批量删除成功");
      } else {
        ElMessage.warning(
          `删除完成，${responses.length - failedCount} 条成功，${failedCount} 条失败`
        );
      }

      fetchData();
      selectedRows.value = [];
      onSuccess?.("batchDelete", selectedRows.value as T);
    } catch (error) {
      if (error !== "cancel") {
        console.error("批量删除失败:", error);
        ElMessage.error("批量删除失败");
        onError?.("batchDelete", error as any);
      }
    }
  };

  // 导出数据
  const handleExport = () => {
    // 这里可以实现导出逻辑
    ElMessage.info("导出功能待实现");
  };

  // 初始化
  onMounted(() => {
    if (immediate) {
      fetchData();
    }
  });

  return {
    // 响应式数据
    loading,
    tableData,
    selectedRows,
    searchValue,
    pagination,

    // 对话框相关
    dialogVisible,
    dialogTitle,
    dialogMode,
    currentRow,
    formRef,
    formData,
    formLoading,

    // 计算属性
    hasSelection,
    isEditing,

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
    handleExport
  };
}
