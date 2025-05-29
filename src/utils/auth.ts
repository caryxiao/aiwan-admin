import Cookies from "js-cookie";
import { useUserStoreHook } from "@/store/modules/user";
import { storageLocal, isString, isIncludeAllChildren } from "@pureadmin/utils";

export interface DataInfo<T> {
  /** token */
  accessToken: string;
  /** `accessToken`的过期时间（时间戳） */
  expires?: T; // Making expires optional as it's not in the new API response
  /** 用于调用刷新accessToken的接口时所需的token */
  refreshToken?: string; // Making refreshToken optional
  /** 头像 */
  avatar?: string;
  /** 用户名 */
  username?: string;
  /** 昵称 */
  nickname?: string;
  /** 当前登录用户的角色 */
  roles?: Array<string>;
  /** 当前登录用户的按钮级别权限 */
  permissions?: Array<string>;
}

export const userKey = "user-info";
export const TokenKey = "authorized-token";
/**
 * 通过`multiple-tabs`是否在`cookie`中，判断用户是否已经登录系统，
 * 从而支持多标签页打开已经登录的系统后无需再登录。
 * 浏览器完全关闭后`multiple-tabs`将自动从`cookie`中销毁，
 * 再次打开浏览器需要重新登录系统
 * */
export const multipleTabsKey = "multiple-tabs";

/** 获取`token` */
export function getToken(): DataInfo<number> {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  return Cookies.get(TokenKey)
    ? JSON.parse(Cookies.get(TokenKey))
    : storageLocal().getItem(userKey);
}

/**
 * @description 设置`token`以及一些必要信息
 * 新版API：登录接口只返回`accessToken`，刷新令牌功能需要单独实现
 * 将`accessToken`信息放在key值为authorized-token的cookie里
 * 将用户相关信息放在key值为`user-info`的localStorage里（利用`multipleTabsKey`当浏览器完全关闭后自动销毁）
 */
export function setToken(data: Partial<DataInfo<Date>>) {
  const {
    accessToken,
    expires,
    refreshToken,
    username,
    roles,
    permissions,
    avatar,
    nickname
  } = data;
  const { isRemembered, loginDay } = useUserStoreHook();

  // 处理过期时间
  let newExpires = 0;
  if (expires) {
    if (typeof expires === "string") {
      newExpires = new Date(expires).getTime();
    } else if (expires instanceof Date) {
      newExpires = expires.getTime();
    } else if (typeof expires === "number") {
      newExpires = expires;
    }
  }

  // 构建cookie数据（主要存储token信息）
  const cookieData: Partial<DataInfo<number>> = { accessToken };
  if (newExpires > 0) cookieData.expires = newExpires;
  if (refreshToken) cookieData.refreshToken = refreshToken;

  const cookieString = JSON.stringify(cookieData);

  // 设置cookie，如果有过期时间则使用，否则使用会话cookie
  let cookieExpires = 2 / 24; // 默认2小时
  if (isRemembered && loginDay && loginDay > 0) {
    cookieExpires = loginDay;
  } else if (newExpires > 0) {
    cookieExpires = (newExpires - Date.now()) / 86400000;
  }
  if (newExpires > 0) {
    Cookies.set(TokenKey, cookieString, {
      expires: cookieExpires
    });
  } else {
    // 如果没有明确的过期时间，设置默认的会话时长（比如2小时）
    const defaultExpires = Date.now() + 2 * 60 * 60 * 1000; // 2小时
    cookieData.expires = defaultExpires;
    Cookies.set(TokenKey, JSON.stringify(cookieData), {
      expires: cookieExpires
    });
  }

  Cookies.set(multipleTabsKey, JSON.stringify(cookieData), {
    expires: cookieExpires
  });

  // 构建本地存储数据（存储用户信息）
  const localData: Partial<DataInfo<number>> = { accessToken };
  if (cookieData.expires) localData.expires = cookieData.expires;
  if (refreshToken) localData.refreshToken = refreshToken;
  if (username) localData.username = username;
  if (roles) localData.roles = roles;
  if (permissions) localData.permissions = permissions;
  if (avatar) localData.avatar = avatar;
  if (nickname) localData.nickname = nickname;

  storageLocal().setItem(userKey, localData);

  // 更新store中的用户信息
  if (avatar) useUserStoreHook().SET_AVATAR(avatar);
  if (username) useUserStoreHook().SET_USERNAME(username);
  if (nickname) useUserStoreHook().SET_NICKNAME(nickname);
  if (roles) useUserStoreHook().SET_ROLES(roles);
  if (permissions) useUserStoreHook().SET_PERMS(permissions);
}

/** 删除`token`以及key值为`user-info`的localStorage信息 */
export function removeToken() {
  Cookies.remove(TokenKey);
  Cookies.remove(multipleTabsKey);
  storageLocal().removeItem(userKey);
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return "Bearer " + token;
};

/** 是否有按钮级别的权限（根据登录接口返回的`permissions`字段进行判断）*/
export const hasPerms = (value: string | Array<string>): boolean => {
  if (!value) return false;
  const allPerms = "*:*:*";
  const { permissions } = useUserStoreHook();
  if (!permissions) return false;
  if (permissions.length === 1 && permissions[0] === allPerms) return true;
  const isAuths = isString(value)
    ? permissions.includes(value)
    : isIncludeAllChildren(value, permissions);
  return isAuths ? true : false;
};
