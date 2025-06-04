<template>
  <div class="table-toolbar">
    <div class="toolbar-left">
      <el-button type="primary" :icon="Plus" @click="handleCreate">
        新增部门
      </el-button>
      <el-button
        type="danger"
        :icon="Delete"
        :disabled="!hasSelection"
        @click="handleBatchDelete"
      >
        批量删除
      </el-button>
    </div>
    <div class="toolbar-right">
      <el-button :icon="Refresh" @click="handleRefresh"> 刷新 </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Delete, Refresh } from "@element-plus/icons-vue";

defineOptions({
  name: "TableToolbar"
});

defineProps<{
  hasSelection: boolean;
}>();

const emit = defineEmits<{
  create: [];
  batchDelete: [];
  refresh: [];
}>();

const handleCreate = () => {
  emit("create");
};

const handleBatchDelete = () => {
  emit("batchDelete");
};

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

.toolbar-left {
  display: flex;
  gap: 8px;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}
</style>
