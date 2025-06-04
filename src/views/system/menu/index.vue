<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="菜单名称：" prop="title">
        <el-input
          v-model="form.title"
          placeholder="请输入菜单名称"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择状态"
          clearable
          class="!w-[180px]"
        >
          <el-option label="启用" value="ENABLED" />
          <el-option label="禁用" value="DISABLED" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="searchButtonIcon"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="refreshButtonIcon" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar title="菜单列表" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button type="primary" :icon="addButtonIcon" @click="openDialog()">
          新增菜单
        </el-button>
      </template>
      <template #default="{ size, dynamicColumns }">
        <PureTable
          row-key="id"
          :default-expand-all="true"
          border
          :loading="loading"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="editButtonIcon"
              @click="openDialog('编辑', row)"
            >
              编辑
            </el-button>
            <el-popconfirm title="是否确认删除?" @confirm="handleDelete(row)">
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="deleteButtonIcon"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </PureTable>
      </template>
    </PureTableBar>

    <!-- 已移动到PureTableBar的default slot中 -->

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :width="680"
      draggable
      :before-close="closeDialog"
    >
      <el-form
        ref="dialogFormRef"
        :model="dialogForm"
        :rules="dialogRules"
        label-width="100px"
      >
        <el-row :gutter="30">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="上级菜单" prop="parent_id">
              <el-tree-select
                v-model="dialogForm.parent_id"
                :data="menuTreeData"
                :props="{
                  value: 'id',
                  label: 'title',
                  children: 'children'
                }"
                check-strictly
                :render-after-expand="false"
                placeholder="请选择上级菜单（可选）"
                clearable
                class="!w-full"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="菜单类型" prop="menu_type">
              <el-select
                v-model="dialogForm.menu_type"
                placeholder="请选择菜单类型"
                class="!w-full"
              >
                <el-option label="目录" value="CATALOG" />
                <el-option label="菜单" value="MENU" />
                <el-option label="按钮" value="BUTTON" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="菜单名称" prop="title">
              <el-input
                v-model="dialogForm.title"
                clearable
                placeholder="请输入菜单名称"
              />
            </el-form-item>
          </el-col>
          <!-- 路由名称：目录和菜单显示 -->
          <el-col
            v-if="
              dialogForm.menu_type === 'CATALOG' ||
              dialogForm.menu_type === 'MENU'
            "
            :xs="24"
            :sm="12"
            :md="12"
            :lg="12"
            :xl="12"
          >
            <el-form-item label="路由名称" prop="name">
              <el-input
                v-model="dialogForm.name"
                clearable
                placeholder="请输入路由名称"
              />
            </el-form-item>
          </el-col>
          <!-- 路由路径：目录和菜单显示 -->
          <el-col
            v-if="
              dialogForm.menu_type === 'CATALOG' ||
              dialogForm.menu_type === 'MENU'
            "
            :xs="24"
            :sm="12"
            :md="12"
            :lg="12"
            :xl="12"
          >
            <el-form-item label="路由路径" prop="path">
              <el-input
                v-model="dialogForm.path"
                clearable
                placeholder="请输入路由路径"
              />
            </el-form-item>
          </el-col>
          <!-- 组件路径：只有菜单显示 -->
          <el-col
            v-if="dialogForm.menu_type === 'MENU'"
            :xs="24"
            :sm="12"
            :md="12"
            :lg="12"
            :xl="12"
          >
            <el-form-item label="组件路径" prop="component">
              <el-input
                v-model="dialogForm.component"
                clearable
                placeholder="请输入组件路径"
              />
            </el-form-item>
          </el-col>
          <!-- 权限标识：所有类型都显示 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="权限标识" prop="permission_key">
              <el-input
                v-model="dialogForm.permission_key"
                clearable
                placeholder="请输入权限标识"
              />
            </el-form-item>
          </el-col>
          <!-- 菜单图标：目录和菜单显示 -->
          <el-col
            v-if="
              dialogForm.menu_type === 'CATALOG' ||
              dialogForm.menu_type === 'MENU'
            "
            :xs="24"
            :sm="12"
            :md="12"
            :lg="12"
            :xl="12"
          >
            <el-form-item label="菜单图标" prop="icon">
              <el-input
                v-model="dialogForm.icon"
                clearable
                placeholder="请输入菜单图标"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="排序" prop="sort_order">
              <el-input-number
                v-model="dialogForm.sort_order"
                :min="0"
                :max="9999"
                class="!w-full"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="dialogForm.status"
                placeholder="请选择状态"
                class="!w-full"
              >
                <el-option label="启用" value="ENABLED" />
                <el-option label="禁用" value="DISABLED" />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 是否隐藏：目录和菜单显示 -->
          <el-col
            v-if="
              dialogForm.menu_type === 'CATALOG' ||
              dialogForm.menu_type === 'MENU'
            "
            :xs="24"
            :sm="24"
            :md="24"
            :lg="24"
            :xl="24"
          >
            <el-form-item label="是否隐藏">
              <el-switch v-model="dialogForm.is_hidden" />
            </el-form-item>
          </el-col>
          <!-- 是否缓存：只有菜单显示 -->
          <el-col
            v-if="dialogForm.menu_type === 'MENU'"
            :xs="24"
            :sm="24"
            :md="24"
            :lg="24"
            :xl="24"
          >
            <el-form-item label="是否缓存">
              <el-switch v-model="dialogForm.is_cache" />
            </el-form-item>
          </el-col>
          <!-- 外部链接：目录和菜单显示 -->
          <el-col
            v-if="
              dialogForm.menu_type === 'CATALOG' ||
              dialogForm.menu_type === 'MENU'
            "
            :xs="24"
            :sm="24"
            :md="24"
            :lg="24"
            :xl="24"
          >
            <el-form-item label="外部链接">
              <el-switch v-model="dialogForm.is_external_link" />
            </el-form-item>
          </el-col>
          <!-- 外部链接地址：当开启外部链接且为目录或菜单时显示 -->
          <el-col
            v-if="
              dialogForm.is_external_link &&
              (dialogForm.menu_type === 'CATALOG' ||
                dialogForm.menu_type === 'MENU')
            "
            :xs="24"
            :sm="24"
            :md="24"
            :lg="24"
            :xl="24"
          >
            <el-form-item label="外部链接地址" prop="external_link_url">
              <el-input
                v-model="dialogForm.external_link_url"
                clearable
                placeholder="请输入外部链接地址"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="dialogForm.remark"
                :autosize="{ minRows: 2, maxRows: 4 }"
                type="textarea"
                placeholder="请输入备注"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed, h } from "vue"; // 引入 computed 和 h
