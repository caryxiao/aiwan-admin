<template>
  <div class="main">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="搜索">
          <el-input
            v-model="searchValue"
            placeholder="请输入分类名称或标识"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <template #icon>
              <EpSearch />
            </template>
            搜索
          </el-button>
          <el-button @click="handleResetSearch">
            <template #icon>
              <IconifyIconOffline icon="ep:refresh" />
            </template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格卡片 -->
    <el-card shadow="never" class="table-card">
      <!-- 表格工具栏 -->
      <template #header>
        <div class="card-header">
          <span class="card-title">权限分类管理</span>
          <div class="card-actions">
            <el-button
              v-auth="'permission_categories:create'"
              type="primary"
              @click="handleOpenCreateDialog"
            >
              <template #icon>
                <EpPlus />
              </template>
              新增分类
            </el-button>
            <el-button
              v-auth="'permission_categories:delete'"
              type="danger"
              :disabled="!hasSelection"
              @click="handleBatchDelete"
            >
              <template #icon>
                <EpDelete />
              </template>
              批量删除
            </el-button>
            <el-button @click="refresh">
              <template #icon>
                <EpRefresh />
              </template>
              刷新
            </el-button>
          </div>
        </div>
      </template>

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="treeTableData"
        stripe
        style="width: 100%"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="category_key" label="分类标识" min-width="150">
          <template #default="{ row }">
            <el-tag type="primary" size="small">{{ row.category_key }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="display_name" label="显示名称" min-width="120" />

        <el-table-column prop="description" label="描述" min-width="200">
          <template #default="{ row }">
            <span>{{ row.description || "-" }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="sort_order"
          label="排序"
          width="80"
          align="center"
        >
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ row.sort_order }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="created_at" label="创建时间" min-width="160">
          <template #default="{ row }">
            <span>{{ formatDateTime(row.created_at) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="updated_at" label="更新时间" min-width="160">
          <template #default="{ row }">
            <span>{{ formatDateTime(row.updated_at) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              v-auth="'permission_categories:update'"
              type="primary"
              size="small"
              link
              @click="openEditDialog(row)"
            >
              <template #icon>
                <EpEdit />
              </template>
              编辑
            </el-button>
            <el-button
              v-auth="'permission_categories:delete'"
              type="danger"
              size="small"
              link
              @click="handleDelete(row)"
            >
              <template #icon>
                <EpDelete />
              </template>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="pagination.pageSizes"
          :layout="pagination.layout"
          :total="pagination.total"
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 分类表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="分类标识" prop="category_key">
          <el-input
            v-model="formData.category_key"
            placeholder="请输入分类标识（英文，如：user_management）"
            :disabled="isEditing"
          />
          <div class="form-tip">分类标识用于系统内部识别，创建后不可修改</div>
        </el-form-item>

        <el-form-item label="显示名称" prop="display_name">
          <el-input
            v-model="formData.display_name"
            placeholder="请输入显示名称（如：用户管理）"
          />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述（可选）"
          />
        </el-form-item>

        <el-form-item label="父级分类" prop="parent_id">
          <el-select
            v-model="formData.parent_id"
            placeholder="请选择父级分类"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.display_name"
              :value="item.id"
              :disabled="isEditing && item.id === currentRow?.id"
            />
          </el-select>
          <div class="form-tip">不选择则为顶级分类</div>
        </el-form-item>

        <el-form-item label="排序" prop="sort_order">
          <el-input-number
            v-model="formData.sort_order"
            :min="0"
            :max="9999"
            placeholder="排序值，数字越小越靠前"
            style="width: 100%"
          />
          <div class="form-tip">排序值越小，显示位置越靠前</div>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button
            type="primary"
            :loading="formLoading"
            @click="handleSubmit()"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import type { FormRules } from "element-plus";

// 直接导入图标
import EpSearch from "~icons/ep/search";
import EpRefresh from "~icons/ep/refresh";
import EpPlus from "~icons/ep/plus";
import EpDelete from "~icons/ep/delete";
import EpEdit from "~icons/ep/edit";
import { useTable } from "@/composables/useTable";
import {
  getPermissionCategories,
  createPermissionCategory,
  updatePermissionCategory,
  deletePermissionCategory,
  type PermissionCategory,
  type CreatePermissionCategoryRequest,
  type UpdatePermissionCategoryRequest
} from "@/api/system/permissions";
import { formatDateTime } from "@/utils/dateTime";

defineOptions({
  name: "PermissionCategories"
});

// 搜索表单
const searchForm = reactive({
  search: ""
});

// 表单验证规则
const formRules: FormRules = {
  category_key: [
    { required: true, message: "请输入分类标识", trigger: "blur" },
    {
      min: 2,
      max: 100,
      message: "分类标识长度在 2 到 100 个字符",
      trigger: "blur"
    },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      message: "分类标识必须以字母开头，只能包含字母、数字和下划线",
      trigger: "blur"
    }
  ],
  display_name: [
    { required: true, message: "请输入显示名称", trigger: "blur" },
    {
      min: 2,
      max: 100,
      message: "显示名称长度在 2 到 100 个字符",
      trigger: "blur"
    }
  ],
  sort_order: [
    { required: true, message: "请输入排序值", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 9999,
      message: "排序值必须在 0 到 9999 之间",
      trigger: "blur"
    }
  ]
};

// 使用表格组合式函数
const {
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
  handleBatchDelete
} = useTable<PermissionCategory>({
  fetchApi: getPermissionCategories,
  createApi: createPermissionCategory,
  updateApi: updatePermissionCategory,
  deleteApi: deletePermissionCategory,
  tableConfig: {
    columns: [],
    showSelection: true,
    showIndex: true,
    stripe: true,
    border: true
  },
  searchConfig: {
    placeholder: "请输入分类名称或标识",
    searchKey: "search"
  },
  onSuccess: (action, data) => {
    console.log(`权限分类 ${action} 操作成功:`, data);
  },
  onError: (action, error) => {
    console.error(`权限分类 ${action} 操作失败:`, error);
  }
});

// 添加调试日志
console.log("权限分类页面初始化，useTable配置:", {
  fetchApi: getPermissionCategories,
  createApi: createPermissionCategory,
  updateApi: updatePermissionCategory,
  deleteApi: deletePermissionCategory
});

// 构建树形数据
const buildTreeData = (data: PermissionCategory[]): PermissionCategory[] => {
  // 确保 data 是数组
  if (!Array.isArray(data)) {
    return [];
  }

  const map = new Map<
    string,
    PermissionCategory & { children: PermissionCategory[] }
  >();
  const roots: (PermissionCategory & { children: PermissionCategory[] })[] = [];

  // 初始化所有节点
  data.forEach(item => {
    map.set(item.id, { ...item, children: [] });
  });

  // 构建树形结构
  data.forEach(item => {
    const node = map.get(item.id)!;
    if (item.parent_id && map.has(item.parent_id)) {
      const parent = map.get(item.parent_id)!;
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

// 树形表格数据
const treeTableData = computed(() => {
  return buildTreeData(tableData.value);
});

// 分类选项列表（排除当前编辑项的子级，避免循环引用）
const categoryOptions = computed(() => {
  // 确保 tableData 是数组
  if (!Array.isArray(tableData.value)) {
    return [];
  }

  if (!isEditing || !currentRow) {
    return tableData.value.map(item => ({
      id: item.id,
      display_name: item.display_name
    }));
  }

  // 获取当前项的所有子级ID
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

  const excludeIds = [
    currentRow.value.id,
    ...getChildrenIds(currentRow.value.id, tableData.value)
  ];

  return tableData.value
    .filter(item => !excludeIds.includes(item.id))
    .map(item => ({
      id: item.id,
      display_name: item.display_name
    }));
});

// 初始化表单数据
const initFormData = () => {
  return {
    category_key: "",
    display_name: "",
    description: "",
    parent_id: null,
    sort_order: 0
  };
};

// 重写打开创建对话框方法
const openCreateDialogWithInit = () => {
  openCreateDialog(initFormData());
};

// 保存原始方法的引用
const openCreateDialogOriginal = openCreateDialog;
// 使用新的方法名
const handleOpenCreateDialog = openCreateDialogWithInit;
</script>

<style scoped>
.main {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  margin-bottom: 0;
}

.table-card {
  min-height: 600px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.card-actions {
  display: flex;
  gap: 8px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.dialog-footer {
  text-align: right;
}

.form-tip {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--el-text-color-secondary);
}

:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table th) {
  font-weight: 600;
  color: var(--el-text-color-primary);
  background-color: var(--el-fill-color-light);
}

:deep(.el-pagination) {
  --el-pagination-font-size: 14px;
}

:deep(.el-input-number) {
  width: 100%;
}
</style>
