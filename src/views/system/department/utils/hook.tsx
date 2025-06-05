import { ref, reactive, computed, nextTick, h } from "vue";
import { ElMessage, ElMessageBox, ElTag, ElButton } from "element-plus";
import { Edit, Delete } from "@element-plus/icons-vue";
import { formatDateTime } from "@/utils/dateTime";
import { addDialog } from "@/components/ReDialog";
import { usePublicHooks } from "../../../../hooks";
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
import DepartmentForm from "../form/index.vue";

export function useDepartment() {
  // 搜索表单状态
  const form = reactive({
    name: "",
    status: null
  });

  // 表单引用
  const formRef = ref();

  // 数据列表
  const dataList = ref<Department[]>([]);
  const loading = ref(false);
  const selectedRows = ref<Department[]>([]);
  const { tagStyle } = usePublicHooks();

  // 表格列配置
  const columns: TableColumnList = [
    {
      type: "selection",
      width: 55,
      align: "center",
      hide: false
    },
    {
      label: "序号",
      type: "index",
      width: 70,
      hide: false
    },
    {
      label: "部门名称",
      prop: "name",
      minWidth: 150
    },
    {
      label: "部门编码",
      prop: "code",
      minWidth: 120
    },
    {
      label: "描述",
      prop: "description",
      minWidth: 200,
      cellRenderer: ({ row }) => <span>{row.description || "-"}</span>
    },
    {
      label: "排序",
      prop: "sort_order",
      width: 80,
      align: "center"
    },
    {
      label: "状态",
      prop: "status",
      width: 80,
      align: "center",
      cellRenderer: ({ row }) => (
        <ElTag style={tagStyle.value(row.status)}>
          {row.status ? "启用" : "禁用"}
        </ElTag>
      )
    },
    {
      label: "创建时间",
      prop: "created_at",
      minWidth: 180,
      cellRenderer: ({ row }) => <span>{formatDateTime(row.created_at)}</span>
    },
    {
      label: "更新时间",
      prop: "updated_at",
      minWidth: 180,
      cellRenderer: ({ row }) => <span>{formatDateTime(row.updated_at)}</span>
    },
    {
      label: "操作",
      fixed: "right",
      width: 160,
      slot: "operation"
    }
  ];

  // 计算属性
  const hasSelection = computed(() => selectedRows.value.length > 0);

  // 级联选择器的部门选项列表（排除当前编辑项的子级，避免循环引用）
  const formatHigherDeptOptions = (
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
        option.children = formatHigherDeptOptions(item.children, excludeIds);
      }

      return option;
    });
  };

  // 选择变化
  const handleSelectionChange = (selection: Department[]) => {
    selectedRows.value = selection;
  };

  // 重置搜索表单
  const resetForm = () => {
    form.name = "";
  };

  // 搜索
  const onSearch = async () => {
    try {
      loading.value = true;
      const params = {
        q: form.name || undefined
      };

      const response = await getDepartmentsTreeAll(params);

      if (response.success) {
        dataList.value = response.data || [];
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

  // 获取当前项的所有子级ID（仅在编辑模式下需要）
  const getChildrenIds = (parentId: string, data: Department[]): string[] => {
    const children = data.filter(item => item.parent_id === parentId);
    const childrenIds = children.map(child => child.id);
    children.forEach(child => {
      childrenIds.push(...getChildrenIds(child.id, data));
    });
    return childrenIds;
  };

  // 打开对话框
  const openDialog = (title = "新增部门", row?: Department) => {
    // 确定需要排除的ID列表
    let excludeIds: string[] = [];
    if (row) {
      excludeIds = [row.id, ...getChildrenIds(row.id, dataList.value)];
    }

    // 格式化部门选项
    const higherDeptOptions = [
      {
        value: null,
        label: "无上级部门（顶级部门）"
      },
      ...formatHigherDeptOptions(dataList.value, excludeIds)
    ];

    // 创建表单数据对象，与DepartmentForm组件的FormData接口匹配
    const formData = {
      name: row?.name ?? "",
      code: row?.code ?? "",
      parent_id: row?.parent_id ?? null,
      description: row?.description ?? "",
      sort_order: row?.sort_order ?? 0,
      status: row?.status ?? true
    };

    addDialog({
      title,
      props: {
        formInline: {
          higherDeptOptions,
          parent_id: row?.parent_id ?? null,
          name: row?.name ?? "",
          code: row?.code ?? "",
          description: row?.description ?? "",
          sort_order: row?.sort_order ?? 0,
          status: row?.status ? 1 : 0
        }
      },
      width: "600px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(DepartmentForm, {
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
              const curData = options.props.formInline as Department;
              console.log(curData);
              const requestData = {
                name: curData.name,
                code: curData.code,
                parent_id: curData.parent_id,
                description: curData.description,
                sort_order: curData.sort_order,
                status: Boolean(curData.status)
              };

              let response;
              if (row) {
                response = await updateDepartment(row.id, requestData);
              } else {
                response = await createDepartment(
                  requestData as CreateDepartmentRequest
                );
              }

              if (response.success) {
                ElMessage.success(row ? "部门更新成功" : "部门创建成功");
                done(); // 使用done()函数关闭对话框
                onSearch(); // 刷新数据
              } else {
                ElMessage.error(
                  response.message || (row ? "部门更新失败" : "部门创建失败")
                );
              }
            } catch (error) {
              console.error("提交部门数据失败:", error);
              ElMessage.error(row ? "部门更新失败" : "部门创建失败");
            }
          }
        });
      }
    });
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
        onSearch();
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
        onSearch();
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