import type { FormRules } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { PureTableBar } from "@/components/RePureTableBar";
import { usePublicHooks } from "@/hooks";
import dayjs from "dayjs";

import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import SearchIcon from "@iconify-icons/ep/search"; // 重命名导入的图标
import RefreshIcon from "@iconify-icons/ep/refresh"; // 重命名导入的图标
import AddFillIcon from "@iconify-icons/ri/add-circle-line"; // 重命名导入的图标

import {
  getAdminMenus,
  createAdminMenu,
  updateAdminMenu,
  deleteAdminMenu,
  type AdminMenu
} from "@/api/system/menus";
import { message } from "@/utils/message";

defineOptions({
  name: "AdminMenus"
});

const formRef = ref();
const tableRef = ref();
const dialogFormRef = ref();

const { tagStyle } = usePublicHooks();

// 为模板中的图标创建响应式引用
const searchButtonIcon = useRenderIcon(SearchIcon);
const refreshButtonIcon = useRenderIcon(RefreshIcon);
const addButtonIcon = useRenderIcon(AddFillIcon);
const editButtonIcon = useRenderIcon(EditPen);
const deleteButtonIcon = useRenderIcon(Delete);

const loading = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref("");

const form = reactive({
  title: "",
  status: ""
});

const dataList = ref<AdminMenu[]>([]);
const menuTreeData = ref<AdminMenu[]>([]);

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

