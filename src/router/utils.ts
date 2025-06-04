import {
  type RouterHistory,
  type RouteRecordRaw,
  type RouteComponent,
  type RouteRecordRedirectOption,
  createWebHistory,
  createWebHashHistory
} from "vue-router";
import { router } from "./index";
import { isProxy, toRaw } from "vue";
import { useTimeoutFn } from "@vueuse/core";
import {
  isString,
  cloneDeep,
  isAllEmpty,
  intersection,
  storageLocal
  // isIncludeAllChildren
} from "@pureadmin/utils";
import { getConfig } from "@/config";
import { buildHierarchyTree } from "@/utils/tree";
import { userKey, type DataInfo } from "@/utils/auth";
import { useUserStoreHook } from "@/store/modules/user";
import { type menuType, routerArrays } from "@/layout/types";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { usePermissionStoreHook } from "@/store/modules/permission";
const IFrame = () => import("@/layout/frame.vue");
// https://cn.vitejs.dev/guide/features.html#glob-import
const modulesRoutes = import.meta.glob("/src/views/**/*.{vue,tsx}");

// 动态路由
import { getAsyncRoutes } from "@/api/routes";
import { transformMenusToRoutes, buildMenuTree } from "@/utils/dynamicRoutes";
import type { AdminMenuTreeItem } from "@/api/routes";

function handRank(routeInfo: any) {
  const { name, path, parentId, meta } = routeInfo;
  return isAllEmpty(parentId)
    ? isAllEmpty(meta?.rank) ||
      (meta?.rank === 0 && name !== "Home" && path !== "/")
      ? true
      : false
    : false;
}

/** 按照路由中meta下的rank等级升序来排序路由 */
function ascending(arr: any[]) {
  arr.forEach((v, index) => {
    // 当rank不存在时，根据顺序自动创建，首页路由永远在第一位
    if (handRank(v)) {
      if (!v.meta) v.meta = {};
      v.meta.rank = index + 2;
    }
  });
  return arr.sort(
    (a: { meta: { rank: number } }, b: { meta: { rank: number } }) => {
      return a?.meta.rank - b?.meta.rank;
    }
  );
}

/** 过滤meta中showLink为false的菜单 */
function filterTree(data: RouteComponent[]) {
  const newTree = cloneDeep(data).filter(
    (v: { meta: { showLink: boolean } }) => v.meta?.showLink !== false
  );
  newTree.forEach(
    (v: { children }) => v.children && (v.children = filterTree(v.children))
  );
  return newTree;
}

/** 过滤children长度为0的的目录，当目录下没有菜单时，会过滤此目录，目录没有赋予roles权限，当目录下只要有一个菜单有显示权限，那么此目录就会显示 */
function filterChildrenTree(data: RouteComponent[]) {
  const newTree = cloneDeep(data).filter((v: any) => v?.children?.length !== 0);
  newTree.forEach(
    (v: { children }) => v.children && (v.children = filterTree(v.children))
  );
  return newTree;
}

/** 判断两个数组彼此是否存在相同值 */
function isOneOfArray(a: Array<string>, b: Array<string>) {
  return Array.isArray(a) && Array.isArray(b)
    ? intersection(a, b).length > 0
      ? true
      : false
    : true;
}

/** 从localStorage里取出当前登录用户的角色roles，过滤无权限的菜单 */
function filterNoPermissionTree(data: RouteComponent[]) {
  const currentRoles =
    storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [];
  const newTree = cloneDeep(data).filter((v: any) =>
    isOneOfArray(v.meta?.roles, currentRoles)
  );
  newTree.forEach(
    (v: any) => v.children && (v.children = filterNoPermissionTree(v.children))
  );
  return filterChildrenTree(newTree);
}

