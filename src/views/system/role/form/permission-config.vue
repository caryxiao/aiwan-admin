<template>
  <div class="permission-config">
    <!-- 角色信息 -->
    <div class="role-info">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="角色名称">
          <el-tag type="primary">{{ formData.role.role_name }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="显示名称">
          {{ formData.role.display_name }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 权限列表标题区域 -->
    <div class="permission-header">
      <div class="permission-divider" />
      <span class="permission-title">权限列表</span>
      <div class="permission-divider" />
    </div>

    <!-- 权限树 -->
    <div v-loading="formData.loadingPermissions" class="permission-tree">
      <!-- 超级管理员提示 -->
      <el-alert
        v-if="isReadOnly"
        title="该角色为超级管理员，拥有所有权限，不允许修改"
        type="info"
        :closable="false"
        style="margin-bottom: 16px"
      />
      <el-tree
        ref="treeRef"
        :data="formData.permissionTreeData"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-checked-keys="formData.checkedNodeIds || []"
        :disabled="isReadOnly"
        @check="handlePermissionCheck"
      >
        <template #default="{ data }">
          <div class="tree-node">
            <span class="node-label">{{ data.display_name }}</span>
            <!-- 只有权限节点才显示权限标识 -->
            <span v-if="data.type === 'permission'" class="node-key">
              {{ data.permission_key }}
            </span>
            <!-- 分类节点显示不同的样式 -->
            <span v-else-if="data.type === 'category'" class="node-category">
              分类
            </span>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from "vue";
import { ElTree } from "element-plus";
import type {
  PermissionConfigFormProps,
  PermissionTreeItem
} from "../utils/types";

interface Props {
  formData: PermissionConfigFormProps;
}

const props = defineProps<Props>();

const treeRef = ref<InstanceType<typeof ElTree>>();

// 计算是否为只读模式（超级管理员）
const isReadOnly = computed(() => {
  return props.formData.checkedPermissionKeys.includes("*");
});

// 树形控件配置
const treeProps = {
  children: "children",
  label: "display_name",
  disabled: "disabled"
};

// 处理权限选择
function handlePermissionCheck(data: PermissionTreeItem, checked: any) {
  // 记录选择变化，可以在这里添加额外逻辑
  console.log("权限选择变化:", data, checked);
}

// 监听选中节点变化，设置树的选中状态
watch(
  () => props.formData.checkedNodeIds,
  async newCheckedNodeIds => {
    if (newCheckedNodeIds && treeRef.value) {
      await nextTick();
      treeRef.value.setCheckedKeys(newCheckedNodeIds);
    }
  },
  { immediate: true }
);

// 暴露树组件引用给父组件
defineExpose({
  getRef: () => treeRef.value
});

// 注意：不再将treeRef添加到formData中，而是通过defineExpose暴露给父组件
</script>

<style scoped>
.permission-config {
  max-height: 500px;
  padding-bottom: 24px;
}

.role-info {
  margin-bottom: 24px;
}

.permission-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0 16px;
}

.permission-title {
  margin: 0 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  white-space: nowrap;
}

.permission-divider {
  flex: 1;
  height: 1px;
  background-color: var(--el-border-color);
}

.permission-tree {
  max-height: 300px;
  padding: 16px;
  margin-bottom: 24px;
  overflow-y: auto;
  background-color: var(--el-bg-color-page);
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
}

.tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.node-label {
  font-weight: 500;
}

.node-key {
  padding: 2px 6px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-light);
  border-radius: 3px;
}

.node-category {
  padding: 2px 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  border: 1px solid var(--el-color-primary-light-7);
  border-radius: 3px;
}

:deep(.el-tree-node__content) {
  height: 32px;
}
</style>
