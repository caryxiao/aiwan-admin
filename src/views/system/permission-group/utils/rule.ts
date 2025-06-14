import { reactive } from "vue";
import type { FormRules } from "element-plus";

export const permissionGroupFormRules = reactive<FormRules>({
  group_key: [
    {
      required: true,
      message: "组键名为必填项",
      trigger: "blur"
    }
  ],
  display_name: [
    {
      required: true,
      message: "显示名称为必填项",
      trigger: "blur"
    }
  ]
});
