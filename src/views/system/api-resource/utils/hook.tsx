import dayjs from "dayjs";
import { message } from "@/utils/message";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h } from "vue";
import {
  getApiResources,
  getApiResourceById
} from "@/api/system/api-resources";
import { addDialog } from "@/components/ReDialog";
import type { ApiResource } from "@/api/system/api-resources";
import Detail from "../components/detail.vue";

export function useApiResource() {
  const form = reactive({
    q: "",
    module_tag: "",
    http_method: ""
  });
  const dataList = ref<ApiResource[]>([]);
  const loading = ref(true);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: "模块",
      prop: "module_tag",
      minWidth: 120
    },
    {
      label: "HTTP方法",
      prop: "http_method",
      minWidth: 100
    },
    {
      label: "路径模式",
      prop: "path_pattern",
      minWidth: 250
    },
    {
      label: "显示名称",
      prop: "display_name",
      minWidth: 200
    },
    {
      label: "激活状态",
      prop: "is_active",
      minWidth: 80,
      cellRenderer: ({ row }) => (
        <el-tag type={row.is_active ? "success" : "danger"}>
          {row.is_active ? "已激活" : "未激活"}
        </el-tag>
      )
    },
    {
      label: "创建时间",
      minWidth: 180,
      prop: "created_at",
      formatter: ({ created_at }) =>
        dayjs(created_at).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 120,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getApiResources({
        page: pagination.currentPage,
        page_size: pagination.pageSize,
        ...form
      });
      dataList.value = data.items;
      pagination.total = data.total;
    } catch {
      message("获取API资源列表失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  async function openDetailDialog(row: ApiResource) {
    loading.value = true;
    try {
      const { data } = await getApiResourceById(row.id);

      addDialog({
        title: "查看API资源详情",
        width: "60%",
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        contentRenderer: () =>
          h(Detail, {
            resource: data
          }),
        footerRenderer: () => null
      });
    } catch (error) {
      console.error("获取API资源详情失败:", error);
      message("获取API资源详情失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleSizeChange,
    handleCurrentChange,
    openDetailDialog
  };
}
