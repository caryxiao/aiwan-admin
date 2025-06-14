<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-form-item label="权限标识" prop="permission_key">
      <el-input
        v-model="newFormInline.permission_key"
        clearable
        placeholder="请输入权限标识（如：users:create）"
      />
    </el-form-item>
    <el-form-item label="权限名称" prop="display_name">
      <el-input
        v-model="newFormInline.display_name"
        clearable
        placeholder="请输入权限名称"
      />
    </el-form-item>
    <el-form-item label="权限分类" prop="category_id">
      <el-tree-select
        v-model="newFormInline.category_id"
        :data="categoryTreeData"
        :props="{
          value: 'category_id',
          label: 'category_name',
          children: 'children_categories'
        }"
        check-strictly
        placeholder="请选择权限分类"
        style="width: 100%"
      />
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input
        v-model="newFormInline.description"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        placeholder="请输入权限描述（可选）"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance } from "element-plus";
import { formRules } from "../utils/rule";
import type { FormItemProps, PermissionCategoryNode } from "../utils/types";

interface FormProps {
  formInline?: FormItemProps;
  categoryTreeData?: PermissionCategoryNode[];
}

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    permission_key: "",
    display_name: "",
    description: "",
    category_id: ""
  }),
  categoryTreeData: () => []
});

const ruleFormRef = ref<FormInstance>();
const newFormInline = reactive(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

function getFormData() {
  return newFormInline;
}

defineExpose({ getRef, getFormData });
</script>
