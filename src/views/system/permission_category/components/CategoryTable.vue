<template>
  <div class="category-table">
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
        prop="category_key"
        label="分类标识"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="display_name"
        label="显示名称"
        min-width="150"
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
import type { PermissionCategory } from "@/api/system/permissions";
import type { PaginationConfig } from "@/composables/useTable";

defineOptions({
  name: "CategoryTable"
});

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  tableData: {
    type: Array as PropType<PermissionCategory[]>,
    default: () => []
  },
  pagination: {
    type: Object as PropType<PaginationConfig>,
    required: true
  },
  formatDateTime: {
    type: Function,
    required: true
  }
});

const emit = defineEmits([
  "selection-change",
  "page-change",
  "page-size-change",
  "edit",
  "delete"
]);

// 树形表格数据 - 直接使用API返回的树形数据
const treeTableData = computed(() => {
  return Array.isArray(props.tableData) ? props.tableData : [];
});

// 选择变化
const handleSelectionChange = (selection: PermissionCategory[]) => {
  emit("selection-change", selection);
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  emit("page-size-change", size);
};

// 当前页变化
const handleCurrentChange = (page: number) => {
  emit("page-change", page);
};

// 编辑
const handleEdit = (row: PermissionCategory) => {
  emit("edit", row);
};

// 删除
const handleDelete = (row: PermissionCategory) => {
  emit("delete", row);
};
</script>

<style scoped>
.category-table {
  width: 100%;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
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
