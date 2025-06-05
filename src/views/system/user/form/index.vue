<template>
  <el-dialog
    :modelValue="visible"
    :title="title"
    width="600px"
    :close-on-click-modal="false"
    @update:modelValue="$emit('update:visible', $event)"
    @closed="handleClosed"
  >
    <el-form
      ref="formRef"
      :model="localFormData"
      :rules="formRules"
      label-width="80px"
      label-position="right"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username" :disabled="isEdit">
            <el-input
              v-model="localFormData.username"
              placeholder="请输入用户名"
              :disabled="isEdit"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="localFormData.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓名" prop="full_name">
            <el-input
              v-model="localFormData.full_name"
              placeholder="请输入姓名"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门" prop="department_id">
            <el-cascader
              v-model="localFormData.department_id"
              :options="departmentOptions"
              :props="{
                checkStrictly: true,
                emitPath: false,
                value: 'id',
                label: 'name'
              }"
              placeholder="请选择部门"
              clearable
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="!isEdit" :gutter="20">
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="localFormData.password"
              type="password"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="状态" prop="is_active">
            <el-switch v-model="localFormData.is_active" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="双因子" prop="mfa_enabled">
            <el-switch v-model="localFormData.mfa_enabled" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { FormProps, FormItemProps } from "../utils/types";

const props = defineProps<{
  visible: boolean;
  title: string;
  isEdit: boolean;
  loading: boolean;
  formData: FormProps["formData"];
  formRules: FormRules;
  departmentOptions?: Array<{ id: string; name: string }>;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
  submit: [value: FormProps["formData"]];
  cancel: [];
}>();

// 本地表单数据 - 使用深拷贝避免引用问题
const localFormData = ref<FormItemProps>({
  title: "",
  username: "",
  email: "",
  full_name: "",
  password: "",
  is_active: true,
  mfa_enabled: false,
  department_id: null,
  department_name: null
});

// 表单引用
const formRef = ref<FormInstance>();

// 监听props.formData变化，同步到本地副本
watch(
  () => props.formData,
  newVal => {
    // 使用深拷贝确保数据隔离，但只在有实际数据时更新
    if (newVal && Object.keys(newVal).length > 0) {
      localFormData.value = JSON.parse(JSON.stringify(newVal));
    }
  },
  { deep: true }
);

// 监听对话框显示状态
watch(
  () => props.visible,
  (newVal, oldVal) => {
    if (!newVal && oldVal) {
      // 对话框关闭时重置表单和本地数据
      nextTick(() => {
        formRef.value?.resetFields();
        formRef.value?.clearValidate();
        // 重置本地表单数据为空对象
        localFormData.value = {
          title: "",
          username: "",
          email: "",
          full_name: "",
          password: "",
          is_active: true,
          mfa_enabled: false,
          department_id: null,
          department_name: null
        };
      });
    }
  }
);

// 不再使用watch监听本地表单数据变化来更新父组件的formData
// 这样可能导致数据同步问题，我们将在提交时一次性更新

// 处理取消
const handleCancel = () => {
  emit("cancel");
  emit("update:visible", false);
};

// 处理关闭
const handleClose = () => {
  emit("update:visible", false);
};

// 对话框完全关闭后的回调
const handleClosed = () => {
  formRef.value?.resetFields();
};

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return;
  try {
    const valid = await formRef.value.validate();
    if (valid) {
      // 直接从表单中获取最新值
      const formValues = {
        ...localFormData.value
      };

      console.log("表单提交数据:", formValues);

      // 直接触发submit事件，不需要更新父组件的formData
      // 移除 emit("update:formData", formValues); 避免双向绑定循环
      emit("submit", formValues);
    }
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};

// 暴露方法给父组件
defineExpose({
  formRef
});
</script>
