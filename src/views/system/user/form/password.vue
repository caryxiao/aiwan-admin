<template>
  <el-dialog
    :modelValue="visible"
    title="重置密码"
    width="500px"
    :close-on-click-modal="false"
    @update:modelValue="$emit('update:visible', $event)"
    @closed="handleClosed"
  >
    <el-form
      ref="passwordFormRef"
      :model="passwordForm"
      :rules="rules"
      label-width="80px"
      label-position="right"
    >
      <el-form-item label="新密码" prop="password">
        <el-input
          v-model="passwordForm.password"
          type="password"
          placeholder="请输入新密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="passwordForm.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          show-password
        />
      </el-form-item>
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
import { ref, reactive, watch, computed } from "vue";
import type { FormInstance } from "element-plus";
import { passwordRules } from "../utils/rule";

defineOptions({
  name: "PasswordResetForm"
});

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
  // passwordRules prop removed
});

const emit = defineEmits(["update:visible", "close", "submit"]);

const passwordFormRef = ref<FormInstance>();
const passwordForm = reactive({
  password: "",
  confirmPassword: ""
});

// Create rules based on local passwordForm
const rules = computed(() => passwordRules(passwordForm));

// 监听visible变化
watch(
  () => props.visible,
  val => {
    emit("update:visible", val);
  }
);

// 关闭对话框
const handleCancel = () => {
  emit("update:visible", false);
  emit("close");
};

// 对话框完全关闭后的回调
const handleClosed = () => {
  passwordForm.password = "";
  passwordForm.confirmPassword = "";
  passwordFormRef.value?.resetFields();
};

// 提交表单
const handleSubmit = async () => {
  if (!passwordFormRef.value) {
    console.log("passwordFormRef.value is null or undefined in password.vue");
    return;
  }

  try {
    console.log("Attempting to validate form in password.vue...");
    const valid = await passwordFormRef.value.validate();
    console.log("Validation result in password.vue:", valid);
    if (valid) {
      console.log(
        "Emitting submit event from password.vue with data:",
        passwordForm
      );
      emit("submit", passwordForm);
    } else {
      console.log(
        "Form validation failed in password.vue, not emitting submit."
      );
    }
  } catch (error) {
    console.error("Password form validation exception in password.vue:", error);
  }
};

// 暴露组件内部的方法和属性给父组件
defineExpose({
  passwordFormRef,
  passwordForm
});
</script>
