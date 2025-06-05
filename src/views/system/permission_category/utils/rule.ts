import type { FormRules } from "element-plus";

// 表单验证规则
export const formRules: FormRules = {
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
  description: [
    {
      max: 500,
      message: "描述长度不能超过 500 个字符",
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
