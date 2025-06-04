<template>
  <el-card shadow="never" class="search-card">
    <el-form
      ref="searchFormRef"
      :model="searchForm"
      :inline="true"
      label-width="auto"
      class="search-form"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入部门名称"
          clearable
          style="width: 200px"
          @keyup.enter="handleSearch"
        />
      </el-form-item>

      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="searchForm.code"
          placeholder="请输入部门编码"
          clearable
          style="width: 200px"
          @keyup.enter="handleSearch"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select
          v-model="searchForm.status"
          placeholder="请选择状态"
          clearable
          style="width: 120px"
        >
          <el-option label="启用" :value="true" />
          <el-option label="禁用" :value="false" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleSearch">
          搜索
        </el-button>
        <el-button :icon="Refresh" @click="handleReset"> 重置 </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { Search, Refresh } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";

defineOptions({
  name: "SearchForm"
});

interface SearchFormData {
  name: string;
  code: string;
  status: boolean | null;
}

const props = defineProps<{
  searchValue: string;
}>();

const emit = defineEmits<{
  search: [searchText: string];
  reset: [];
}>();

const searchFormRef = ref<FormInstance>();

const searchForm = reactive<SearchFormData>({
  name: "",
  code: "",
  status: null
});

// 搜索
const handleSearch = () => {
  // 构建搜索参数
  const searchParams = [];
  if (searchForm.name) searchParams.push(`name:${searchForm.name}`);
  if (searchForm.code) searchParams.push(`code:${searchForm.code}`);
  if (searchForm.status !== null)
    searchParams.push(`status:${searchForm.status}`);

  const searchText = searchParams.join(" ");
  emit("search", searchText);
};

// 重置
const handleReset = () => {
  searchFormRef.value?.resetFields();
  searchForm.name = "";
  searchForm.code = "";
  searchForm.status = null;
  emit("reset");
};
</script>

<style scoped>
.search-card {
  margin-bottom: 16px;
}

.search-form {
  margin-bottom: 0;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
}
</style>
