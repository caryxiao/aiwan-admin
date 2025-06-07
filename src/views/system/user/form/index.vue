<template>
  <el-form
    ref="formRef"
    :model="localFormData"
    :rules="formRules"
    label-width="80px"
    label-position="right"
  >
    <el-row :gutter="20">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="localFormData.username"
            placeholder="请输入用户名"
            :disabled="!!localFormData.id"
            clearable
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="localFormData.email"
            placeholder="请输入邮箱"
            clearable
          />
        </el-form-item>
      </re-col>
    </el-row>

    <el-row :gutter="20">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="姓名" prop="full_name">
          <el-input
            v-model="localFormData.full_name"
            placeholder="请输入姓名"
            clearable
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="部门" prop="department_id">
          <el-cascader
            v-model="localFormData.department_id"
            :options="localFormData.departmentOptions"
            :props="{
              checkStrictly: true,
              emitPath: false,
              value: 'value',
              label: 'label'
            }"
            placeholder="请选择部门"
            clearable
            style="width: 100%"
          />
        </el-form-item>
      </re-col>
    </el-row>

    <el-row v-if="!localFormData.id" :gutter="20">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="localFormData.password"
            type="password"
            placeholder="请输入密码"
            show-password
            clearable
          />
        </el-form-item>
      </re-col>
    </el-row>

    <el-row :gutter="20">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="状态" prop="is_active">
          <el-switch
            v-model="localFormData.is_active"
            active-text="启用"
            inactive-text="禁用"
            inline-prompt
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="多因子认证" prop="mfa_enabled">
          <el-switch
            v-model="localFormData.mfa_enabled"
            active-text="启用"
            inactive-text="禁用"
            inline-prompt
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from "vue";
import ReCol from "@/components/ReCol";
import { userFormRules } from "../utils/rules";

export interface FormItemProps {
  id?: number;
  username: string;
  email: string;
  full_name: string;
  password: string;
  department_id: number | null;
  is_active: boolean;
  mfa_enabled: boolean;
  departmentOptions?: any[];
}

const props = withDefaults(
  defineProps<{
    formInline?: FormItemProps;
  }>(),
  {
    formInline: () => ({
      username: "",
      email: "",
      full_name: "",
      password: "",
      department_id: null,
      is_active: true,
      mfa_enabled: false,
      departmentOptions: []
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

// 动态生成表单规则，编辑时密码不是必填的
const formRules = computed(() => {
  const rules = { ...userFormRules };
  // 编辑模式下密码不是必填的
  if (localFormData.id && Array.isArray(rules.password)) {
    rules.password = (rules.password as any[]).filter(
      (rule: any) => rule.required !== true
    );
  }
  return rules;
});

function getRef() {
  return formRef.value;
}

function getFormData() {
  return localFormData;
}

defineExpose({ getRef, getFormData });
</script>
