<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { usePublicHooks } from "@/hooks";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    categoryOptions: [],
    category_key: "",
    display_name: "",
    description: "",
    parent_id: null,
    sort_order: 0
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const { switchStyle } = usePublicHooks();

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="100px"
  >
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="newFormInline.parent_id"
            class="w-full"
            :options="newFormInline.categoryOptions"
            :props="{
              value: 'value',
              label: 'label',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择父级分类"
          >
            <template #default="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="!node.isLeaf">
                ({{ data.children?.length || 0 }})
              </span>
            </template>
          </el-cascader>
          <div class="form-tip text-gray-400 text-xs mt-1">
            不选择则为顶级分类
          </div>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="分类标识" prop="category_key">
          <el-input
            v-model="newFormInline.category_key"
            clearable
            placeholder="请输入分类标识，如：user_management"
          />
          <div class="form-tip text-gray-400 text-xs mt-1">
            分类标识必须以字母开头，只能包含字母、数字和下划线
          </div>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="显示名称" prop="display_name">
          <el-input
            v-model="newFormInline.display_name"
            clearable
            placeholder="请输入显示名称，如：用户管理"
          />
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="newFormInline.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述"
            clearable
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="排序" prop="sort_order">
          <el-input-number
            v-model="newFormInline.sort_order"
            class="w-full!"
            :min="0"
            :max="9999"
            controls-position="right"
            placeholder="排序值，数字越小越靠前"
          />
          <div class="form-tip text-gray-400 text-xs mt-1">
            排序值越小，显示位置越靠前
          </div>
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
