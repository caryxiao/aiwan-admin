import { reactive, ref, onMounted, computed, h } from "vue";
import { ElMessage, ElMessageBox, ElTag } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import { deviceDetection } from "@pureadmin/utils";
import { usePublicHooks } from "@/hooks";
import {
  getAdminMenus,
  createAdminMenu,
  updateAdminMenu,
  deleteAdminMenu,
  type AdminMenu
} from "@/api/system/menus";
import MenuForm from "../form/index.vue";
import type { MenuTreeNode } from "./types";

// TableColumnList 类型已在全局类型定义中声明，无需额外导入

export function useMenu() {
  // 搜索表单状态
  const form = reactive({
    title: "",
    status: ""
  });

  // 表单引用
  const formRef = ref();

  // 数据列表
  const dataList = ref<AdminMenu[]>([]);
  const loading = ref(false);
  const selectedRows = ref<AdminMenu[]>([]);
  const {} = usePublicHooks();

  // 菜单树数据
  const menuTreeData = ref<AdminMenu[]>([]);

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
      label: "菜单名称",
      prop: "title",
      align: "left",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <>
          {row.icon && (
            <span class="inline-block mr-1">
              <i class={row.icon} style={{ paddingTop: "1px" }} />
            </span>
          )}
          <span>{row.title}</span>
        </>
      )
    },
    {
      label: "菜单类型",
      prop: "menu_type",
      width: 100,
      align: "center",
      cellRenderer: ({ row }) => {
        const typeMap = {
          CATALOG: { text: "目录", type: "info" },
          MENU: { text: "菜单", type: "success" },
          BUTTON: { text: "按钮", type: "warning" }
        };
        const config = typeMap[row.menu_type] || {
          text: row.menu_type,
          type: "info"
        };
        return (
          <ElTag type={config.type} effect="plain">
            {config.text}
          </ElTag>
        );
      }
    },
    {
      label: "路由路径",
      prop: "path",
      minWidth: 120
    },
    {
      label: "组件路径",
      prop: "component",
      minWidth: 180,
      formatter: ({ path, component }) => (!component ? path : component)
    },
    {
      label: "权限标识",
      prop: "permission_key",
      minWidth: 150
    },
    {
      label: "排序",
      prop: "sort_order",
      width: 100,
      align: "center"
    },
    {
      label: "隐藏",
      prop: "is_hidden",
      formatter: ({ is_hidden }) => (is_hidden ? "是" : "否"),
      width: 100,
      align: "center"
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

  // 计算属性
  const hasSelection = computed(() => selectedRows.value.length > 0);

  // 格式化菜单选项列表（排除当前编辑项的子级，避免循环引用）
  const formatMenuOptions = (
    data: AdminMenu[],
    excludeIds: string[] = []
  ): MenuTreeNode[] => {
    const filteredData = data.filter(item => !excludeIds.includes(item.id));

    return filteredData.map(item => {
      const option: MenuTreeNode = {
        id: item.id,
        title: item.title,
        children: []
      };

      // 如果有子级，递归处理
      if (item.children && item.children.length > 0) {
        option.children = formatMenuOptions(item.children, excludeIds);
      }

      return option;
    });
  };

  // 选择变化
  const handleSelectionChange = (selection: AdminMenu[]) => {
    selectedRows.value = selection;
  };

  // 重置搜索表单
  const resetForm = () => {
    form.title = "";
    form.status = "";
    onSearch();
  };

  // 搜索
  const onSearch = async () => {
    try {
      loading.value = true;
      const params = {
        title: form.title || undefined,
        status: form.status || undefined
      };

      const response = await getAdminMenus(params);

      if (response.success) {
        const data = response.data || [];
        // 构建菜单树
        dataList.value = buildMenuTree(data);
        // 保存原始菜单数据用于表单选择
        menuTreeData.value = buildMenuTree(data);
      } else {
        ElMessage.error(response.message || "获取菜单列表失败");
        dataList.value = [];
        menuTreeData.value = [];
      }
    } catch (error) {
      console.error("获取菜单列表失败:", error);
      ElMessage.error("获取菜单列表失败");
      dataList.value = [];
      menuTreeData.value = [];
    } finally {
      loading.value = false;
    }
  };

  // 构建菜单树
  const buildMenuTree = (
    menus: AdminMenu[],
    parentId: string | null = null
  ): AdminMenu[] => {
    const result: AdminMenu[] = [];

    for (const menu of menus) {
      if (
        (parentId === null && !menu.parent_id) ||
        menu.parent_id === parentId
      ) {
        const children = buildMenuTree(menus, menu.id);
        if (children.length > 0) {
          menu.children = children;
        }
        result.push(menu);
      }
    }

    return result;
  };

  // 获取当前项的所有子级ID（仅在编辑模式下需要）
  const getChildrenIds = (parentId: string, data: AdminMenu[]): string[] => {
    const children = data.filter(item => item.parent_id === parentId);
    const childrenIds = children.map(child => child.id);
    children.forEach(child => {
      childrenIds.push(...getChildrenIds(child.id, data));
    });
    return childrenIds;
  };

  // 格式化上级菜单选项 - 暂时注释，如需要可取消注释
  // const formatHigherMenuOptions = (treeList: AdminMenu[]) => {
  //   if (!treeList || !treeList.length) return [];
  //   return cloneDeep(treeList);
  // };

  // 打开对话框
  const openDialog = (
    title = "新增",
    row?: AdminMenu | { parent_id?: string }
  ) => {
    // 判断是否是编辑模式（传入完整的row对象）还是新增子菜单模式（只传入parent_id）
    const isEdit = row && "id" in row;
    const parentId = isEdit
      ? (row as AdminMenu).parent_id
      : (row as { parent_id?: string })?.parent_id;

    // 确定需要排除的ID列表（仅在编辑模式下需要）
    let excludeIds: string[] = [];
    if (isEdit) {
      const editRow = row as AdminMenu;
      excludeIds = [editRow.id, ...getChildrenIds(editRow.id, dataList.value)];
    }

    // 格式化菜单选项
    const menuOptions = [
      {
        id: "",
        title: "无上级菜单（顶级菜单）",
        children: []
      },
      ...formatMenuOptions(dataList.value, excludeIds)
    ];

    // 准备表单数据
    const formData = {
      menuTreeData: menuOptions,
      id: isEdit ? (row as AdminMenu).id : "",
      parent_id: parentId ?? "",
      menu_type: isEdit ? (row as AdminMenu).menu_type : "MENU",
      title: isEdit ? (row as AdminMenu).title : "",
      name: isEdit ? (row as AdminMenu).name : "",
      path: isEdit ? (row as AdminMenu).path : "",
      component: isEdit ? (row as AdminMenu).component : "",
      permission_key: isEdit ? (row as AdminMenu).permission_key : "",
      icon: isEdit ? (row as AdminMenu).icon : "",
      sort_order: isEdit ? (row as AdminMenu).sort_order : 99,
      is_hidden: isEdit ? (row as AdminMenu).is_hidden : false,
      is_cache: isEdit ? (row as AdminMenu).is_cache : false,
      is_external_link: isEdit ? (row as AdminMenu).is_external_link : false,
      external_link_url: isEdit ? (row as AdminMenu).external_link_url : "",
      status: isEdit ? (row as AdminMenu).status : "ENABLED",
      remark: isEdit ? (row as AdminMenu).remark : "",
      created_at: isEdit ? (row as AdminMenu).created_at : "",
      updated_at: isEdit ? (row as AdminMenu).updated_at : ""
    };

    addDialog({
      title: `${title}菜单`,
      props: {
        formInline: formData
      },
      width: "45%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(MenuForm, {
          ref: formRef,
          formInline: formData
        }),
      beforeSure: (done, { options: _options }) => {
        const formInstance = formRef.value?.getRef();
        if (!formInstance) {
          ElMessage.error("表单引用获取失败");
          return;
        }

        formInstance.validate(async (valid: boolean) => {
          if (valid) {
            try {
              // 从表单组件的newFormInline中获取数据
              const formComponent = formRef.value;
              const curData = formComponent.newFormInline;
              const requestData = {
                parent_id: curData.parent_id === "" ? null : curData.parent_id,
                menu_type: curData.menu_type,
                title: curData.title,
                name: curData.name,
                path: curData.path,
                component: curData.component,
                permission_key: curData.permission_key,
                icon: curData.icon,
                sort_order: curData.sort_order,
                is_hidden: curData.is_hidden,
                is_cache: curData.is_cache,
                is_external_link: curData.is_external_link,
                external_link_url: curData.external_link_url,
                status: curData.status,
                remark: curData.remark
              };

              let response;
              if (isEdit) {
                response = await updateAdminMenu(
                  (row as AdminMenu).id,
                  requestData
                );
              } else {
                response = await createAdminMenu(requestData);
              }

              if (response.success) {
                ElMessage.success(isEdit ? "菜单更新成功" : "菜单创建成功");
                done(); // 使用done()函数关闭对话框
                onSearch(); // 刷新数据
              } else {
                ElMessage.error(
                  response.message || (isEdit ? "菜单更新失败" : "菜单创建失败")
                );
              }
            } catch (error) {
              console.error("提交菜单数据失败:", error);
              ElMessage.error(isEdit ? "菜单更新失败" : "菜单创建失败");
            }
          }
        });
      }
    });
  };

  // 删除菜单
  const handleDelete = async (row: AdminMenu) => {
    try {
      await ElMessageBox.confirm(
        `确定要删除菜单 "${row.title}" 吗？此操作不可恢复。`,
        "删除确认",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );

      const response = await deleteAdminMenu(row.id);
      if (response.success) {
        ElMessage.success("菜单删除成功");
        onSearch();
      } else {
        ElMessage.error(response.message || "菜单删除失败");
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("删除菜单失败:", error);
        ElMessage.error("菜单删除失败");
      }
    }
  };

  // 初始化
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
    handleDelete
  };
}
