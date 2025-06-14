import dayjs from "dayjs";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted } from "vue";
import { getReadOnlyPermissionTree } from "@/api/system/permissions";
import type {
  ReadOnlyPermissionTreeNode,
  PermissionNodeInfo
} from "@/api/system/permissions";

interface TableDataItem extends PermissionNodeInfo {
  id: string;
  category_id: string;
  category_display_name: string;
  created_at: string;
  updated_at: string;
  _rowKey: string;
  _level: number;
  _isCategory: boolean;
  children?: TableDataItem[];
}

export function usePermissionDefined() {
  const dataList = ref<TableDataItem[]>([]);
  const loading = ref(true);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 100, // Show more items per page as it's a read-only view
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: "权限名称",
      prop: "display_name",
      minWidth: 250,
      align: "left"
    },
    {
      label: "显示名称",
      prop: "display_name",
      minWidth: 200
    },
    {
      label: "描述",
      prop: "description",
      minWidth: 300,
      showOverflowTooltip: true
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
    }
  ];

  /** 转换树形数据为表格数据 */
  function transformTreeToTableData(
    nodes: ReadOnlyPermissionTreeNode[]
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
        description: node.category_description || "权限分类",
        created_at: "", // Categories don't have timestamps in this view
        updated_at: "",
        _rowKey: `category_${node.category_id}`,
        _level: 0,
        _isCategory: true,
        children: []
      };

      // 添加该分类下的权限
      const permissions: TableDataItem[] = node.permissions.map(
        permission =>
          ({
            ...permission,
            category_id: node.category_id,
            category_display_name: node.category_name,
            _rowKey: permission.id,
            _level: 1,
            _isCategory: false
          }) as TableDataItem
      );

      categoryItem.children = permissions;
      result.push(categoryItem);
    });

    return result;
  }

  /** 获取权限列表数据 */
  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getReadOnlyPermissionTree();
      if (data) {
        dataList.value = transformTreeToTableData(data);
      } else {
        dataList.value = [];
      }
    } catch (error) {
      console.error("获取权限列表失败:", error);
      dataList.value = [];
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    columns,
    dataList,
    pagination,
    onSearch
  };
}
