import { ref, reactive, computed, h, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { formatDateTime } from "@/utils/dateTime";
import { addDialog } from "@/components/ReDialog";
import {
  getPermissionCategoriesTree,
  createPermissionCategory,
  updatePermissionCategory,
  deletePermissionCategory,
  batchDeletePermissionCategories,
  type PermissionCategory
} from "@/api/system/permissions";
import CategoryForm from "../form/index.vue";

export function usePermissionCategory() {
  // 搜索表单状态
  const form = reactive({
    name: ""
  });

  // 表单引用
  const formRef = ref();

  // 数据列表
  const dataList = ref<PermissionCategory[]>([]);

  // 加载状态
  const loading = ref(false);

  // 表格列配置
  const columns: TableColumnList = [
    {
      label: "显示名称",
      prop: "display_name",
      align: "left",
      width: 180
    },
    {
      label: "排序",
      prop: "sort_order",
      width: 80,
      align: "center"
    },
    {
      label: "分类标识",
      prop: "category_key",
      align: "center",
      width: 280
    },

    {
      label: "描述",
      prop: "description",
      showOverflowTooltip: true
    },
    {
      label: "创建时间",
      prop: "created_at",
      width: 180,
      formatter: (row: PermissionCategory) => formatDateTime(row.created_at)
    },
    {
      label: "更新时间",
      prop: "updated_at",
      width: 180,
      formatter: (row: PermissionCategory) => formatDateTime(row.updated_at)
    },
    {
      label: "操作",
      prop: "operation",
      width: 210,
      fixed: "right",
      slot: "operation"
    }
  ];

  // 选中的行数据
  const selectedRows = ref<PermissionCategory[]>([]);

  // 重置搜索表单
  const resetForm = () => {
    form.name = "";
  };

  // 搜索
  const onSearch = async () => {
    try {
      loading.value = true;
      const { data } = await getPermissionCategoriesTree();
      dataList.value = data.items || [];
    } catch (error) {
      console.error("获取权限分类列表失败:", error);
      ElMessage.error("获取权限分类列表失败");
    } finally {
      loading.value = false;
    }
  };

  // 选择变化
  const handleSelectionChange = (selection: PermissionCategory[]) => {
    selectedRows.value = selection;
  };

  // 格式化级联选择器的分类选项
  const formatCategoryOptions = (
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
        option.children = formatCategoryOptions(item.children, excludeIds);
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

  // 打开对话框
  const openDialog = (
    title = "新增分类",
    row?: PermissionCategory | { parentId: string }
  ) => {
    // 判断是否为编辑模式（row有id属性）还是新增模式
    const isEdit = row && "id" in row;
    // 判断是否为行记录新增模式（row有parentId属性）
    const isRowAdd = row && "parentId" in row;

    // 确定需要排除的ID列表
    let excludeIds: string[] = [];
    if (isEdit) {
      excludeIds = [row.id, ...getChildrenIds(row.id, dataList.value)];
    }

    // 格式化分类选项
    const categoryOptions = [
      {
        value: null,
        label: "无上级分类（顶级分类）"
      },
      ...formatCategoryOptions(dataList.value, excludeIds)
    ];

    // 设置表单初始数据
    let formData;
    if (isEdit) {
      // 编辑模式：使用现有数据
      formData = {
        categoryOptions,
        parent_id: row.parent_id ?? null,
        category_key: row.category_key ?? "",
        display_name: row.display_name ?? "",
        description: row.description ?? "",
        sort_order: row.sort_order ?? 0
      };
    } else if (isRowAdd) {
      // 行记录新增模式：设置父级分类
      formData = {
        categoryOptions,
        parent_id: row.parentId,
        category_key: "",
        display_name: "",
        description: "",
        sort_order: 0
      };
    } else {
      // 普通新增模式：空表单
      formData = {
        categoryOptions,
        parent_id: null,
        category_key: "",
        display_name: "",
        description: "",
        sort_order: 0
      };
    }

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
        h(CategoryForm, {
          ref: formRef,
          formInline: null
        }),
      beforeSure: (done, { options }) => {
        const formInstance = formRef.value?.getRef();
        if (!formInstance) {
          ElMessage.error("表单引用获取失败");
          return;
        }

        formInstance.validate(async (valid: boolean) => {
          if (valid) {
            try {
              const curData = options.props.formInline as PermissionCategory;
              const requestData = {
                category_key: curData.category_key,
                display_name: curData.display_name,
                description: curData.description,
                parent_id: curData.parent_id,
                sort_order: curData.sort_order
              };

              let response;
              if (isEdit) {
                response = await updatePermissionCategory(row.id, requestData);
              } else {
                response = await createPermissionCategory(requestData);
              }

              if (response.success) {
                ElMessage.success(
                  isEdit ? "权限分类更新成功" : "权限分类创建成功"
                );
                done(); // 使用done()函数关闭对话框
                onSearch(); // 刷新数据
              } else {
                ElMessage.error(
                  response.message ||
                    (isEdit ? "权限分类更新失败" : "权限分类创建失败")
                );
              }
            } catch (error) {
              console.error("提交权限分类数据失败:", error);
              ElMessage.error(isEdit ? "权限分类更新失败" : "权限分类创建失败");
            }
          }
        });
      }
    });
  };

  // 删除分类
  const handleDelete = async (row: PermissionCategory) => {
    try {
      await ElMessageBox.confirm(
        `确定要删除分类 "${row.display_name}" 吗？此操作不可恢复。`,
        "删除确认",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );

      const response = await deletePermissionCategory(row.id);
      if (response.success) {
        ElMessage.success("权限分类删除成功");
        onSearch();
      } else {
        ElMessage.error(response.message || "权限分类删除失败");
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("删除权限分类失败:", error);
        ElMessage.error("权限分类删除失败");
      }
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRows.value.length === 0) {
      ElMessage.warning("请选择要删除的权限分类");
      return;
    }

    try {
      await ElMessageBox.confirm(
        `确定要删除选中的 ${selectedRows.value.length} 个权限分类吗？此操作不可恢复。`,
        "批量删除确认",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );

      const ids = selectedRows.value.map(row => row.id);
      const response = await batchDeletePermissionCategories(ids);

      if (response.success) {
        ElMessage.success("批量删除成功");
        selectedRows.value = [];
        onSearch();
      } else {
        ElMessage.error(response.message || "批量删除失败");
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("批量删除权限分类失败:", error);
        ElMessage.error("批量删除失败");
      }
    }
  };

  // 计算属性
  const hasSelection = computed(() => selectedRows.value.length > 0);

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    selectedRows,
    hasSelection,
    handleSelectionChange,
    resetForm,
    onSearch,
    openDialog,
    handleDelete,
    handleBatchDelete
  };
}
