<template>
  <div class="department-table">
    <el-table
      v-loading="loading"
      :data="treeTableData"
      style="width: 100%"
      stripe
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="#" width="60" align="center" />
      <el-table-column
        prop="name"
        label="部门名称"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="code"
        label="部门编码"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="description"
        label="描述"
        min-width="200"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <span>{{ row.description || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort_order"
        label="排序"
        width="80"
        align="center"
      />
      <el-table-column prop="status" label="状态" width="80" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'danger'">
            {{ row.status ? "启用" : "禁用" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" min-width="180">
        <template #default="{ row }">
          <span>{{ formatDateTime(row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updated_at" label="更新时间" min-width="180">
        <template #default="{ row }">
          <span>{{ formatDateTime(row.updated_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right" align="center">
        <template #default="{ row }">
          <el-button
            type="primary"
            link
            size="small"
            :icon="Edit"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            link
            size="small"
            :icon="Delete"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 树状表格不需要分页 -->
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from "vue";
import { Edit, Delete } from "@element-plus/icons-vue";
import type { Department } from "@/api/system/departments";
import type { PaginationConfig } from "@/composables/useTable";

defineOptions({
  name: "DepartmentTable"
});

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  tableData: {
    type: Array as PropType<Department[]>,
    default: () => []
  },
  pagination: {
    type: Object as PropType<PaginationConfig>,
    default: () => ({
      page: 1,
      pageSize: 20,
      total: 0
    })
  },
  formatDateTime: {
    type: Function as PropType<(date: string) => string>,
    required: true
  }
});

const emit = defineEmits<{
  selectionChange: [selection: Department[]];
  pageChange: [page: number];
  pageSizeChange: [pageSize: number];
  edit: [row: Department];
  delete: [row: Department];
}>();

// 计算树状表格数据
const treeTableData = computed(() => {
  return props.tableData || [];
});

// 选择变化
const handleSelectionChange = (selection: Department[]) => {
  emit("selectionChange", selection);
};

// 分页变化
const handlePageChange = (page: number) => {
  emit("pageChange", page);
};

const handlePageSizeChange = (pageSize: number) => {
  emit("pageSizeChange", pageSize);
};

// 编辑
const handleEdit = (row: Department) => {
  emit("edit", row);
};

// 删除
const handleDelete = (row: Department) => {
  emit("delete", row);
};
</script>

<style scoped>
.department-table {
  width: 100%;
}

:deep(.el-table) {
  border-radius: 8px;
}

:deep(.el-table__header) {
  background-color: var(--el-bg-color-page);
}

:deep(.el-table__row:hover > td) {
  background-color: var(--el-fill-color-light);
}
</style>
