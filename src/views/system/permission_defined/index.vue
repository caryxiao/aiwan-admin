<template>
  <div class="main">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="搜索">
          <el-input
            v-model="searchValue"
            placeholder="请输入权限名称或标识"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearchWithCategoryWrapper"
          />
        </el-form-item>
        <el-form-item label="权限分类">
          <el-select
            v-model="searchForm.category_id"
            placeholder="请选择权限分类"
            clearable
            style="width: 150px"
            @change="handleSearchWithCategoryWrapper"
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.display_name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchWithCategoryWrapper">
            <template #icon>
              <IconifyIconOffline icon="ep:search" />
            </template>
            搜索
          </el-button>
          <el-button @click="handleResetSearchWithCategoryWrapper">
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
          <span class="card-title">权限定义管理</span>
          <div class="card-actions">
            <el-button
              v-auth="'admin:permissions:create'"
              type="primary"
              @click="handleOpenCreateDialog"
            >
              <template #icon>
                <IconifyIconOffline icon="ep:plus" />
              </template>
              新增权限
            </el-button>
            <el-button
              v-auth="'admin:permissions:delete'"
              type="danger"
              :disabled="!hasSelection"
              @click="handleBatchDelete"
            >
              <template #icon>
                <IconifyIconOffline icon="ep:delete" />
              </template>
              批量删除
            </el-button>
            <el-button @click="refresh">
              <template #icon>
                <IconifyIconOffline icon="ep:refresh" />
              </template>
              刷新
            </el-button>
          </div>
        </div>
      </template>

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="permission_key" label="权限标识" min-width="200">
          <template #default="{ row }">
            <el-tag type="primary" size="small">{{
              row.permission_key
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="display_name" label="权限名称" min-width="150" />

        <el-table-column prop="category_name" label="权限分类" min-width="120">
          <template #default="{ row }">
            <el-tag type="success" size="small">{{ row.category_name }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="description" label="描述" min-width="200">
          <template #default="{ row }">
            <span>{{ row.description || "-" }}</span>
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
              v-auth="'admin:permissions:update'"
              type="primary"
              size="small"
              link
              @click="openEditDialog(row)"
            >
              <template #icon>
                <IconifyIconOffline icon="ep:edit" />
              </template>
              编辑
            </el-button>
            <el-button
              v-auth="'admin:permissions:delete'"
              type="danger"
              size="small"
              link
              @click="handleDelete(row)"
            >
              <template #icon>
                <IconifyIconOffline icon="ep:delete" />
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

    <!-- 权限表单对话框 -->
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
        <el-form-item label="权限标识" prop="permission_key">
          <el-input
            v-model="formData.permission_key"
            placeholder="请输入权限标识（如：admin:users:create）"
          />
        </el-form-item>
        <el-form-item label="权限名称" prop="display_name">
          <el-input
            v-model="formData.display_name"
            placeholder="请输入权限名称"
          />
        </el-form-item>

        <el-form-item label="权限分类" prop="category_id">
          <el-select
            v-model="formData.category_id"
            placeholder="请选择权限分类"
            style="width: 100%"
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.display_name"
              :value="category.id"
            >
              <span>{{ category.display_name }}</span>
              <span
                style="
                  float: right;
                  font-size: 12px;
                  color: var(--el-text-color-secondary);
                "
              >
                {{ category.category_key }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入权限描述（可选）"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button
            type="primary"
            :loading="formLoading"
            @click="handleSubmit"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { IconifyIconOffline } from "@/components/ReIcon";
import { useTable } from "@/composables/useTable";
import {
  getDefinedPermissions,
  createDefinedPermission,
  updateDefinedPermission,
  deleteDefinedPermission,
  getPermissionCategories,
  type DefinedPermission,
  type CreateDefinedPermissionRequest,
  type UpdateDefinedPermissionRequest,
  type PermissionCategory
} from "@/api/system/permissions";
import { formatDateTime } from "@/utils/dateTime";

defineOptions({
  name: "DefinedPermissions"
});

// 权限分类列表
const categories = ref<PermissionCategory[]>([]);

// 搜索表单
const searchForm = reactive({
  search: "",
  category_id: undefined as number | undefined
});

const formRules = {
  permission_key: [
    { required: true, message: "请输入权限标识", trigger: "blur" }
  ],
  display_name: [{ required: true, message: "请输入权限名称", trigger: "blur" }]
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
} = useTable<DefinedPermission>({
  fetchApi: params => {
    // 合并搜索参数
    const searchParams = {
      ...params,
      category_id: searchForm.category_id
    };
    return getDefinedPermissions(searchParams);
  },
  createApi: createDefinedPermission,
  updateApi: updateDefinedPermission,
  deleteApi: deleteDefinedPermission,
  tableConfig: {
    columns: [],
    showSelection: true,
    showIndex: true,
    stripe: true,
    border: true
  },
  searchConfig: {
    placeholder: "请输入权限名称或标识",
    searchKey: "search"
  },
  onSuccess: (action, data) => {
    console.log(`${action} 操作成功:`, data);
  },
  onError: (action, error) => {
    console.error(`${action} 操作失败:`, error);
  }
});

// 获取权限分类列表
const fetchCategories = async () => {
  try {
    const response = await getPermissionCategories({
      page: 1,
      page_size: 1000
    });
    categories.value = response.data.items;
  } catch (error) {
    console.error("获取权限分类失败:", error);
  }
};

// 重写搜索方法，包含分类筛选
const handleSearchWithCategory = () => {
  fetchData();
};

// 重写重置搜索方法
const handleResetSearchWithCategory = () => {
  searchForm.category_id = undefined;
  handleResetSearch();
};

// 保存原始方法的引用
const handleSearchOriginal = handleSearch;
const handleResetSearchOriginal = handleResetSearch;
// 使用新的方法名
const handleSearchWithCategoryWrapper = handleSearchWithCategory;
const handleResetSearchWithCategoryWrapper = handleResetSearchWithCategory;

const initFormData = () => ({
  permission_key: "",
  display_name: "",
  description: "",
  category_id: ""
});

// 保存原始的openCreateDialog引用
const originalOpenCreateDialog = openCreateDialog;

// 重写打开创建对话框方法
const handleOpenCreateDialog = () => {
  originalOpenCreateDialog(initFormData());
};

// 组件挂载时获取权限分类
onMounted(() => {
  fetchCategories();
});
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

:deep(.el-select) {
  width: 100%;
}
</style>
