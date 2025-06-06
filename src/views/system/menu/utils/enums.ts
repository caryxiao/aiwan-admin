import type { OptionsType } from "@/components/ReSegmented";

// 菜单类型选项
const menuTypeOptions: Array<OptionsType> = [
  {
    label: "目录",
    value: "CATALOG"
  },
  {
    label: "菜单",
    value: "MENU"
  },
  {
    label: "按钮",
    value: "BUTTON"
  }
];

// 状态选项
const statusOptions: Array<OptionsType> = [
  {
    label: "启用",
    tip: "菜单正常显示和使用",
    value: "ENABLED"
  },
  {
    label: "禁用",
    tip: "菜单不显示且不可使用",
    value: "DISABLED"
  }
];

// 是否隐藏选项
const hiddenOptions: Array<OptionsType> = [
  {
    label: "显示",
    tip: "会在菜单中显示",
    value: false
  },
  {
    label: "隐藏",
    tip: "不会在菜单中显示",
    value: true
  }
];

// 是否缓存选项
const cacheOptions: Array<OptionsType> = [
  {
    label: "缓存",
    tip: "页面会被缓存，切换时保持状态",
    value: true
  },
  {
    label: "不缓存",
    tip: "页面不会被缓存，每次切换都会重新加载",
    value: false
  }
];

// 是否外部链接选项
const externalLinkOptions: Array<OptionsType> = [
  {
    label: "是",
    tip: "点击菜单时打开外部链接",
    value: true
  },
  {
    label: "否",
    tip: "点击菜单时打开内部页面",
    value: false
  }
];

export {
  menuTypeOptions,
  statusOptions,
  hiddenOptions,
  cacheOptions,
  externalLinkOptions
};
