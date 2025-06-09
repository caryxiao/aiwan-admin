import dayjs from "dayjs";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { usePublicHooks } from "@/hooks";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import type { Ref } from "vue";
import { reactive, ref, onMounted, h, defineAsyncComponent } from "vue";
import {
  getPermissionTree,
  getDefinedPermissions,
  createDefinedPermission,
  updateDefinedPermission,
  deleteDefinedPermission
} from "@/api/system/permissions";
import type {
  DefinedPermission,
  PermissionCategoryNode,
  TableDataItem,
  SearchFormProps,
  CreateDefinedPermissionRequest,
  UpdateDefinedPermissionRequest,
  PaginatedResponse
} from "./types";

export function usePermissionDefined(_tableRef: Ref) {
  const form = reactive<SearchFormProps>({
    permission_key: "",
    display_name: "",
    category_id: ""
  });

  const dataList = ref<TableDataItem[]>([]);
  const loading = ref(true);
  const categoryTreeData = ref<PermissionCategoryNode[]>([]);
  const _switchLoadMap = ref({});
  const { tagStyle } = usePublicHooks();

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: "权限标识",
      prop: "permission_key",
      minWidth: 180,
      cellRenderer: ({ row }) => {
        const displayText = row._isCategory
          ? `[分类] ${row.category_display_name || row.display_name || "未命名分类"}`
          : row.permission_key || "未定义";
        return (
          <span class={row._isCategory ? "font-medium text-primary" : ""}>
            {displayText}
          </span>
        );
      }
    },
    {
      label: "权限名称",
      prop: "display_name",
      minWidth: 150,
      cellRenderer: ({ row }) => {
        const displayText = row._isCategory
          ? row.category_display_name || row.display_name || "未命名分类"
          : row.display_name || "未命名权限";
        return (
          <span class={row._isCategory ? "font-medium text-primary" : ""}>
            {displayText}
          </span>
        );
      }
    },
    {
      label: "权限分类",
      prop: "category_display_name",
      minWidth: 120,
      cellRenderer: ({ row }) => {
        if (row._isCategory) return <span>-</span>;
        return (
          <el-tag size="small" style={tagStyle.value(true)}>
            {row.category_display_name || "未分类"}
          </el-tag>
        );
      }
    },
    {
      label: "描述",
      prop: "description",
      minWidth: 200,
      showOverflowTooltip: true,
      cellRenderer: ({ row }) => {
        if (row._isCategory) {
          return <span class="text-gray-500">权限分类节点</span>;
        }
        return <span>{row.description || "-"}</span>;
      }
    },
    {
      label: "创建时间",
      minWidth: 180,
      prop: "created_at",
      formatter: ({ created_at }) =>
        created_at ? dayjs(created_at).format("YYYY-MM-DD HH:mm:ss") : "-"
    },
    {
      label: "更新时间",
      minWidth: 180,
      prop: "updated_at",
      formatter: ({ updated_at }) =>
        updated_at ? dayjs(updated_at).format("YYYY-MM-DD HH:mm:ss") : "-"
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  /** 转换树形数据为表格数据 */
  function transformTreeToTableData(
    nodes: PermissionCategoryNode[],
    level = 0
  ): TableDataItem[] {
    const result: TableDataItem[] = [];

    nodes.forEach(node => {
      // 添加分类节点
      const categoryItem: TableDataItem = {
        id: `category_${node.category_id}`,
        permission_key: `[分类] ${node.category_name}`,
        display_name: node.category_name,
        category_id: node.category_id,
        category_display_name: node.category_name,
        description: "权限分类节点",
        created_at: "",
        updated_at: "",
        _rowKey: `category_${node.category_id}`,
        _level: level,
        _isCategory: true,
        children: []
      };

      // 添加该分类下的权限
      const permissions: TableDataItem[] = node.permissions.map(permission => ({
        id: permission.id,
        permission_key: permission.permission_key,
        display_name: permission.display_name,
        description: permission.description || "", // 使用权限项的描述
        category_id: node.category_id,
        category_display_name: node.category_name,
        created_at: "",
        updated_at: "",
        _rowKey: permission.id,
        _level: level + 1,
        _isCategory: false
      }));

      // 递归处理子分类
      const childCategories = transformTreeToTableData(
        node.children_categories,
        level + 1
      );

      // 将权限和子分类合并到children中
      categoryItem.children = [...permissions, ...childCategories];

      result.push(categoryItem);
    });

    return result;
  }

  /** 获取权限分类树 */
  async function fetchCategoryTree() {
    try {
      const { data } = await getPermissionTree();
      categoryTreeData.value = data?.tree || [];
    } catch (error) {
      console.error("获取权限分类树失败:", error);
      message("获取权限分类树失败", { type: "error" });
    }
  }

  /** 获取权限列表数据 */
  async function onSearch() {
    loading.value = true;
    try {
      console.log("开始获取权限数据，搜索条件:", form);

      if (form.permission_key || form.display_name || form.category_id) {
        console.log("使用搜索模式获取权限列表");
        const { data } = await getDefinedPermissions({
          page: pagination.currentPage,
          page_size: pagination.pageSize,
          search: form.permission_key || form.display_name || undefined,
          category_id: form.category_id || undefined
        });

        console.log("搜索模式API响应:", data);
        const response = data as PaginatedResponse<DefinedPermission>;
        const flatData: TableDataItem[] = response.items.map(item => ({
          ...item,
          _rowKey: item.id,
          _level: 0,
          _isCategory: false
        }));

        console.log("搜索模式处理后的数据:", flatData);
        dataList.value = flatData;
        pagination.total = response.total;
      } else {
        console.log("使用树形模式获取权限列表");
        const { data } = await getPermissionTree();
        console.log("树形模式API响应:", data);

        if (!data || !data.tree) {
          console.warn("权限树数据为空");
          dataList.value = [];
          return;
        }

        const treeData = transformTreeToTableData(data.tree);
        console.log("转换后的树形数据:", treeData);
        dataList.value = treeData;
      }
    } catch (error) {
      console.error("获取权限列表失败:", error);
      message("获取权限列表失败", { type: "error" });
      dataList.value = [];
    } finally {
      loading.value = false;
    }
  }

  /** 重置搜索 */
  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  /** 打开新增对话框 */
  function openDialog(title = "新增权限", row?: TableDataItem) {
    const isEdit = !!row && !row._isCategory;
    const formRef = ref();

    addDialog({
      title: `${title}`,
      props: {
        formInline: {
          permission_key: isEdit ? row.permission_key : "",
          display_name: isEdit ? row.display_name : "",
          description: isEdit ? row.description : "",
          category_id: isEdit ? row.category_id : ""
        },
        categoryTreeData: categoryTreeData.value
      },
      width: "46%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(
          defineAsyncComponent(() => import("../form/index.vue")),
          {
            ref: formRef,
            formInline: null
          }
        ),
      beforeSure: (done, { options: _options }) => {
        const formInstance = formRef.value?.getRef();
        if (!formInstance) {
          message("表单引用获取失败", { type: "error" });
          return;
        }

        formInstance.validate(async (valid: boolean) => {
          if (valid) {
            try {
              const curData = formRef.value?.getFormData();
              if (!curData) {
                message("获取表单数据失败", { type: "error" });
                return;
              }

              function chores() {
                message(
                  `您${title}了权限标识为${curData.permission_key}的这条数据`,
                  {
                    type: "success"
                  }
                );
                done(); // 关闭弹框
                onSearch(); // 刷新表格数据
              }

              if (isEdit) {
                // 实际开发中这里会调用修改接口
                const updateData: UpdateDefinedPermissionRequest = {
                  permission_key: curData.permission_key,
                  display_name: curData.display_name,
                  description: curData.description,
                  category_id: curData.category_id
                };
                await updateDefinedPermission(row.id, updateData);
                chores();
              } else {
                // 实际开发中这里会调用新增接口
                const createData: CreateDefinedPermissionRequest = {
                  permission_key: curData.permission_key,
                  display_name: curData.display_name,
                  description: curData.description,
                  category_id: curData.category_id
                };
                await createDefinedPermission(createData);
                chores();
              }
            } catch (error) {
              console.error(isEdit ? "更新权限失败:" : "创建权限失败:", error);
              message(isEdit ? "更新权限失败" : "创建权限失败", {
                type: "error"
              });
            }
          }
        });
      }
    });
  }

  /** 删除权限 */
  async function handleDelete(row: TableDataItem) {
    if (row._isCategory) {
      message("不能删除分类节点", { type: "warning" });
      return;
    }

    try {
      await ElMessageBox.confirm(
        `确认要删除权限标识为 "${row.permission_key}" 的权限吗？`,
        "删除确认",
        { type: "warning" }
      );

      await deleteDefinedPermission(row.id);
      message("删除成功", { type: "success" });
      onSearch();
    } catch (error) {
      if (error !== "cancel") {
        console.error("删除权限失败:", error);
        message("删除失败", { type: "error" });
      }
    }
  }

  /** 分页改变 */
  function _handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function _handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function _handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  /** 表格行选中状态控制 */
  function _onCurrentChange(val) {
    console.log("onCurrentChange", val);
  }

  // 页面加载时获取数据
  onMounted(() => {
    fetchCategoryTree();
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    categoryTreeData,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleSelectionChange: _handleSelectionChange
  };
}
