import type { FormRules } from "element-plus";

/** 表单规则 */
export const formRules = (
  passwordForm: any,
  isEdit: boolean = false
): FormRules => {
  const rules: FormRules = {
    username: [
      { required: true, message: "请输入用户名", trigger: "manual" },
      {
        min: 3,
        max: 20,
        message: "用户名长度在 3 到 20 个字符",
        trigger: "manual"
      }
    ],
    email: [
      { required: true, message: "请输入邮箱", trigger: "manual" },
      { type: "email", message: "请输入正确的邮箱格式", trigger: "manual" }
    ],
    password: [
      { required: !isEdit, message: "请输入密码", trigger: "manual" },
      {
        min: 6,
        max: 20,
        message: "密码长度在 6 到 20 个字符",
        trigger: "manual"
      }
    ]
  };

  return rules;
};

/** 密码重置表单规则 */
export const passwordRules = (passwordForm: any): FormRules => ({
  password: [
    { required: true, message: "请输入新密码", trigger: "change" },
    { min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "change" }
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== passwordForm.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "change"
    }
  ]
});
