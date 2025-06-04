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
          @refresh="refresh"
        />
      </template>

      <!-- 数据表格 -->
      <DepartmentTable
        :loading="loading"
        :table-data="tableData"
        :pagination="pagination"
        :format-date-time="formatDateTime"
        @selection-change="handleSelectionChange"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
        @edit="openEditDialog"
        @delete="handleDelete"
      />
    </el-card>

    <!-- 部门表单对话框 -->
    <DepartmentForm
      v-model:visible="dialogVisible"
      :title="dialogTitle"
      :form-data="formData"
      :is-edit="isEdit"
      :loading="submitLoading"
      :department-options="departmentOptions"
      :current-edit-id="currentRow?.id || ''"
      @close="closeDialog"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useDepartment } from "./utils/hook";
import SearchForm from "./components/SearchForm.vue";
import TableToolbar from "./components/TableToolbar.vue";
import DepartmentTable from "./components/DepartmentTable.vue";
import DepartmentForm from "./form/index.vue";

defineOptions({
  name: "DepartmentManagement"
});

// 使用部门管理的组合式函数
const {
  loading,
  tableData,
  searchValue,
  pagination,
  dialogVisible,
  dialogTitle,
  isEdit,
  formData,
  submitLoading,
  hasSelection,
  departmentOptions,
  currentRow,
  formatDateTime,
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
} = useDepartment();

// 组件挂载时获取数据
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.department-management {
  padding: 20px;
}

.table-card {
  margin-top: 16px;
}
</style>
