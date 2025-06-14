import dayjs from "dayjs";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h } from "vue";
import {
  getPermissionGroups,
  createPermissionGroup,
  updatePermissionGroup,
  deletePermissionGroup
} from "@/api/system/permissions";
import { addDialog } from "@/components/ReDialog";
import type { PermissionGroup } from "@/api/system/permissions";
import Form from "../form/index.vue";
import AssignForm from "../form/assign.vue";
import type { PermissionGroupFormProps } from "./types";

export function usePermissionGroup() {
  const form = reactive({
    q: ""
  });
  const dataList = ref<PermissionGroup[]>([]);
  const loading = ref(true);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: "权限组键名",
      prop: "group_key",
      minWidth: 150
    },
    {
      label: "显示名称",
      prop: "display_name",
      minWidth: 150
    },
    {
      label: "描述",
      prop: "description",
      minWidth: 200,
      showOverflowTooltip: true
    },
    {
      label: "排序",
      prop: "sort_order",
      minWidth: 80
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
      width: 320,
      slot: "operation"
    }
  ];

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getPermissionGroups({
        page: pagination.currentPage,
        page_size: pagination.pageSize,
        q: form.q
      });
      dataList.value = data.items;
      pagination.total = data.total;
    } catch (e) {
      console.error(e);
      message("获取权限组列表失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  async function handleDelete(row: PermissionGroup) {
    try {
      await ElMessageBox.confirm(
        `确认要删除权限组 "${row.display_name}" 吗？`,
        "删除确认",
        { type: "warning" }
      );
      await deletePermissionGroup(row.id);
      message("删除成功", { type: "success" });
      onSearch();
    } catch (error) {
      if (error !== "cancel") {
        message("删除失败", { type: "error" });
      }
    }
  }

  function openDialog(title = "新增", row?: PermissionGroup) {
    let formComponentRef: any = null;
    const initialData: PermissionGroupFormProps = {
      id: row?.id,
      group_key: row?.group_key ?? "",
      display_name: row?.display_name ?? "",
      description: row?.description ?? "",
      sort_order: row?.sort_order ?? 0
    };

    addDialog({
      title: `${title}权限组`,
      props: {
        formData: initialData
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(Form, {
          ref: el => (formComponentRef = el),
          formData: initialData
        }),
      beforeSure: async (done, { options }) => {
        const FormRef = formComponentRef.getRef();
        const curData = options.props.formData as PermissionGroupFormProps;

        FormRef.validate(async valid => {
          if (valid) {
            try {
              if (curData.id) {
                await updatePermissionGroup(curData.id, curData);
                message("更新成功", { type: "success" });
              } else {
                await createPermissionGroup(curData);
                message("新增成功", { type: "success" });
              }
              done();
              onSearch();
            } catch {
              // 错误消息由拦截器统一处理
            }
          }
        });
      }
    });
  }

  function openAssignDialog(row: PermissionGroup) {
    const assignFormRef = ref();

    addDialog({
      title: `为 ${row.display_name} 分配权限`,
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(AssignForm, {
          ref: assignFormRef,
          groupId: row.id
        }),
      beforeSure: async done => {
        try {
          const formInstance = assignFormRef.value;
          if (formInstance && formInstance.handleSubmit) {
            const success = await formInstance.handleSubmit();
            if (success) {
              done(); // 关闭对话框
              onSearch(); // 刷新列表
            }
          }
        } catch (error) {
          console.error("保存权限分配失败:", error);
          message("保存权限分配失败", { type: "error" });
        }
      }
    });
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
    handleDelete,
    openDialog,
    openAssignDialog
  };
}
