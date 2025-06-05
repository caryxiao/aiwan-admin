import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [
    { required: true, message: "部门名称为必填项", trigger: "blur" },
    {
      min: 1,
      max: 50,
      message: "部门名称长度在 1 到 50 个字符",
      trigger: "blur"
    }
  ],
  code: [
    { required: true, message: "部门编码为必填项", trigger: "blur" },
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
});
