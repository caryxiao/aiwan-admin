<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="localFormData"
      :rules="formRules"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="分类标识" prop="category_key">
        <el-input
          v-model="localFormData.category_key"
          placeholder="请输入分类标识，如：user_management"
          clearable
          maxlength="100"
          show-word-limit
        />
        <div class="form-tip">
          分类标识必须以字母开头，只能包含字母、数字和下划线
        </div>
      </el-form-item>

      <el-form-item label="显示名称" prop="display_name">
        <el-input
          v-model="localFormData.display_name"
          placeholder="请输入显示名称，如：用户管理"
          clearable
          maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="localFormData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入分类描述"
          clearable
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="父级分类" prop="parent_id">
        <el-cascader
          v-model="localFormData.parent_id"
          :options="categoryOptions"
          :props="cascaderProps"
          placeholder="请选择父级分类"
          clearable
          filterable
          style="width: 100%"
          @change="handleCascaderChange"
        />
        <div class="form-tip">不选择则为顶级分类</div>
      </el-form-item>

      <el-form-item label="排序" prop="sort_order">
        <el-input-number
          v-model="localFormData.sort_order"
          :min="0"
          :max="9999"
          placeholder="排序值，数字越小越靠前"
          style="width: 100%"
        />
        <div class="form-tip">排序值越小，显示位置越靠前</div>
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
import { ref, computed, watch, nextTick, type PropType } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import type { PermissionCategory } from "@/api/system/permissions";

defineOptions({
  name: "CategoryForm"
});

interface FormData {
  category_key: string;
  display_name: string;
  description: string;
  parent_id: string | null;
  sort_order: number;
}

interface CategoryOption {
  value: string;
  label: string;
  children?: CategoryOption[];
}

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: "新增分类"
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
  categoryOptions: {
    type: Array as PropType<CategoryOption[]>,
    default: () => []
  },
  currentEditId: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["update:visible", "close", "submit"]);

// 表单引用
const formRef = ref<FormInstance>();

// 本地表单数据副本，避免直接修改props
const localFormData = ref<FormData>({
  category_key: "",
  display_name: "",
  description: "",
  parent_id: null,
  sort_order: 0
});

// 监听props.formData变化，同步到本地副本
watch(
  () => props.formData,
  newFormData => {
    localFormData.value = { ...newFormData };
  },
  { immediate: true, deep: true }
);

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: value => emit("update:visible", value)
});

// 级联选择器配置
const cascaderProps = {
  value: "value",
  label: "label",
  children: "children",
  checkStrictly: true, // 允许选择任意级别
  emitPath: false // 只返回最后一级的值
};

// 级联选择器变化处理
const handleCascaderChange = (value: string | null) => {
  // 级联选择器会自动更新 localFormData.parent_id
  console.log("Selected parent_id:", value);
};

// 表单验证规则
const formRules: FormRules = {
  category_key: [
    { required: true, message: "请输入分类标识", trigger: "blur" },
    {
      min: 2,
      max: 100,
      message: "分类标识长度在 2 到 100 个字符",
      trigger: "blur"
    },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      message: "分类标识必须以字母开头，只能包含字母、数字和下划线",
      trigger: "blur"
    }
  ],
  display_name: [
    { required: true, message: "请输入显示名称", trigger: "blur" },
    {
      min: 2,
      max: 100,
      message: "显示名称长度在 2 到 100 个字符",
      trigger: "blur"
    }
  ],
  sort_order: [
    { required: true, message: "请输入排序值", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 9999,
      message: "排序值必须在 0 到 9999 之间",
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
    emit("submit", localFormData.value);
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};

// 监听对话框打开，重置表单验证状态
watch(
  () => props.visible,
  visible => {
    if (visible) {
      nextTick(() => {
        formRef.value?.clearValidate();
      });
    }
  }
);
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}

.form-tip {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--el-text-color-secondary);
}

:deep(.el-input-number) {
  width: 100%;
}
</style>
