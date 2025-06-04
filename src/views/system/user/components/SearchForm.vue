<template>
  <el-card shadow="never" class="search-card mb-4">
    <el-form :inline="true" :model="searchForm" @keyup.enter="handleSearch">
      <el-form-item>
        <el-select
          v-model="searchForm.status"
          placeholder="用户状态"
          clearable
          style="width: 120px"
        >
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="searchValue"
          placeholder="请输入用户名或邮箱"
          clearable
          style="width: 240px"
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
import { reactive, ref, watch } from "vue";
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

const emit = defineEmits(["update:searchValue", "search", "reset"]);

// 搜索表单
const searchForm = reactive({
  status: ""
});

// 搜索值（用户名或邮箱）
const searchValue = ref(props.searchValue);

// 监听搜索值变化
watch(
  () => props.searchValue,
  val => {
    searchValue.value = val;
  }
);

watch(
  () => searchValue.value,
  val => {
    emit("update:searchValue", val);
  }
);

// 搜索
const handleSearch = () => {
  emit("search", {
    ...searchForm,
    search: searchValue.value
  });
};

// 重置
const handleReset = () => {
  searchForm.status = "";
  searchValue.value = "";
  emit("update:searchValue", "");
  emit("reset");
};
</script>

<style scoped>
.search-card {
  margin-bottom: 16px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>
