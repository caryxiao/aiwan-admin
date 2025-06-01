import { defineStore } from "pinia";
import { cloneDeep } from "lodash-es";
import {
  type cacheType,
  store,
  debounce,
  ascending,
  getKeyList,
  filterTree,
  constantMenus,
  filterNoPermissionTree,
  formatFlatteningRoutes
} from "../utils";
import { useMultiTagsStoreHook } from "./multiTags";

export const usePermissionStore = defineStore("pure-permission", {
  state: () => ({
    // 静态路由生成的菜单
    constantMenus,
    // 整体路由生成的菜单（静态、动态）
    wholeMenus: [],
    // 整体路由（一维数组格式）
    flatteningRoutes: [],
    // 缓存页面keepAlive
    cachePageList: []
  }),
  actions: {
    /** 组装整体路由生成的菜单 */
    handleWholeMenus(routes: any[]) {
      console.log(
        "handleWholeMenus - 接收到的路由 (routes):",
        JSON.stringify(cloneDeep(routes), null, 2)
      );
      const filteredNoPermissionTree = filterNoPermissionTree(
        filterTree(ascending(this.constantMenus.concat(routes)))
      );
      console.log(
        "handleWholeMenus - 过滤无权限和 showLink 为 false 后的树 (filteredNoPermissionTree):",
        JSON.stringify(cloneDeep(filteredNoPermissionTree), null, 2)
      );
      this.wholeMenus = filteredNoPermissionTree;
      const newFlatteningRoutes = formatFlatteningRoutes(
        this.constantMenus.concat(routes) as any
      );
      console.log(
        "handleWholeMenus - 扁平化后的路由 (newFlatteningRoutes):",
        JSON.stringify(cloneDeep(newFlatteningRoutes), null, 2)
      );
      this.flatteningRoutes = newFlatteningRoutes;
    },
    cacheOperate({ mode, name }: cacheType) {
      const delIndex = this.cachePageList.findIndex(v => v === name);
      switch (mode) {
        case "refresh":
          this.cachePageList = this.cachePageList.filter(v => v !== name);
          break;
        case "add":
          this.cachePageList.push(name);
          break;
        case "delete":
          delIndex !== -1 && this.cachePageList.splice(delIndex, 1);
          break;
      }
      /** 监听缓存页面是否存在于标签页，不存在则删除 */
      debounce(() => {
        let cacheLength = this.cachePageList.length;
        const nameList = getKeyList(useMultiTagsStoreHook().multiTags, "name");
        while (cacheLength > 0) {
          nameList.findIndex(v => v === this.cachePageList[cacheLength - 1]) ===
            -1 &&
            this.cachePageList.splice(
              this.cachePageList.indexOf(this.cachePageList[cacheLength - 1]),
              1
            );
          cacheLength--;
        }
      })();
    },
    /** 清空缓存页面 */
    clearAllCachePage() {
      this.wholeMenus = [];
      this.cachePageList = [];
    }
  }
});

export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
