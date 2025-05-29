// 根据角色动态生成路由
import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/login",
    method: "post",
    response: ({ body }) => {
      // The new API uses 'identifier' instead of 'username'
      if (body.identifier === "admin" || body.identifier === "common") {
        return {
          success: true,
          code: "SUCCESS",
          message: "登录成功",
          data: {
            token:
              body.identifier === "admin"
                ? "eyJhbGciOiJIUzUxMiJ9.admin"
                : "eyJhbGciOiJIUzUxMiJ9.common"
          },
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          success: false,
          code: "FAIL",
          message: "用户名或密码错误",
          data: null,
          timestamp: new Date().toISOString()
        };
      }
    }
  }
]);
