<script setup lang="ts">
import { ref, computed } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import type { FormInstance } from "element-plus";
import { IconSelect } from "@/components/ReIcon";
import Segmented from "@/components/ReSegmented";
import {
  menuTypeOptions,
  statusOptions,
  hiddenOptions,
  cacheOptions,
  externalLinkOptions
} from "../utils/enums";

defineOptions({
  name: "MenuForm"
});

import type { FormProps } from "../utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    // 必需字段
    created_at: "",
    updated_at: "",
    // 其他字段
    id: "",
    parent_id: "",
    menu_type: "MENU",
    title: "",
    name: "",
    path: "",
    component: "",
    permission_key: "",
    icon: "",
    sort_order: 0,
    is_hidden: false,
    is_cache: false,
    is_external_link: false,
    external_link_url: "",
    status: "ENABLED",
    remark: "",
    menuTreeData: []
  })
});

// 表单引用
const ruleFormRef = ref<FormInstance>();

// 创建表单数据的响应式副本
const newFormInline = ref(props.formInline);

// 动态表单验证规则
const dynamicRules = computed(() => {
  const rules = { ...formRules };

  // 根据菜单类型动态添加验证规则
  if (
    newFormInline.value.menu_type === "CATALOG" ||
    newFormInline.value.menu_type === "MENU"
  ) {
    rules.name = [
      { required: true, message: "路由名称为必填项", trigger: "blur" }
    ];
    rules.path = [
      { required: true, message: "路由路径为必填项", trigger: "blur" }
    ];
  }

  if (newFormInline.value.menu_type === "MENU") {
    rules.component = [
      { required: true, message: "组件路径为必填项", trigger: "blur" }
    ];
  }

  if (newFormInline.value.is_external_link) {
    rules.external_link_url = [
      { required: true, message: "外部链接地址为必填项", trigger: "blur" },
      { type: "url", message: "请输入正确的URL格式", trigger: "blur" }
    ];
  }

  return rules;
});

