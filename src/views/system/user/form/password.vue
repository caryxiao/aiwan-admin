<template>
  <el-form
    ref="formRef"
    :model="localFormData"
    :rules="formRules"
    label-width="100px"
    label-position="right"
  >
    <el-form-item label="新密码" prop="password">
      <el-input
        v-model="localFormData.password"
        type="password"
        placeholder="请输入新密码"
        show-password
        clearable
      />
    </el-form-item>

    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
        v-model="localFormData.confirmPassword"
        type="password"
        placeholder="请再次输入新密码"
        show-password
        clearable
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { passwordResetRules } from "../utils/rules";

export interface PasswordFormProps {
  password: string;
  confirmPassword: string;
}

const props = withDefaults(
  defineProps<{
    formInline?: PasswordFormProps;
  }>(),
  {
    formInline: () => ({
      password: "",
      confirmPassword: ""
    })
  }
);

// 创建本地响应式副本
const localFormData = reactive({ ...props.formInline });

// 监听props变化，同步到本地数据
watch(
  () => props.formInline,
  newVal => {
    if (newVal) {
      Object.assign(localFormData, newVal);
    }
  },
  { deep: true, immediate: true }
);

const formRef = ref();

const formRules = passwordResetRules(localFormData);

function getRef() {
  return formRef.value;
}

function getFormData() {
  return localFormData;
}

defineExpose({ getRef, getFormData });
</script>
