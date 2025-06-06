import type { FormRules } from "element-plus";

// 菜单表单验证规则
export const formRules: FormRules = {
  title: [{ required: true, message: "菜单名称为必填项", trigger: "blur" }]
  // 以下规则会在组件中根据菜单类型动态添加
  // name: [{ required: true, message: "路由名称为必填项", trigger: "blur" }],
  // path: [{ required: true, message: "路由路径为必填项", trigger: "blur" }],
  // component: [{ required: true, message: "组件路径为必填项", trigger: "blur" }],
  // external_link_url: [
  //   { required: true, message: "外部链接地址为必填项", trigger: "blur" },
  //   { type: "url", message: "请输入正确的URL格式", trigger: "blur" }
  // ]
};
