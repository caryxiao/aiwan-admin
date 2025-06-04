// 这里存放本地图标，在 src/layout/index.vue 文件中加载，避免在首启动加载
import { getSvgInfo } from "@pureadmin/utils";
import { addIcon } from "@iconify/vue/dist/offline";

// https://icon-sets.iconify.design/ep/?keyword=ep
import EpHomeFilled from "~icons/ep/home-filled?raw";
import EpSearch from "~icons/ep/search?raw";
import EpRefresh from "~icons/ep/refresh?raw";
import EpPlus from "~icons/ep/plus?raw";
import EpDelete from "~icons/ep/delete?raw";
import EpEditPen from "~icons/ep/edit-pen?raw";
import EpEdit from "~icons/ep/edit?raw";
import EpKey from "~icons/ep/key?raw";
import EpDownload from "~icons/ep/download?raw";

// https://icon-sets.iconify.design/ri/?keyword=ri
import RiSearchLine from "~icons/ri/search-line?raw";
import RiInformationLine from "~icons/ri/information-line?raw";
import RiAddCircleLine from "~icons/ri/add-circle-line?raw";

const icons = [
  // Element Plus Icon: https://github.com/element-plus/element-plus-icons
  ["ep/home-filled", EpHomeFilled],
  ["ep/search", EpSearch],
  ["ep/refresh", EpRefresh],
  ["ep/plus", EpPlus],
  ["ep/delete", EpDelete],
  ["ep/edit-pen", EpEditPen],
  ["ep/edit", EpEdit],
  ["ep/key", EpKey],
  ["ep/download", EpDownload],
  // Remix Icon: https://github.com/Remix-Design/RemixIcon
  ["ri/search-line", RiSearchLine],
  ["ri/information-line", RiInformationLine],
  ["ri/add-circle-line", RiAddCircleLine]
];

// 本地菜单图标，后端在路由的 icon 中返回对应的图标字符串并且前端在此处使用 addIcon 添加即可渲染菜单图标
icons.forEach(([name, icon]) => {
  addIcon(name as string, getSvgInfo(icon as string));
});
