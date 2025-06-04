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
      <CategoryTable
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

    <!-- 分类表单对话框 -->
    <CategoryForm
      v-model:visible="dialogVisible"
      :title="dialogTitle"
      :form-data="formData"
      :is-edit="isEdit"
      :loading="submitLoading"
      :category-options="categoryOptions"
      :current-edit-id="currentRow?.id || ''"
      @close="closeDialog"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { usePermissionCategory } from "./utils/hook";
import SearchForm from "./components/SearchForm.vue";
import TableToolbar from "./components/TableToolbar.vue";
import CategoryTable from "./components/CategoryTable.vue";
import CategoryForm from "./form/index.vue";

defineOptions({
  name: "PermissionCategoryManagement"
});

// 使用权限分类管理的组合式函数
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
  categoryOptions,
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
} = usePermissionCategory();

// 组件挂载时获取数据
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.permission-category-management {
  padding: 20px;
}

.permission-category-management .search-section {
  margin-bottom: 20px;
}

.permission-category-management .table-section {
  margin-bottom: 20px;
}
</style>
