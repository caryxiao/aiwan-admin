<template>
  <div class="main">
    <PureTableBar
      title="权限列表（只读）"
      :columns="columns"
      @refresh="onSearch"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          adaptive
          :adaptiveConfig="{ offsetBottom: 45 }"
          align-whole="center"
          row-key="id"
          showOverflowTooltip
          table-layout="auto"
          default-expand-all
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        />
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { usePermissionDefined } from "./utils/hook";

defineOptions({
  name: "Permission"
});

const tableRef = ref();

const { loading, columns, dataList, onSearch } = usePermissionDefined();
</script>

<style scoped>
.main {
  padding: 20px;
}
</style>
