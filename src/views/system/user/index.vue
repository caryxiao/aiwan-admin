<template>
  <div class="main">
    <!-- 搜索栏 -->
    <SearchForm
      v-model:search-value="searchValue"
      @search="handleSearch"
      @reset="handleResetSearch"
    />

    <!-- 表格卡片 -->
    <el-card shadow="never" class="table-card">
      <template #header>
        <TableToolbar
          :has-selection="hasSelection"
          @create="openCreateDialog"
          @batch-delete="handleBatchDelete"
          @export="handleExport"
          @refresh="refresh"
        />
      </template>

      <!-- 数据表格 -->
      <UserTable
        :loading="loading"
        :table-data="tableData"
        :pagination="pagination"
        :switch-load-map="switchLoadMap"
        :format-date-time="formatDateTime"
        @selection-change="handleSelectionChange"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
        @edit="openEditDialog"
        @reset-password="handleResetPassword"
        @delete="handleDelete"
        @status-change="handleStatusChange"
        @assign-roles="handleAssignRoles"
      />
    </el-card>

    <!-- 用户表单对话框 -->
    <UserForm
      v-model:visible="dialogVisible"
      :formData="formData"
      :title="dialogTitle"
      :is-edit="isEdit"
      :loading="submitLoading"
      :form-rules="formRules"
      :department-options="departmentOptions"
      @close="closeDialog"
      @cancel="closeDialog"
      @submit="handleSubmit"
    />

    <!-- 重置密码对话框 -->
    <PasswordResetForm
      ref="passwordFormRef"
      v-model:visible="passwordDialogVisible"
      :loading="passwordSubmitLoading"
      @close="
        () => {
          passwordDialogVisible = false;
        }
      "
      @submit="formData => handlePasswordSubmit(formData)"
    />

    <AssignRoleForm
      v-if="assignRoleDialogVisible"
      v-model:visible="assignRoleDialogVisible"
      :currentAssignUser="currentAssignUser"
      @close="assignRoleDialogVisible = false"
      @submit="handleAssignRolesSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { useUser } from "./utils/hook";
import SearchForm from "./components/SearchForm.vue";
import TableToolbar from "./components/TableToolbar.vue";
import UserTable from "./components/UserTable.vue";
import UserForm from "./form/index.vue";
import PasswordResetForm from "./form/password.vue";
import AssignRoleForm from "./components/AssignRoleForm.vue";

defineOptions({
  name: "SystemUser"
});

// 使用用户管理的hooks
const {
  // 响应式数据
  searchForm,
  loading,
  tableData,
  pagination,
  selectedUsers,
  searchValue,
  switchLoadMap,
  dialogVisible,
  dialogTitle,
  isEdit,
  submitLoading,
  formRef,
  formData,
  passwordDialogVisible,
  passwordSubmitLoading,
  passwordFormRef,
  passwordForm,
  currentPasswordUser,
  departmentOptions,
  loadingDepartments,
  assignRoleDialogVisible,
  currentAssignUser,

  // 验证规则
  formRules,
  passwordRules,

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
  openCreateDialog,
  openEditDialog,
  closeDialog,
  handleStatusChange,
  handleResetPassword,
  handlePasswordSubmit,
  handleSubmit,
  handleDelete,
  handleBatchDelete,
  handleExport,
  refresh,
  handleAssignRoles,
  handleAssignRolesSubmit,

  formatDateTime
} = useUser();
</script>

<style scoped>
.main {
  padding: 16px;
}

.table-card {
  margin-bottom: 16px;
}

.text-muted {
  font-style: italic;
  color: #909399;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>
