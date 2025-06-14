<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
    <el-form-item label="组键名" prop="group_key">
      <el-input
        v-model="formData.group_key"
        placeholder="请输入权限组唯一键名"
      />
    </el-form-item>
    <el-form-item label="显示名称" prop="display_name">
      <el-input v-model="formData.display_name" placeholder="请输入显示名称" />
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input
        v-model="formData.description"
        type="textarea"
        placeholder="请输入描述"
      />
    </el-form-item>
    <el-form-item label="排序" prop="sort_order">
      <el-input-number v-model="formData.sort_order" :min="0" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { FormInstance } from "element-plus";
import type { PermissionGroupFormProps } from "../utils/types";
import { permissionGroupFormRules } from "../utils/rule";

const props = defineProps<{
  formData: PermissionGroupFormProps;
}>();

const formRef = ref<FormInstance>();
const formData = ref(props.formData);

const rules = permissionGroupFormRules;

defineExpose({
  getRef() {
    return formRef.value;
  }
});
</script>