/** 通过指定 `key` 获取父级路径集合，默认 `key` 为 `path` */
function getParentPaths(value: string, routes: RouteRecordRaw[], key = "path") {
  // 深度遍历查找
  function dfs(routes: RouteRecordRaw[], value: string, parents: string[]) {
    for (let i = 0; i < routes.length; i++) {
      const item = routes[i];
      // 返回父级path
      if (item[key] === value) return parents;
      // children不存在或为空则不递归
      if (!item.children || !item.children.length) continue;
      // 往下查找时将当前path入栈
      parents.push(item.path);

      if (dfs(item.children, value, parents).length) return parents;
      // 深度遍历查找未找到时当前path 出栈
      parents.pop();
    }
    // 未找到时返回空数组
    return [];
  }

  return dfs(routes, value, []);
}

/** 查找对应 `path` 的路由信息 */
function findRouteByPath(path: string, routes: RouteRecordRaw[]) {
  let res = routes.find((item: { path: string }) => item.path == path);
  if (res) {
    return isProxy(res) ? toRaw(res) : res;
  } else {
    for (let i = 0; i < routes.length; i++) {
      if (
        routes[i].children instanceof Array &&
        routes[i].children.length > 0
      ) {
        res = findRouteByPath(path, routes[i].children);
        if (res) {
          return isProxy(res) ? toRaw(res) : res;
        }
      }
    }
    return null;
  }
}

function addPathMatch() {
  if (!router.hasRoute("pathMatch")) {
    router.addRoute({
      path: "/:pathMatch(.*)",
      name: "pathMatch",
      redirect: "/error/404"
    });
  }
}

/** 处理动态路由（后端返回的路由） */
function handleAsyncRoutes(routeList: any[]) {
  // console.log(
  //   "handleAsyncRoutes - 接收到的原始路由数据 (routeList):",
  //   JSON.stringify(cloneDeep(routeList), null, 2)
  // // );
  // console.log("handleAsyncRoutes - 接收到的路由数据:", routeList);

  if (routeList.length === 0) {
    console.log("路由数据为空");
    usePermissionStoreHook().handleWholeMenus(routeList);
  } else {
    // 如果routeList是菜单数据，需要先转换为路由格式
    let processedRoutes = routeList;

    // 检查是否是菜单数据格式（包含menu_type字段）
    if (routeList[0] && routeList[0].menu_type) {
      // console.log("检测到菜单数据格式，开始转换为路由格式...");
      // 构建菜单树
      const menuTree = buildMenuTree(routeList as AdminMenuTreeItem[]);
      // console.log(
      //   "构建的菜单树 (menuTree):",
      //   JSON.stringify(cloneDeep(menuTree), null, 2)
      // );
      // 转换为路由格式
      processedRoutes = transformMenusToRoutes(menuTree);
      // console.log(
      //   "转换后的路由数据 (processedRoutes):",
      //   JSON.stringify(cloneDeep(processedRoutes), null, 2)
      // );
    }

    // console.log(
    //   "最终准备添加到 router 的路由数据 (树形 processedRoutes):",
    //   JSON.stringify(cloneDeep(processedRoutes), null, 2)
    // );

    // 将处理后的路由添加到路由表中
    // 注意：这里我们假设所有动态获取的路由都应作为 "Home" 路由的子路由
    // 如果你的应用有不同的结构，例如多个顶级动态路由，需要调整此处的逻辑
    console.log("开始将处理后的路由添加到路由表...");
    processedRoutes.forEach((route: RouteRecordRaw) => {
      if (route.name && !router.hasRoute(route.name)) {
        try {
          router.addRoute(route); // 直接添加路由，由Vue Router根据定义处理层级
          // console.log(
          //   `成功添加路由 ${route.path || "unknown"}:`,
          //   JSON.stringify(cloneDeep(route), null, 2)
          // );
        } catch (e) {
          console.error(
            `添加路由 ${route.path || "unknown"} 失败:`,
            e,
            JSON.stringify(cloneDeep(route), null, 2)
          );
        }
      } else if (!route.name) {
        console.warn(
          `路由 ${route.path || "unknown"} 没有名称，无法检查是否已存在或添加，已跳过。`,
          JSON.stringify(cloneDeep(route), null, 2)
        );
      } else {
        console.log(
          `路由 ${String(route.name)} (${route.path || "unknown"}) 已存在，跳过添加。`,
          JSON.stringify(cloneDeep(route), null, 2)
        );
      }
    });
    console.log("所有动态路由添加完成。");

    // 将扁平化后的路由处理后传递给 usePermissionStoreHook().handleWholeMenus
    // 将具有层级结构的路由数据传递给 store，而不是扁平化的
    // console.log(
    //   "准备传递给 store 的层级路由 (processedRoutes):",
    //   JSON.stringify(cloneDeep(processedRoutes), null, 2)
    // );
    usePermissionStoreHook().handleWholeMenus(processedRoutes);
    console.log(
      "路由处理完成，当前所有路由:",
      router.getRoutes().map(r => ({
        path: r.path,
        name: r.name,
        children: r.children?.map(c => ({ path: c.path, name: c.name }))
      }))
    );
  }
  if (!useMultiTagsStoreHook().getMultiTagsCache) {
    useMultiTagsStoreHook().handleTags("equal", [
      ...routerArrays,
      ...usePermissionStoreHook().flatteningRoutes.filter(
        v => v?.meta?.fixedTag
      )
    ]);
  }
  addPathMatch();
}