// 暴露验证方法和表单数据给父组件
defineExpose({
  getRef: () => ruleFormRef.value,
  newFormInline
});
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="dynamicRules"
    label-width="100px"
  >
    <el-row :gutter="30">
      <!-- 菜单类型 -->
      <ReCol>
        <el-form-item label="菜单类型">
          <Segmented
            v-model="newFormInline.menu_type"
            :options="menuTypeOptions"
          />
        </el-form-item>
      </ReCol>

      <!-- 上级菜单 -->
      <ReCol>
        <el-form-item label="上级菜单" prop="parent_id">
          <el-cascader
            v-model="newFormInline.parent_id"
            class="w-full"
            :options="newFormInline.menuTreeData || []"
            :props="{
              value: 'id',
              label: 'title',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择上级菜单"
          >
            <template #default="{ node, data }">
              <span>{{ data.title }}</span>
              <span v-if="!node.isLeaf">
                ({{ data.children?.length || 0 }})
              </span>
            </template>
          </el-cascader>
        </el-form-item>
      </ReCol>

      <!-- 菜单名称 -->
      <ReCol :value="12" :xs="24" :sm="12">
        <el-form-item label="菜单名称" prop="title">
          <el-input
            v-model="newFormInline.title"
            clearable
            placeholder="请输入菜单名称"
          />
        </el-form-item>
      </ReCol>

      <!-- 路由名称：目录和菜单显示 -->
      <ReCol
        v-if="
          newFormInline.menu_type === 'CATALOG' ||
          newFormInline.menu_type === 'MENU'
        "
        :value="12"
        :xs="24"
        :sm="12"
      >
        <el-form-item label="路由名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入路由名称"
          />
        </el-form-item>
      </ReCol>

      <!-- 路由路径：目录和菜单显示 -->
      <ReCol
        v-if="
          newFormInline.menu_type === 'CATALOG' ||
          newFormInline.menu_type === 'MENU'
        "
        :value="12"
        :xs="24"
        :sm="12"
      >
        <el-form-item label="路由路径" prop="path">
          <el-input
            v-model="newFormInline.path"
            clearable
            placeholder="请输入路由路径"
          />
        </el-form-item>
      </ReCol>

      <!-- 组件路径：只有菜单显示 -->
      <ReCol
        v-if="newFormInline.menu_type === 'MENU'"
        :value="12"
        :xs="24"
        :sm="12"
      >
        <el-form-item label="组件路径" prop="component">
          <el-input
            v-model="newFormInline.component"
            clearable
            placeholder="请输入组件路径"
          />
        </el-form-item>
      </ReCol>

      <!-- 菜单图标：目录和菜单显示 -->
      <ReCol
        v-if="
          newFormInline.menu_type === 'CATALOG' ||
          newFormInline.menu_type === 'MENU'
        "
        :value="12"
        :xs="24"
        :sm="12"
      >
        <el-form-item label="菜单图标" prop="icon">
          <IconSelect v-model="newFormInline.icon" class="w-full" />
        </el-form-item>
      </ReCol>

      <!-- 权限标识：所有类型都显示 -->
      <ReCol :value="12" :xs="24" :sm="12">
        <el-form-item label="权限标识" prop="permission_key">
          <el-input
            v-model="newFormInline.permission_key"
            clearable
            placeholder="请输入权限标识"
          />
        </el-form-item>
      </ReCol>

      <!-- 排序 -->
      <ReCol :value="12" :xs="24" :sm="12">
        <el-form-item label="排序" prop="sort_order">
          <el-input-number
            v-model="newFormInline.sort_order"
            :min="0"
            :max="9999"
            class="w-full"
          />
        </el-form-item>
      </ReCol>

      <!-- 状态 -->
      <ReCol :value="12" :xs="24" :sm="12">
        <el-form-item label="状态" prop="status">
          <Segmented
            :modelValue="newFormInline.status === 'ENABLED' ? 0 : 1"
            :options="statusOptions"
            @change="
              ({ option: { value } }) => {
                newFormInline.status =
                  value === 'ENABLED' ? 'ENABLED' : 'DISABLED';
              }
            "
          />
        </el-form-item>
      </ReCol>

      <!-- 是否隐藏：目录和菜单显示 -->
      <ReCol
        v-if="
          newFormInline.menu_type === 'CATALOG' ||
          newFormInline.menu_type === 'MENU'
        "
        :value="24"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="是否隐藏">
          <Segmented
            :modelValue="newFormInline.is_hidden ? 1 : 0"
            :options="hiddenOptions"
            @change="
              ({ option: { value } }) => {
                newFormInline.is_hidden = value === true;
              }
            "
          />
        </el-form-item>
      </ReCol>

      <!-- 是否缓存：只有菜单显示 -->
      <ReCol
        v-if="newFormInline.menu_type === 'MENU'"
        :value="24"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="是否缓存">
          <Segmented
            :modelValue="newFormInline.is_cache ? 0 : 1"
            :options="cacheOptions"
            @change="
              ({ option: { value } }) => {
                newFormInline.is_cache = value === true;
              }
            "
          />
        </el-form-item>
      </ReCol>

      <!-- 外部链接：目录和菜单显示 -->
      <ReCol
        v-if="
          newFormInline.menu_type === 'CATALOG' ||
          newFormInline.menu_type === 'MENU'
        "
        :value="24"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="是否外部链接">
          <Segmented
            :modelValue="newFormInline.is_external_link ? 0 : 1"
            :options="externalLinkOptions"
            @change="
              ({ option: { value } }) => {
                newFormInline.is_external_link = value === true;
              }
            "
          />
        </el-form-item>
      </ReCol>

      <!-- 外部链接地址：当开启外部链接且为目录或菜单时显示 -->
      <ReCol
        v-if="
          newFormInline.is_external_link &&
          (newFormInline.menu_type === 'CATALOG' ||
            newFormInline.menu_type === 'MENU')
        "
        :value="24"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="外部链接地址" prop="external_link_url">
          <el-input
            v-model="newFormInline.external_link_url"
            clearable
            placeholder="请输入外部链接地址"
          />
        </el-form-item>
      </ReCol>

      <!-- 备注 -->
      <ReCol :value="24" :xs="24" :sm="24">
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="newFormInline.remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入备注"
          />
        </el-form-item>
      </ReCol>
    </el-row>
  </el-form>
</template>
