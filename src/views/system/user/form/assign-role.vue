<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="80px"
    label-position="right"
  >
    <el-row :gutter="20">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="newFormInline.username"
            placeholder="用户名"
            disabled
            clearable
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="姓名" prop="full_name">
          <el-input
            v-model="newFormInline.full_name"
            placeholder="姓名"
            disabled
            clearable
          />
        </el-form-item>
      </re-col>
    </el-row>

    <el-row :gutter="20">
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="角色" prop="roleIds">
          <el-select
            v-model="newFormInline.roleIds"
            v-loading="newFormInline.loadingRoles"
            placeholder="请选择角色"
            multiple
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="role in newFormInline.roleOptions"
              :key="role.id"
              :label="role.display_name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { FormInstance } from "element-plus";
import ReCol from "@/components/ReCol";
import { assignRoleRules } from "../utils/rules";

const formRules = assignRoleRules;
import type { AssignRoleFormProps } from "../utils/types";

const props = withDefaults(defineProps<AssignRoleFormProps>(), {
  username: "",
  full_name: "",
  roleIds: () => [],
  roleOptions: () => [],
  loadingRoles: false
});

const ruleFormRef = ref<FormInstance>();
const newFormInline = ref({
  username: props.username,
  full_name: props.full_name,
  roleIds: [...props.roleIds],
  roleOptions: props.roleOptions,
  loadingRoles: props.loadingRoles
});

defineExpose({
  /** 获取ref */
  getRef: () => {
    return ruleFormRef.value;
  },
  /** 获取表单数据 */
  getFormData: () => {
    return newFormInline.value;
  }
});
</script>

<style scoped>
:deep(.el-select__tags) {
  max-width: 100%;
}
</style>
