<template>
  <el-card shadow="never" class="search-card">
    <el-form
      :model="searchForm"
      class="search-form"
      :inline="true"
      label-width="auto"
    >
      <el-form-item label="分类名称">
        <el-input
          v-model="searchForm.search"
          placeholder="请输入分类名称或标识"
          clearable
          style="width: 240px"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleSearch">
          搜索
        </el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import { Search, Refresh } from "@element-plus/icons-vue";

defineOptions({
  name: "SearchForm"
});

const props = defineProps({
  searchValue: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["search", "reset"]);

// 搜索表单
const searchForm = reactive({
  search: props.searchValue
});

// 搜索
const handleSearch = () => {
  emit("search", searchForm.search);
};

// 重置
const handleReset = () => {
  searchForm.search = "";
  emit("reset");
};

// 监听外部搜索值变化
watch(
  () => props.searchValue,
  newValue => {
    searchForm.search = newValue;
  }
);
</script>

<style scoped>
.search-card {
  margin-bottom: 20px;
}

.search-form {
  margin-bottom: 0;
}
</style>
