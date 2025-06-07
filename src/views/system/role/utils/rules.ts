import type { FormRules } from "element-plus";

// 角色表单验证规则
export const roleFormRules: FormRules = {
  role_name: [
    {
      required: true,
      message: "请输入角色名称",
      trigger: "blur"
    },
    {
      min: 2,
      max: 100,
      message: "角色名称长度在 2 到 100 个字符",
      trigger: "blur"
    },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      message: "角色名称必须以字母开头，只能包含字母、数字和下划线",
      trigger: "blur"
    }
  ],
  display_name: [
    {
      required: true,
      message: "请输入显示名称",
      trigger: "blur"
    },
    {
      min: 2,
      max: 100,
      message: "显示名称长度在 2 到 100 个字符",
      trigger: "blur"
    }
  ],
  description: [
    {
      max: 500,
      message: "描述长度不能超过500个字符",
      trigger: "blur"
    }
  ]
};
