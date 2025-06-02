import type { RouteRecordRaw, RouteRecordRedirectOption } from "vue-router";
import type { AdminMenuTreeItem } from "@/api/routes";

/**
 * 将API返回的菜单树数据转换为Vue Router路由格式
 */
export function transformMenusToRoutes(
  menus: AdminMenuTreeItem[],
  parentPath: string = ""
): RouteRecordRaw[] {
  return menus.map(menu => {
    // 处理路径：如果是子菜单且路径不以/开头，则拼接父路径
    let fullPath = menu.path || "/";
    if (parentPath && menu.path && !menu.path.startsWith("/")) {
      fullPath = `${parentPath}/${menu.path}`;
    }

    const route: any = {
      path: fullPath,
      name: menu.name || menu.meta?.title,
      meta: {
        title: menu.meta?.title,
        icon: menu.meta?.icon,
        showLink: menu.meta?.show_link,
        rank: menu.meta?.rank,
        showParent: menu.meta?.show_parent,
        keepAlive: menu.meta?.keep_alive,
        frameSrc: menu.meta?.frame_src,
        frameLoading: menu.meta?.frame_loading,
        transition: menu.meta?.transition,
        hiddenTag: menu.meta?.hidden_tag,
        dynamicLevel: menu.meta?.dynamic_level,
        activePath: menu.meta?.active_path,
        authority: menu.meta?.authority,
        // 将authority转换为auths，用于按钮权限判断
        auths: menu.meta?.authority || []
      }
    };

    // 只有当component存在时才设置component属性
    const component = getComponent(menu.component);
    if (component) {
      route.component = component;
    }

    if (menu.redirect) {
      route.redirect = menu.redirect as unknown as RouteRecordRedirectOption;
    }

    if (menu.children && menu.children.length > 0) {
      route.children = transformMenusToRoutes(menu.children, fullPath);
    }

    return route as RouteRecordRaw;
  });
}

const modules = import.meta.glob("/src/views/**/*.vue");

/**
 * 根据组件路径获取组件
 */
function getComponent(componentPath?: string) {
  if (!componentPath) {
    console.warn("getComponent called with no componentPath");
    return undefined;
  }

  if (componentPath === "LAYOUT") {
    return () => import("@/layout/index.vue");
  }

  const fullComponentPath = `/src/views/${componentPath}.vue`;
  const componentImporter = modules[fullComponentPath];

  if (componentImporter) {
    return componentImporter;
  } else {
    console.error(
      `Component not found for path: '${componentPath}'. Expected to find it at '${fullComponentPath}' in import.meta.glob results. Available paths:`,
      Object.keys(modules)
    );
    // 尝试记录更详细的匹配失败原因
    // 例如，检查大小写或路径分隔符问题 (虽然 Vite 通常规范化)
    const possibleMatches = Object.keys(modules).filter(p =>
      p.toLowerCase().includes(componentPath.toLowerCase())
    );
    if (possibleMatches.length > 0) {
      console.warn(
        `Found possible case-insensitive or partial matches:`,
        possibleMatches
      );
    }
    return undefined;
  }
}

/**
 * 构建菜单树形结构（API已返回树形结构，此函数保留用于兼容）
 */
export function buildMenuTree(menus: AdminMenuTreeItem[]): AdminMenuTreeItem[] {
  // API已经返回树形结构，直接返回
  return menus;
}

/**
 * 根据用户权限过滤菜单
 */
export function filterMenusByPermissions(
  menus: AdminMenuTreeItem[],
  userPermissions: string[]
): AdminMenuTreeItem[] {
  return menus.filter(menu => {
    // 如果菜单没有权限要求，则显示
    if (!menu.meta.authority || menu.meta.authority.length === 0) {
      return true;
    }

    // 检查用户是否有该菜单的权限
    const hasPermission = menu.meta.authority.some(auth =>
      userPermissions.includes(auth)
    );

    if (hasPermission && menu.children && menu.children.length > 0) {
      // 递归过滤子菜单
      menu.children = filterMenusByPermissions(menu.children, userPermissions);
    }

    return hasPermission;
  });
}