/** 初始化路由（`new Promise` 写法防止在异步请求中造成无限循环）*/
export const initRouter = () => {
  return new Promise<any>(resolve => {
    // 检查用户是否已登录且有角色信息
    const userInfo = storageLocal().getItem(userKey) as DataInfo<number>;
    console.log("initRouter - 用户信息:", userInfo);

    if (
      userInfo?.accessToken &&
      (!userInfo.roles || userInfo.roles.length === 0)
    ) {
      // 用户已登录但缺少角色信息，先获取用户信息
      console.log("用户已登录但缺少角色信息，正在获取用户信息...");
      useUserStoreHook()
        .getUserInfo()
        .then(() => {
          // 获取用户信息后继续处理路由
          proceedWithRouteInit(resolve);
        })
        .catch(error => {
          console.error("获取用户信息失败:", error);
          proceedWithRouteInit(resolve);
        });
    } else {
      proceedWithRouteInit(resolve);
    }
  });
};

function proceedWithRouteInit(resolve: (value: any) => void) {
  console.log("开始处理路由初始化...");
  if (getConfig()?.CachingAsyncRoutes) {
    // 从缓存中获取路由
    const asyncRouteList =
      storageLocal().getItem<DataInfo<number>>("async-routes") || [];
    console.log("缓存的路由数据:", asyncRouteList);

    if (!Array.isArray(asyncRouteList) || asyncRouteList.length === 0) {
      // 缓存为空，从服务器获取
      console.log("缓存为空，从服务器获取菜单数据...");
      getAsyncRoutes()
        .then(apiResponse => {
          console.log("从服务器获取到的菜单数据:", apiResponse);
          const menuData = apiResponse.data || [];
          handleAsyncRoutes(menuData);
          storageLocal().setItem("async-routes", menuData);
          resolve(router);
        })
        .catch(error => {
          console.error("获取异步路由失败:", error);
          resolve(router);
        });
    } else {
      console.log("使用缓存的路由数据");
      handleAsyncRoutes(asyncRouteList);
      resolve(router);
    }
  } else {
    // 每次都从服务器获取最新路由
    console.log("每次都从服务器获取最新路由...");
    getAsyncRoutes()
      .then(apiResponse => {
        console.log("从服务器获取到的菜单数据:", apiResponse);
        const menuData = apiResponse.data || [];
        handleAsyncRoutes(menuData);
        resolve(router);
      })
      .catch(error => {
        console.error("获取异步路由失败:", error);
        resolve(router);
      });
  }
}

/**
 * 将多级嵌套路由处理成一维数组
 * @param routesList 传入路由
 * @returns 返回处理后的一维路由
 */
function formatFlatteningRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0) return routesList;
  let hierarchyList = buildHierarchyTree(routesList);
  for (let i = 0; i < hierarchyList.length; i++) {
    if (hierarchyList[i].children) {
      hierarchyList = hierarchyList
        .slice(0, i + 1)
        .concat(hierarchyList[i].children, hierarchyList.slice(i + 1));
    }
  }
  return hierarchyList;
}

/**
 * 一维数组处理成多级嵌套数组（三级及以上的路由全部拍成二级，keep-alive 只支持到二级缓存）
 * https://github.com/pure-admin/vue-pure-admin/issues/67
 * @param routesList 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成规定路由的格式
 */
function formatTwoStageRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0) return routesList;
  const newRoutesList: RouteRecordRaw[] = [];
  routesList.forEach((v: RouteRecordRaw) => {
    if (v.path === "/") {
      newRoutesList.push({
        component: v.component,
        name: v.name,
        path: v.path,
        redirect: v.redirect as unknown as RouteRecordRedirectOption,
        meta: v.meta,
        children: []
      });
    } else {
      newRoutesList[0]?.children.push({ ...v });
    }
  });
  return newRoutesList;
}

/** 处理缓存路由（添加、删除、刷新） */
function handleAliveRoute({ name }: ToRouteType, mode?: string) {
  switch (mode) {
    case "add":
      usePermissionStoreHook().cacheOperate({
        mode: "add",
        name
      });
      break;
    case "delete":
      usePermissionStoreHook().cacheOperate({
        mode: "delete",
        name
      });
      break;
    case "refresh":
      usePermissionStoreHook().cacheOperate({
        mode: "refresh",
        name
      });
      break;
    default:
      usePermissionStoreHook().cacheOperate({
        mode: "delete",
        name
      });
      useTimeoutFn(() => {
        usePermissionStoreHook().cacheOperate({
          mode: "add",
          name
        });
      }, 100);
  }
}

/** 过滤后端传来的动态路由 重新生成规范路由 */
function addAsyncRoutes(arrRoutes: Array<RouteRecordRaw>) {
  if (!arrRoutes || !arrRoutes.length) return [];
  const modulesRoutesKeys = Object.keys(modulesRoutes);
  arrRoutes.forEach((v: RouteRecordRaw) => {
    // 将backstage属性加入meta，标识此路由为后端返回路由
    v.meta.backstage = true;
    // 父级的redirect属性取值：如果子级存在且父级的redirect属性不存在，默认取第一个子级的path；如果子级存在且父级的redirect属性存在，取存在的redirect属性，会覆盖默认值
    if (v?.children && v.children.length && !v.redirect)
      v.redirect = v.children[0].path as unknown as RouteRecordRedirectOption;
    // 父级的name属性取值：如果子级存在且父级的name属性不存在，默认取第一个子级的name；如果子级存在且父级的name属性存在，取存在的name属性，会覆盖默认值（注意：测试中发现父级的name不能和子级name重复，如果重复会造成重定向无效（跳转404），所以这里给父级的name起名的时候后面会自动加上`Parent`，避免重复）
    if (v?.children && v.children.length && !v.name)
      v.name = (v.children[0].name as string) + "Parent";
    if (v.meta?.frameSrc) {
      v.component = IFrame;
    } else {
      // 对后端传component组件路径和不传做兼容（如果后端传component组件路径，那么path可以随便写，如果不传，component组件路径会跟path保持一致）
      const index = v?.component
        ? modulesRoutesKeys.findIndex(ev => ev.includes(v.component as any))
        : modulesRoutesKeys.findIndex(ev => ev.includes(v.path));
      v.component = modulesRoutes[modulesRoutesKeys[index]];
    }
    if (v?.children && v.children.length) {
      addAsyncRoutes(v.children);
    }
  });
  return arrRoutes;
}

