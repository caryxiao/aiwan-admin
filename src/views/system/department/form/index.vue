<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { usePublicHooks } from "@/hooks";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    higherDeptOptions: [],
    parent_id: 0,
    name: "",
    code: "",
    description: "",
    sort_order: 0,
    status: 1
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
        <el-form-item label="上级部门">
          <el-cascader
            v-model="newFormInline.parent_id"
            class="w-full"
            :options="newFormInline.higherDeptOptions"
            :props="{
              value: 'value',
              label: 'label',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择上级部门"
          >
            <template #default="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="!node.isLeaf">
                ({{ data.children?.length || 0 }})
              </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入部门名称"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="部门编码" prop="code">
          <el-input
            v-model="newFormInline.code"
            clearable
            placeholder="请输入部门编码"
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
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="部门状态">
          <el-switch
            v-model="newFormInline.status"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="停用"
            :style="switchStyle"
          />
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="newFormInline.description"
            placeholder="请输入部门描述"
            type="textarea"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
