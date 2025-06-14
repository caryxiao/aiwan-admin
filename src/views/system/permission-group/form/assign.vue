<template>
  <div v-loading="loading">
    <el-tree
      ref="treeRef"
      :data="permissionTree"
      :props="treeProps"
      show-checkbox
      node-key="id"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import {
  getHierarchicalPermissionTree,
  getPermissionGroupPermissions,
  setPermissionGroupPermissions,
  type HierarchicalPermissionNode
} from "@/api/system/permissions";
import { message } from "@/utils/message";
import type { ElTree } from "element-plus";

const props = defineProps<{
  groupId: string;
}>();

const loading = ref(true);
const isSubmitting = ref(false);
const treeRef = ref<InstanceType<typeof ElTree>>();
const permissionTree = ref<HierarchicalPermissionNode[]>([]);
const treeProps = {
  children: "children",
  label: "display_name"
};

async function handleSubmit() {
  if (isSubmitting.value) return false;

  isSubmitting.value = true;
  try {
    const permissionIds = treeRef.value?.getCheckedKeys(true) as string[];

    await setPermissionGroupPermissions(props.groupId, {
      permission_ids: permissionIds
    });

    message("保存成功", { type: "success" });
    return true;
  } catch (error) {
    console.error("保存权限分配失败:", error);
    message("保存失败", { type: "error" });
    return false;
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(async () => {
  if (!props.groupId) {
    message("权限组ID不能为空", { type: "error" });
    return;
  }

  loading.value = true;
  try {
    const [{ data: tree }, { data: groupPermissionIds }] = await Promise.all([
      getHierarchicalPermissionTree(),
      getPermissionGroupPermissions(props.groupId)
    ]);

    permissionTree.value = tree;

    // 等待DOM更新完成后设置选中状态
    await nextTick();
    if (treeRef.value && groupPermissionIds?.length > 0) {
      treeRef.value.setCheckedKeys(groupPermissionIds, false);
    }
  } catch (error) {
    console.error("获取权限数据失败:", error);
    message("获取权限数据失败", { type: "error" });
  } finally {
    loading.value = false;
  }
});

// 暴露方法供父组件调用
defineExpose({
  handleSubmit
});
</script>

<style scoped>
.dialog-footer {
  margin-top: 20px;
  text-align: right;
}
</style>
