import type { FormRules } from "element-plus";

// 用户表单验证规则
export const userFormRules: FormRules = {
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur"
    },
    {
      min: 3,
      max: 20,
      message: "用户名长度在 3 到 20 个字符",
      trigger: "blur"
    }
  ],
  email: [
    {
      required: true,
      message: "请输入邮箱",
      trigger: "blur"
    },
    {
      type: "email",
      message: "请输入正确的邮箱格式",
      trigger: "blur"
    }
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur"
    },
    {
      min: 6,
      message: "密码长度不能少于6位",
      trigger: "blur"
    }
  ],
  full_name: [
    {
      max: 50,
      message: "姓名长度不能超过50个字符",
      trigger: "blur"
    }
  ]
};

// 密码重置表单验证规则
export const passwordResetRules = (passwordForm: any): FormRules => ({
  password: [
    {
      required: true,
      message: "请输入新密码",
      trigger: "blur"
    },
    {
      min: 6,
      message: "密码长度不能少于6位",
      trigger: "blur"
    }
  ],
  confirmPassword: [
    {
      required: true,
      message: "请确认密码",
      trigger: "blur"
    },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== passwordForm.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

// 分配角色表单验证规则
export const assignRoleRules: FormRules = {
  roleIds: [
    {
      required: true,
      message: "请选择至少一个角色",
      trigger: "change"
    },
    {
      validator: (rule: any, value: any[], callback: Function) => {
        if (!value || value.length === 0) {
          callback(new Error("请选择至少一个角色"));
        } else {
          callback();
        }
      },
      trigger: "change"
    }
  ]
};
