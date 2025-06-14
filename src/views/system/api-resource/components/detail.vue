<template>
  <div v-if="resource">
    <el-descriptions title="基本信息" :column="2" border>
      <el-descriptions-item label="ID">{{ resource.id }}</el-descriptions-item>
      <el-descriptions-item label="模块">{{
        resource.module_tag
      }}</el-descriptions-item>
      <el-descriptions-item label="HTTP方法">{{
        resource.http_method
      }}</el-descriptions-item>
      <el-descriptions-item label="激活状态">
        <el-tag :type="resource.is_active ? 'success' : 'danger'">
          {{ resource.is_active ? "已激活" : "未激活" }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="路径模式">{{
        resource.path_pattern
      }}</el-descriptions-item>
      <el-descriptions-item label="显示名称">{{
        resource.display_name
      }}</el-descriptions-item>
      <el-descriptions-item label="描述" :span="2">{{
        resource.description || "无描述"
      }}</el-descriptions-item>
    </el-descriptions>

    <el-descriptions title="权限信息" :column="1" border class="mt-4">
      <el-descriptions-item label="所需权限">
        <div v-if="resource.required_permission_keys?.length > 0">
          <el-tag
            v-for="key in resource.required_permission_keys"
            :key="key"
            class="mr-2"
            >{{ key }}</el-tag
          >
        </div>
        <span v-else>无需特定权限</span>
      </el-descriptions-item>
    </el-descriptions>
  </div>
  <div v-else>
    <el-result
      icon="warning"
      title="数据加载失败"
      sub-title="无法获取API资源详情信息"
    />
  </div>
</template>

<script setup lang="ts">
import type { ApiResourceDetail } from "@/api/system/api-resources";

defineProps<{
  resource?: ApiResourceDetail;
}>();
</script>

<style scoped>
.mt-4 {
  margin-top: 1.5rem;
}

.mr-2 {
  margin-right: 0.5rem;
}
</style>