/** 获取路由历史模式 https://next.router.vuejs.org/zh/guide/essentials/history-mode.html */
function getHistoryMode(routerHistory): RouterHistory {
  // len为1 代表只有历史模式 为2 代表历史模式中存在base参数 https://next.router.vuejs.org/zh/api/#%E5%8F%82%E6%95%B0-1
  const historyMode = routerHistory.split(",");
  const leftMode = historyMode[0];
  const rightMode = historyMode[1];
  // no param
  if (historyMode.length === 1) {
    if (leftMode === "hash") {
      return createWebHashHistory("");
    } else if (leftMode === "h5") {
      return createWebHistory("");
    }
  } //has param
  else if (historyMode.length === 2) {
    if (leftMode === "hash") {
      return createWebHashHistory(rightMode);
    } else if (leftMode === "h5") {
      return createWebHistory(rightMode);
    }
  }
}

/** 获取当前页面按钮级别的权限 */
function getAuths(): Array<string> {
  return router.currentRoute.value.meta.auths as Array<string>;
}

/** 检查权限是否匹配（支持通配符） */
function checkPermissionMatch(
  requiredPermission: string,
  userPermissions: Array<string>
): boolean {
  // 直接匹配
  if (userPermissions.includes(requiredPermission)) {
    return true;
  }

  // 检查通配符权限
  for (const permission of userPermissions) {
    if (permission === "*:*") {
      // 超级管理员权限，允许所有操作
      return true;
    }

    if (permission.includes("*")) {
      // 处理通配符权限
      const permissionPattern = permission.replace(/\*/g, ".*");
      const regex = new RegExp(`^${permissionPattern}$`);
      if (regex.test(requiredPermission)) {
        return true;
      }
    }
  }

  return false;
}

/** 是否有按钮级别的权限（根据路由`meta`中的`auths`字段进行判断）*/
function hasAuth(value: string | Array<string>): boolean {
  if (!value) return false;

  // 获取用户的所有权限（从用户信息中获取）
  const userStore = useUserStoreHook();
  const userPermissions = userStore.permissions || [];

  // 如果用户有超级管理员权限，直接返回true
  if (userPermissions.includes("*:*")) {
    return true;
  }

  /** 从当前路由的`meta`字段里获取按钮级别的所有自定义`code`值 */
  const metaAuths = getAuths();
  if (!metaAuths) return false;

  // 检查所需权限
  if (isString(value)) {
    // 首先检查用户权限中是否直接包含所需权限
    if (checkPermissionMatch(value, userPermissions)) {
      return true;
    }
    // 然后检查路由meta中的权限
    return metaAuths.includes(value);
  } else {
    // 数组权限，需要所有权限都满足
    return value.every(
      perm =>
        checkPermissionMatch(perm, userPermissions) || metaAuths.includes(perm)
    );
  }
}

function handleTopMenu(route) {
  if (route?.children && route.children.length > 1) {
    if (route.redirect) {
      return route.children.filter(cur => cur.path === route.redirect)[0];
    } else {
      return route.children[0];
    }
  } else {
    return route;
  }
}

/** 获取所有菜单中的第一个菜单（顶级菜单）*/
function getTopMenu(tag = false): menuType {
  const wholeMenus = usePermissionStoreHook().wholeMenus;
  if (
    !wholeMenus ||
    wholeMenus.length === 0 ||
    !wholeMenus[0]?.children ||
    wholeMenus[0].children.length === 0
  ) {
    // 返回默认的首页路由
    return { path: "/welcome", meta: { title: "首页" }, value: null };
  }

  const topMenu = handleTopMenu(wholeMenus[0].children[0]);
  if (!topMenu) {
    return { path: "/welcome", meta: { title: "首页" }, value: null };
  }

  tag && useMultiTagsStoreHook().handleTags("push", topMenu);
  return topMenu;
}

export {
  hasAuth,
  getAuths,
  ascending,
  filterTree,
  getTopMenu,
  addPathMatch,
  isOneOfArray,
  getHistoryMode,
  addAsyncRoutes,
  getParentPaths,
  findRouteByPath,
  handleAliveRoute,
  formatTwoStageRoutes,
  formatFlatteningRoutes,
  filterNoPermissionTree
};
