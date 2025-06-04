<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="localFormData"
      :rules="formRules"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="localFormData.name"
          placeholder="请输入部门名称"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="localFormData.code"
          placeholder="请输入部门编码"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="上级部门" prop="parent_id">
        <el-cascader
          v-model="localFormData.parent_id"
          :options="departmentOptions"
          :props="cascaderProps"
          placeholder="请选择上级部门"
          clearable
          filterable
          style="width: 100%"
          @change="handleCascaderChange"
        />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="localFormData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入部门描述"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="排序" prop="sort_order">
        <el-input-number
          v-model="localFormData.sort_order"
          :min="0"
          :max="9999"
          placeholder="请输入排序值"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="localFormData.status"
          active-text="启用"
          inactive-text="禁用"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, type PropType } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import type { Department } from "@/api/system/departments";

defineOptions({
  name: "DepartmentForm"
});

interface FormData {
  name: string;
  code: string;
  parent_id: string | null;
  description: string;
  sort_order: number;
  status: boolean;
}

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: "新增部门"
  },
  formData: {
    type: Object as PropType<FormData>,
    required: true
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  departmentOptions: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  currentEditId: {
    type: String,
    default: ""
  }
});

const emit = defineEmits<{
  "update:visible": [visible: boolean];
  close: [];
  submit: [formData: FormData];
}>();

const formRef = ref<FormInstance>();

// 创建本地表单数据副本
const localFormData = reactive<FormData>({
  name: "",
  code: "",
  parent_id: null,
  description: "",
  sort_order: 0,
  status: true
});

// 监听 props.formData 变化，同步到本地副本
watch(
  () => props.formData,
  newFormData => {
    if (newFormData) {
      Object.assign(localFormData, newFormData);
    }
  },
  { immediate: true, deep: true }
);

const dialogVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => {
    emit("update:visible", value);
  }
});

// 级联选择器配置
const cascaderProps = {
  value: "value",
  label: "label",
  children: "children",
  checkStrictly: true, // 允许选择任意级别
  emitPath: false // 只返回选中节点的值
};

// 级联选择器变化处理
const handleCascaderChange = (value: string | null) => {
  localFormData.parent_id = value;
};

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: "请输入部门名称", trigger: "blur" },
    {
      min: 1,
      max: 50,
      message: "部门名称长度在 1 到 50 个字符",
      trigger: "blur"
    }
  ],
  code: [
    { required: true, message: "请输入部门编码", trigger: "blur" },
    {
      min: 1,
      max: 20,
      message: "部门编码长度在 1 到 20 个字符",
      trigger: "blur"
    },
    {
      pattern: /^[a-zA-Z0-9_-]+$/,
      message: "部门编码只能包含字母、数字、下划线和横线",
      trigger: "blur"
    }
  ],
  description: [
    { max: 200, message: "描述长度不能超过 200 个字符", trigger: "blur" }
  ],
  sort_order: [
    { required: true, message: "请输入排序值", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 9999,
      message: "排序值范围为 0-9999",
      trigger: "blur"
    }
  ]
};

// 关闭对话框
const handleClose = () => {
  emit("close");
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    emit("submit", { ...localFormData });
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};

// 监听对话框显示状态，重置表单验证
watch(
  () => props.visible,
  visible => {
    if (visible && formRef.value) {
      // 延迟清除验证状态，确保表单已渲染
      setTimeout(() => {
        formRef.value?.clearValidate();
      }, 100);
    }
  }
);
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-cascader) {
  width: 100%;
}
</style>
