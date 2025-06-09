import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 表单验证规则 */
export const formRules = reactive<FormRules>({
  permission_key: [
    {
      required: true,
      message: "权限标识为必填项",
      trigger: "blur"
    },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_:]*$/,
      message: "权限标识必须以字母开头，只能包含字母、数字、下划线和冒号",
      trigger: "blur"
    },
    {
      min: 2,
      max: 100,
      message: "权限标识长度应在 2 到 100 个字符之间",
      trigger: "blur"
    }
  ],
  display_name: [
    {
      required: true,
      message: "权限名称为必填项",
      trigger: "blur"
    },
    {
      min: 1,
      max: 50,
      message: "权限名称长度应在 1 到 50 个字符之间",
      trigger: "blur"
    }
  ],
  category_id: [
    {
      required: true,
      message: "权限分类为必选项",
      trigger: "change"
    }
  ],
  description: [
    {
      max: 500,
      message: "描述长度不能超过 500 个字符",
      trigger: "blur"
    }
  ]
});