const columns: TableColumnList = [
  {
    label: "菜单名称",
    prop: "title",
    minWidth: 120
  },
  {
    label: "菜单类型",
    prop: "menu_type",
    minWidth: 100,
    cellRenderer: ({ row, props }) => {
      const type =
        row.menu_type === "CATALOG"
          ? "primary"
          : row.menu_type === "MENU"
            ? "success"
            : "warning";
      const text =
        row.menu_type === "CATALOG"
          ? "目录"
          : row.menu_type === "MENU"
            ? "菜单"
            : "按钮";
      return h("el-tag", { size: props.size, type: type }, text);
    }
  },
  {
    label: "路由名称",
    prop: "name",
    minWidth: 120
  },
  {
    label: "路由路径",
    prop: "path",
    minWidth: 150
  },
  {
    label: "组件路径",
    prop: "component",
    minWidth: 200
  },
  {
    label: "权限标识",
    prop: "permission_key",
    minWidth: 150
  },
  {
    label: "图标",
    prop: "icon",
    minWidth: 100
  },
  {
    label: "排序",
    prop: "sort_order",
    minWidth: 80
  },
  {
    label: "状态",
    prop: "status",
    minWidth: 100,
    cellRenderer: ({ row, props }) => {
      const type = row.status === "ENABLED" ? "success" : "danger";
      const text = row.status === "ENABLED" ? "启用" : "禁用";
      return h("el-tag", { size: props.size, type: type }, text);
    }
  },
  {
    label: "是否隐藏",
    prop: "is_hidden",
    minWidth: 100,
    cellRenderer: ({ row, props }) => {
      return h(
        "el-tag",
        {
          size: props.size,
          style: tagStyle()[row.is_hidden ? "warning" : "success"]
        },
        row.is_hidden ? "是" : "否"
      );
    }
  },
  {
    label: "创建时间",
    prop: "created_at",
    minWidth: 180,
    formatter: ({ created_at }) =>
      dayjs(created_at).format("YYYY-MM-DD HH:mm:ss")
  },
  {
    label: "操作",
    fixed: "right",
    width: 180,
    slot: "operation"
  }
];

const dialogForm = reactive<Partial<AdminMenu>>({
  parent_id: "",
  menu_type: "MENU",
  title: "",
  name: "",
  path: "",
  component: "",
  permission_key: "",
  icon: "",
  sort_order: 0,
  is_hidden: false,
  is_cache: false,
  is_external_link: false,
  external_link_url: "",
  status: "ENABLED",
  remark: ""
});

const dialogRules: FormRules = reactive({
  menu_type: [{ required: true, message: "菜单类型为必填项", trigger: "blur" }],
  title: [{ required: true, message: "菜单名称为必填项", trigger: "blur" }],
  status: [{ required: true, message: "状态为必填项", trigger: "blur" }]
});

function resetForm(formEl) {
  if (!formEl) return;
  formEl.resetFields();
  onSearch();
}

