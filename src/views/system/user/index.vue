<template>
  <div class="main">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="搜索">
          <el-input
            v-model="searchValue"
            placeholder="请输入用户名或邮箱"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <template #icon>
              <IconifyIconOffline icon="ep:search" />
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
          <span class="card-title">用户管理</span>
          <div class="card-actions">
            <el-button
              v-auth="'admin:users:create'"
              type="primary"
              @click="openCreateDialog"
            >
              <template #icon>
                <IconifyIconOffline icon="ep:plus" />
              </template>
              新增用户
            </el-button>
            <el-button
              v-auth="'admin:users:delete'"
              type="danger"
              :disabled="!hasSelection"
              @click="handleBatchDelete"
            >
              <template #icon>
                <IconifyIconOffline icon="ep:delete" />
              </template>
              批量删除
            </el-button>
            <el-button @click="handleExport">
              <template #icon>
                <IconifyIconOffline icon="ep:download" />
              </template>
              导出
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

        <el-table-column prop="username" label="用户名" min-width="120">
          <template #default="{ row }">
            <el-tag type="primary" size="small">{{ row.username }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="email" label="邮箱" min-width="200" />

        <el-table-column prop="full_name" label="姓名" min-width="120" />

        <el-table-column prop="is_active" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.is_active ? 'success' : 'danger'">
              {{ row.is_active ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="mfa_enabled" label="双因子认证" width="120">
          <template #default="{ row }">
            <el-tag :type="row.mfa_enabled ? 'success' : 'info'">
              {{ row.mfa_enabled ? "已启用" : "未启用" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="last_login_at" label="最后登录" width="180">
          <template #default="{ row }">
            {{
              row.last_login_at ? formatDateTime(row.last_login_at) : "从未登录"
            }}
          </template>
        </el-table-column>

        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.created_at) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              v-auth="'admin:users:update'"
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
              v-auth="'admin:users:delete'"
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

    <!-- 用户表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-form
        ref="formRef as any"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名"
            :disabled="isEditing"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
            type="email"
          />
        </el-form-item>

        <el-form-item v-if="!isEditing" label="密码" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入密码"
            type="password"
            show-password
          />
        </el-form-item>

        <el-form-item v-if="isEditing" label="新密码" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="留空则不修改密码"
            type="password"
            show-password
          />
        </el-form-item>

        <el-form-item label="姓名" prop="full_name">
          <el-input
            v-model="formData.full_name"
            placeholder="请输入姓名（可选）"
          />
        </el-form-item>

        <el-form-item label="状态" prop="is_active">
          <el-switch
            v-model="formData.is_active"
            active-text="激活"
            inactive-text="禁用"
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
import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { IconifyIconOffline } from "@/components/ReIcon";
import { useTable } from "@/composables/useTable";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  type AdminUser,
  type CreateAdminUserRequest,
  type UpdateAdminUserRequest
} from "@/api/system/users";
import { formatDateTime } from "@/utils/dateTime";

defineOptions({
  name: "AdminUsers"
});

// 搜索表单
const searchForm = reactive({
  search: ""
});

// 表单验证规则
const formRules: FormRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      min: 3,
      max: 100,
      message: "用户名长度在 3 到 100 个字符",
      trigger: "blur"
    }
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, message: "密码长度至少 8 个字符", trigger: "blur" }
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
  openCreateDialog: _openCreateDialog, // 重命名从 useTable 返回的 openCreateDialog
  openEditDialog,
  closeDialog,
  handleSubmit,
  handleDelete,
  handleBatchDelete,
  handleExport
} = useTable<AdminUser>({
  fetchApi: getAdminUsers,
  createApi: createAdminUser,
  updateApi: updateAdminUser,
  deleteApi: deleteAdminUser,
  tableConfig: {
    columns: [],
    showSelection: true,
    showIndex: true,
    stripe: true,
    border: true
  },
  searchConfig: {
    placeholder: "请输入用户名或邮箱",
    searchKey: "search"
  },
  onSuccess: (action, data) => {
    console.log(`${action} 操作成功:`, data);
  },
  onError: (action, error) => {
    console.error(`${action} 操作失败:`, error);
  }
});

// 初始化表单数据
const initFormData = () => {
  return {
    username: "",
    email: "",
    password: "",
    full_name: "",
    is_active: true
  };
};

// 定义在模板中使用的 openCreateDialog 方法
const openCreateDialog = () => {
  _openCreateDialog(initFormData()); // 调用重命名后的原始方法
};

// 移除之前的错误赋值语句
// const openCreateDialog = openCreateDialogWithInit;
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
</style>
