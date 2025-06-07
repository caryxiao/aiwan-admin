<template>
  <el-form
    ref="formRef"
    :model="localFormData"
    :rules="roleFormRules"
    label-width="100px"
  >
    <el-row :gutter="20">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="角色名称" prop="role_name">
          <el-input
            v-model="localFormData.role_name"
            placeholder="请输入角色名称（英文标识）"
            :disabled="!!localFormData.id"
            clearable
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="显示名称" prop="display_name">
          <el-input
            v-model="localFormData.display_name"
            placeholder="请输入显示名称（中文名称）"
            clearable
          />
        </el-form-item>
      </re-col>
      <re-col :value="24">
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="localFormData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述（可选）"
            clearable
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { type FormInstance } from "element-plus";
import ReCol from "@/components/ReCol";
import { roleFormRules } from "../utils/rules";
import type { RoleFormProps } from "../utils/types";

interface Props {
  formData: RoleFormProps;
}

const props = defineProps<Props>();

const formRef = ref<FormInstance>();

// 创建本地响应式数据，避免直接修改props
const localFormData = reactive<RoleFormProps>({
  id: props.formData.id,
  role_name: props.formData.role_name,
  display_name: props.formData.display_name,
  description: props.formData.description
});

// 监听props变化，同步到本地数据
watch(
  () => props.formData,
  newData => {
    Object.assign(localFormData, newData);
  },
  { deep: true, immediate: true }
);

// 暴露表单引用、验证方法和获取数据方法给父组件
defineExpose({
  validate: (callback: (valid: boolean) => void) => {
    formRef.value?.validate(callback);
  },
  getRef: () => formRef.value,
  getFormData: () => localFormData
});
</script>