const onSearch = () => {
  loading.value = true;
  console.log("菜单管理页面：开始搜索数据");
  getAdminMenus()
    .then(response => {
      console.log("菜单管理页面：获取到的响应", response);

      // 检查响应是否是标准的API响应格式（包含success和data字段）
      if (response && response.success && response.data) {
        const menuList = response.data;
        console.log("菜单管理页面：提取的菜单列表", menuList);
        console.log("菜单管理页面：菜单列表长度", menuList.length);

        // API返回的数据已经是树形结构，直接使用
        dataList.value = menuList;
        console.log("菜单管理页面：dataList.value设置后", dataList.value);

        // 构建菜单树选择数据（用于选择上级菜单）
        menuTreeData.value = menuList.filter(
          menu => menu.menu_type !== "BUTTON"
        );
        console.log(
          "菜单管理页面：menuTreeData.value设置后",
          menuTreeData.value
        );

        // 计算总数需要递归统计所有菜单项
        pagination.total = countAllMenus(menuList);
        console.log("菜单管理页面：设置dataList完成，总数:", pagination.total);
      } else {
        console.error("菜单管理页面：无效的响应格式或空数据", response);
        dataList.value = [];
        menuTreeData.value = [];
        pagination.total = 0;
      }
    })
    .catch(error => {
      console.error("菜单管理页面：API请求失败", error);
    })
    .finally(() => {
      loading.value = false;
      console.log("菜单管理页面：搜索完成，最终loading状态:", loading.value);
      console.log("菜单管理页面：最终dataList:", dataList.value);
    });
};

// 递归计算所有菜单项的数量
function countAllMenus(menuList: AdminMenu[]): number {
  let count = 0;
  if (!menuList || menuList.length === 0) return count;

  for (const menu of menuList) {
    count++; // 计算当前菜单
    if (menu.children && menu.children.length > 0) {
      count += countAllMenus(menu.children); // 递归计算子菜单
    }
  }

  return count;
}

// 构建菜单树形结构 (保留此函数以备需要)
function buildMenuTree(menuList: AdminMenu[]): AdminMenu[] {
  const menuMap = new Map<string, AdminMenu>();
  const rootMenus: AdminMenu[] = [];

  // 创建菜单映射
  menuList.forEach(menu => {
    menuMap.set(menu.id, { ...menu, children: [] });
  });

  // 构建树形结构
  menuList.forEach(menu => {
    const menuItem = menuMap.get(menu.id)!;
    if (menu.parent_id && menuMap.has(menu.parent_id)) {
      const parent = menuMap.get(menu.parent_id)!;
      parent.children!.push(menuItem);
    } else {
      rootMenus.push(menuItem);
    }
  });

  return rootMenus;
}

function handleSizeChange(val: number) {
  pagination.pageSize = val;
  onSearch();
}

function handleCurrentChange(val: number) {
  pagination.currentPage = val;
  onSearch();
}

function openDialog(title = "新增", row?: AdminMenu) {
  dialogTitle.value = `${title}菜单`;
  dialogVisible.value = true;
  if (title === "编辑" && row) {
    Object.assign(dialogForm, row);
  } else {
    resetDialogForm();
  }
}

function resetDialogForm() {
  Object.assign(dialogForm, {
    parent_id: "",
    menu_type: "MENU",
    title: "",
    name: "",
    path: "",
    component: "",
    permission_key: "",
    icon: "",
    sort_order: 0,
    is_hidden: false,
    is_cache: false,
    is_external_link: false,
    external_link_url: "",
    status: "ENABLED",
    remark: ""
  });
}

function closeDialog() {
  dialogVisible.value = false;
  resetDialogForm();
}

function handleConfirm() {
  dialogFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;

    try {
      const isEdit = !!dialogForm.id;
      const apiCall = isEdit
        ? updateAdminMenu(dialogForm.id as string, dialogForm)
        : createAdminMenu(dialogForm);

      const response = await apiCall;
      if (response.success) {
        message(`${isEdit ? "编辑" : "新增"}菜单成功`, { type: "success" });
        closeDialog();
        onSearch();
      }
    } catch (error) {
      console.error(error);
    }
  });
}

function handleDelete(row: AdminMenu) {
  deleteAdminMenu(row.id)
    .then(response => {
      if (response.success) {
        message("删除菜单成功", { type: "success" });
        onSearch();
      }
    })
    .catch(error => {
      console.error(error);
    });
}

onMounted(() => {
  onSearch();
});
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
