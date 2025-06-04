<template>
  <div class="table-toolbar">
    <div class="left">
      <!-- 预留导出功能位置 -->
    </div>
    <div class="right">
      <el-button type="primary" :icon="Plus" @click="handleCreate">
        新增分类
      </el-button>
      <el-button
        type="danger"
        :icon="Delete"
        :disabled="!hasSelection"
        @click="handleBatchDelete"
      >
        批量删除
      </el-button>
      <el-tooltip content="刷新表格数据" placement="top">
        <el-button :icon="Refresh" circle @click="handleRefresh" />
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Delete, Refresh } from "@element-plus/icons-vue";

defineOptions({
  name: "TableToolbar"
});

const props = defineProps({
  hasSelection: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["create", "batch-delete", "refresh"]);

// 新增分类
const handleCreate = () => {
  emit("create");
};

// 批量删除
const handleBatchDelete = () => {
  emit("batch-delete");
};

// 刷新表格
const handleRefresh = () => {
  emit("refresh");
};
</script>

<style scoped>
.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left {
  display: flex;
  gap: 8px;
}

.right {
  display: flex;
  gap: 8px;
}
</style>
