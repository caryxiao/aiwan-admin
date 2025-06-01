import { defineStore } from "pinia";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import {
  type UserResult,
  type RefreshTokenResult,
  type CurrentUserResult,
  getLogin,
  refreshTokenApi,
  getCurrentUser
} from "@/api/user";
import { useMultiTagsStoreHook } from "./multiTags";
import {
  type DataInfo,
  setToken,
  getToken,
  removeToken,
  userKey
} from "@/utils/auth";

export const useUserStore = defineStore("pure-user", {
  state: (): userType => ({
    // 头像
    avatar: storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? "",
    // 用户名
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? "",
    // 昵称
    nickname: storageLocal().getItem<DataInfo<number>>(userKey)?.nickname ?? "",
    // 页面级别权限
    roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
    // 按钮级别权限
    permissions:
      storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [],
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7
  }),
  actions: {
    /** 存储头像 */
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储昵称 */
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储按钮级别权限 */
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin({
          identifier: data.identifier,
          password: data.password
        })
          .then(async loginData => {
            if (loginData?.success) {
              // 设置令牌信息，包括访问令牌、刷新令牌和过期时间
              setToken({
                accessToken: loginData.data.access_token,
                refreshToken: loginData.data.refresh_token,
                expires: new Date(loginData.data.access_token_expires_at * 1000) // 转换为毫秒时间戳
              });

              // 登录成功后获取用户信息
              try {
                await this.getUserInfo();
              } catch (error) {
                console.error("获取用户信息失败:", error);
              }
            }
            resolve(loginData);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 获取当前用户信息 */
    async getUserInfo() {
      return new Promise<CurrentUserResult>((resolve, reject) => {
        getCurrentUser()
          .then(data => {
            if (data?.success) {
              // 更新用户信息到store和localStorage
              this.SET_USERNAME(data.data.username);
              this.SET_NICKNAME(data.data.full_name || data.data.username);
              this.SET_ROLES(data.data.roles);
              this.SET_PERMS(data.data.permissions);

              // 更新localStorage中的用户信息
              const currentToken = getToken();
              setToken({
                ...currentToken,
                username: data.data?.username,
                nickname: data.data?.full_name || data.data?.username,
                roles: data.data?.roles,
                permissions: data.data?.permissions
              } as any);
            }
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      this.permissions = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then(data => {
            if (data?.success) {
              // 更新访问令牌信息，保留原有的刷新令牌
              const currentRefreshToken = getToken()?.refreshToken;
              setToken({
                accessToken: data.data.access_token,
                refreshToken: currentRefreshToken, // 保留原有的刷新令牌
                expires: new Date(data.data.access_token_expires_at * 1000) // 转换为毫秒时间戳
              });
            }
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
