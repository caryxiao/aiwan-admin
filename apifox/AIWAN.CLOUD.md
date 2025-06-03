---
title: AIWAN.CLOUD
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"
---

# AIWAN.CLOUD

Base URLs:

# Authentication

- HTTP Authentication, scheme: bearer<br/>Enter JWT Bearer token **_only_**

- HTTP Authentication, scheme: bearer

- HTTP Authentication, scheme: bearer

# Auth

## POST Login

POST /api/v1/auth/login

> Body 请求参数

```json
{
  "identifier": "13477072323@qq.com",
  "password": "a12345678"
}
```

### 请求参数

| 名称         | 位置 | 类型   | 必选 | 说明 |
| ------------ | ---- | ------ | ---- | ---- |
| body         | body | object | 否   | none |
| » identifier | body | string | 是   | none |
| » password   | body | string | 是   | none |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "access_token": "string",
    "refresh_token": "string",
    "token_type": "Bearer",
    "access_token_expires_at": 0
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称                       | 类型              | 必选 | 约束 | 中文名 | 说明                                                         |
| -------------------------- | ----------------- | ---- | ---- | ------ | ------------------------------------------------------------ |
| » success                  | boolean           | true | none |        | 请求是否成功                                                 |
| » code                     | string            | true | none |        | 业务状态码，SUCCESS表示成功                                  |
| » message                  | string            | true | none |        | 对当前状态的描述信息                                         |
| » data                     | object            | true | none |        | 返回的业务数据主体                                           |
| »» access_token            | string            | true | none |        | 访问令牌 (Access Token)。                                    |
| »» refresh_token           | string            | true | none |        | 刷新令牌 (Refresh Token)。                                   |
| »» token_type              | string            | true | none |        | 令牌类型，通常为 'Bearer'。                                  |
| »» access_token_expires_at | integer(int64)    | true | none |        | 访问令牌的过期时间戳 (Unix timestamp, seconds since epoch)。 |
| » timestamp                | string(date-time) | true | none |        | 服务器响应时间戳                                             |

#### 枚举值

| 属性       | 值      |
| ---------- | ------- |
| code       | SUCCESS |
| code       | FAIL    |
| token_type | Bearer  |

## POST Refresh Token

POST /api/v1/auth/refresh-token

> Body 请求参数

```json
{
  "refresh_token": "string"
}
```

### 请求参数

| 名称            | 位置 | 类型   | 必选 | 说明                           |
| --------------- | ---- | ------ | ---- | ------------------------------ |
| body            | body | object | 否   | none                           |
| » refresh_token | body | string | 是   | 用于获取新访问令牌的刷新令牌。 |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "access_token": "string",
    "token_type": "Bearer",
    "access_token_expires_at": 0
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称                       | 类型              | 必选 | 约束 | 中文名 | 说明                                                           |
| -------------------------- | ----------------- | ---- | ---- | ------ | -------------------------------------------------------------- |
| » success                  | boolean           | true | none |        | 请求是否成功                                                   |
| » code                     | string            | true | none |        | 业务状态码，SUCCESS表示成功                                    |
| » message                  | string            | true | none |        | 对当前状态的描述信息                                           |
| » data                     | object            | true | none |        | 返回的业务数据主体                                             |
| »» access_token            | string            | true | none |        | 新的访问令牌 (Access Token)。                                  |
| »» token_type              | string            | true | none |        | 令牌类型，通常为 'Bearer'。                                    |
| »» access_token_expires_at | integer(int64)    | true | none |        | 新访问令牌的过期时间戳 (Unix timestamp, 自 epoch 以来的秒数)。 |
| » timestamp                | string(date-time) | true | none |        | 服务器响应时间戳                                               |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

## POST Change Owner Password

POST /api/v1/auth/me/change-password

> Body 请求参数

```json
{
  "old_password": "a123456789",
  "new_password": "a12345678",
  "confirm_new_password": "a12345678"
}
```

### 请求参数

| 名称                   | 位置 | 类型             | 必选 | 说明                                  |
| ---------------------- | ---- | ---------------- | ---- | ------------------------------------- |
| body                   | body | object           | 否   | none                                  |
| » old_password         | body | string           | 是   | 当前使用的旧密码。                    |
| » new_password         | body | string(password) | 是   | 希望设置的新密码，必须至少为8个字符。 |
| » confirm_new_password | body | string(password) | 是   | 确认新密码，必须与新密码一致。        |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {},
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称        | 类型              | 必选  | 约束 | 中文名 | 说明                        |
| ----------- | ----------------- | ----- | ---- | ------ | --------------------------- |
| » success   | boolean           | true  | none |        | 请求是否成功                |
| » code      | string            | true  | none |        | 业务状态码，SUCCESS表示成功 |
| » message   | string            | true  | none |        | 对当前状态的描述信息        |
| » data      | object            | false | none |        | 返回的业务数据主体          |
| » timestamp | string(date-time) | true  | none |        | 服务器响应时间戳            |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

## GET Me

GET /api/v1/auth/me/profile

当前登录用户的信息查询接口

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "username": "string",
    "email": "user@example.com",
    "full_name": "string",
    "mfa_enabled": true,
    "roles": ["string"],
    "permissions": ["string"]
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称           | 类型              | 必选  | 约束 | 中文名 | 说明                                           |
| -------------- | ----------------- | ----- | ---- | ------ | ---------------------------------------------- |
| » success      | boolean           | true  | none |        | 请求是否成功                                   |
| » code         | string            | true  | none |        | 业务状态码，SUCCESS表示成功                    |
| » message      | string            | true  | none |        | 对当前状态的描述信息                           |
| » data         | object            | true  | none |        | 返回的业务数据主体                             |
| »» id          | string(uuid)      | true  | none |        | 管理员用户的唯一标识符                         |
| »» username    | string            | true  | none |        | 用户名                                         |
| »» email       | string(email)     | true  | none |        | 电子邮箱地址                                   |
| »» full_name   | string¦null       | false | none |        | 用户的全名或昵称                               |
| »» mfa_enabled | boolean           | true  | none |        | 是否启用了多因素认证(MFA)                      |
| »» roles       | [string]          | true  | none |        | 用户所属的角色名称列表                         |
| »» permissions | [string]          | true  | none |        | 用户拥有的所有有效权限键 (permission_key) 列表 |
| » timestamp    | string(date-time) | true  | none |        | 服务器响应时间戳                               |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

## GET Me Menus

GET /api/v1/auth/me/menus

获取用户的路由菜单，用于前端路由配置

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
    "menu_type": "CATALOG",
    "path": "string",
    "name": "string",
    "component": "string",
    "redirect": "string",
    "meta": {
      "title": "string",
      "icon": "string",
      "show_link": true,
      "rank": 0,
      "show_parent": true,
      "keep_alive": true,
      "frame_src": "string",
      "frame_loading": true,
      "transition": {
        "name": "string",
        "enter_transition": "string",
        "leave_transition": "string"
      },
      "hidden_tag": true,
      "dynamic_level": 0,
      "active_path": "string",
      "authority": ["string"]
    },
    "children": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
        "menu_type": "CATALOG",
        "path": "string",
        "name": "string",
        "component": "string",
        "redirect": "string",
        "meta": {
          "title": "string",
          "icon": "string",
          "show_link": true,
          "rank": 0,
          "show_parent": true,
          "keep_alive": true,
          "frame_src": "string",
          "frame_loading": true,
          "transition": {},
          "hidden_tag": true,
          "dynamic_level": 0,
          "active_path": "string",
          "authority": [null]
        },
        "children": [
          {
            "id": null,
            "parent_id": null,
            "menu_type": null,
            "path": null,
            "name": null,
            "component": null,
            "redirect": null,
            "meta": null,
            "children": null,
            "permission_key": null,
            "status": null,
            "remark": null,
            "created_at": null,
            "updated_at": null
          }
        ],
        "permission_key": "string",
        "status": "string",
        "remark": "string",
        "created_at": "2019-08-24T14:15:22Z",
        "updated_at": "2019-08-24T14:15:22Z"
      }
    ],
    "permission_key": "string",
    "status": "string",
    "remark": "string",
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称                  | 类型                                            | 必选  | 约束 | 中文名         | 说明                                                                                     |
| --------------------- | ----------------------------------------------- | ----- | ---- | -------------- | ---------------------------------------------------------------------------------------- |
| » success             | boolean                                         | true  | none |                | 请求是否成功                                                                             |
| » code                | string                                          | true  | none |                | 业务状态码，SUCCESS表示成功                                                              |
| » message             | string                                          | true  | none |                | 对当前状态的描述信息                                                                     |
| » data                | [AdminMenuTreeItem](#schemaadminmenutreeitem)   | true  | none | 菜单树节点     | 表示前端菜单树中的一个节点，可以是目录、菜单或按钮（按钮类型通常不在此接口返回）。       |
| »» id                 | string(uuid)                                    | true  | none |                | 菜单项的唯一标识符。                                                                     |
| »» parent_id          | string(uuid)¦null                               | false | none |                | 父菜单项的ID，如果是顶级菜单则为null。                                                   |
| »» menu_type          | string                                          | true  | none |                | 菜单类型 (例如：'CATALOG', 'MENU')。                                                     |
| »» path               | string¦null                                     | false | none |                | 路由路径 (例如：'/system/user')。                                                        |
| »» name               | string¦null                                     | false | none |                | 路由名称，通常唯一，用于前端路由的命名视图和缓存 (keep-alive)。                          |
| »» component          | string¦null                                     | false | none |                | 前端组件的路径 (例如：'system/user/index' 或特殊值如 'LAYOUT' 表示布局组件)。            |
| »» redirect           | string¦null                                     | false | none |                | 路由重定向的路径。                                                                       |
| »» meta               | [AdminMenuMeta](#schemaadminmenumeta)           | true  | none | 菜单路由元信息 | 路由元信息。                                                                             |
| »»» title             | string                                          | true  | none |                | 菜单标题，用于在界面上显示。                                                             |
| »»» icon              | string¦null                                     | false | none |                | 菜单图标的标识符 (例如：'ep:home-filled')。                                              |
| »»» show_link         | boolean                                         | true  | none |                | 是否在菜单中显示此链接 (通常与后端的 is_hidden 相反)。                                   |
| »»» rank              | integer                                         | true  | none |                | 菜单的排序值，数字越小越靠前。                                                           |
| »»» show_parent       | boolean¦null                                    | false | none |                | 当只有一个子路由时，是否依然显示父级菜单。                                               |
| »»» keep_alive        | boolean¦null                                    | false | none |                | 当前路由是否开启页面缓存 (对应后端的 is_cache)。                                         |
| »»» frame_src         | string¦null                                     | false | none |                | 内嵌 iframe 的 src 地址 (对应后端的 external_link_url，当 is_external_link 为 true 时)。 |
| »»» frame_loading     | boolean¦null                                    | false | none |                | 内嵌 iframe 是否显示加载动画。                                                           |
| »»» transition        | [RouteTransition](#schemaroutetransition)       | false | none | 路由切换动画   | 页面切换动画配置。                                                                       |
| »»»» name             | string¦null                                     | false | none |                | 动画名称 (例如：'fade', 'slide-left')。                                                  |
| »»»» enter_transition | string¦null                                     | false | none |                | 进入时的动画效果。                                                                       |
| »»»» leave_transition | string¦null                                     | false | none |                | 离开时的动画效果。                                                                       |
| »»» hidden_tag        | boolean¦null                                    | false | none |                | 是否在标签页导航栏中隐藏此路由。                                                         |
| »»» dynamic_level     | integer(int32)¦null                             | false | none |                | 动态路由的层级。                                                                         |
| »»» active_path       | string¦null                                     | false | none |                | 当前菜单激活时，指定另一个菜单的路径也高亮 (用于详情页等场景)。                          |
| »»» authority         | [string]¦null                                   | false | none |                | 访问此菜单或路由所需的权限标识符列表 (对应后端的 permission_key)。                       |
| »» children           | [[AdminMenuTreeItem](#schemaadminmenutreeitem)] | true  | none |                | 子菜单项列表。                                                                           |
| »»» 菜单树节点        | [AdminMenuTreeItem](#schemaadminmenutreeitem)   | false | none | 菜单树节点     | 表示前端菜单树中的一个节点，可以是目录、菜单或按钮（按钮类型通常不在此接口返回）。       |
| »»»» id               | string(uuid)                                    | true  | none |                | 菜单项的唯一标识符。                                                                     |
| »»»» parent_id        | string(uuid)¦null                               | false | none |                | 父菜单项的ID，如果是顶级菜单则为null。                                                   |
| »»»» menu_type        | string                                          | true  | none |                | 菜单类型 (例如：'CATALOG', 'MENU')。                                                     |
| »»»» path             | string¦null                                     | false | none |                | 路由路径 (例如：'/system/user')。                                                        |
| »»»» name             | string¦null                                     | false | none |                | 路由名称，通常唯一，用于前端路由的命名视图和缓存 (keep-alive)。                          |
| »»»» component        | string¦null                                     | false | none |                | 前端组件的路径 (例如：'system/user/index' 或特殊值如 'LAYOUT' 表示布局组件)。            |
| »»»» redirect         | string¦null                                     | false | none |                | 路由重定向的路径。                                                                       |
| »»»» meta             | [AdminMenuMeta](#schemaadminmenumeta)           | true  | none | 菜单路由元信息 | 路由元信息。                                                                             |
| »»»» children         | [[AdminMenuTreeItem](#schemaadminmenutreeitem)] | true  | none |                | 子菜单项列表。                                                                           |
| »»»» permission_key   | string¦null                                     | false | none |                | [管理端使用] 关联的权限标识。                                                            |
| »»»» status           | string¦null                                     | false | none |                | [管理端使用] 菜单状态 (ENABLED/DISABLED)。                                               |
| »»»» remark           | string¦null                                     | false | none |                | [管理端使用] 备注信息。                                                                  |
| »»»» created_at       | string(date-time)¦null                          | false | none |                | [管理端使用] 创建时间。                                                                  |
| »»»» updated_at       | string(date-time)¦null                          | false | none |                | [管理端使用] 更新时间。                                                                  |
| »» permission_key     | string¦null                                     | false | none |                | [管理端使用] 关联的权限标识。                                                            |
| »» status             | string¦null                                     | false | none |                | [管理端使用] 菜单状态 (ENABLED/DISABLED)。                                               |
| »» remark             | string¦null                                     | false | none |                | [管理端使用] 备注信息。                                                                  |
| »» created_at         | string(date-time)¦null                          | false | none |                | [管理端使用] 创建时间。                                                                  |
| »» updated_at         | string(date-time)¦null                          | false | none |                | [管理端使用] 更新时间。                                                                  |
| » timestamp           | string(date-time)                               | true  | none |                | 服务器响应时间戳                                                                         |

#### 枚举值

| 属性      | 值      |
| --------- | ------- |
| code      | SUCCESS |
| code      | FAIL    |
| menu_type | CATALOG |
| menu_type | MENU    |
| menu_type | BUTTON  |
| menu_type | CATALOG |
| menu_type | MENU    |
| menu_type | BUTTON  |

# Admin Users

## GET List Users

GET /api/v1/admin-users

### 请求参数

| 名称       | 位置  | 类型    | 必选 | 说明                                      |
| ---------- | ----- | ------- | ---- | ----------------------------------------- |
| page       | query | string  | 否   | 页码 从1开始                              |
| page_size  | query | integer | 否   | 每页记录数                                |
| sort_by    | query | string  | 否   | 排序字段名 例如 username email created_at |
| sort_order | query | string  | 否   | 排序顺序 asc 或 desc                      |
| q          | query | string  | 否   | 通用搜索 搜索用户名 邮箱 全名等           |
| username   | query | string  | 否   | 按用户名筛选 模糊匹配                     |
| email      | query | string  | 否   | 按邮箱筛选 模糊匹配                       |
| is_active  | query | boolean | 否   | 按激活状态筛选 true 或 false              |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "items": [
      {
        "id": "963ba384-253d-48ff-853f-a64b33014caf",
        "username": "admin_user",
        "email": "admin@example.com",
        "full_name": "Administrator",
        "is_active": true,
        "mfa_enabled": false,
        "last_login_at": "2025-05-24T10:00:00Z",
        "created_at": "2025-05-20T10:00:00Z",
        "updated_at": "2025-05-23T10:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "page_size": 10
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称                  | 类型                                            | 必选  | 约束 | 中文名            | 说明                        |
| --------------------- | ----------------------------------------------- | ----- | ---- | ----------------- | --------------------------- |
| » success             | boolean                                         | true  | none |                   | 请求是否成功                |
| » code                | string                                          | true  | none |                   | 业务状态码，SUCCESS表示成功 |
| » message             | string                                          | true  | none |                   | 对当前状态的描述信息        |
| » data                | object                                          | true  | none |                   | 返回的业务数据主体          |
| »» items              | [[AdminUserListItem](#schemaadminuserlistitem)] | true  | none |                   | 当前页的用户列表            |
| »»» AdminUserListItem | [AdminUserListItem](#schemaadminuserlistitem)   | false | none | AdminUserListItem | none                        |
| »»»» id               | string(uuid)                                    | true  | none |                   | 用户ID                      |
| »»»» username         | string                                          | true  | none |                   | 用户名                      |
| »»»» email            | string(email)                                   | true  | none |                   | 邮箱                        |
| »»»» full_name        | string¦null                                     | false | none |                   | 全名                        |
| »»»» is_active        | boolean                                         | true  | none |                   | 账户是否激活                |
| »»»» mfa_enabled      | boolean                                         | true  | none |                   | 是否启用了多因素认证        |
| »»»» last_login_at    | string(date-time)¦null                          | false | none |                   | 最后登录时间 (UTC)          |
| »»»» created_at       | string(date-time)                               | true  | none |                   | 创建时间 (UTC)              |
| »»»» updated_at       | string(date-time)                               | true  | none |                   | 更新时间 (UTC)              |
| »» total              | integer(int64)                                  | true  | none |                   | 总记录数                    |
| »» page               | integer(int64)                                  | true  | none |                   | 当前页码                    |
| »» page_size          | integer(int64)                                  | true  | none |                   | 每页记录数                  |
| » timestamp           | string(date-time)                               | true  | none |                   | 服务器响应时间戳            |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

## POST Create User

POST /api/v1/admin-users

> Body 请求参数

```json
{
  "username": "xiao19891",
  "email": "xiao19891@example.com",
  "password": "password123",
  "full_name": "Xiao 1899",
  "is_active": true
}
```

### 请求参数

| 名称        | 位置 | 类型          | 必选 | 说明                         |
| ----------- | ---- | ------------- | ---- | ---------------------------- |
| body        | body | object        | 否   | none                         |
| » username  | body | string        | 是   | 用户名 (3-100字符)           |
| » email     | body | string(email) | 是   | 邮箱                         |
| » password  | body | string        | 是   | 密码 (至少8字符)             |
| » full_name | body | string¦null   | 否   | 全名 (可选)                  |
| » is_active | body | boolean¦null  | 否   | 是否激活 (可选, 默认为 true) |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "username": "string",
    "email": "user@example.com",
    "full_name": "string",
    "is_active": true,
    "mfa_enabled": true,
    "totp_setup_at": "2019-08-24T14:15:22Z",
    "preferred_language_code": "string",
    "preferred_timezone": "string",
    "last_login_at": "2019-08-24T14:15:22Z",
    "last_login_ip": "string",
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称                       | 类型                   | 必选  | 约束 | 中文名 | 说明                        |
| -------------------------- | ---------------------- | ----- | ---- | ------ | --------------------------- |
| » success                  | boolean                | true  | none |        | 请求是否成功                |
| » code                     | string                 | true  | none |        | 业务状态码，SUCCESS表示成功 |
| » message                  | string                 | true  | none |        | 对当前状态的描述信息        |
| » data                     | object                 | true  | none |        | 返回的业务数据主体          |
| »» id                      | string(uuid)           | true  | none |        | 用户ID                      |
| »» username                | string                 | true  | none |        | 用户名                      |
| »» email                   | string(email)          | true  | none |        | 邮箱                        |
| »» full_name               | string¦null            | false | none |        | 全名                        |
| »» is_active               | boolean                | true  | none |        | 账户是否激活                |
| »» mfa_enabled             | boolean                | true  | none |        | 是否启用了多因素认证        |
| »» totp_setup_at           | string(date-time)¦null | false | none |        | TOTP 设置时间 (UTC)         |
| »» preferred_language_code | string¦null            | false | none |        | 偏好语言代码                |
| »» preferred_timezone      | string¦null            | false | none |        | 偏好时区                    |
| »» last_login_at           | string(date-time)¦null | false | none |        | 最后登录时间 (UTC)          |
| »» last_login_ip           | string¦null            | false | none |        | 最后登录IP                  |
| »» created_at              | string(date-time)      | true  | none |        | 创建时间 (UTC)              |
| »» updated_at              | string(date-time)      | true  | none |        | 更新时间 (UTC)              |
| » timestamp                | string(date-time)      | true  | none |        | 服务器响应时间戳            |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

## PUT Update User

PUT /api/v1/admin-users/{id}

> Body 请求参数

```json
{
  "username": "test_admin",
  "email": "test_admin@example.com",
  "full_name": "Test Admin",
  "is_active": false
}
```

### 请求参数

| 名称        | 位置 | 类型               | 必选 | 说明                     |
| ----------- | ---- | ------------------ | ---- | ------------------------ |
| id          | path | string             | 是   | none                     |
| body        | body | object             | 否   | none                     |
| » username  | body | string¦null        | 否   | 用户名 (3-100字符, 可选) |
| » email     | body | string(email)¦null | 否   | 邮箱 (可选)              |
| » full_name | body | string¦null        | 否   | 全名 (可选)              |
| » is_active | body | boolean¦null       | 否   | 是否激活 (可选)          |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "username": "string",
    "email": "user@example.com",
    "full_name": "string",
    "is_active": true,
    "mfa_enabled": true,
    "totp_setup_at": "2019-08-24T14:15:22Z",
    "preferred_language_code": "string",
    "preferred_timezone": "string",
    "last_login_at": "2019-08-24T14:15:22Z",
    "last_login_ip": "string",
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称                       | 类型                   | 必选  | 约束 | 中文名 | 说明                        |
| -------------------------- | ---------------------- | ----- | ---- | ------ | --------------------------- |
| » success                  | boolean                | true  | none |        | 请求是否成功                |
| » code                     | string                 | true  | none |        | 业务状态码，SUCCESS表示成功 |
| » message                  | string                 | true  | none |        | 对当前状态的描述信息        |
| » data                     | object                 | true  | none |        | 返回的业务数据主体          |
| »» id                      | string(uuid)           | true  | none |        | 用户ID                      |
| »» username                | string                 | true  | none |        | 用户名                      |
| »» email                   | string(email)          | true  | none |        | 邮箱                        |
| »» full_name               | string¦null            | false | none |        | 全名                        |
| »» is_active               | boolean                | true  | none |        | 账户是否激活                |
| »» mfa_enabled             | boolean                | true  | none |        | 是否启用了多因素认证        |
| »» totp_setup_at           | string(date-time)¦null | false | none |        | TOTP 设置时间 (UTC)         |
| »» preferred_language_code | string¦null            | false | none |        | 偏好语言代码                |
| »» preferred_timezone      | string¦null            | false | none |        | 偏好时区                    |
| »» last_login_at           | string(date-time)¦null | false | none |        | 最后登录时间 (UTC)          |
| »» last_login_ip           | string¦null            | false | none |        | 最后登录IP                  |
| »» created_at              | string(date-time)      | true  | none |        | 创建时间 (UTC)              |
| »» updated_at              | string(date-time)      | true  | none |        | 更新时间 (UTC)              |
| » timestamp                | string(date-time)      | true  | none |        | 服务器响应时间戳            |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

## GET Get User By Id

GET /api/v1/admin-users/{id}

### 请求参数

| 名称 | 位置 | 类型   | 必选 | 说明       |
| ---- | ---- | ------ | ---- | ---------- |
| id   | path | string | 是   | 系统用户ID |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "username": "string",
    "email": "user@example.com",
    "full_name": "string",
    "is_active": true,
    "mfa_enabled": true,
    "totp_setup_at": "2019-08-24T14:15:22Z",
    "preferred_language_code": "string",
    "preferred_timezone": "string",
    "last_login_at": "2019-08-24T14:15:22Z",
    "last_login_ip": "string",
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称                       | 类型                   | 必选  | 约束 | 中文名 | 说明                        |
| -------------------------- | ---------------------- | ----- | ---- | ------ | --------------------------- |
| » success                  | boolean                | true  | none |        | 请求是否成功                |
| » code                     | string                 | true  | none |        | 业务状态码，SUCCESS表示成功 |
| » message                  | string                 | true  | none |        | 对当前状态的描述信息        |
| » data                     | object                 | true  | none |        | 返回的业务数据主体          |
| »» id                      | string(uuid)           | true  | none |        | 用户ID                      |
| »» username                | string                 | true  | none |        | 用户名                      |
| »» email                   | string(email)          | true  | none |        | 邮箱                        |
| »» full_name               | string¦null            | false | none |        | 全名                        |
| »» is_active               | boolean                | true  | none |        | 账户是否激活                |
| »» mfa_enabled             | boolean                | true  | none |        | 是否启用了多因素认证        |
| »» totp_setup_at           | string(date-time)¦null | false | none |        | TOTP 设置时间 (UTC)         |
| »» preferred_language_code | string¦null            | false | none |        | 偏好语言代码                |
| »» preferred_timezone      | string¦null            | false | none |        | 偏好时区                    |
| »» last_login_at           | string(date-time)¦null | false | none |        | 最后登录时间 (UTC)          |
| »» last_login_ip           | string¦null            | false | none |        | 最后登录IP                  |
| »» created_at              | string(date-time)      | true  | none |        | 创建时间 (UTC)              |
| »» updated_at              | string(date-time)      | true  | none |        | 更新时间 (UTC)              |
| » timestamp                | string(date-time)      | true  | none |        | 服务器响应时间戳            |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

## DELETE Delete User

DELETE /api/v1/admin-users/{id}

### 请求参数

| 名称 | 位置 | 类型   | 必选 | 说明 |
| ---- | ---- | ------ | ---- | ---- |
| id   | path | string | 是   | none |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {},
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称        | 类型              | 必选  | 约束 | 中文名 | 说明                        |
| ----------- | ----------------- | ----- | ---- | ------ | --------------------------- |
| » success   | boolean           | true  | none |        | 请求是否成功                |
| » code      | string            | true  | none |        | 业务状态码，SUCCESS表示成功 |
| » message   | string            | true  | none |        | 对当前状态的描述信息        |
| » data      | object¦null       | false | none |        | 返回的业务数据主体          |
| » timestamp | string(date-time) | true  | none |        | 服务器响应时间戳            |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

## POST Assign Roles To User

POST /api/v1/admin-users/{id}/roles

> Body 请求参数

```json
{
  "role_names": ["admin_staff", "content_editor"]
}
```

### 请求参数

| 名称         | 位置 | 类型     | 必选 | 说明                                                                       |
| ------------ | ---- | -------- | ---- | -------------------------------------------------------------------------- |
| id           | path | string   | 是   | none                                                                       |
| body         | body | object   | 否   | none                                                                       |
| » role_names | body | [string] | 是   | 要分配给用户的角色名称列表。如果提供空列表，则会移除用户在该域的所有角色。 |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {},
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称        | 类型              | 必选  | 约束 | 中文名 | 说明                        |
| ----------- | ----------------- | ----- | ---- | ------ | --------------------------- |
| » success   | boolean           | true  | none |        | 请求是否成功                |
| » code      | string            | true  | none |        | 业务状态码，SUCCESS表示成功 |
| » message   | string            | true  | none |        | 对当前状态的描述信息        |
| » data      | object            | false | none |        | 返回的业务数据主体          |
| » timestamp | string(date-time) | true  | none |        | 服务器响应时间戳            |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

## POST Reset Password

POST /api/v1/admin-users/{id}/reset-password

强制重置用户密码（需要管理员权限）

> Body 请求参数

```json
{
  "new_password": "stringst",
  "notify_user": true
}
```

### 请求参数

| 名称           | 位置 | 类型         | 必选 | 说明                             |
| -------------- | ---- | ------------ | ---- | -------------------------------- |
| id             | path | string(uuid) | 是   | none                             |
| body           | body | object       | 否   | none                             |
| » new_password | body | string       | 是   | 新密码（需包含大小写字母和数字） |
| » notify_user  | body | boolean      | 否   | 是否通知用户                     |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Admin users listed successfully.",
  "data": {
    "items": [
      {
        "id": "63104f9e-8500-40a1-8a9c-2bdf1d374a8d",
        "username": "cary",
        "email": "13477072323@qq.com",
        "full_name": "Cary Xiao",
        "is_active": true,
        "mfa_enabled": false,
        "last_login_at": "2025-05-24T16:49:44.893294Z",
        "created_at": "2025-05-24T16:48:56.601285Z",
        "updated_at": "2025-05-24T16:49:44.897501Z"
      }
    ],
    "total": 1,
    "page": 1,
    "page_size": 10
  },
  "timestamp": "2025-05-24T16:49:45.545712Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明         | 数据模型                                  |
| ------ | ------------------------------------------------------- | ------------ | ----------------------------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | 密码重置成功 | [ApiResponseBase](#schemaapiresponsebase) |

## POST Batch Import

POST /api/v1/admin-users/batch-import

通过CSV文件批量导入用户账户

> Body 请求参数

```yaml
file: ""
```

### 请求参数

| 名称   | 位置 | 类型           | 必选 | 说明                 |
| ------ | ---- | -------------- | ---- | -------------------- |
| body   | body | object         | 否   | none                 |
| » file | body | string(binary) | 是   | CSV文件（UTF-8编码） |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "task_id": "string",
    "invalid_rows": [0]
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明     | 数据模型 |
| ------ | ------------------------------------------------------- | -------- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | 成功响应 | Inline   |

### 返回数据结构

状态码 **200**

| 名称            | 类型              | 必选  | 约束 | 中文名 | 说明                        |
| --------------- | ----------------- | ----- | ---- | ------ | --------------------------- |
| » success       | boolean           | true  | none |        | 请求是否成功                |
| » code          | string            | true  | none |        | 业务状态码，SUCCESS表示成功 |
| » message       | string            | true  | none |        | 对当前状态的描述信息        |
| » data          | object            | true  | none |        | none                        |
| »» task_id      | string            | false | none |        | none                        |
| »» invalid_rows | [number]          | false | none |        | none                        |
| » timestamp     | string(date-time) | true  | none |        | 服务器响应时间戳            |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

# Defined Permissions

<a id="opIdlistDefinedPermissions"></a>

## GET List Defined Permissions

GET /api/v1/permissions/defined

### 请求参数

| 名称           | 位置  | 类型           | 必选 | 说明 |
| -------------- | ----- | -------------- | ---- | ---- |
| page           | query | integer(int64) | 否   | none |
| page_size      | query | integer(int64) | 否   | none |
| permission_key | query | string         | 否   | none |
| display_name   | query | string         | 否   | none |
| category_id    | query | string(uuid)   | 否   | none |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "items": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "permission_key": "string",
        "display_name": "string",
        "description": "string",
        "category_id": "8de4c9fd-61a4-4c0b-bf88-0ed3a0fe3fa2",
        "category_display_name": "string",
        "category_path_names": ["string"],
        "created_at": "2019-08-24T14:15:22Z",
        "updated_at": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "page": 0,
    "page_size": 1
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明                                     | 数据模型                                                                                                |
| ------ | ------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | A paginated list of defined permissions. | [ApiResponse_PaginatedDefinedPermissionResponse](#schemaapiresponse_paginateddefinedpermissionresponse) |

<a id="opIdcreateDefinedPermission"></a>

## POST Create Defined Permission

POST /api/v1/permissions/defined

> Body 请求参数

```json
{
  "permission_key": "string",
  "display_name": "string",
  "description": "string",
  "category_id": "8de4c9fd-61a4-4c0b-bf88-0ed3a0fe3fa2"
}
```

### 请求参数

| 名称 | 位置 | 类型                                                                    | 必选 | 中文名                         | 说明 |
| ---- | ---- | ----------------------------------------------------------------------- | ---- | ------------------------------ | ---- |
| body | body | [CreateDefinedPermissionPayload](#schemacreatedefinedpermissionpayload) | 否   | CreateDefinedPermissionPayload | none |

> 返回示例

> 201 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "permission_key": "string",
    "display_name": "string",
    "description": "string",
    "category_id": "8de4c9fd-61a4-4c0b-bf88-0ed3a0fe3fa2",
    "category_display_name": "string",
    "category_path_names": ["string"],
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                                   | 说明                                     | 数据模型                                                                              |
| ------ | ------------------------------------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------- |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2) | Defined permission created successfully. | [ApiResponse_DefinedPermissionResponse](#schemaapiresponse_definedpermissionresponse) |

<a id="opIdgetDefinedPermissionById"></a>

## GET Get Defined Permission by ID

GET /api/v1/permissions/defined/{id}

### 请求参数

| 名称 | 位置 | 类型         | 必选 | 中文名 | 说明 |
| ---- | ---- | ------------ | ---- | ------ | ---- |
| id   | path | string(uuid) | 是   |        | none |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "permission_key": "string",
    "display_name": "string",
    "description": "string",
    "category_id": "8de4c9fd-61a4-4c0b-bf88-0ed3a0fe3fa2",
    "category_display_name": "string",
    "category_path_names": ["string"],
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明                               | 数据模型                                                                              |
| ------ | ------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | Details of the defined permission. | [ApiResponse_DefinedPermissionResponse](#schemaapiresponse_definedpermissionresponse) |

<a id="opIdupdateDefinedPermission"></a>

## PUT Update Defined Permission

PUT /api/v1/permissions/defined/{id}

> Body 请求参数

```json
{
  "display_name": "string",
  "description": "string",
  "category_id": "8de4c9fd-61a4-4c0b-bf88-0ed3a0fe3fa2"
}
```

### 请求参数

| 名称 | 位置 | 类型                                                                    | 必选 | 中文名                         | 说明 |
| ---- | ---- | ----------------------------------------------------------------------- | ---- | ------------------------------ | ---- |
| id   | path | string(uuid)                                                            | 是   |                                | none |
| body | body | [UpdateDefinedPermissionPayload](#schemaupdatedefinedpermissionpayload) | 否   | UpdateDefinedPermissionPayload | none |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "permission_key": "string",
    "display_name": "string",
    "description": "string",
    "category_id": "8de4c9fd-61a4-4c0b-bf88-0ed3a0fe3fa2",
    "category_display_name": "string",
    "category_path_names": ["string"],
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明                                     | 数据模型                                                                              |
| ------ | ------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | Defined permission updated successfully. | [ApiResponse_DefinedPermissionResponse](#schemaapiresponse_definedpermissionresponse) |

<a id="opIddeleteDefinedPermission"></a>

## DELETE Delete Defined Permission

DELETE /api/v1/permissions/defined/{id}

### 请求参数

| 名称 | 位置 | 类型         | 必选 | 中文名 | 说明 |
| ---- | ---- | ------------ | ---- | ------ | ---- |
| id   | path | string(uuid) | 是   |        | none |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Admin users listed successfully.",
  "data": {
    "items": [
      {
        "id": "63104f9e-8500-40a1-8a9c-2bdf1d374a8d",
        "username": "cary",
        "email": "13477072323@qq.com",
        "full_name": "Cary Xiao",
        "is_active": true,
        "mfa_enabled": false,
        "last_login_at": "2025-05-24T16:49:44.893294Z",
        "created_at": "2025-05-24T16:48:56.601285Z",
        "updated_at": "2025-05-24T16:49:44.897501Z"
      }
    ],
    "total": 1,
    "page": 1,
    "page_size": 10
  },
  "timestamp": "2025-05-24T16:49:45.545712Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明                                     | 数据模型                                  |
| ------ | ------------------------------------------------------- | ---------------------------------------- | ----------------------------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | Defined permission deleted successfully. | [ApiResponseBase](#schemaapiresponsebase) |

## GET List Defined Permissions Hierarchical Tree

GET /api/v1/permissions/defined/hierarchical-tree

返回一个以权限分类组织的树形结构，其中包含所有已定义的、可分配给角色的细粒度操作权限。

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "tree": [
      {
        "category_id": "8de4c9fd-61a4-4c0b-bf88-0ed3a0fe3fa2",
        "category_name": "string",
        "category_parent_id": "f9607e03-d562-4309-b36d-19b0c3c1cd3b",
        "permissions": [
          {
            "id": null,
            "permission_key": null,
            "display_name": null
          }
        ],
        "children_categories": [
          {
            "category_id": null,
            "category_name": null,
            "category_parent_id": null,
            "permissions": null,
            "children_categories": null
          }
        ]
      }
    ],
    "total_categories": 0,
    "total_permissions": 0
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型                                                                                |
| ------ | ------------------------------------------------------- | ---- | --------------------------------------------------------------------------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | [ApiResponse_PermissionCategoryNodeList](#schemaapiresponse_permissioncategorynodelist) |

# Defined Permissions/Permission Categories

## GET List Permission Categories Tree

GET /api/v1/permissions/categories/tree

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "items": [
      {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "category_key": "string",
        "display_name": "string",
        "description": "string",
        "sort_order": 0,
        "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
        "created_at": "2025-06-02T10:30:00Z",
        "updated_at": "2025-06-02T10:30:00Z",
        "children": [
          {
            "id": null,
            "category_key": null,
            "display_name": null,
            "description": null,
            "sort_order": null,
            "parent_id": null,
            "created_at": null,
            "updated_at": null,
            "children": null
          }
        ]
      }
    ],
    "total": 0
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型                                                                                        |
| ------ | ------------------------------------------------------- | ---- | ----------------------------------------------------------------------------------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | [ApiResponse_PermissionCategoryTreeResponse](#schemaapiresponse_permissioncategorytreeresponse) |

<a id="opIdlistPermissionCategories"></a>

## GET List Permission Categories

GET /api/v1/permissions/categories

### 请求参数

| 名称         | 位置  | 类型           | 必选 | 中文名 | 说明                                        |
| ------------ | ----- | -------------- | ---- | ------ | ------------------------------------------- |
| page         | query | integer(int64) | 否   |        | Page number for pagination (starts from 1). |
| page_size    | query | integer(int64) | 否   |        | Number of items per page.                   |
| category_key | query | string         | 否   |        | Filter by category key (partial match).     |
| display_name | query | string         | 否   |        | Filter by display name (partial match).     |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Permission categories listed successfully.",
  "data": {
    "items": [
      {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "category_key": "user_management",
        "display_name": "用户管理",
        "description": "管理用户相关操作",
        "sort_order": 10,
        "created_at": "2025-05-26T10:00:00Z",
        "updated_at": "2025-05-26T10:00:00Z"
      }
    ],
    "total": 1,
    "page": 1,
    "page_size": 10
  },
  "timestamp": "2025-05-26T10:00:05Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明                                       | 数据模型 |
| ------ | ------------------------------------------------------- | ------------------------------------------ | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | A paginated list of permission categories. | Inline   |

### 返回数据结构

状态码 **200**

| 名称              | 类型                                                                   | 必选  | 约束 | 中文名 | 说明                               |
| ----------------- | ---------------------------------------------------------------------- | ----- | ---- | ------ | ---------------------------------- |
| » success         | boolean                                                                | true  | none |        | 请求是否成功                       |
| » code            | string                                                                 | true  | none |        | 业务状态码，SUCCESS表示成功        |
| » message         | string                                                                 | true  | none |        | 对当前状态的描述信息               |
| » data            | object                                                                 | true  | none |        | 返回的业务数据主体                 |
| »» items          | [[PermissionCategoryResponse](#schemapermissioncategoryresponse)]      | true  | none |        | 对象数组                           |
| »»» id            | string(uuid)                                                           | true  | none |        | 通用唯一标识符 (UUID)              |
| »»» category_key  | string                                                                 | true  | none |        | 分类的唯一键                       |
| »»» display_name  | string                                                                 | true  | none |        | 分类的显示名称                     |
| »»» description   | string¦null                                                            | false | none |        | 分类的可选描述                     |
| »»» sort_order    | integer(int32)                                                         | true  | none |        | 用于显示的排序顺序                 |
| »»» parent_id     | string(uuid)¦null                                                      | false | none |        | 父级分类的ID，顶级分类此字段为null |
| »»» created_at    | string(date-time)                                                      | true  | none |        | UTC时间，ISO 8601格式              |
| »»» updated_at    | string(date-time)                                                      | true  | none |        | UTC时间，ISO 8601格式              |
| »»» children      | [[PermissionCategoryResponse](#schemapermissioncategoryresponse)]¦null | false | none |        | 子分类列表 (当返回树形结构时使用)  |
| »»»» id           | string(uuid)                                                           | true  | none |        | 通用唯一标识符 (UUID)              |
| »»»» category_key | string                                                                 | true  | none |        | 分类的唯一键                       |
| »»»» display_name | string                                                                 | true  | none |        | 分类的显示名称                     |
| »»»» description  | string¦null                                                            | false | none |        | 分类的可选描述                     |
| »»»» sort_order   | integer(int32)                                                         | true  | none |        | 用于显示的排序顺序                 |
| »»»» parent_id    | string(uuid)¦null                                                      | false | none |        | 父级分类的ID，顶级分类此字段为null |
| »»»» created_at   | string(date-time)                                                      | true  | none |        | UTC时间，ISO 8601格式              |
| »»»» updated_at   | string(date-time)                                                      | true  | none |        | UTC时间，ISO 8601格式              |
| »»»» children     | [[PermissionCategoryResponse](#schemapermissioncategoryresponse)]¦null | false | none |        | 子分类列表 (当返回树形结构时使用)  |
| »» total          | integer                                                                | true  | none |        | 总记录数（用于分页）               |
| »» page           | integer                                                                | true  | none |        | 当前页码（从1开始）                |
| »» page_size      | integer                                                                | true  | none |        | 每页记录数                         |
| » timestamp       | string(date-time)                                                      | true  | none |        | 服务器响应时间戳                   |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

<a id="opIdcreatePermissionCategory"></a>

## POST Create Permission Category

POST /api/v1/permissions/categories

> Body 请求参数

```json
{
  "category_key": "user_management",
  "display_name": "用户管理",
  "description": "管理用户账户、角色和权限",
  "sort_order": 10,
  "parent_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
}
```

### 请求参数

| 名称 | 位置 | 类型                                                                      | 必选 | 中文名 | 说明 |
| ---- | ---- | ------------------------------------------------------------------------- | ---- | ------ | ---- |
| body | body | [CreatePermissionCategoryPayload](#schemacreatepermissioncategorypayload) | 否   |        | none |

> 返回示例

> 201 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Permission category created successfully.",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "category_key": "new_category",
    "display_name": "新分类",
    "description": "这是一个新分类",
    "sort_order": 0,
    "created_at": "2025-05-26T10:05:00Z",
    "updated_at": "2025-05-26T10:05:00Z"
  },
  "timestamp": "2025-05-26T10:05:05Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                                   | 说明                                      | 数据模型                                                                                |
| ------ | ------------------------------------------------------------ | ----------------------------------------- | --------------------------------------------------------------------------------------- |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2) | Permission category created successfully. | [ApiResponse_PermissionCategoryResponse](#schemaapiresponse_permissioncategoryresponse) |

<a id="opIdgetPermissionCategoryById"></a>

## GET Get Permission Category by ID

GET /api/v1/permissions/categories/{id}

### 请求参数

| 名称 | 位置 | 类型         | 必选 | 中文名 | 说明                                       |
| ---- | ---- | ------------ | ---- | ------ | ------------------------------------------ |
| id   | path | string(uuid) | 是   |        | ID of the permission category to retrieve. |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "category_key": "string",
    "display_name": "string",
    "description": "string",
    "sort_order": 0,
    "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
    "created_at": "2025-06-02T10:30:00Z",
    "updated_at": "2025-06-02T10:30:00Z",
    "children": [
      {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "category_key": "string",
        "display_name": "string",
        "description": "string",
        "sort_order": 0,
        "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
        "created_at": "2025-06-02T10:30:00Z",
        "updated_at": "2025-06-02T10:30:00Z",
        "children": [
          {
            "id": null,
            "category_key": null,
            "display_name": null,
            "description": null,
            "sort_order": null,
            "parent_id": null,
            "created_at": null,
            "updated_at": null,
            "children": null
          }
        ]
      }
    ]
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明                                | 数据模型 |
| ------ | ------------------------------------------------------- | ----------------------------------- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | Details of the permission category. | Inline   |

### 返回数据结构

状态码 **200**

| 名称             | 类型                                                                   | 必选  | 约束 | 中文名 | 说明                               |
| ---------------- | ---------------------------------------------------------------------- | ----- | ---- | ------ | ---------------------------------- |
| » success        | boolean                                                                | true  | none |        | 请求是否成功                       |
| » code           | string                                                                 | true  | none |        | 业务状态码，SUCCESS表示成功        |
| » message        | string                                                                 | true  | none |        | 对当前状态的描述信息               |
| » data           | [PermissionCategoryResponse](#schemapermissioncategoryresponse)        | true  | none |        | 权限分类的响应数据结构             |
| »» id            | string(uuid)                                                           | true  | none |        | 通用唯一标识符 (UUID)              |
| »» category_key  | string                                                                 | true  | none |        | 分类的唯一键                       |
| »» display_name  | string                                                                 | true  | none |        | 分类的显示名称                     |
| »» description   | string¦null                                                            | false | none |        | 分类的可选描述                     |
| »» sort_order    | integer(int32)                                                         | true  | none |        | 用于显示的排序顺序                 |
| »» parent_id     | string(uuid)¦null                                                      | false | none |        | 父级分类的ID，顶级分类此字段为null |
| »» created_at    | string(date-time)                                                      | true  | none |        | UTC时间，ISO 8601格式              |
| »» updated_at    | string(date-time)                                                      | true  | none |        | UTC时间，ISO 8601格式              |
| »» children      | [[PermissionCategoryResponse](#schemapermissioncategoryresponse)]¦null | false | none |        | 子分类列表 (当返回树形结构时使用)  |
| »»» id           | string(uuid)                                                           | true  | none |        | 通用唯一标识符 (UUID)              |
| »»» category_key | string                                                                 | true  | none |        | 分类的唯一键                       |
| »»» display_name | string                                                                 | true  | none |        | 分类的显示名称                     |
| »»» description  | string¦null                                                            | false | none |        | 分类的可选描述                     |
| »»» sort_order   | integer(int32)                                                         | true  | none |        | 用于显示的排序顺序                 |
| »»» parent_id    | string(uuid)¦null                                                      | false | none |        | 父级分类的ID，顶级分类此字段为null |
| »»» created_at   | string(date-time)                                                      | true  | none |        | UTC时间，ISO 8601格式              |
| »»» updated_at   | string(date-time)                                                      | true  | none |        | UTC时间，ISO 8601格式              |
| »»» children     | [[PermissionCategoryResponse](#schemapermissioncategoryresponse)]¦null | false | none |        | 子分类列表 (当返回树形结构时使用)  |
| » timestamp      | string(date-time)                                                      | true  | none |        | 服务器响应时间戳                   |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

<a id="opIdupdatePermissionCategory"></a>

## PUT Update Permission Category

PUT /api/v1/permissions/categories/{id}

> Body 请求参数

```json
{
  "display_name": "用户与角色管理",
  "description": "string",
  "sort_order": 0,
  "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef"
}
```

### 请求参数

| 名称 | 位置 | 类型                                                                      | 必选 | 中文名 | 说明                                     |
| ---- | ---- | ------------------------------------------------------------------------- | ---- | ------ | ---------------------------------------- |
| id   | path | string(uuid)                                                              | 是   |        | ID of the permission category to update. |
| body | body | [UpdatePermissionCategoryPayload](#schemaupdatepermissioncategorypayload) | 否   |        | none                                     |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "category_key": "string",
    "display_name": "string",
    "description": "string",
    "sort_order": 0,
    "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
    "created_at": "2025-06-02T10:30:00Z",
    "updated_at": "2025-06-02T10:30:00Z",
    "children": [
      {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "category_key": "string",
        "display_name": "string",
        "description": "string",
        "sort_order": 0,
        "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
        "created_at": "2025-06-02T10:30:00Z",
        "updated_at": "2025-06-02T10:30:00Z",
        "children": [
          {
            "id": null,
            "category_key": null,
            "display_name": null,
            "description": null,
            "sort_order": null,
            "parent_id": null,
            "created_at": null,
            "updated_at": null,
            "children": null
          }
        ]
      }
    ]
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明                                      | 数据模型                                                                                |
| ------ | ------------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | Permission category updated successfully. | [ApiResponse_PermissionCategoryResponse](#schemaapiresponse_permissioncategoryresponse) |

<a id="opIddeletePermissionCategory"></a>

## DELETE Delete Permission Category

DELETE /api/v1/permissions/categories/{id}

### 请求参数

| 名称 | 位置 | 类型         | 必选 | 中文名 | 说明                                     |
| ---- | ---- | ------------ | ---- | ------ | ---------------------------------------- |
| id   | path | string(uuid) | 是   |        | ID of the permission category to delete. |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Permission category deleted successfully.",
  "data": {},
  "timestamp": "2025-05-26T10:10:00Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明                                      | 数据模型                                  |
| ------ | ------------------------------------------------------- | ----------------------------------------- | ----------------------------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | Permission category deleted successfully. | [ApiResponseBase](#schemaapiresponsebase) |

# Roles

<a id="opIdlistRoles"></a>

## GET List Roles

GET /api/v1/roles

### 请求参数

| 名称         | 位置  | 类型           | 必选 | 中文名 | 说明 |
| ------------ | ----- | -------------- | ---- | ------ | ---- |
| page         | query | integer(int64) | 否   |        | none |
| page_size    | query | integer(int64) | 否   |        | none |
| role_name    | query | string         | 否   |        | none |
| display_name | query | string         | 否   |        | none |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "items": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "role_name": "string",
        "display_name": "string",
        "description": "string",
        "created_at": "2019-08-24T14:15:22Z",
        "updated_at": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "page": 0,
    "page_size": 1
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明                       | 数据模型 |
| ------ | ------------------------------------------------------- | -------------------------- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | A paginated list of roles. | Inline   |

### 返回数据结构

状态码 **200**

| 名称              | 类型                                  | 必选  | 约束 | 中文名       | 说明                                                                                                   |
| ----------------- | ------------------------------------- | ----- | ---- | ------------ | ------------------------------------------------------------------------------------------------------ |
| » success         | boolean                               | true  | none |              | 请求是否成功                                                                                           |
| » code            | string                                | true  | none |              | 业务状态码，SUCCESS表示成功                                                                            |
| » message         | string                                | true  | none |              | 对当前状态的描述信息                                                                                   |
| » data            | object                                | true  | none |              | 返回的业务数据主体                                                                                     |
| »» items          | [[RoleResponse](#schemaroleresponse)] | true  | none |              | 对象数组                                                                                               |
| »»» RoleResponse  | [RoleResponse](#schemaroleresponse)   | false | none | RoleResponse | 角色的响应结构。可用于单个对象响应的 data 字段，或分页列表中 items 的单个元素。对应 RoleResponse DTO。 |
| »»»» id           | string(uuid)                          | true  | none |              | 角色的唯一标识符。                                                                                     |
| »»»» role_name    | string                                | true  | none |              | 角色的唯一名称。                                                                                       |
| »»»» display_name | string                                | true  | none |              | 角色的显示名称。                                                                                       |
| »»»» description  | string¦null                           | false | none |              | 角色的描述。                                                                                           |
| »»»» created_at   | string(date-time)                     | true  | none |              | 创建时间戳。                                                                                           |
| »»»» updated_at   | string(date-time)                     | true  | none |              | 最后更新时间戳。                                                                                       |
| »» total          | integer                               | true  | none |              | 总记录数（用于分页）                                                                                   |
| »» page           | integer                               | true  | none |              | 当前页码（从1开始）                                                                                    |
| »» page_size      | integer                               | true  | none |              | 每页记录数                                                                                             |
| » timestamp       | string(date-time)                     | true  | none |              | 服务器响应时间戳                                                                                       |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

<a id="opIdcreateRole"></a>

## POST Create Role

POST /api/v1/roles

> Body 请求参数

```json
{
  "role_name": "string",
  "display_name": "string",
  "description": "string"
}
```

### 请求参数

| 名称 | 位置 | 类型                                          | 必选 | 中文名            | 说明 |
| ---- | ---- | --------------------------------------------- | ---- | ----------------- | ---- |
| body | body | [CreateRolePayload](#schemacreaterolepayload) | 否   | CreateRolePayload | none |

> 返回示例

> 201 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Admin users listed successfully.",
  "data": {
    "items": [
      {
        "id": "63104f9e-8500-40a1-8a9c-2bdf1d374a8d",
        "username": "cary",
        "email": "13477072323@qq.com",
        "full_name": "Cary Xiao",
        "is_active": true,
        "mfa_enabled": false,
        "last_login_at": "2025-05-24T16:49:44.893294Z",
        "created_at": "2025-05-24T16:48:56.601285Z",
        "updated_at": "2025-05-24T16:49:44.897501Z"
      }
    ],
    "total": 1,
    "page": 1,
    "page_size": 10
  },
  "timestamp": "2025-05-24T16:49:45.545712Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                                   | 说明                       | 数据模型                                  |
| ------ | ------------------------------------------------------------ | -------------------------- | ----------------------------------------- |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2) | Role created successfully. | [ApiResponseBase](#schemaapiresponsebase) |

<a id="opIdgetRoleById"></a>

## GET Get Role by ID

GET /api/v1/roles/{id}

### 请求参数

| 名称 | 位置 | 类型         | 必选 | 中文名 | 说明 |
| ---- | ---- | ------------ | ---- | ------ | ---- |
| id   | path | string(uuid) | 是   |        | none |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Admin users listed successfully.",
  "data": {
    "items": [
      {
        "id": "63104f9e-8500-40a1-8a9c-2bdf1d374a8d",
        "username": "cary",
        "email": "13477072323@qq.com",
        "full_name": "Cary Xiao",
        "is_active": true,
        "mfa_enabled": false,
        "last_login_at": "2025-05-24T16:49:44.893294Z",
        "created_at": "2025-05-24T16:48:56.601285Z",
        "updated_at": "2025-05-24T16:49:44.897501Z"
      }
    ],
    "total": 1,
    "page": 1,
    "page_size": 10
  },
  "timestamp": "2025-05-24T16:49:45.545712Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明                 | 数据模型                                  |
| ------ | ------------------------------------------------------- | -------------------- | ----------------------------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | Details of the role. | [ApiResponseBase](#schemaapiresponsebase) |

<a id="opIdupdateRole"></a>

## PUT Update Role

PUT /api/v1/roles/{id}

> Body 请求参数

```json
{
  "role_name": "string",
  "display_name": "string",
  "description": "string"
}
```

### 请求参数

| 名称 | 位置 | 类型                                          | 必选 | 中文名            | 说明 |
| ---- | ---- | --------------------------------------------- | ---- | ----------------- | ---- |
| id   | path | string(uuid)                                  | 是   |                   | none |
| body | body | [UpdateRolePayload](#schemaupdaterolepayload) | 否   | UpdateRolePayload | none |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Admin users listed successfully.",
  "data": {
    "items": [
      {
        "id": "63104f9e-8500-40a1-8a9c-2bdf1d374a8d",
        "username": "cary",
        "email": "13477072323@qq.com",
        "full_name": "Cary Xiao",
        "is_active": true,
        "mfa_enabled": false,
        "last_login_at": "2025-05-24T16:49:44.893294Z",
        "created_at": "2025-05-24T16:48:56.601285Z",
        "updated_at": "2025-05-24T16:49:44.897501Z"
      }
    ],
    "total": 1,
    "page": 1,
    "page_size": 10
  },
  "timestamp": "2025-05-24T16:49:45.545712Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明                       | 数据模型                                  |
| ------ | ------------------------------------------------------- | -------------------------- | ----------------------------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | Role updated successfully. | [ApiResponseBase](#schemaapiresponsebase) |

<a id="opIddeleteRole"></a>

## DELETE Delete Role

DELETE /api/v1/roles/{id}

### 请求参数

| 名称 | 位置 | 类型         | 必选 | 中文名 | 说明 |
| ---- | ---- | ------------ | ---- | ------ | ---- |
| id   | path | string(uuid) | 是   |        | none |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Admin users listed successfully.",
  "data": {
    "items": [
      {
        "id": "63104f9e-8500-40a1-8a9c-2bdf1d374a8d",
        "username": "cary",
        "email": "13477072323@qq.com",
        "full_name": "Cary Xiao",
        "is_active": true,
        "mfa_enabled": false,
        "last_login_at": "2025-05-24T16:49:44.893294Z",
        "created_at": "2025-05-24T16:48:56.601285Z",
        "updated_at": "2025-05-24T16:49:44.897501Z"
      }
    ],
    "total": 1,
    "page": 1,
    "page_size": 10
  },
  "timestamp": "2025-05-24T16:49:45.545712Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明                       | 数据模型                                  |
| ------ | ------------------------------------------------------- | -------------------------- | ----------------------------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | Role deleted successfully. | [ApiResponseBase](#schemaapiresponsebase) |

<a id="opIdassignPermissionsToRole"></a>

## POST Assign Permissions to Role

POST /api/v1/roles/{id}/permissions

> Body 请求参数

```json
{
  "permission_keys": ["string"]
}
```

### 请求参数

| 名称 | 位置 | 类型                                                                    | 必选 | 中文名                         | 说明                                     |
| ---- | ---- | ----------------------------------------------------------------------- | ---- | ------------------------------ | ---------------------------------------- |
| id   | path | string(uuid)                                                            | 是   |                                | ID of the role to assign permissions to. |
| body | body | [AssignPermissionsToRolePayload](#schemaassignpermissionstorolepayload) | 否   | AssignPermissionsToRolePayload | none                                     |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Admin users listed successfully.",
  "data": {
    "items": [
      {
        "id": "63104f9e-8500-40a1-8a9c-2bdf1d374a8d",
        "username": "cary",
        "email": "13477072323@qq.com",
        "full_name": "Cary Xiao",
        "is_active": true,
        "mfa_enabled": false,
        "last_login_at": "2025-05-24T16:49:44.893294Z",
        "created_at": "2025-05-24T16:48:56.601285Z",
        "updated_at": "2025-05-24T16:49:44.897501Z"
      }
    ],
    "total": 1,
    "page": 1,
    "page_size": 10
  },
  "timestamp": "2025-05-24T16:49:45.545712Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明                                       | 数据模型                                  |
| ------ | ------------------------------------------------------- | ------------------------------------------ | ----------------------------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | Permissions assigned to role successfully. | [ApiResponseBase](#schemaapiresponsebase) |

## GET List Permission Keys For Role

GET /api/v1/roles/{role_id}/permissions

获取角色拥有的权限键列表
根据角色ID，查询该角色实际拥有的所有操作权限的 `permission_key` 字符串列表。用于在权限树上回显已勾选的权限。

### 请求参数

| 名称    | 位置 | 类型         | 必选 | 中文名 | 说明       |
| ------- | ---- | ------------ | ---- | ------ | ---------- |
| role_id | path | string(uuid) | 是   |        | 角色的ID。 |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": ["string"],
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明                                         | 数据模型                                                |
| ------ | ------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | 与该角色关联的 `permission_key` 字符串列表。 | [ApiResponse_StringList](#schemaapiresponse_stringlist) |

# Admin Menu

## GET List Menus

GET /api/v1/menus

### 请求参数

| 名称   | 位置  | 类型   | 必选 | 中文名 | 说明               |
| ------ | ----- | ------ | ---- | ------ | ------------------ |
| title  | query | string | 否   |        | 按菜单标题模糊查询 |
| status | query | string | 否   |        | 按菜单状态精确查询 |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": ["string"],
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称      | 类型    | 必选  | 约束 | 中文名 | 说明                        |
| --------- | ------- | ----- | ---- | ------ | --------------------------- |
| » success | boolean | true  | none |        | 请求是否成功                |
| » code    | string  | true  | none |        | 业务状态码，SUCCESS表示成功 |
| » message | string  | true  | none |        | 对当前状态的描述信息        |
| » data    | any     | false | none |        | 返回的业务数据主体          |

_oneOf_

| 名称           | 类型     | 必选  | 约束 | 中文名 | 说明 |
| -------------- | -------- | ----- | ---- | ------ | ---- |
| »» _anonymous_ | [string] | false | none |        | none |

_xor_

| 名称           | 类型   | 必选  | 约束 | 中文名 | 说明 |
| -------------- | ------ | ----- | ---- | ------ | ---- |
| »» _anonymous_ | object | false | none |        | none |

_continued_

| 名称        | 类型              | 必选 | 约束 | 中文名 | 说明             |
| ----------- | ----------------- | ---- | ---- | ------ | ---------------- |
| » timestamp | string(date-time) | true | none |        | 服务器响应时间戳 |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

## POST Create Menu

POST /api/v1/menus

> Body 请求参数

```json
{
  "title": "string",
  "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
  "menu_type": "CATALOG",
  "name": "string",
  "path": "string",
  "component": "string",
  "permission_key": "string",
  "icon": "string",
  "sort_order": 0,
  "is_hidden": true,
  "is_cache": true,
  "is_external_link": true,
  "external_link_url": "string",
  "status": "ENABLED",
  "remark": "string"
}
```

### 请求参数

| 名称                | 位置 | 类型              | 必选 | 中文名 | 说明                                    |
| ------------------- | ---- | ----------------- | ---- | ------ | --------------------------------------- |
| body                | body | object            | 否   |        | none                                    |
| » title             | body | string            | 是   |        | 菜单标题                                |
| » parent_id         | body | string(uuid)¦null | 否   |        | 父菜单ID                                |
| » menu_type         | body | string            | 是   |        | 菜单类型                                |
| » name              | body | string¦null       | 否   |        | 路由名称 (唯一, 可选)                   |
| » path              | body | string¦null       | 否   |        | 路由路径                                |
| » component         | body | string¦null       | 否   |        | 前端组件路径                            |
| » permission_key    | body | string¦null       | 否   |        | 关联的权限标识                          |
| » icon              | body | string¦null       | 否   |        | 菜单图标                                |
| » sort_order        | body | integer¦null      | 否   |        | 排序值 (默认0)                          |
| » is_hidden         | body | boolean¦null      | 否   |        | 是否隐藏 (默认false)                    |
| » is_cache          | body | boolean¦null      | 否   |        | 是否缓存 (默认false)                    |
| » is_external_link  | body | boolean¦null      | 否   |        | 是否为外链 (默认false)                  |
| » external_link_url | body | string¦null       | 否   |        | 外链URL (如果 is_external_link 为 true) |
| » status            | body | string¦null       | 否   |        | 菜单状态 (默认ENABLED)                  |
| » remark            | body | string¦null       | 否   |        | 备注                                    |

#### 枚举值

| 属性        | 值       |
| ----------- | -------- |
| » menu_type | CATALOG  |
| » menu_type | MENU     |
| » menu_type | BUTTON   |
| » status    | ENABLED  |
| » status    | DISABLED |
| » status    | null     |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
    "menu_type": "CATALOG",
    "title": "string",
    "name": "string",
    "path": "string",
    "component": "string",
    "permission_key": "string",
    "icon": "string",
    "sort_order": 0,
    "is_hidden": true,
    "is_cache": true,
    "is_external_link": true,
    "external_link_url": "string",
    "status": "ENABLED",
    "remark": "string",
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称                 | 类型              | 必选  | 约束 | 中文名 | 说明                        |
| -------------------- | ----------------- | ----- | ---- | ------ | --------------------------- |
| » success            | boolean           | true  | none |        | 请求是否成功                |
| » code               | string            | true  | none |        | 业务状态码，SUCCESS表示成功 |
| » message            | string            | true  | none |        | 对当前状态的描述信息        |
| » data               | object            | true  | none |        | 返回的业务数据主体          |
| »» id                | string(uuid)      | true  | none |        | 菜单ID                      |
| »» parent_id         | string(uuid)¦null | false | none |        | 父菜单ID                    |
| »» menu_type         | string            | true  | none |        | 菜单类型                    |
| »» title             | string            | true  | none |        | 菜单标题                    |
| »» name              | string¦null       | false | none |        | 路由名称                    |
| »» path              | string¦null       | false | none |        | 路由路径                    |
| »» component         | string¦null       | false | none |        | 前端组件路径                |
| »» permission_key    | string¦null       | false | none |        | 关联的权限标识              |
| »» icon              | string¦null       | false | none |        | 菜单图标                    |
| »» sort_order        | integer           | true  | none |        | 排序值                      |
| »» is_hidden         | boolean           | true  | none |        | 是否隐藏                    |
| »» is_cache          | boolean           | true  | none |        | 是否缓存                    |
| »» is_external_link  | boolean           | true  | none |        | 是否为外链                  |
| »» external_link_url | string¦null       | false | none |        | 外链URL                     |
| »» status            | string            | true  | none |        | 菜单状态                    |
| »» remark            | string¦null       | false | none |        | 备注                        |
| »» created_at        | string(date-time) | true  | none |        | 创建时间                    |
| »» updated_at        | string(date-time) | true  | none |        | 更新时间                    |
| » timestamp          | string(date-time) | true  | none |        | 服务器响应时间戳            |

#### 枚举值

| 属性      | 值       |
| --------- | -------- |
| code      | SUCCESS  |
| code      | FAIL     |
| menu_type | CATALOG  |
| menu_type | MENU     |
| menu_type | BUTTON   |
| status    | ENABLED  |
| status    | DISABLED |

## GET Get Menu By Id

GET /api/v1/menus/{id}

### 请求参数

| 名称 | 位置 | 类型   | 必选 | 中文名 | 说明 |
| ---- | ---- | ------ | ---- | ------ | ---- |
| id   | path | string | 是   |        | none |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
    "menu_type": "CATALOG",
    "title": "string",
    "name": "string",
    "path": "string",
    "component": "string",
    "permission_key": "string",
    "icon": "string",
    "sort_order": 0,
    "is_hidden": true,
    "is_cache": true,
    "is_external_link": true,
    "external_link_url": "string",
    "status": "ENABLED",
    "remark": "string",
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称                 | 类型              | 必选  | 约束 | 中文名 | 说明                        |
| -------------------- | ----------------- | ----- | ---- | ------ | --------------------------- |
| » success            | boolean           | true  | none |        | 请求是否成功                |
| » code               | string            | true  | none |        | 业务状态码，SUCCESS表示成功 |
| » message            | string            | true  | none |        | 对当前状态的描述信息        |
| » data               | object            | true  | none |        | 返回的业务数据主体          |
| »» id                | string(uuid)      | true  | none |        | 菜单ID                      |
| »» parent_id         | string(uuid)¦null | false | none |        | 父菜单ID                    |
| »» menu_type         | string            | true  | none |        | 菜单类型                    |
| »» title             | string            | true  | none |        | 菜单标题                    |
| »» name              | string¦null       | false | none |        | 路由名称                    |
| »» path              | string¦null       | false | none |        | 路由路径                    |
| »» component         | string¦null       | false | none |        | 前端组件路径                |
| »» permission_key    | string¦null       | false | none |        | 关联的权限标识              |
| »» icon              | string¦null       | false | none |        | 菜单图标                    |
| »» sort_order        | integer           | true  | none |        | 排序值                      |
| »» is_hidden         | boolean           | true  | none |        | 是否隐藏                    |
| »» is_cache          | boolean           | true  | none |        | 是否缓存                    |
| »» is_external_link  | boolean           | true  | none |        | 是否为外链                  |
| »» external_link_url | string¦null       | false | none |        | 外链URL                     |
| »» status            | string            | true  | none |        | 菜单状态                    |
| »» remark            | string¦null       | false | none |        | 备注                        |
| »» created_at        | string(date-time) | true  | none |        | 创建时间                    |
| »» updated_at        | string(date-time) | true  | none |        | 更新时间                    |
| » timestamp          | string(date-time) | true  | none |        | 服务器响应时间戳            |

#### 枚举值

| 属性      | 值       |
| --------- | -------- |
| code      | SUCCESS  |
| code      | FAIL     |
| menu_type | CATALOG  |
| menu_type | MENU     |
| menu_type | BUTTON   |
| status    | ENABLED  |
| status    | DISABLED |

## PUT Update Menu

PUT /api/v1/menus/{id}

> Body 请求参数

```json
{
  "title": "string",
  "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
  "menu_type": "CATALOG",
  "name": "string",
  "path": "string",
  "component": "string",
  "permission_key": "string",
  "icon": "string",
  "sort_order": 0,
  "is_hidden": true,
  "is_cache": true,
  "is_external_link": true,
  "external_link_url": "string",
  "status": "ENABLED",
  "remark": "string"
}
```

### 请求参数

| 名称                | 位置 | 类型              | 必选 | 中文名 | 说明                  |
| ------------------- | ---- | ----------------- | ---- | ------ | --------------------- |
| id                  | path | string            | 是   |        | none                  |
| body                | body | object            | 否   |        | none                  |
| » title             | body | string¦null       | 否   |        | 菜单标题              |
| » parent_id         | body | string(uuid)¦null | 否   |        | 父菜单ID              |
| » menu_type         | body | string¦null       | 否   |        | 菜单类型              |
| » name              | body | string¦null       | 否   |        | 路由名称 (唯一, 可选) |
| » path              | body | string¦null       | 否   |        | 路由路径              |
| » component         | body | string¦null       | 否   |        | 前端组件路径          |
| » permission_key    | body | string¦null       | 否   |        | 关联的权限标识        |
| » icon              | body | string¦null       | 否   |        | 菜单图标              |
| » sort_order        | body | integer¦null      | 否   |        | 排序值                |
| » is_hidden         | body | boolean¦null      | 否   |        | 是否隐藏              |
| » is_cache          | body | boolean¦null      | 否   |        | 是否缓存              |
| » is_external_link  | body | boolean¦null      | 否   |        | 是否为外链            |
| » external_link_url | body | string¦null       | 否   |        | 外链URL               |
| » status            | body | string¦null       | 否   |        | 菜单状态              |
| » remark            | body | string¦null       | 否   |        | 备注                  |

#### 枚举值

| 属性        | 值       |
| ----------- | -------- |
| » menu_type | CATALOG  |
| » menu_type | MENU     |
| » menu_type | BUTTON   |
| » menu_type | null     |
| » status    | ENABLED  |
| » status    | DISABLED |
| » status    | null     |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
    "menu_type": "CATALOG",
    "title": "string",
    "name": "string",
    "path": "string",
    "component": "string",
    "permission_key": "string",
    "icon": "string",
    "sort_order": 0,
    "is_hidden": true,
    "is_cache": true,
    "is_external_link": true,
    "external_link_url": "string",
    "status": "ENABLED",
    "remark": "string",
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称                 | 类型              | 必选  | 约束 | 中文名 | 说明                        |
| -------------------- | ----------------- | ----- | ---- | ------ | --------------------------- |
| » success            | boolean           | true  | none |        | 请求是否成功                |
| » code               | string            | true  | none |        | 业务状态码，SUCCESS表示成功 |
| » message            | string            | true  | none |        | 对当前状态的描述信息        |
| » data               | object            | true  | none |        | 返回的业务数据主体          |
| »» id                | string(uuid)      | true  | none |        | 菜单ID                      |
| »» parent_id         | string(uuid)¦null | false | none |        | 父菜单ID                    |
| »» menu_type         | string            | true  | none |        | 菜单类型                    |
| »» title             | string            | true  | none |        | 菜单标题                    |
| »» name              | string¦null       | false | none |        | 路由名称                    |
| »» path              | string¦null       | false | none |        | 路由路径                    |
| »» component         | string¦null       | false | none |        | 前端组件路径                |
| »» permission_key    | string¦null       | false | none |        | 关联的权限标识              |
| »» icon              | string¦null       | false | none |        | 菜单图标                    |
| »» sort_order        | integer           | true  | none |        | 排序值                      |
| »» is_hidden         | boolean           | true  | none |        | 是否隐藏                    |
| »» is_cache          | boolean           | true  | none |        | 是否缓存                    |
| »» is_external_link  | boolean           | true  | none |        | 是否为外链                  |
| »» external_link_url | string¦null       | false | none |        | 外链URL                     |
| »» status            | string            | true  | none |        | 菜单状态                    |
| »» remark            | string¦null       | false | none |        | 备注                        |
| »» created_at        | string(date-time) | true  | none |        | 创建时间                    |
| »» updated_at        | string(date-time) | true  | none |        | 更新时间                    |
| » timestamp          | string(date-time) | true  | none |        | 服务器响应时间戳            |

#### 枚举值

| 属性      | 值       |
| --------- | -------- |
| code      | SUCCESS  |
| code      | FAIL     |
| menu_type | CATALOG  |
| menu_type | MENU     |
| menu_type | BUTTON   |
| status    | ENABLED  |
| status    | DISABLED |

## DELETE Delete Menu

DELETE /api/v1/menus/{id}

### 请求参数

| 名称 | 位置 | 类型         | 必选 | 中文名 | 说明       |
| ---- | ---- | ------------ | ---- | ------ | ---------- |
| id   | path | string(uuid) | 是   |        | 菜单项的ID |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {},
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称        | 类型              | 必选  | 约束 | 中文名 | 说明                        |
| ----------- | ----------------- | ----- | ---- | ------ | --------------------------- |
| » success   | boolean           | true  | none |        | 请求是否成功                |
| » code      | string            | true  | none |        | 业务状态码，SUCCESS表示成功 |
| » message   | string            | true  | none |        | 对当前状态的描述信息        |
| » data      | object            | false | none |        | 返回的业务数据主体          |
| » timestamp | string(date-time) | true  | none |        | 服务器响应时间戳            |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

# API Resources

## POST Create Api Resource

POST /api/v1/api-resources

> Body 请求参数

```json
{
  "http_method": "string",
  "path_pattern": "string",
  "display_name": "string",
  "description": "string",
  "required_permission_keys": ["string"],
  "module_tag": "string",
  "is_active": true
}
```

### 请求参数

| 名称                       | 位置 | 类型          | 必选 | 中文名 | 说明                                            |
| -------------------------- | ---- | ------------- | ---- | ------ | ----------------------------------------------- |
| body                       | body | object        | 否   |        | none                                            |
| » http_method              | body | string        | 是   |        | HTTP方法。                                      |
| » path_pattern             | body | string        | 是   |        | URL路径模式。                                   |
| » display_name             | body | string        | 是   |        | API资源的显示名称。                             |
| » description              | body | string¦null   | 否   |        | 可选的描述信息。                                |
| » required_permission_keys | body | [string]¦null | 否   |        | 可选的所需权限键列表。                          |
| » module_tag               | body | string¦null   | 否   |        | 可选的模块标签。                                |
| » is_active                | body | boolean¦null  | 否   |        | 可选的是否激活标志 (如果未提供，则默认为true)。 |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "http_method": "string",
    "path_pattern": "string",
    "display_name": "string",
    "description": "string",
    "required_permission_keys": ["string"],
    "is_active": true,
    "auto_registered": true,
    "module_tag": "string",
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称                        | 类型              | 必选  | 约束 | 中文名 | 说明                                              |
| --------------------------- | ----------------- | ----- | ---- | ------ | ------------------------------------------------- |
| » success                   | boolean           | true  | none |        | 请求是否成功                                      |
| » code                      | string            | true  | none |        | 业务状态码，SUCCESS表示成功                       |
| » message                   | string            | true  | none |        | 对当前状态的描述信息                              |
| » data                      | object            | true  | none |        | 返回的业务数据主体                                |
| »» id                       | string(uuid)      | true  | none |        | API资源的唯一标识符。                             |
| »» http_method              | string            | true  | none |        | HTTP方法 (例如：GET, POST)。                      |
| »» path_pattern             | string            | true  | none |        | API资源的URL路径模式 (例如：/api/v1/users/{id})。 |
| »» display_name             | string            | true  | none |        | API资源的用户友好显示名称。                       |
| »» description              | string¦null       | false | none |        | API资源的详细描述。                               |
| »» required_permission_keys | [string]¦null     | false | none |        | 访问此资源所需的权限键列表。                      |
| »» is_active                | boolean           | true  | none |        | 此API资源的权限控制是否已激活。                   |
| »» auto_registered          | boolean           | true  | none |        | 此API资源是否由系统自动注册。                     |
| »» module_tag               | string¦null       | false | none |        | 用于按模块对API资源进行分组的标签。               |
| »» created_at               | string(date-time) | true  | none |        | API资源的创建时间戳。                             |
| »» updated_at               | string(date-time) | true  | none |        | API资源的最后更新时间戳。                         |
| » timestamp                 | string(date-time) | true  | none |        | 服务器响应时间戳                                  |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

## GET Api Resource List

GET /api/v1/api-resources

### 请求参数

| 名称        | 位置  | 类型    | 必选 | 中文名 | 说明                                                 |
| ----------- | ----- | ------- | ---- | ------ | ---------------------------------------------------- |
| http_method | query | string  | 否   |        | 按HTTP方法过滤                                       |
| module_tag  | query | string  | 否   |        | 按模块标签过滤                                       |
| is_active   | query | boolean | 否   |        | 按激活状态过滤                                       |
| page        | query | integer | 否   |        | 页码，从1开始，默认为1                               |
| page_size   | query | integer | 否   |        | 每页数量，默认为20 (或您代码中定义的默认值)          |
| search      | query | string  | 否   |        | 全局搜索关键词，用于在显示名称、路径模式、描述中搜索 |
| sort_by     | query | string  | 否   |        | 排序字段名                                           |
| sort_order  | query | string  | 否   |        | 排序顺序，asc为升序，desc为降序                      |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "items": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "http_method": "string",
        "path_pattern": "string",
        "display_name": "string",
        "description": "string",
        "required_permission_keys": ["string"],
        "is_active": true,
        "auto_registered": true,
        "module_tag": "string",
        "created_at": "2019-08-24T14:15:22Z",
        "updated_at": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "page": 0,
    "page_size": 1
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称                          | 类型                                          | 必选  | 约束 | 中文名           | 说明                                              |
| ----------------------------- | --------------------------------------------- | ----- | ---- | ---------------- | ------------------------------------------------- |
| » success                     | boolean                                       | true  | none |                  | 请求是否成功                                      |
| » code                        | string                                        | true  | none |                  | 业务状态码，SUCCESS表示成功                       |
| » message                     | string                                        | true  | none |                  | 对当前状态的描述信息                              |
| » data                        | object                                        | true  | none |                  | 返回的业务数据主体                                |
| »» items                      | [[ApiResourceModel](#schemaapiresourcemodel)] | true  | none |                  | 对象数组                                          |
| »»» ApiResourceModel          | [ApiResourceModel](#schemaapiresourcemodel)   | false | none | ApiResourceModel | 表示数据库中的API资源实体。                       |
| »»»» id                       | string(uuid)                                  | true  | none |                  | API资源的唯一标识符。                             |
| »»»» http_method              | string                                        | true  | none |                  | HTTP方法 (例如：GET, POST)。                      |
| »»»» path_pattern             | string                                        | true  | none |                  | API资源的URL路径模式 (例如：/api/v1/users/{id})。 |
| »»»» display_name             | string                                        | true  | none |                  | API资源的用户友好显示名称。                       |
| »»»» description              | string¦null                                   | false | none |                  | API资源的详细描述。                               |
| »»»» required_permission_keys | [string]¦null                                 | false | none |                  | 访问此资源所需的权限键列表。                      |
| »»»» is_active                | boolean                                       | true  | none |                  | 此API资源的权限控制是否已激活。                   |
| »»»» auto_registered          | boolean                                       | true  | none |                  | 此API资源是否由系统自动注册。                     |
| »»»» module_tag               | string¦null                                   | false | none |                  | 用于按模块对API资源进行分组的标签。               |
| »»»» created_at               | string(date-time)                             | true  | none |                  | API资源的创建时间戳。                             |
| »»»» updated_at               | string(date-time)                             | true  | none |                  | API资源的最后更新时间戳。                         |
| »» total                      | integer                                       | true  | none |                  | 总记录数（用于分页）                              |
| »» page                       | integer                                       | true  | none |                  | 当前页码（从1开始）                               |
| »» page_size                  | integer                                       | true  | none |                  | 每页记录数                                        |
| » timestamp                   | string(date-time)                             | true  | none |                  | 服务器响应时间戳                                  |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

## GET Get Api Resource

GET /api/v1/api-resources/{id}

### 请求参数

| 名称 | 位置 | 类型         | 必选 | 中文名 | 说明      |
| ---- | ---- | ------------ | ---- | ------ | --------- |
| id   | path | string(uuid) | 是   |        | API资源ID |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "resource": {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "http_method": "string",
      "path_pattern": "string",
      "display_name": "string",
      "description": "string",
      "required_permission_keys": ["string"],
      "is_active": true,
      "auto_registered": true,
      "module_tag": "string",
      "created_at": "2019-08-24T14:15:22Z",
      "updated_at": "2019-08-24T14:15:22Z"
    },
    "validation": {
      "resource_id": "4d5215ed-38bb-48ed-879a-fdb9ca58522f",
      "is_valid": true,
      "issues": [
        {
          "issue_type": "[",
          "description": "string",
          "severity": "[",
          "field": "string"
        }
      ],
      "suggestions": ["string"],
      "validated_at": "2019-08-24T14:15:22Z"
    },
    "usage_stats": {
      "access_count": 0,
      "last_accessed": "2019-08-24T14:15:22Z",
      "avg_response_time": 0.1,
      "error_rate": 0.1
    },
    "related_resources": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "http_method": "string",
        "path_pattern": "string",
        "display_name": "string",
        "description": "string",
        "required_permission_keys": ["string"],
        "is_active": true,
        "auto_registered": true,
        "module_tag": "string",
        "created_at": "2019-08-24T14:15:22Z",
        "updated_at": "2019-08-24T14:15:22Z"
      }
    ]
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称                          | 类型                                              | 必选  | 约束 | 中文名              | 说明                                              |
| ----------------------------- | ------------------------------------------------- | ----- | ---- | ------------------- | ------------------------------------------------- |
| » success                     | boolean                                           | true  | none |                     | 请求是否成功                                      |
| » code                        | string                                            | true  | none |                     | 业务状态码，SUCCESS表示成功                       |
| » message                     | string                                            | true  | none |                     | 对当前状态的描述信息                              |
| » data                        | object                                            | true  | none |                     | 返回的业务数据主体                                |
| »» resource                   | [ApiResourceModel](#schemaapiresourcemodel)       | true  | none | ApiResourceModel    | 表示数据库中的API资源实体。                       |
| »»» id                        | string(uuid)                                      | true  | none |                     | API资源的唯一标识符。                             |
| »»» http_method               | string                                            | true  | none |                     | HTTP方法 (例如：GET, POST)。                      |
| »»» path_pattern              | string                                            | true  | none |                     | API资源的URL路径模式 (例如：/api/v1/users/{id})。 |
| »»» display_name              | string                                            | true  | none |                     | API资源的用户友好显示名称。                       |
| »»» description               | string¦null                                       | false | none |                     | API资源的详细描述。                               |
| »»» required_permission_keys  | [string]¦null                                     | false | none |                     | 访问此资源所需的权限键列表。                      |
| »»» is_active                 | boolean                                           | true  | none |                     | 此API资源的权限控制是否已激活。                   |
| »»» auto_registered           | boolean                                           | true  | none |                     | 此API资源是否由系统自动注册。                     |
| »»» module_tag                | string¦null                                       | false | none |                     | 用于按模块对API资源进行分组的标签。               |
| »»» created_at                | string(date-time)                                 | true  | none |                     | API资源的创建时间戳。                             |
| »»» updated_at                | string(date-time)                                 | true  | none |                     | API资源的最后更新时间戳。                         |
| »» validation                 | [ValidationResponse](#schemavalidationresponse)   | false | none | ValidationResponse  | 权限验证结果。                                    |
| »»» resource_id               | string(uuid)                                      | true  | none |                     | 被验证资源的ID。                                  |
| »»» is_valid                  | boolean                                           | true  | none |                     | 配置是否有效。                                    |
| »»» issues                    | [[ValidationIssue](#schemavalidationissue)]       | true  | none |                     | 发现的验证问题列表。                              |
| »»»» ValidationIssue          | [ValidationIssue](#schemavalidationissue)         | false | none | ValidationIssue     | 单个验证问题的详细信息。                          |
| »»»»» issue_type              | [ValidationIssueType](#schemavalidationissuetype) | true  | none | ValidationIssueType | 问题类型。                                        |
| »»»»» description             | string                                            | true  | none |                     | 问题描述。                                        |
| »»»»» severity                | [ValidationSeverity](#schemavalidationseverity)   | true  | none | ValidationSeverity  | 严重级别。                                        |
| »»»»» field                   | string¦null                                       | false | none |                     | 与问题相关的字段名 (如果适用)。                   |
| »»» suggestions               | [string]                                          | true  | none |                     | 改进建议列表。                                    |
| »»» validated_at              | string(date-time)                                 | true  | none |                     | 执行验证的时间戳。                                |
| »» usage_stats                | [ResourceUsageStats](#schemaresourceusagestats)   | false | none | ResourceUsageStats  | 资源使用统计 (如果可用)。                         |
| »»» access_count              | integer(int64)                                    | true  | none |                     | 资源被访问的次数。                                |
| »»» last_accessed             | string(date-time)¦null                            | false | none |                     | 最后访问的时间戳。                                |
| »»» avg_response_time         | number(double)¦null                               | false | none |                     | 平均响应时间 (毫秒)。                             |
| »»» error_rate                | number(double)¦null                               | false | none |                     | 错误率 (0.0 到 1.0)。                             |
| »» related_resources          | [[ApiResourceModel](#schemaapiresourcemodel)]     | true  | none |                     | 相关API资源列表。                                 |
| »»» ApiResourceModel          | [ApiResourceModel](#schemaapiresourcemodel)       | false | none | ApiResourceModel    | 表示数据库中的API资源实体。                       |
| »»»» id                       | string(uuid)                                      | true  | none |                     | API资源的唯一标识符。                             |
| »»»» http_method              | string                                            | true  | none |                     | HTTP方法 (例如：GET, POST)。                      |
| »»»» path_pattern             | string                                            | true  | none |                     | API资源的URL路径模式 (例如：/api/v1/users/{id})。 |
| »»»» display_name             | string                                            | true  | none |                     | API资源的用户友好显示名称。                       |
| »»»» description              | string¦null                                       | false | none |                     | API资源的详细描述。                               |
| »»»» required_permission_keys | [string]¦null                                     | false | none |                     | 访问此资源所需的权限键列表。                      |
| »»»» is_active                | boolean                                           | true  | none |                     | 此API资源的权限控制是否已激活。                   |
| »»»» auto_registered          | boolean                                           | true  | none |                     | 此API资源是否由系统自动注册。                     |
| »»»» module_tag               | string¦null                                       | false | none |                     | 用于按模块对API资源进行分组的标签。               |
| »»»» created_at               | string(date-time)                                 | true  | none |                     | API资源的创建时间戳。                             |
| »»»» updated_at               | string(date-time)                                 | true  | none |                     | API资源的最后更新时间戳。                         |
| » timestamp                   | string(date-time)                                 | true  | none |                     | 服务器响应时间戳                                  |

#### 枚举值

| 属性       | 值               |
| ---------- | ---------------- |
| code       | SUCCESS          |
| code       | FAIL             |
| issue_type | MissingRequired  |
| issue_type | InvalidFormat    |
| issue_type | InvalidValue     |
| issue_type | PermissionIssue  |
| issue_type | PathPatternIssue |
| issue_type | HttpMethodIssue  |
| severity   | Error            |
| severity   | Warning          |
| severity   | Info             |

## PUT Update Api Resource

PUT /api/v1/api-resources/{id}

> Body 请求参数

```json
{
  "display_name": "string",
  "description": "string",
  "required_permission_keys": ["string"],
  "module_tag": "string",
  "is_active": true
}
```

### 请求参数

| 名称                       | 位置 | 类型          | 必选 | 中文名 | 说明                       |
| -------------------------- | ---- | ------------- | ---- | ------ | -------------------------- |
| id                         | path | string(uuid)  | 是   |        | API资源ID                  |
| body                       | body | object        | 否   |        | none                       |
| » display_name             | body | string¦null   | 否   |        | 可选的新的显示名称。       |
| » description              | body | string¦null   | 否   |        | 可选的新的描述信息。       |
| » required_permission_keys | body | [string]¦null | 否   |        | 可选的新的所需权限键列表。 |
| » module_tag               | body | string¦null   | 否   |        | 可选的新的模块标签。       |
| » is_active                | body | boolean¦null  | 否   |        | 可选的新的激活状态。       |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "http_method": "string",
    "path_pattern": "string",
    "display_name": "string",
    "description": "string",
    "required_permission_keys": ["string"],
    "is_active": true,
    "auto_registered": true,
    "module_tag": "string",
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称                        | 类型                                        | 必选  | 约束 | 中文名           | 说明                                              |
| --------------------------- | ------------------------------------------- | ----- | ---- | ---------------- | ------------------------------------------------- |
| » success                   | boolean                                     | true  | none |                  | 请求是否成功                                      |
| » code                      | string                                      | true  | none |                  | 业务状态码，SUCCESS表示成功                       |
| » message                   | string                                      | true  | none |                  | 对当前状态的描述信息                              |
| » data                      | [ApiResourceModel](#schemaapiresourcemodel) | true  | none | ApiResourceModel | 表示数据库中的API资源实体。                       |
| »» id                       | string(uuid)                                | true  | none |                  | API资源的唯一标识符。                             |
| »» http_method              | string                                      | true  | none |                  | HTTP方法 (例如：GET, POST)。                      |
| »» path_pattern             | string                                      | true  | none |                  | API资源的URL路径模式 (例如：/api/v1/users/{id})。 |
| »» display_name             | string                                      | true  | none |                  | API资源的用户友好显示名称。                       |
| »» description              | string¦null                                 | false | none |                  | API资源的详细描述。                               |
| »» required_permission_keys | [string]¦null                               | false | none |                  | 访问此资源所需的权限键列表。                      |
| »» is_active                | boolean                                     | true  | none |                  | 此API资源的权限控制是否已激活。                   |
| »» auto_registered          | boolean                                     | true  | none |                  | 此API资源是否由系统自动注册。                     |
| »» module_tag               | string¦null                                 | false | none |                  | 用于按模块对API资源进行分组的标签。               |
| »» created_at               | string(date-time)                           | true  | none |                  | API资源的创建时间戳。                             |
| »» updated_at               | string(date-time)                           | true  | none |                  | API资源的最后更新时间戳。                         |
| » timestamp                 | string(date-time)                           | true  | none |                  | 服务器响应时间戳                                  |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

## DELETE Delete Api Resource

DELETE /api/v1/api-resources/{id}

### 请求参数

| 名称 | 位置 | 类型         | 必选 | 中文名 | 说明      |
| ---- | ---- | ------------ | ---- | ------ | --------- |
| id   | path | string(uuid) | 是   |        | API资源ID |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {},
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称        | 类型              | 必选  | 约束 | 中文名 | 说明                        |
| ----------- | ----------------- | ----- | ---- | ------ | --------------------------- |
| » success   | boolean           | true  | none |        | 请求是否成功                |
| » code      | string            | true  | none |        | 业务状态码，SUCCESS表示成功 |
| » message   | string            | true  | none |        | 对当前状态的描述信息        |
| » data      | object            | false | none |        | 返回的业务数据主体          |
| » timestamp | string(date-time) | true  | none |        | 服务器响应时间戳            |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

## POST Batch Register Resources

POST /api/v1/api-resources/batch-register

> Body 请求参数

```json
{
  "http_method": "string",
  "path_pattern": "string",
  "display_name": "string",
  "description": "string",
  "required_permissions": ["string"],
  "module_tag": "string"
}
```

### 请求参数

| 名称                   | 位置 | 类型        | 必选 | 中文名 | 说明             |
| ---------------------- | ---- | ----------- | ---- | ------ | ---------------- |
| body                   | body | object      | 否   |        | none             |
| » http_method          | body | string      | 是   |        | HTTP方法。       |
| » path_pattern         | body | string      | 是   |        | URL路径模式。    |
| » display_name         | body | string      | 是   |        | 显示名称。       |
| » description          | body | string¦null | 否   |        | 可选的描述信息。 |
| » required_permissions | body | [string]    | 是   |        | 所需权限键列表。 |
| » module_tag           | body | string      | 是   |        | 模块标签。       |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "registered_count": 0,
    "skipped_count": 0,
    "resources": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "http_method": "string",
        "path_pattern": "string",
        "display_name": "string",
        "description": "string",
        "required_permission_keys": ["string"],
        "is_active": true,
        "auto_registered": true,
        "module_tag": "string",
        "created_at": "2019-08-24T14:15:22Z",
        "updated_at": "2019-08-24T14:15:22Z"
      }
    ],
    "skipped_resources": ["string"]
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称                          | 类型                                                  | 必选  | 约束 | 中文名                | 说明                                              |
| ----------------------------- | ----------------------------------------------------- | ----- | ---- | --------------------- | ------------------------------------------------- |
| » success                     | boolean                                               | true  | none |                       | 请求是否成功                                      |
| » code                        | string                                                | true  | none |                       | 业务状态码，SUCCESS表示成功                       |
| » message                     | string                                                | true  | none |                       | 对当前状态的描述信息                              |
| » data                        | [BatchRegisterResponse](#schemabatchregisterresponse) | true  | none | BatchRegisterResponse | 返回的业务数据主体                                |
| »» registered_count           | integer                                               | true  | none |                       | 成功注册的资源数量。                              |
| »» skipped_count              | integer                                               | true  | none |                       | 跳过的资源数量 (例如，已存在)。                   |
| »» resources                  | [[ApiResourceModel](#schemaapiresourcemodel)]         | true  | none |                       | 新注册的API资源列表。                             |
| »»» ApiResourceModel          | [ApiResourceModel](#schemaapiresourcemodel)           | false | none | ApiResourceModel      | 表示数据库中的API资源实体。                       |
| »»»» id                       | string(uuid)                                          | true  | none |                       | API资源的唯一标识符。                             |
| »»»» http_method              | string                                                | true  | none |                       | HTTP方法 (例如：GET, POST)。                      |
| »»»» path_pattern             | string                                                | true  | none |                       | API资源的URL路径模式 (例如：/api/v1/users/{id})。 |
| »»»» display_name             | string                                                | true  | none |                       | API资源的用户友好显示名称。                       |
| »»»» description              | string¦null                                           | false | none |                       | API资源的详细描述。                               |
| »»»» required_permission_keys | [string]¦null                                         | false | none |                       | 访问此资源所需的权限键列表。                      |
| »»»» is_active                | boolean                                               | true  | none |                       | 此API资源的权限控制是否已激活。                   |
| »»»» auto_registered          | boolean                                               | true  | none |                       | 此API资源是否由系统自动注册。                     |
| »»»» module_tag               | string¦null                                           | false | none |                       | 用于按模块对API资源进行分组的标签。               |
| »»»» created_at               | string(date-time)                                     | true  | none |                       | API资源的创建时间戳。                             |
| »»»» updated_at               | string(date-time)                                     | true  | none |                       | API资源的最后更新时间戳。                         |
| »» skipped_resources          | [string]                                              | true  | none |                       | 被跳过的资源标识符列表。                          |
| » timestamp                   | string(date-time)                                     | true  | none |                       | 服务器响应时间戳                                  |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

## GET Api Reources Stats

GET /api/v1/api-resources/stats/modules

获取API资源模块统计

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "modules": {
      "resource_count": 0,
      "method_distribution": {
        "property1": 0,
        "property2": 0
      },
      "active_count": 0,
      "inactive_count": 0
    },
    "total_resources": 0,
    "active_resources": 0,
    "inactive_resources": 0
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称                          | 类型                              | 必选  | 约束 | 中文名      | 说明                             |
| ----------------------------- | --------------------------------- | ----- | ---- | ----------- | -------------------------------- |
| » success                     | boolean                           | true  | none |             | 请求是否成功                     |
| » code                        | string                            | true  | none |             | 业务状态码，SUCCESS表示成功      |
| » message                     | string                            | true  | none |             | 对当前状态的描述信息             |
| » data                        | object                            | true  | none |             | 返回的业务数据主体               |
| »» modules                    | [ModuleStats](#schemamodulestats) | true  | none | ModuleStats | 每个模块的统计信息。             |
| »»» resource_count            | integer(int64)                    | true  | none |             | 模块下的资源总数。               |
| »»» method_distribution       | object                            | true  | none |             | 模块下各HTTP方法的资源数量分布。 |
| »»»» **additionalProperties** | integer(int64)                    | false | none |             | none                             |
| »»» active_count              | integer(int64)                    | true  | none |             | 模块下已激活的资源数量。         |
| »»» inactive_count            | integer(int64)                    | true  | none |             | 模块下未激活的资源数量。         |
| »» total_resources            | integer(int64)                    | true  | none |             | API资源总数。                    |
| »» active_resources           | integer(int64)                    | true  | none |             | 已激活的API资源总数。            |
| »» inactive_resources         | integer(int64)                    | true  | none |             | 未激活的API资源总数。            |
| » timestamp                   | string(date-time)                 | true  | none |             | 服务器响应时间戳                 |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

## DELETE Cleanup Auto Registered

DELETE /api/v1/api-resources/cleanup/auto-registered

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "deleted_count": 0,
    "deleted_resources": ["string"]
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称                 | 类型                                      | 必选 | 约束 | 中文名          | 说明                        |
| -------------------- | ----------------------------------------- | ---- | ---- | --------------- | --------------------------- |
| » success            | boolean                                   | true | none |                 | 请求是否成功                |
| » code               | string                                    | true | none |                 | 业务状态码，SUCCESS表示成功 |
| » message            | string                                    | true | none |                 | 对当前状态的描述信息        |
| » data               | [CleanupResponse](#schemacleanupresponse) | true | none | CleanupResponse | 返回的业务数据主体          |
| »» deleted_count     | integer(int64)                            | true | none |                 | 已删除的自动注册资源数量。  |
| »» deleted_resources | [string]                                  | true | none |                 | 已删除资源的标识符列表。    |
| » timestamp          | string(date-time)                         | true | none |                 | 服务器响应时间戳            |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

## GET Find Resource

GET /api/v1/api-resources/find

根据路径查找API资源

### 请求参数

| 名称   | 位置  | 类型   | 必选 | 中文名 | 说明            |
| ------ | ----- | ------ | ---- | ------ | --------------- |
| method | query | string | 否   |        | HTTP方法        |
| path   | query | string | 否   |        | 要查找的API路径 |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "http_method": "string",
    "path_pattern": "string",
    "display_name": "string",
    "description": "string",
    "required_permission_keys": ["string"],
    "is_active": true,
    "auto_registered": true,
    "module_tag": "string",
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称                        | 类型                                        | 必选  | 约束 | 中文名           | 说明                                              |
| --------------------------- | ------------------------------------------- | ----- | ---- | ---------------- | ------------------------------------------------- |
| » success                   | boolean                                     | true  | none |                  | 请求是否成功                                      |
| » code                      | string                                      | true  | none |                  | 业务状态码，SUCCESS表示成功                       |
| » message                   | string                                      | true  | none |                  | 对当前状态的描述信息                              |
| » data                      | [ApiResourceModel](#schemaapiresourcemodel) | true  | none | ApiResourceModel | 表示数据库中的API资源实体。                       |
| »» id                       | string(uuid)                                | true  | none |                  | API资源的唯一标识符。                             |
| »» http_method              | string                                      | true  | none |                  | HTTP方法 (例如：GET, POST)。                      |
| »» path_pattern             | string                                      | true  | none |                  | API资源的URL路径模式 (例如：/api/v1/users/{id})。 |
| »» display_name             | string                                      | true  | none |                  | API资源的用户友好显示名称。                       |
| »» description              | string¦null                                 | false | none |                  | API资源的详细描述。                               |
| »» required_permission_keys | [string]¦null                               | false | none |                  | 访问此资源所需的权限键列表。                      |
| »» is_active                | boolean                                     | true  | none |                  | 此API资源的权限控制是否已激活。                   |
| »» auto_registered          | boolean                                     | true  | none |                  | 此API资源是否由系统自动注册。                     |
| »» module_tag               | string¦null                                 | false | none |                  | 用于按模块对API资源进行分组的标签。               |
| »» created_at               | string(date-time)                           | true  | none |                  | API资源的创建时间戳。                             |
| »» updated_at               | string(date-time)                           | true  | none |                  | API资源的最后更新时间戳。                         |
| » timestamp                 | string(date-time)                           | true  | none |                  | 服务器响应时间戳                                  |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

## POST Auto Discover

POST /api/v1/api-resources/auto-discover

自动发现API资源

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "discovered_count": 0,
    "registered_count": 0,
    "skipped_count": 0,
    "resources": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "http_method": "string",
        "path_pattern": "string",
        "display_name": "string",
        "description": "string",
        "required_permission_keys": ["string"],
        "is_active": true,
        "auto_registered": true,
        "module_tag": "string",
        "created_at": "2019-08-24T14:15:22Z",
        "updated_at": "2019-08-24T14:15:22Z"
      }
    ],
    "modules": ["string"]
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称                          | 类型                                                | 必选  | 约束 | 中文名               | 说明                                              |
| ----------------------------- | --------------------------------------------------- | ----- | ---- | -------------------- | ------------------------------------------------- |
| » success                     | boolean                                             | true  | none |                      | 请求是否成功                                      |
| » code                        | string                                              | true  | none |                      | 业务状态码，SUCCESS表示成功                       |
| » message                     | string                                              | true  | none |                      | 对当前状态的描述信息                              |
| » data                        | [AutoDiscoverResponse](#schemaautodiscoverresponse) | true  | none | AutoDiscoverResponse | 返回的业务数据主体                                |
| »» discovered_count           | integer                                             | true  | none |                      | 发现的资源数量。                                  |
| »» registered_count           | integer                                             | true  | none |                      | 新注册的资源数量。                                |
| »» skipped_count              | integer                                             | true  | none |                      | 注册时跳过的资源数量。                            |
| »» resources                  | [[ApiResourceModel](#schemaapiresourcemodel)]       | true  | none |                      | 已注册或更新的API资源列表。                       |
| »»» ApiResourceModel          | [ApiResourceModel](#schemaapiresourcemodel)         | false | none | ApiResourceModel     | 表示数据库中的API资源实体。                       |
| »»»» id                       | string(uuid)                                        | true  | none |                      | API资源的唯一标识符。                             |
| »»»» http_method              | string                                              | true  | none |                      | HTTP方法 (例如：GET, POST)。                      |
| »»»» path_pattern             | string                                              | true  | none |                      | API资源的URL路径模式 (例如：/api/v1/users/{id})。 |
| »»»» display_name             | string                                              | true  | none |                      | API资源的用户友好显示名称。                       |
| »»»» description              | string¦null                                         | false | none |                      | API资源的详细描述。                               |
| »»»» required_permission_keys | [string]¦null                                       | false | none |                      | 访问此资源所需的权限键列表。                      |
| »»»» is_active                | boolean                                             | true  | none |                      | 此API资源的权限控制是否已激活。                   |
| »»»» auto_registered          | boolean                                             | true  | none |                      | 此API资源是否由系统自动注册。                     |
| »»»» module_tag               | string¦null                                         | false | none |                      | 用于按模块对API资源进行分组的标签。               |
| »»»» created_at               | string(date-time)                                   | true  | none |                      | API资源的创建时间戳。                             |
| »»»» updated_at               | string(date-time)                                   | true  | none |                      | API资源的最后更新时间戳。                         |
| »» modules                    | [string]                                            | true  | none |                      | 发现的模块列表。                                  |
| » timestamp                   | string(date-time)                                   | true  | none |                      | 服务器响应时间戳                                  |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

## GET Validate Api Resource

GET /api/v1/api-resources/{id}/validate

验证API资源权限配置

### 请求参数

| 名称 | 位置 | 类型         | 必选 | 中文名 | 说明      |
| ---- | ---- | ------------ | ---- | ------ | --------- |
| id   | path | string(uuid) | 是   |        | API资源ID |

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "resource_id": "4d5215ed-38bb-48ed-879a-fdb9ca58522f",
    "is_valid": true,
    "issues": [
      {
        "issue_type": "MissingRequired",
        "description": "string",
        "severity": "Error",
        "field": "string"
      }
    ],
    "suggestions": ["string"],
    "validated_at": "2019-08-24T14:15:22Z"
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称                | 类型                                              | 必选  | 约束 | 中文名              | 说明                            |
| ------------------- | ------------------------------------------------- | ----- | ---- | ------------------- | ------------------------------- |
| » success           | boolean                                           | true  | none |                     | 请求是否成功                    |
| » code              | string                                            | true  | none |                     | 业务状态码，SUCCESS表示成功     |
| » message           | string                                            | true  | none |                     | 对当前状态的描述信息            |
| » data              | [ValidationResponse](#schemavalidationresponse)   | true  | none | ValidationResponse  | 权限验证结果。                  |
| »» resource_id      | string(uuid)                                      | true  | none |                     | 被验证资源的ID。                |
| »» is_valid         | boolean                                           | true  | none |                     | 配置是否有效。                  |
| »» issues           | [[ValidationIssue](#schemavalidationissue)]       | true  | none |                     | 发现的验证问题列表。            |
| »»» ValidationIssue | [ValidationIssue](#schemavalidationissue)         | false | none | ValidationIssue     | 单个验证问题的详细信息。        |
| »»»» issue_type     | [ValidationIssueType](#schemavalidationissuetype) | true  | none | ValidationIssueType | 问题类型。                      |
| »»»» description    | string                                            | true  | none |                     | 问题描述。                      |
| »»»» severity       | [ValidationSeverity](#schemavalidationseverity)   | true  | none | ValidationSeverity  | 严重级别。                      |
| »»»» field          | string¦null                                       | false | none |                     | 与问题相关的字段名 (如果适用)。 |
| »» suggestions      | [string]                                          | true  | none |                     | 改进建议列表。                  |
| »» validated_at     | string(date-time)                                 | true  | none |                     | 执行验证的时间戳。              |
| » timestamp         | string(date-time)                                 | true  | none |                     | 服务器响应时间戳                |

#### 枚举值

| 属性       | 值               |
| ---------- | ---------------- |
| code       | SUCCESS          |
| code       | FAIL             |
| issue_type | MissingRequired  |
| issue_type | InvalidFormat    |
| issue_type | InvalidValue     |
| issue_type | PermissionIssue  |
| issue_type | PathPatternIssue |
| issue_type | HttpMethodIssue  |
| severity   | Error            |
| severity   | Warning          |
| severity   | Info             |

## POST Sync Resource Permission

POST /api/v1/api-resources/sync-permissions

同步API资源权限

> 返回示例

> 200 Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "synced_resources": 0,
    "created_permissions": 0,
    "updated_permissions": 0,
    "deleted_permissions": 0,
    "sync_details": [
      {
        "resource_id": "4d5215ed-38bb-48ed-879a-fdb9ca58522f",
        "operation": "Create",
        "description": "string",
        "success": true,
        "error": "string"
      }
    ],
    "synced_at": "2019-08-24T14:15:22Z"
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称                   | 类型                                      | 必选  | 约束 | 中文名                  | 说明                         |
| ---------------------- | ----------------------------------------- | ----- | ---- | ----------------------- | ---------------------------- |
| » success              | boolean                                   | true  | none |                         | 请求是否成功                 |
| » code                 | string                                    | true  | none |                         | 业务状态码，SUCCESS表示成功  |
| » message              | string                                    | true  | none |                         | 对当前状态的描述信息         |
| » data                 | [未命名数据模型4](#schema未命名数据模型4) | true  | none | SyncPermissionsResponse | 返回的业务数据主体           |
| »» synced_resources    | integer(int64)                            | true  | none |                         | 同步的资源数量。             |
| »» created_permissions | integer(int64)                            | true  | none |                         | 创建的权限数量。             |
| »» updated_permissions | integer(int64)                            | true  | none |                         | 更新的权限数量。             |
| »» deleted_permissions | integer(int64)                            | true  | none |                         | 删除的权限数量。             |
| »» sync_details        | [[SyncDetail](#schemasyncdetail)]         | true  | none |                         | 同步操作的详细列表。         |
| »»» SyncDetail         | [SyncDetail](#schemasyncdetail)           | false | none | SyncDetail              | 单条同步操作的详细信息。     |
| »»»» resource_id       | string(uuid)                              | true  | none |                         | 同步操作所涉及资源的ID。     |
| »»»» operation         | [SyncOperation](#schemasyncoperation)     | true  | none | SyncOperation           | 操作类型。                   |
| »»»» description       | string                                    | true  | none |                         | 操作描述。                   |
| »»»» success           | boolean                                   | true  | none |                         | 操作是否成功。               |
| »»»» error             | string¦null                               | false | none |                         | 如果操作失败，则为错误信息。 |
| »» synced_at           | string(date-time)                         | true  | none |                         | 执行同步的时间戳。           |
| » timestamp            | string(date-time)                         | true  | none |                         | 服务器响应时间戳             |

#### 枚举值

| 属性      | 值      |
| --------- | ------- |
| code      | SUCCESS |
| code      | FAIL    |
| operation | Create  |
| operation | Update  |
| operation | Delete  |
| operation | Skip    |

# 数据模型

<h2 id="tocS_AdminUserListItem">AdminUserListItem</h2>

<a id="schemaadminuserlistitem"></a>
<a id="schema_AdminUserListItem"></a>
<a id="tocSadminuserlistitem"></a>
<a id="tocsadminuserlistitem"></a>

```json
{
  "id": "963ba384-253d-48ff-853f-a64b33014caf",
  "username": "admin_user",
  "email": "admin@example.com",
  "full_name": "Administrator",
  "is_active": true,
  "mfa_enabled": false,
  "last_login_at": "2025-05-24T10:00:00Z",
  "created_at": "2025-05-20T10:00:00Z",
  "updated_at": "2025-05-23T10:00:00Z"
}
```

AdminUserListItem

### 属性

| 名称          | 类型                   | 必选  | 约束 | 中文名 | 说明                 |
| ------------- | ---------------------- | ----- | ---- | ------ | -------------------- |
| id            | string(uuid)           | true  | none |        | 用户ID               |
| username      | string                 | true  | none |        | 用户名               |
| email         | string(email)          | true  | none |        | 邮箱                 |
| full_name     | string¦null            | false | none |        | 全名                 |
| is_active     | boolean                | true  | none |        | 账户是否激活         |
| mfa_enabled   | boolean                | true  | none |        | 是否启用了多因素认证 |
| last_login_at | string(date-time)¦null | false | none |        | 最后登录时间 (UTC)   |
| created_at    | string(date-time)      | true  | none |        | 创建时间 (UTC)       |
| updated_at    | string(date-time)      | true  | none |        | 更新时间 (UTC)       |

<h2 id="tocS_PaginatedAdminUsersResponse">PaginatedAdminUsersResponse</h2>

<a id="schemapaginatedadminusersresponse"></a>
<a id="schema_PaginatedAdminUsersResponse"></a>
<a id="tocSpaginatedadminusersresponse"></a>
<a id="tocspaginatedadminusersresponse"></a>

```json
{
  "items": [
    {
      "id": "963ba384-253d-48ff-853f-a64b33014caf",
      "username": "admin_user",
      "email": "admin@example.com",
      "full_name": "Administrator",
      "is_active": true,
      "mfa_enabled": false,
      "last_login_at": "2025-05-24T10:00:00Z",
      "created_at": "2025-05-20T10:00:00Z",
      "updated_at": "2025-05-23T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "page_size": 10
}
```

PaginatedAdminUsersResponse

### 属性

| 名称      | 类型                                            | 必选 | 约束 | 中文名 | 说明             |
| --------- | ----------------------------------------------- | ---- | ---- | ------ | ---------------- |
| items     | [[AdminUserListItem](#schemaadminuserlistitem)] | true | none |        | 当前页的用户列表 |
| total     | integer(int64)                                  | true | none |        | 总记录数         |
| page      | integer(int64)                                  | true | none |        | 当前页码         |
| page_size | integer(int64)                                  | true | none |        | 每页记录数       |

<h2 id="tocS_CreateAdminUserPayload">CreateAdminUserPayload</h2>

<a id="schemacreateadminuserpayload"></a>
<a id="schema_CreateAdminUserPayload"></a>
<a id="tocScreateadminuserpayload"></a>
<a id="tocscreateadminuserpayload"></a>

```json
{
  "username": "new_admin",
  "email": "new_admin@example.com",
  "password": "password123",
  "full_name": "New Admin User",
  "is_active": true
}
```

CreateAdminUserPayload

### 属性

| 名称      | 类型          | 必选  | 约束 | 中文名 | 说明                         |
| --------- | ------------- | ----- | ---- | ------ | ---------------------------- |
| username  | string        | true  | none |        | 用户名 (3-100字符)           |
| email     | string(email) | true  | none |        | 邮箱                         |
| password  | string        | true  | none |        | 密码 (至少8字符)             |
| full_name | string¦null   | false | none |        | 全名 (可选)                  |
| is_active | boolean¦null  | false | none |        | 是否激活 (可选, 默认为 true) |

<h2 id="tocS_未命名数据模型">未命名数据模型</h2>

<a id="schema未命名数据模型"></a>
<a id="schema_未命名数据模型"></a>
<a id="tocS未命名数据模型"></a>
<a id="tocs未命名数据模型"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "username": "string",
  "email": "user@example.com",
  "full_name": "string",
  "is_active": true,
  "mfa_enabled": true,
  "totp_setup_at": "2019-08-24T14:15:22Z",
  "preferred_language_code": "string",
  "preferred_timezone": "string",
  "last_login_at": "2019-08-24T14:15:22Z",
  "last_login_ip": "string",
  "created_at": "2019-08-24T14:15:22Z",
  "updated_at": "2019-08-24T14:15:22Z"
}
```

AdminUserDetailResponse

### 属性

| 名称                    | 类型                   | 必选  | 约束 | 中文名 | 说明                 |
| ----------------------- | ---------------------- | ----- | ---- | ------ | -------------------- |
| id                      | string(uuid)           | true  | none |        | 用户ID               |
| username                | string                 | true  | none |        | 用户名               |
| email                   | string(email)          | true  | none |        | 邮箱                 |
| full_name               | string¦null            | false | none |        | 全名                 |
| is_active               | boolean                | true  | none |        | 账户是否激活         |
| mfa_enabled             | boolean                | true  | none |        | 是否启用了多因素认证 |
| totp_setup_at           | string(date-time)¦null | false | none |        | TOTP 设置时间 (UTC)  |
| preferred_language_code | string¦null            | false | none |        | 偏好语言代码         |
| preferred_timezone      | string¦null            | false | none |        | 偏好时区             |
| last_login_at           | string(date-time)¦null | false | none |        | 最后登录时间 (UTC)   |
| last_login_ip           | string¦null            | false | none |        | 最后登录IP           |
| created_at              | string(date-time)      | true  | none |        | 创建时间 (UTC)       |
| updated_at              | string(date-time)      | true  | none |        | 更新时间 (UTC)       |

<h2 id="tocS_UpdateAdminUserPayload">UpdateAdminUserPayload</h2>

<a id="schemaupdateadminuserpayload"></a>
<a id="schema_UpdateAdminUserPayload"></a>
<a id="tocSupdateadminuserpayload"></a>
<a id="tocsupdateadminuserpayload"></a>

```json
{
  "username": "updated_admin",
  "email": "updated_admin@example.com",
  "full_name": "Updated Admin User",
  "is_active": false
}
```

UpdateAdminUserPayload

### 属性

| 名称      | 类型               | 必选  | 约束 | 中文名 | 说明                     |
| --------- | ------------------ | ----- | ---- | ------ | ------------------------ |
| username  | string¦null        | false | none |        | 用户名 (3-100字符, 可选) |
| email     | string(email)¦null | false | none |        | 邮箱 (可选)              |
| full_name | string¦null        | false | none |        | 全名 (可选)              |
| is_active | boolean¦null       | false | none |        | 是否激活 (可选)          |

<h2 id="tocS_AssignRolesToUserPayload">AssignRolesToUserPayload</h2>

<a id="schemaassignrolestouserpayload"></a>
<a id="schema_AssignRolesToUserPayload"></a>
<a id="tocSassignrolestouserpayload"></a>
<a id="tocsassignrolestouserpayload"></a>

```json
{
  "role_names": ["admin_staff", "content_editor"]
}
```

AssignRolesToUserPayload

### 属性

| 名称       | 类型     | 必选 | 约束 | 中文名 | 说明                                                                       |
| ---------- | -------- | ---- | ---- | ------ | -------------------------------------------------------------------------- |
| role_names | [string] | true | none |        | 要分配给用户的角色名称列表。如果提供空列表，则会移除用户在该域的所有角色。 |

<h2 id="tocS_EmptyDataPayload">EmptyDataPayload</h2>

<a id="schemaemptydatapayload"></a>
<a id="schema_EmptyDataPayload"></a>
<a id="tocSemptydatapayload"></a>
<a id="tocsemptydatapayload"></a>

```json
{}
```

EmptyDataPayload

### 属性

_None_

<h2 id="tocS_ApiResponseBase">ApiResponseBase</h2>

<a id="schemaapiresponsebase"></a>
<a id="schema_ApiResponseBase"></a>
<a id="tocSapiresponsebase"></a>
<a id="tocsapiresponsebase"></a>

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Admin users listed successfully.",
  "data": {
    "items": [
      {
        "id": "63104f9e-8500-40a1-8a9c-2bdf1d374a8d",
        "username": "cary",
        "email": "13477072323@qq.com",
        "full_name": "Cary Xiao",
        "is_active": true,
        "mfa_enabled": false,
        "last_login_at": "2025-05-24T16:49:44.893294Z",
        "created_at": "2025-05-24T16:48:56.601285Z",
        "updated_at": "2025-05-24T16:49:44.897501Z"
      }
    ],
    "total": 1,
    "page": 1,
    "page_size": 10
  },
  "timestamp": "2025-05-24T16:49:45.545712Z"
}
```

接口返回格式

### 属性

| 名称      | 类型              | 必选 | 约束 | 中文名 | 说明                        |
| --------- | ----------------- | ---- | ---- | ------ | --------------------------- |
| success   | boolean           | true | none |        | 请求是否成功                |
| code      | string            | true | none |        | 业务状态码，SUCCESS表示成功 |
| message   | string            | true | none |        | 对当前状态的描述信息        |
| data      | object            | true | none |        | 返回的业务数据主体          |
| timestamp | string(date-time) | true | none |        | 服务器响应时间戳            |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

<h2 id="tocS_ApiResponse_StringList">ApiResponse_StringList</h2>

<a id="schemaapiresponse_stringlist"></a>
<a id="schema_ApiResponse_StringList"></a>
<a id="tocSapiresponse_stringlist"></a>
<a id="tocsapiresponse_stringlist"></a>

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": ["string"],
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 属性

| 名称      | 类型              | 必选 | 约束 | 中文名 | 说明                        |
| --------- | ----------------- | ---- | ---- | ------ | --------------------------- |
| success   | boolean           | true | none |        | 请求是否成功                |
| code      | string            | true | none |        | 业务状态码，SUCCESS表示成功 |
| message   | string            | true | none |        | 对当前状态的描述信息        |
| data      | [string]          | true | none |        | 返回的业务数据主体          |
| timestamp | string(date-time) | true | none |        | 服务器响应时间戳            |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

<h2 id="tocS_ApiResponseBase-Paginated">ApiResponseBase-Paginated</h2>

<a id="schemaapiresponsebase-paginated"></a>
<a id="schema_ApiResponseBase-Paginated"></a>
<a id="tocSapiresponsebase-paginated"></a>
<a id="tocsapiresponsebase-paginated"></a>

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Admin users listed successfully.",
  "data": {
    "items": [
      {
        "id": "63104f9e-8500-40a1-8a9c-2bdf1d374a8d",
        "username": "cary",
        "email": "13477072323@qq.com",
        "full_name": "Cary Xiao",
        "is_active": true,
        "mfa_enabled": false,
        "last_login_at": "2025-05-24T16:49:44.893294Z",
        "created_at": "2025-05-24T16:48:56.601285Z",
        "updated_at": "2025-05-24T16:49:44.897501Z"
      }
    ],
    "total": 1,
    "page": 1,
    "page_size": 10
  },
  "timestamp": "2025-05-24T16:49:45.545712Z"
}
```

接口返回格式

### 属性

| 名称        | 类型              | 必选 | 约束 | 中文名 | 说明                        |
| ----------- | ----------------- | ---- | ---- | ------ | --------------------------- |
| success     | boolean           | true | none |        | 请求是否成功                |
| code        | string            | true | none |        | 业务状态码，SUCCESS表示成功 |
| message     | string            | true | none |        | 对当前状态的描述信息        |
| data        | object            | true | none |        | 返回的业务数据主体          |
| » items     | [string]          | true | none |        | 对象数组                    |
| » total     | integer           | true | none |        | 总记录数（用于分页）        |
| » page      | integer           | true | none |        | 当前页码（从1开始）         |
| » page_size | integer           | true | none |        | 每页记录数                  |
| timestamp   | string(date-time) | true | none |        | 服务器响应时间戳            |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

<h2 id="tocS_ErrorCodes">ErrorCodes</h2>

<a id="schemaerrorcodes"></a>
<a id="schema_ErrorCodes"></a>
<a id="tocSerrorcodes"></a>
<a id="tocserrorcodes"></a>

```json
{
  "error": {
    "code": 4001,
    "type": "validation_error",
    "message": "参数校验失败",
    "details": [
      {
        "field": "string",
        "message": "string"
      }
    ]
  }
}
```

### 属性

| 名称       | 类型     | 必选  | 约束 | 中文名 | 说明                     |
| ---------- | -------- | ----- | ---- | ------ | ------------------------ |
| error      | object   | false | none |        | none                     |
| » code     | integer  | true  | none |        | 错误代码                 |
| » type     | string   | true  | none |        | 错误类型                 |
| » message  | string   | false | none |        | 用户可读的错误信息       |
| » details  | [object] | false | none |        | 错误详情（如字段级错误） |
| »» field   | string   | false | none |        | none                     |
| »» message | string   | false | none |        | none                     |

#### 枚举值

| 属性 | 值               |
| ---- | ---------------- |
| code | 4001             |
| code | 4003             |
| code | 4031             |
| code | 4041             |
| code | 4091             |
| code | 5001             |
| code | 5002             |
| type | validation_error |
| type | auth_error       |
| type | rate_limit       |
| type | not_found        |
| type | conflict         |
| type | server_error     |

<h2 id="tocS_CreatePermissionCategoryPayload">CreatePermissionCategoryPayload</h2>

<a id="schemacreatepermissioncategorypayload"></a>
<a id="schema_CreatePermissionCategoryPayload"></a>
<a id="tocScreatepermissioncategorypayload"></a>
<a id="tocscreatepermissioncategorypayload"></a>

```json
{
  "category_key": "user_management",
  "display_name": "用户管理",
  "description": "管理用户账户、角色和权限",
  "sort_order": 10,
  "parent_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
}
```

创建权限分类的请求体

### 属性

| 名称         | 类型                | 必选  | 约束 | 中文名 | 说明         |
| ------------ | ------------------- | ----- | ---- | ------ | ------------ |
| category_key | string              | true  | none |        | 分类唯一键   |
| display_name | string              | true  | none |        | 分类显示名称 |
| description  | string¦null         | false | none |        | 分类描述     |
| sort_order   | integer(int32)¦null | false | none |        | 排序值       |
| parent_id    | string(uuid)¦null   | false | none |        | 父级分类ID   |

<h2 id="tocS_UpdateDefinedPermissionPayload">UpdateDefinedPermissionPayload</h2>

<a id="schemaupdatedefinedpermissionpayload"></a>
<a id="schema_UpdateDefinedPermissionPayload"></a>
<a id="tocSupdatedefinedpermissionpayload"></a>
<a id="tocsupdatedefinedpermissionpayload"></a>

```json
{
  "display_name": "string",
  "description": "string",
  "category_id": "8de4c9fd-61a4-4c0b-bf88-0ed3a0fe3fa2"
}
```

UpdateDefinedPermissionPayload

### 属性

| 名称         | 类型              | 必选  | 约束 | 中文名 | 说明                                                 |
| ------------ | ----------------- | ----- | ---- | ------ | ---------------------------------------------------- |
| display_name | string¦null       | false | none |        | 新的显示名称，如果提供，长度必须在2到255个字符之间。 |
| description  | string¦null       | false | none |        | 新的详细描述。                                       |
| category_id  | string(uuid)¦null | false | none |        | 新的关联分类ID (可以设为null来解除关联)。            |

<h2 id="tocS_DefinedPermissionResponse">DefinedPermissionResponse</h2>

<a id="schemadefinedpermissionresponse"></a>
<a id="schema_DefinedPermissionResponse"></a>
<a id="tocSdefinedpermissionresponse"></a>
<a id="tocsdefinedpermissionresponse"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "permission_key": "string",
  "display_name": "string",
  "description": "string",
  "category_id": "8de4c9fd-61a4-4c0b-bf88-0ed3a0fe3fa2",
  "category_display_name": "string",
  "category_path_names": ["string"],
  "created_at": "2019-08-24T14:15:22Z",
  "updated_at": "2019-08-24T14:15:22Z"
}
```

权限定义的响应数据结构

### 属性

| 名称                  | 类型              | 必选  | 约束 | 中文名 | 说明                                                              |
| --------------------- | ----------------- | ----- | ---- | ------ | ----------------------------------------------------------------- |
| id                    | string(uuid)      | true  | none |        | none                                                              |
| permission_key        | string            | true  | none |        | 权限的唯一键 (例如: users:list)                                   |
| display_name          | string            | true  | none |        | 权限的显示名称                                                    |
| description           | string¦null       | false | none |        | 权限的可选描述                                                    |
| category_id           | string(uuid)¦null | false | none |        | 关联的权限分类ID                                                  |
| category_display_name | string¦null       | false | none |        | 关联的权限分类的显示名称                                          |
| category_path_names   | [string]¦null     | false | none |        | 从根分类到当前分类的显示名称路径 (例如: ["系统管理", "用户管理"]) |
| created_at            | string(date-time) | true  | none |        | none                                                              |
| updated_at            | string(date-time) | true  | none |        | none                                                              |

<h2 id="tocS_CreateDefinedPermissionPayload">CreateDefinedPermissionPayload</h2>

<a id="schemacreatedefinedpermissionpayload"></a>
<a id="schema_CreateDefinedPermissionPayload"></a>
<a id="tocScreatedefinedpermissionpayload"></a>
<a id="tocscreatedefinedpermissionpayload"></a>

```json
{
  "permission_key": "string",
  "display_name": "string",
  "description": "string",
  "category_id": "8de4c9fd-61a4-4c0b-bf88-0ed3a0fe3fa2"
}
```

CreateDefinedPermissionPayload

### 属性

| 名称           | 类型              | 必选  | 约束 | 中文名 | 说明                                                                |
| -------------- | ----------------- | ----- | ---- | ------ | ------------------------------------------------------------------- |
| permission_key | string            | true  | none |        | 权限的唯一程序键 (例如：users:create)，长度必须在3到255个字符之间。 |
| display_name   | string            | true  | none |        | 权限在UI中显示的友好名称，长度必须在2到255个字符之间。              |
| description    | string¦null       | false | none |        | 对权限的详细描述 (可选)。                                           |
| category_id    | string(uuid)¦null | false | none |        | 关联的权限分类ID (可选)。                                           |

<h2 id="tocS_UpdatePermissionCategoryPayload">UpdatePermissionCategoryPayload</h2>

<a id="schemaupdatepermissioncategorypayload"></a>
<a id="schema_UpdatePermissionCategoryPayload"></a>
<a id="tocSupdatepermissioncategorypayload"></a>
<a id="tocsupdatepermissioncategorypayload"></a>

```json
{
  "display_name": "用户与角色管理",
  "description": "string",
  "sort_order": 0,
  "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef"
}
```

更新权限分类的请求体

### 属性

| 名称         | 类型                | 必选  | 约束 | 中文名 | 说明           |
| ------------ | ------------------- | ----- | ---- | ------ | -------------- |
| display_name | string¦null         | false | none |        | 新的显示名称   |
| description  | string¦null         | false | none |        | 新的描述       |
| sort_order   | integer(int32)¦null | false | none |        | 新的排序值     |
| parent_id    | string(uuid)¦null   | false | none |        | 新的父级分类ID |

<h2 id="tocS_PermissionCategoryResponse">PermissionCategoryResponse</h2>

<a id="schemapermissioncategoryresponse"></a>
<a id="schema_PermissionCategoryResponse"></a>
<a id="tocSpermissioncategoryresponse"></a>
<a id="tocspermissioncategoryresponse"></a>

```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "category_key": "string",
  "display_name": "string",
  "description": "string",
  "sort_order": 0,
  "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
  "created_at": "2025-06-02T10:30:00Z",
  "updated_at": "2025-06-02T10:30:00Z",
  "children": [
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "category_key": "string",
      "display_name": "string",
      "description": "string",
      "sort_order": 0,
      "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
      "created_at": "2025-06-02T10:30:00Z",
      "updated_at": "2025-06-02T10:30:00Z",
      "children": [
        {
          "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
          "category_key": "string",
          "display_name": "string",
          "description": "string",
          "sort_order": 0,
          "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
          "created_at": "2025-06-02T10:30:00Z",
          "updated_at": "2025-06-02T10:30:00Z",
          "children": [{}]
        }
      ]
    }
  ]
}
```

权限分类的响应数据结构

### 属性

| 名称         | 类型                                                                   | 必选  | 约束 | 中文名 | 说明                               |
| ------------ | ---------------------------------------------------------------------- | ----- | ---- | ------ | ---------------------------------- |
| id           | string(uuid)                                                           | true  | none |        | 通用唯一标识符 (UUID)              |
| category_key | string                                                                 | true  | none |        | 分类的唯一键                       |
| display_name | string                                                                 | true  | none |        | 分类的显示名称                     |
| description  | string¦null                                                            | false | none |        | 分类的可选描述                     |
| sort_order   | integer(int32)                                                         | true  | none |        | 用于显示的排序顺序                 |
| parent_id    | string(uuid)¦null                                                      | false | none |        | 父级分类的ID，顶级分类此字段为null |
| created_at   | string(date-time)                                                      | true  | none |        | UTC时间，ISO 8601格式              |
| updated_at   | string(date-time)                                                      | true  | none |        | UTC时间，ISO 8601格式              |
| children     | [[PermissionCategoryResponse](#schemapermissioncategoryresponse)]¦null | false | none |        | 子分类列表 (当返回树形结构时使用)  |

<h2 id="tocS_PermissionTreeItem">PermissionTreeItem</h2>

<a id="schemapermissiontreeitem"></a>
<a id="schema_PermissionTreeItem"></a>
<a id="tocSpermissiontreeitem"></a>
<a id="tocspermissiontreeitem"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "permission_key": "string",
  "display_name": "string"
}
```

权限树中的单个权限项

### 属性

| 名称           | 类型         | 必选 | 约束 | 中文名 | 说明                                          |
| -------------- | ------------ | ---- | ---- | ------ | --------------------------------------------- |
| id             | string(uuid) | true | none |        | 权限定义表(defined_admin_permissions)的主键ID |
| permission_key | string       | true | none |        | 权限的唯一键                                  |
| display_name   | string       | true | none |        | 权限的显示名称                                |

<h2 id="tocS_PermissionCategoryNode">PermissionCategoryNode</h2>

<a id="schemapermissioncategorynode"></a>
<a id="schema_PermissionCategoryNode"></a>
<a id="tocSpermissioncategorynode"></a>
<a id="tocspermissioncategorynode"></a>

```json
{
  "category_id": "8de4c9fd-61a4-4c0b-bf88-0ed3a0fe3fa2",
  "category_name": "string",
  "category_parent_id": "f9607e03-d562-4309-b36d-19b0c3c1cd3b",
  "permissions": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "permission_key": "string",
      "display_name": "string"
    }
  ],
  "children_categories": [
    {
      "category_id": "8de4c9fd-61a4-4c0b-bf88-0ed3a0fe3fa2",
      "category_name": "string",
      "category_parent_id": "f9607e03-d562-4309-b36d-19b0c3c1cd3b",
      "permissions": [
        {
          "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
          "permission_key": "string",
          "display_name": "string"
        }
      ],
      "children_categories": [
        {
          "category_id": "8de4c9fd-61a4-4c0b-bf88-0ed3a0fe3fa2",
          "category_name": "string",
          "category_parent_id": "f9607e03-d562-4309-b36d-19b0c3c1cd3b",
          "permissions": [{}],
          "children_categories": [{}]
        }
      ]
    }
  ]
}
```

权限树中的分类节点结构

### 属性

| 名称                | 类型                                                      | 必选  | 约束 | 中文名 | 说明                         |
| ------------------- | --------------------------------------------------------- | ----- | ---- | ------ | ---------------------------- |
| category_id         | string(uuid)                                              | true  | none |        | 分类的ID                     |
| category_name       | string                                                    | true  | none |        | 分类的名称                   |
| category_parent_id  | string(uuid)¦null                                         | false | none |        | 父级分类的ID                 |
| permissions         | [[PermissionTreeItem](#schemapermissiontreeitem)]         | true  | none |        | 直接挂载在此分类下的权限列表 |
| children_categories | [[PermissionCategoryNode](#schemapermissioncategorynode)] | true  | none |        | 子分类节点列表               |

<h2 id="tocS_ApiResponse_PermissionCategoryNodeList">ApiResponse_PermissionCategoryNodeList</h2>

<a id="schemaapiresponse_permissioncategorynodelist"></a>
<a id="schema_ApiResponse_PermissionCategoryNodeList"></a>
<a id="tocSapiresponse_permissioncategorynodelist"></a>
<a id="tocsapiresponse_permissioncategorynodelist"></a>

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "tree": [
      {
        "category_id": "8de4c9fd-61a4-4c0b-bf88-0ed3a0fe3fa2",
        "category_name": "string",
        "category_parent_id": "f9607e03-d562-4309-b36d-19b0c3c1cd3b",
        "permissions": [
          {
            "id": null,
            "permission_key": null,
            "display_name": null
          }
        ],
        "children_categories": [
          {
            "category_id": null,
            "category_name": null,
            "category_parent_id": null,
            "permissions": null,
            "children_categories": null
          }
        ]
      }
    ],
    "total_categories": 0,
    "total_permissions": 0
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 属性

| 名称                | 类型                                                      | 必选 | 约束 | 中文名 | 说明                        |
| ------------------- | --------------------------------------------------------- | ---- | ---- | ------ | --------------------------- |
| success             | boolean                                                   | true | none |        | 请求是否成功                |
| code                | string                                                    | true | none |        | 业务状态码，SUCCESS表示成功 |
| message             | string                                                    | true | none |        | 对当前状态的描述信息        |
| data                | object                                                    | true | none |        | 返回的业务数据主体          |
| » tree              | [[PermissionCategoryNode](#schemapermissioncategorynode)] | true | none |        | [权限树中的分类节点结构]    |
| » total_categories  | integer                                                   | true | none |        | 分类总数                    |
| » total_permissions | integer                                                   | true | none |        | 权限总数                    |
| timestamp           | string(date-time)                                         | true | none |        | 服务器响应时间戳            |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

<h2 id="tocS_ApiResponse_PermissionCategoryResponse">ApiResponse_PermissionCategoryResponse</h2>

<a id="schemaapiresponse_permissioncategoryresponse"></a>
<a id="schema_ApiResponse_PermissionCategoryResponse"></a>
<a id="tocSapiresponse_permissioncategoryresponse"></a>
<a id="tocsapiresponse_permissioncategoryresponse"></a>

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "category_key": "string",
    "display_name": "string",
    "description": "string",
    "sort_order": 0,
    "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
    "created_at": "2025-06-02T10:30:00Z",
    "updated_at": "2025-06-02T10:30:00Z",
    "children": [
      {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "category_key": "string",
        "display_name": "string",
        "description": "string",
        "sort_order": 0,
        "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
        "created_at": "2025-06-02T10:30:00Z",
        "updated_at": "2025-06-02T10:30:00Z",
        "children": [
          {
            "id": null,
            "category_key": null,
            "display_name": null,
            "description": null,
            "sort_order": null,
            "parent_id": null,
            "created_at": null,
            "updated_at": null,
            "children": null
          }
        ]
      }
    ]
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 属性

| 名称      | 类型                                                            | 必选 | 约束 | 中文名 | 说明                        |
| --------- | --------------------------------------------------------------- | ---- | ---- | ------ | --------------------------- |
| success   | boolean                                                         | true | none |        | 请求是否成功                |
| code      | string                                                          | true | none |        | 业务状态码，SUCCESS表示成功 |
| message   | string                                                          | true | none |        | 对当前状态的描述信息        |
| data      | [PermissionCategoryResponse](#schemapermissioncategoryresponse) | true | none |        | 权限分类的响应数据结构      |
| timestamp | string(date-time)                                               | true | none |        | 服务器响应时间戳            |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

<h2 id="tocS_ApiResponse_PaginatedPermissionCategoryResponse">ApiResponse_PaginatedPermissionCategoryResponse</h2>

<a id="schemaapiresponse_paginatedpermissioncategoryresponse"></a>
<a id="schema_ApiResponse_PaginatedPermissionCategoryResponse"></a>
<a id="tocSapiresponse_paginatedpermissioncategoryresponse"></a>
<a id="tocsapiresponse_paginatedpermissioncategoryresponse"></a>

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "items": [
      {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "category_key": "string",
        "display_name": "string",
        "description": "string",
        "sort_order": 0,
        "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
        "created_at": "2025-06-02T10:30:00Z",
        "updated_at": "2025-06-02T10:30:00Z",
        "children": [
          {
            "id": null,
            "category_key": null,
            "display_name": null,
            "description": null,
            "sort_order": null,
            "parent_id": null,
            "created_at": null,
            "updated_at": null,
            "children": null
          }
        ]
      }
    ],
    "total": 0,
    "page": 0,
    "page_size": 1
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 属性

| 名称        | 类型                                                              | 必选 | 约束 | 中文名 | 说明                        |
| ----------- | ----------------------------------------------------------------- | ---- | ---- | ------ | --------------------------- |
| success     | boolean                                                           | true | none |        | 请求是否成功                |
| code        | string                                                            | true | none |        | 业务状态码，SUCCESS表示成功 |
| message     | string                                                            | true | none |        | 对当前状态的描述信息        |
| data        | object                                                            | true | none |        | 返回的业务数据主体          |
| » items     | [[PermissionCategoryResponse](#schemapermissioncategoryresponse)] | true | none |        | 对象数组                    |
| » total     | integer                                                           | true | none |        | 总记录数（用于分页）        |
| » page      | integer                                                           | true | none |        | 当前页码（从1开始）         |
| » page_size | integer                                                           | true | none |        | 每页记录数                  |
| timestamp   | string(date-time)                                                 | true | none |        | 服务器响应时间戳            |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

<h2 id="tocS_ApiResponse_PaginatedDefinedPermissionResponse">ApiResponse_PaginatedDefinedPermissionResponse</h2>

<a id="schemaapiresponse_paginateddefinedpermissionresponse"></a>
<a id="schema_ApiResponse_PaginatedDefinedPermissionResponse"></a>
<a id="tocSapiresponse_paginateddefinedpermissionresponse"></a>
<a id="tocsapiresponse_paginateddefinedpermissionresponse"></a>

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "items": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "permission_key": "string",
        "display_name": "string",
        "description": "string",
        "category_id": "8de4c9fd-61a4-4c0b-bf88-0ed3a0fe3fa2",
        "category_display_name": "string",
        "category_path_names": ["string"],
        "created_at": "2019-08-24T14:15:22Z",
        "updated_at": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "page": 0,
    "page_size": 1
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 属性

| 名称        | 类型                                                            | 必选 | 约束 | 中文名 | 说明                        |
| ----------- | --------------------------------------------------------------- | ---- | ---- | ------ | --------------------------- |
| success     | boolean                                                         | true | none |        | 请求是否成功                |
| code        | string                                                          | true | none |        | 业务状态码，SUCCESS表示成功 |
| message     | string                                                          | true | none |        | 对当前状态的描述信息        |
| data        | object                                                          | true | none |        | 返回的业务数据主体          |
| » items     | [[DefinedPermissionResponse](#schemadefinedpermissionresponse)] | true | none |        | 对象数组                    |
| » total     | integer                                                         | true | none |        | 总记录数（用于分页）        |
| » page      | integer                                                         | true | none |        | 当前页码（从1开始）         |
| » page_size | integer                                                         | true | none |        | 每页记录数                  |
| timestamp   | string(date-time)                                               | true | none |        | 服务器响应时间戳            |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

<h2 id="tocS_ApiResponse_DefinedPermissionResponse">ApiResponse_DefinedPermissionResponse</h2>

<a id="schemaapiresponse_definedpermissionresponse"></a>
<a id="schema_ApiResponse_DefinedPermissionResponse"></a>
<a id="tocSapiresponse_definedpermissionresponse"></a>
<a id="tocsapiresponse_definedpermissionresponse"></a>

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "permission_key": "string",
    "display_name": "string",
    "description": "string",
    "category_id": "8de4c9fd-61a4-4c0b-bf88-0ed3a0fe3fa2",
    "category_display_name": "string",
    "category_path_names": ["string"],
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 属性

| 名称                    | 类型              | 必选  | 约束 | 中文名 | 说明                                                              |
| ----------------------- | ----------------- | ----- | ---- | ------ | ----------------------------------------------------------------- |
| success                 | boolean           | true  | none |        | 请求是否成功                                                      |
| code                    | string            | true  | none |        | 业务状态码，SUCCESS表示成功                                       |
| message                 | string            | true  | none |        | 对当前状态的描述信息                                              |
| data                    | object            | true  | none |        | 返回的业务数据主体                                                |
| » id                    | string(uuid)      | true  | none |        | none                                                              |
| » permission_key        | string            | true  | none |        | 权限的唯一键 (例如: users:list)                                   |
| » display_name          | string            | true  | none |        | 权限的显示名称                                                    |
| » description           | string¦null       | false | none |        | 权限的可选描述                                                    |
| » category_id           | string(uuid)¦null | false | none |        | 关联的权限分类ID                                                  |
| » category_display_name | string¦null       | false | none |        | 关联的权限分类的显示名称                                          |
| » category_path_names   | [string]¦null     | false | none |        | 从根分类到当前分类的显示名称路径 (例如: ["系统管理", "用户管理"]) |
| » created_at            | string(date-time) | true  | none |        | none                                                              |
| » updated_at            | string(date-time) | true  | none |        | none                                                              |
| timestamp               | string(date-time) | true  | none |        | 服务器响应时间戳                                                  |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

<h2 id="tocS_PermissionCategoryTreeResponse">PermissionCategoryTreeResponse</h2>

<a id="schemapermissioncategorytreeresponse"></a>
<a id="schema_PermissionCategoryTreeResponse"></a>
<a id="tocSpermissioncategorytreeresponse"></a>
<a id="tocspermissioncategorytreeresponse"></a>

```json
{
  "items": [
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "category_key": "string",
      "display_name": "string",
      "description": "string",
      "sort_order": 0,
      "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
      "created_at": "2025-06-02T10:30:00Z",
      "updated_at": "2025-06-02T10:30:00Z",
      "children": [
        {
          "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
          "category_key": "string",
          "display_name": "string",
          "description": "string",
          "sort_order": 0,
          "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
          "created_at": "2025-06-02T10:30:00Z",
          "updated_at": "2025-06-02T10:30:00Z",
          "children": [{}]
        }
      ]
    }
  ],
  "total": 0
}
```

权限分类树形结构响应的业务数据主体

### 属性

| 名称  | 类型                                                              | 必选 | 约束 | 中文名 | 说明                   |
| ----- | ----------------------------------------------------------------- | ---- | ---- | ------ | ---------------------- |
| items | [[PermissionCategoryResponse](#schemapermissioncategoryresponse)] | true | none |        | 权限分类树的根节点列表 |
| total | integer(int64)                                                    | true | none |        | 总分类数量             |

<h2 id="tocS_ApiResponse_PermissionCategoryTreeResponse">ApiResponse_PermissionCategoryTreeResponse</h2>

<a id="schemaapiresponse_permissioncategorytreeresponse"></a>
<a id="schema_ApiResponse_PermissionCategoryTreeResponse"></a>
<a id="tocSapiresponse_permissioncategorytreeresponse"></a>
<a id="tocsapiresponse_permissioncategorytreeresponse"></a>

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "items": [
      {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "category_key": "string",
        "display_name": "string",
        "description": "string",
        "sort_order": 0,
        "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
        "created_at": "2025-06-02T10:30:00Z",
        "updated_at": "2025-06-02T10:30:00Z",
        "children": [
          {
            "id": null,
            "category_key": null,
            "display_name": null,
            "description": null,
            "sort_order": null,
            "parent_id": null,
            "created_at": null,
            "updated_at": null,
            "children": null
          }
        ]
      }
    ],
    "total": 0
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 属性

| 名称      | 类型                                                                    | 必选 | 约束 | 中文名 | 说明                        |
| --------- | ----------------------------------------------------------------------- | ---- | ---- | ------ | --------------------------- |
| success   | boolean                                                                 | true | none |        | 请求是否成功                |
| code      | string                                                                  | true | none |        | 业务状态码，SUCCESS表示成功 |
| message   | string                                                                  | true | none |        | 对当前状态的描述信息        |
| data      | [PermissionCategoryTreeResponse](#schemapermissioncategorytreeresponse) | true | none |        | 返回的业务数据主体          |
| timestamp | string(date-time)                                                       | true | none |        | 服务器响应时间戳            |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

<h2 id="tocS_CreateRolePayload">CreateRolePayload</h2>

<a id="schemacreaterolepayload"></a>
<a id="schema_CreateRolePayload"></a>
<a id="tocScreaterolepayload"></a>
<a id="tocscreaterolepayload"></a>

```json
{
  "role_name": "string",
  "display_name": "string",
  "description": "string"
}
```

CreateRolePayload

### 属性

| 名称         | 类型        | 必选  | 约束 | 中文名 | 说明                                                   |
| ------------ | ----------- | ----- | ---- | ------ | ------------------------------------------------------ |
| role_name    | string      | true  | none |        | 角色的唯一名称，长度必须在2到100个字符之间。           |
| display_name | string      | true  | none |        | 角色在UI中显示的友好名称，长度必须在2到255个字符之间。 |
| description  | string¦null | false | none |        | 对角色的描述 (可选)。                                  |

<h2 id="tocS_RoleResponse">RoleResponse</h2>

<a id="schemaroleresponse"></a>
<a id="schema_RoleResponse"></a>
<a id="tocSroleresponse"></a>
<a id="tocsroleresponse"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "role_name": "string",
  "display_name": "string",
  "description": "string",
  "created_at": "2019-08-24T14:15:22Z",
  "updated_at": "2019-08-24T14:15:22Z"
}
```

RoleResponse

### 属性

| 名称         | 类型              | 必选  | 约束 | 中文名 | 说明               |
| ------------ | ----------------- | ----- | ---- | ------ | ------------------ |
| id           | string(uuid)      | true  | none |        | 角色的唯一标识符。 |
| role_name    | string            | true  | none |        | 角色的唯一名称。   |
| display_name | string            | true  | none |        | 角色的显示名称。   |
| description  | string¦null       | false | none |        | 角色的描述。       |
| created_at   | string(date-time) | true  | none |        | 创建时间戳。       |
| updated_at   | string(date-time) | true  | none |        | 最后更新时间戳。   |

<h2 id="tocS_UpdateRolePayload">UpdateRolePayload</h2>

<a id="schemaupdaterolepayload"></a>
<a id="schema_UpdateRolePayload"></a>
<a id="tocSupdaterolepayload"></a>
<a id="tocsupdaterolepayload"></a>

```json
{
  "role_name": "string",
  "display_name": "string",
  "description": "string"
}
```

UpdateRolePayload

### 属性

| 名称         | 类型        | 必选  | 约束 | 中文名 | 说明                                                     |
| ------------ | ----------- | ----- | ---- | ------ | -------------------------------------------------------- |
| role_name    | string¦null | false | none |        | 新的角色唯一名称，如果提供，长度必须在2到100个字符之间。 |
| display_name | string¦null | false | none |        | 新的显示名称，如果提供，长度必须在2到255个字符之间。     |
| description  | string¦null | false | none |        | 新的描述。                                               |

<h2 id="tocS_AssignPermissionsToRolePayload">AssignPermissionsToRolePayload</h2>

<a id="schemaassignpermissionstorolepayload"></a>
<a id="schema_AssignPermissionsToRolePayload"></a>
<a id="tocSassignpermissionstorolepayload"></a>
<a id="tocsassignpermissionstorolepayload"></a>

```json
{
  "permission_keys": ["string"]
}
```

AssignPermissionsToRolePayload

### 属性

| 名称            | 类型     | 必选 | 约束 | 中文名 | 说明                                     |
| --------------- | -------- | ---- | ---- | ------ | ---------------------------------------- |
| permission_keys | [string] | true | none |        | 要分配给角色的权限键列表，不能为空数组。 |

<h2 id="tocS_RouteTransition">RouteTransition</h2>

<a id="schemaroutetransition"></a>
<a id="schema_RouteTransition"></a>
<a id="tocSroutetransition"></a>
<a id="tocsroutetransition"></a>

```json
{
  "name": "string",
  "enter_transition": "string",
  "leave_transition": "string"
}
```

路由切换动画

### 属性

| 名称             | 类型        | 必选  | 约束 | 中文名 | 说明                                    |
| ---------------- | ----------- | ----- | ---- | ------ | --------------------------------------- |
| name             | string¦null | false | none |        | 动画名称 (例如：'fade', 'slide-left')。 |
| enter_transition | string¦null | false | none |        | 进入时的动画效果。                      |
| leave_transition | string¦null | false | none |        | 离开时的动画效果。                      |

<h2 id="tocS_AdminMenuMeta">AdminMenuMeta</h2>

<a id="schemaadminmenumeta"></a>
<a id="schema_AdminMenuMeta"></a>
<a id="tocSadminmenumeta"></a>
<a id="tocsadminmenumeta"></a>

```json
{
  "title": "string",
  "icon": "string",
  "show_link": true,
  "rank": 0,
  "show_parent": true,
  "keep_alive": true,
  "frame_src": "string",
  "frame_loading": true,
  "transition": {
    "name": "string",
    "enter_transition": "string",
    "leave_transition": "string"
  },
  "hidden_tag": true,
  "dynamic_level": 0,
  "active_path": "string",
  "authority": ["string"]
}
```

菜单路由元信息

### 属性

| 名称          | 类型                                      | 必选  | 约束 | 中文名 | 说明                                                                                     |
| ------------- | ----------------------------------------- | ----- | ---- | ------ | ---------------------------------------------------------------------------------------- |
| title         | string                                    | true  | none |        | 菜单标题，用于在界面上显示。                                                             |
| icon          | string¦null                               | false | none |        | 菜单图标的标识符 (例如：'ep:home-filled')。                                              |
| show_link     | boolean                                   | true  | none |        | 是否在菜单中显示此链接 (通常与后端的 is_hidden 相反)。                                   |
| rank          | integer                                   | true  | none |        | 菜单的排序值，数字越小越靠前。                                                           |
| show_parent   | boolean¦null                              | false | none |        | 当只有一个子路由时，是否依然显示父级菜单。                                               |
| keep_alive    | boolean¦null                              | false | none |        | 当前路由是否开启页面缓存 (对应后端的 is_cache)。                                         |
| frame_src     | string¦null                               | false | none |        | 内嵌 iframe 的 src 地址 (对应后端的 external_link_url，当 is_external_link 为 true 时)。 |
| frame_loading | boolean¦null                              | false | none |        | 内嵌 iframe 是否显示加载动画。                                                           |
| transition    | [RouteTransition](#schemaroutetransition) | false | none |        | 页面切换动画配置。                                                                       |
| hidden_tag    | boolean¦null                              | false | none |        | 是否在标签页导航栏中隐藏此路由。                                                         |
| dynamic_level | integer(int32)¦null                       | false | none |        | 动态路由的层级。                                                                         |
| active_path   | string¦null                               | false | none |        | 当前菜单激活时，指定另一个菜单的路径也高亮 (用于详情页等场景)。                          |
| authority     | [string]¦null                             | false | none |        | 访问此菜单或路由所需的权限标识符列表 (对应后端的 permission_key)。                       |

<h2 id="tocS_AdminMenuTreeItem">AdminMenuTreeItem</h2>

<a id="schemaadminmenutreeitem"></a>
<a id="schema_AdminMenuTreeItem"></a>
<a id="tocSadminmenutreeitem"></a>
<a id="tocsadminmenutreeitem"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
  "menu_type": "CATALOG",
  "path": "string",
  "name": "string",
  "component": "string",
  "redirect": "string",
  "meta": {
    "title": "string",
    "icon": "string",
    "show_link": true,
    "rank": 0,
    "show_parent": true,
    "keep_alive": true,
    "frame_src": "string",
    "frame_loading": true,
    "transition": {
      "name": "string",
      "enter_transition": "string",
      "leave_transition": "string"
    },
    "hidden_tag": true,
    "dynamic_level": 0,
    "active_path": "string",
    "authority": ["string"]
  },
  "children": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
      "menu_type": "CATALOG",
      "path": "string",
      "name": "string",
      "component": "string",
      "redirect": "string",
      "meta": {
        "title": "string",
        "icon": "string",
        "show_link": true,
        "rank": 0,
        "show_parent": true,
        "keep_alive": true,
        "frame_src": "string",
        "frame_loading": true,
        "transition": {
          "name": "string",
          "enter_transition": "string",
          "leave_transition": "string"
        },
        "hidden_tag": true,
        "dynamic_level": 0,
        "active_path": "string",
        "authority": ["string"]
      },
      "children": [
        {
          "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
          "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
          "menu_type": "CATALOG",
          "path": "string",
          "name": "string",
          "component": "string",
          "redirect": "string",
          "meta": {
            "title": null,
            "icon": null,
            "show_link": null,
            "rank": null,
            "show_parent": null,
            "keep_alive": null,
            "frame_src": null,
            "frame_loading": null,
            "transition": null,
            "hidden_tag": null,
            "dynamic_level": null,
            "active_path": null,
            "authority": null
          },
          "children": [{}],
          "permission_key": "string",
          "status": "string",
          "remark": "string",
          "created_at": "2019-08-24T14:15:22Z",
          "updated_at": "2019-08-24T14:15:22Z"
        }
      ],
      "permission_key": "string",
      "status": "string",
      "remark": "string",
      "created_at": "2019-08-24T14:15:22Z",
      "updated_at": "2019-08-24T14:15:22Z"
    }
  ],
  "permission_key": "string",
  "status": "string",
  "remark": "string",
  "created_at": "2019-08-24T14:15:22Z",
  "updated_at": "2019-08-24T14:15:22Z"
}
```

菜单树节点

### 属性

| 名称           | 类型                                            | 必选  | 约束 | 中文名 | 说明                                                                          |
| -------------- | ----------------------------------------------- | ----- | ---- | ------ | ----------------------------------------------------------------------------- |
| id             | string(uuid)                                    | true  | none |        | 菜单项的唯一标识符。                                                          |
| parent_id      | string(uuid)¦null                               | false | none |        | 父菜单项的ID，如果是顶级菜单则为null。                                        |
| menu_type      | string                                          | true  | none |        | 菜单类型 (例如：'CATALOG', 'MENU')。                                          |
| path           | string¦null                                     | false | none |        | 路由路径 (例如：'/system/user')。                                             |
| name           | string¦null                                     | false | none |        | 路由名称，通常唯一，用于前端路由的命名视图和缓存 (keep-alive)。               |
| component      | string¦null                                     | false | none |        | 前端组件的路径 (例如：'system/user/index' 或特殊值如 'LAYOUT' 表示布局组件)。 |
| redirect       | string¦null                                     | false | none |        | 路由重定向的路径。                                                            |
| meta           | [AdminMenuMeta](#schemaadminmenumeta)           | true  | none |        | 路由元信息。                                                                  |
| children       | [[AdminMenuTreeItem](#schemaadminmenutreeitem)] | true  | none |        | 子菜单项列表。                                                                |
| permission_key | string¦null                                     | false | none |        | [管理端使用] 关联的权限标识。                                                 |
| status         | string¦null                                     | false | none |        | [管理端使用] 菜单状态 (ENABLED/DISABLED)。                                    |
| remark         | string¦null                                     | false | none |        | [管理端使用] 备注信息。                                                       |
| created_at     | string(date-time)¦null                          | false | none |        | [管理端使用] 创建时间。                                                       |
| updated_at     | string(date-time)¦null                          | false | none |        | [管理端使用] 更新时间。                                                       |

#### 枚举值

| 属性      | 值      |
| --------- | ------- |
| menu_type | CATALOG |
| menu_type | MENU    |
| menu_type | BUTTON  |

<h2 id="tocS_BaseApiResponse_AdminMenuTree">BaseApiResponse_AdminMenuTree</h2>

<a id="schemabaseapiresponse_adminmenutree"></a>
<a id="schema_BaseApiResponse_AdminMenuTree"></a>
<a id="tocSbaseapiresponse_adminmenutree"></a>
<a id="tocsbaseapiresponse_adminmenutree"></a>

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
    "menu_type": "CATALOG",
    "path": "string",
    "name": "string",
    "component": "string",
    "redirect": "string",
    "meta": {
      "title": "string",
      "icon": "string",
      "show_link": true,
      "rank": 0,
      "show_parent": true,
      "keep_alive": true,
      "frame_src": "string",
      "frame_loading": true,
      "transition": {
        "name": "string",
        "enter_transition": "string",
        "leave_transition": "string"
      },
      "hidden_tag": true,
      "dynamic_level": 0,
      "active_path": "string",
      "authority": ["string"]
    },
    "children": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
        "menu_type": "CATALOG",
        "path": "string",
        "name": "string",
        "component": "string",
        "redirect": "string",
        "meta": {
          "title": "string",
          "icon": "string",
          "show_link": true,
          "rank": 0,
          "show_parent": true,
          "keep_alive": true,
          "frame_src": "string",
          "frame_loading": true,
          "transition": {},
          "hidden_tag": true,
          "dynamic_level": 0,
          "active_path": "string",
          "authority": [null]
        },
        "children": [
          {
            "id": null,
            "parent_id": null,
            "menu_type": null,
            "path": null,
            "name": null,
            "component": null,
            "redirect": null,
            "meta": null,
            "children": null,
            "permission_key": null,
            "status": null,
            "remark": null,
            "created_at": null,
            "updated_at": null
          }
        ],
        "permission_key": "string",
        "status": "string",
        "remark": "string",
        "created_at": "2019-08-24T14:15:22Z",
        "updated_at": "2019-08-24T14:15:22Z"
      }
    ],
    "permission_key": "string",
    "status": "string",
    "remark": "string",
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 属性

| 名称      | 类型                                          | 必选 | 约束 | 中文名 | 说明                                                                               |
| --------- | --------------------------------------------- | ---- | ---- | ------ | ---------------------------------------------------------------------------------- |
| success   | boolean                                       | true | none |        | 请求是否成功                                                                       |
| code      | string                                        | true | none |        | 业务状态码，SUCCESS表示成功                                                        |
| message   | string                                        | true | none |        | 对当前状态的描述信息                                                               |
| data      | [AdminMenuTreeItem](#schemaadminmenutreeitem) | true | none |        | 表示前端菜单树中的一个节点，可以是目录、菜单或按钮（按钮类型通常不在此接口返回）。 |
| timestamp | string(date-time)                             | true | none |        | 服务器响应时间戳                                                                   |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

<h2 id="tocS_RefreshTokenPayload">RefreshTokenPayload</h2>

<a id="schemarefreshtokenpayload"></a>
<a id="schema_RefreshTokenPayload"></a>
<a id="tocSrefreshtokenpayload"></a>
<a id="tocsrefreshtokenpayload"></a>

```json
{
  "refresh_token": "string"
}
```

### 属性

| 名称          | 类型   | 必选 | 约束 | 中文名 | 说明                           |
| ------------- | ------ | ---- | ---- | ------ | ------------------------------ |
| refresh_token | string | true | none |        | 用于获取新访问令牌的刷新令牌。 |

<h2 id="tocS_RefreshTokenSuccessData">RefreshTokenSuccessData</h2>

<a id="schemarefreshtokensuccessdata"></a>
<a id="schema_RefreshTokenSuccessData"></a>
<a id="tocSrefreshtokensuccessdata"></a>
<a id="tocsrefreshtokensuccessdata"></a>

```json
{
  "access_token": "string",
  "token_type": "Bearer",
  "access_token_expires_at": 0
}
```

RefreshTokenSuccessData

### 属性

| 名称                    | 类型           | 必选 | 约束 | 中文名 | 说明                                                           |
| ----------------------- | -------------- | ---- | ---- | ------ | -------------------------------------------------------------- |
| access_token            | string         | true | none |        | 新的访问令牌 (Access Token)。                                  |
| token_type              | string         | true | none |        | 令牌类型，通常为 'Bearer'。                                    |
| access_token_expires_at | integer(int64) | true | none |        | 新访问令牌的过期时间戳 (Unix timestamp, 自 epoch 以来的秒数)。 |

<h2 id="tocS_ChangeOwnPasswordPayload">ChangeOwnPasswordPayload</h2>

<a id="schemachangeownpasswordpayload"></a>
<a id="schema_ChangeOwnPasswordPayload"></a>
<a id="tocSchangeownpasswordpayload"></a>
<a id="tocschangeownpasswordpayload"></a>

```json
{
  "old_password": "string",
  "new_password": "pa$$word",
  "confirm_new_password": "pa$$word"
}
```

### 属性

| 名称                 | 类型             | 必选 | 约束 | 中文名 | 说明                                  |
| -------------------- | ---------------- | ---- | ---- | ------ | ------------------------------------- |
| old_password         | string           | true | none |        | 当前使用的旧密码。                    |
| new_password         | string(password) | true | none |        | 希望设置的新密码，必须至少为8个字符。 |
| confirm_new_password | string(password) | true | none |        | 确认新密码，必须与新密码一致。        |

<h2 id="tocS_CurrentAdminResponse">CurrentAdminResponse</h2>

<a id="schemacurrentadminresponse"></a>
<a id="schema_CurrentAdminResponse"></a>
<a id="tocScurrentadminresponse"></a>
<a id="tocscurrentadminresponse"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "username": "string",
  "email": "user@example.com",
  "full_name": "string",
  "mfa_enabled": true,
  "roles": ["string"],
  "permissions": ["string"]
}
```

CurrentAdminResponseData

### 属性

| 名称        | 类型          | 必选  | 约束 | 中文名 | 说明                                           |
| ----------- | ------------- | ----- | ---- | ------ | ---------------------------------------------- |
| id          | string(uuid)  | true  | none |        | 管理员用户的唯一标识符                         |
| username    | string        | true  | none |        | 用户名                                         |
| email       | string(email) | true  | none |        | 电子邮箱地址                                   |
| full_name   | string¦null   | false | none |        | 用户的全名或昵称                               |
| mfa_enabled | boolean       | true  | none |        | 是否启用了多因素认证(MFA)                      |
| roles       | [string]      | true  | none |        | 用户所属的角色名称列表                         |
| permissions | [string]      | true  | none |        | 用户拥有的所有有效权限键 (permission_key) 列表 |

<h2 id="tocS_AdminMenuTreeItem1">AdminMenuTreeItem1</h2>

<a id="schemaadminmenutreeitem1"></a>
<a id="schema_AdminMenuTreeItem1"></a>
<a id="tocSadminmenutreeitem1"></a>
<a id="tocsadminmenutreeitem1"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
  "menu_type": "CATALOG",
  "path": "string",
  "name": "string",
  "component": "string",
  "redirect": "string",
  "meta": {
    "title": "string",
    "icon": "string",
    "show_link": true,
    "rank": 0,
    "show_parent": true,
    "keep_alive": true,
    "frame_src": "string",
    "frame_loading": true,
    "transition": {
      "name": "string",
      "enter_transition": "string",
      "leave_transition": "string"
    },
    "hidden_tag": true,
    "dynamic_level": 0,
    "active_path": "string",
    "authority": ["string"]
  },
  "children": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
      "menu_type": "CATALOG",
      "path": "string",
      "name": "string",
      "component": "string",
      "redirect": "string",
      "meta": {
        "title": "string",
        "icon": "string",
        "show_link": true,
        "rank": 0,
        "show_parent": true,
        "keep_alive": true,
        "frame_src": "string",
        "frame_loading": true,
        "transition": {
          "name": "string",
          "enter_transition": "string",
          "leave_transition": "string"
        },
        "hidden_tag": true,
        "dynamic_level": 0,
        "active_path": "string",
        "authority": ["string"]
      },
      "children": [
        {
          "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
          "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
          "menu_type": "CATALOG",
          "path": "string",
          "name": "string",
          "component": "string",
          "redirect": "string",
          "meta": {
            "title": null,
            "icon": null,
            "show_link": null,
            "rank": null,
            "show_parent": null,
            "keep_alive": null,
            "frame_src": null,
            "frame_loading": null,
            "transition": null,
            "hidden_tag": null,
            "dynamic_level": null,
            "active_path": null,
            "authority": null
          },
          "children": [{}]
        }
      ]
    }
  ]
}
```

AdminMenuTreeItem

### 属性

| 名称      | 类型                                              | 必选  | 约束 | 中文名 | 说明                                  |
| --------- | ------------------------------------------------- | ----- | ---- | ------ | ------------------------------------- |
| id        | string(uuid)                                      | true  | none |        | 菜单项的唯一标识符                    |
| parent_id | string(uuid)¦null                                 | false | none |        | 父菜单项的ID，如果是顶级菜单则为null  |
| menu_type | string                                            | true  | none |        | 菜单类型                              |
| path      | string¦null                                       | false | none |        | 前端路由路径                          |
| name      | string¦null                                       | false | none |        | 路由名称，用于 keep-alive, tab 标签等 |
| component | string¦null                                       | false | none |        | 前端组件路径或特殊值如 'LAYOUT'       |
| redirect  | string¦null                                       | false | none |        | 重定向路径                            |
| meta      | [AdminMenuMeta3](#schemaadminmenumeta3)           | true  | none |        | 菜单项的元数据，供前端路由和显示使用  |
| children  | [[AdminMenuTreeItem1](#schemaadminmenutreeitem1)] | true  | none |        | 子菜单项列表                          |

#### 枚举值

| 属性      | 值      |
| --------- | ------- |
| menu_type | CATALOG |
| menu_type | MENU    |
| menu_type | BUTTON  |

<h2 id="tocS_RouteTransition2">RouteTransition2</h2>

<a id="schemaroutetransition2"></a>
<a id="schema_RouteTransition2"></a>
<a id="tocSroutetransition2"></a>
<a id="tocsroutetransition2"></a>

```json
{
  "name": "string",
  "enter_transition": "string",
  "leave_transition": "string"
}
```

RouteTransition

### 属性

| 名称             | 类型        | 必选  | 约束 | 中文名 | 说明                                 |
| ---------------- | ----------- | ----- | ---- | ------ | ------------------------------------ |
| name             | string¦null | false | none |        | 动画名称 (例如 'fade', 'slide-fade') |
| enter_transition | string¦null | false | none |        | 进入动画的 CSS 类名                  |
| leave_transition | string¦null | false | none |        | 离开动画的 CSS 类名                  |

<h2 id="tocS_AdminMenuMeta3">AdminMenuMeta3</h2>

<a id="schemaadminmenumeta3"></a>
<a id="schema_AdminMenuMeta3"></a>
<a id="tocSadminmenumeta3"></a>
<a id="tocsadminmenumeta3"></a>

```json
{
  "title": "string",
  "icon": "string",
  "show_link": true,
  "rank": 0,
  "show_parent": true,
  "keep_alive": true,
  "frame_src": "string",
  "frame_loading": true,
  "transition": {
    "name": "string",
    "enter_transition": "string",
    "leave_transition": "string"
  },
  "hidden_tag": true,
  "dynamic_level": 0,
  "active_path": "string",
  "authority": ["string"]
}
```

AdminMenuMeta

### 属性

| 名称          | 类型                                        | 必选  | 约束 | 中文名 | 说明                                                  |
| ------------- | ------------------------------------------- | ----- | ---- | ------ | ----------------------------------------------------- |
| title         | string                                      | true  | none |        | 菜单显示标题                                          |
| icon          | string¦null                                 | false | none |        | 菜单图标 (例如 el-icon-setting)                       |
| show_link     | boolean                                     | true  | none |        | 是否在菜单中显示链接 (通常与 is_hidden 相反)          |
| rank          | integer                                     | true  | none |        | 显示排序，数字越小越靠前                              |
| show_parent   | boolean¦null                                | false | none |        | 如果只有一个子级时是否显示父级 (pure-admin)           |
| keep_alive    | boolean¦null                                | false | none |        | 是否缓存页面 (对应 is_cache)                          |
| frame_src     | string¦null                                 | false | none |        | 外链URL (如果是 iframe 形式的外链)                    |
| frame_loading | boolean¦null                                | false | none |        | iframe 加载动画                                       |
| transition    | [RouteTransition2](#schemaroutetransition2) | false | none |        | 定义页面切换动画                                      |
| hidden_tag    | boolean¦null                                | false | none |        | 是否在标签页导航中隐藏                                |
| dynamic_level | integer¦null                                | false | none |        | 动态路由层级 (用于父视图缓存)                         |
| active_path   | string¦null                                 | false | none |        | 当前菜单激活时，另一个菜单的path (用于高亮特定菜单)   |
| authority     | [string]¦null                               | false | none |        | 拥有访问权限的权限标识列表 (对应 pure-admin 的 auths) |

<h2 id="tocS_AdminMenuManagementTreeItem">AdminMenuManagementTreeItem</h2>

<a id="schemaadminmenumanagementtreeitem"></a>
<a id="schema_AdminMenuManagementTreeItem"></a>
<a id="tocSadminmenumanagementtreeitem"></a>
<a id="tocsadminmenumanagementtreeitem"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
  "menu_type": "CATALOG",
  "title": "string",
  "name": "string",
  "path": "string",
  "component": "string",
  "permission_key": "string",
  "icon": "string",
  "sort_order": 0,
  "is_hidden": true,
  "is_cache": true,
  "is_external_link": true,
  "external_link_url": "string",
  "status": "ENABLED",
  "remark": "string",
  "created_at": "2019-08-24T14:15:22Z",
  "updated_at": "2019-08-24T14:15:22Z",
  "children": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
      "menu_type": "CATALOG",
      "title": "string",
      "name": "string",
      "path": "string",
      "component": "string",
      "permission_key": "string",
      "icon": "string",
      "sort_order": 0,
      "is_hidden": true,
      "is_cache": true,
      "is_external_link": true,
      "external_link_url": "string",
      "status": "ENABLED",
      "remark": "string",
      "created_at": "2019-08-24T14:15:22Z",
      "updated_at": "2019-08-24T14:15:22Z",
      "children": [
        {
          "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
          "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
          "menu_type": "CATALOG",
          "title": "string",
          "name": "string",
          "path": "string",
          "component": "string",
          "permission_key": "string",
          "icon": "string",
          "sort_order": 0,
          "is_hidden": true,
          "is_cache": true,
          "is_external_link": true,
          "external_link_url": "string",
          "status": "ENABLED",
          "remark": "string",
          "created_at": "2019-08-24T14:15:22Z",
          "updated_at": "2019-08-24T14:15:22Z",
          "children": [{}]
        }
      ]
    }
  ]
}
```

AdminMenuManagementTreeItem

### 属性

| 名称              | 类型                                                                | 必选  | 约束 | 中文名 | 说明                                                              |
| ----------------- | ------------------------------------------------------------------- | ----- | ---- | ------ | ----------------------------------------------------------------- |
| id                | string(uuid)                                                        | true  | none |        | 菜单ID                                                            |
| parent_id         | string(uuid)¦null                                                   | false | none |        | 父菜单ID                                                          |
| menu_type         | string                                                              | true  | none |        | 菜单类型                                                          |
| title             | string                                                              | true  | none |        | 菜单标题                                                          |
| name              | string¦null                                                         | false | none |        | 路由名称                                                          |
| path              | string¦null                                                         | false | none |        | 路由路径                                                          |
| component         | string¦null                                                         | false | none |        | 前端组件路径                                                      |
| permission_key    | string¦null                                                         | false | none |        | 关联的权限标识                                                    |
| icon              | string¦null                                                         | false | none |        | 菜单图标                                                          |
| sort_order        | integer                                                             | true  | none |        | 排序值                                                            |
| is_hidden         | boolean                                                             | true  | none |        | 是否隐藏                                                          |
| is_cache          | boolean                                                             | true  | none |        | 是否缓存                                                          |
| is_external_link  | boolean                                                             | true  | none |        | 是否为外链                                                        |
| external_link_url | string¦null                                                         | false | none |        | 外链URL                                                           |
| status            | string                                                              | true  | none |        | 菜单状态                                                          |
| remark            | string¦null                                                         | false | none |        | 备注                                                              |
| created_at        | string(date-time)                                                   | true  | none |        | 创建时间                                                          |
| updated_at        | string(date-time)                                                   | true  | none |        | 更新时间                                                          |
| children          | [[AdminMenuManagementTreeItem](#schemaadminmenumanagementtreeitem)] | true  | none |        | [(后台管理界面使用) 菜单管理树结构中的单个节点，包含更多管理字段] |

#### 枚举值

| 属性      | 值       |
| --------- | -------- |
| menu_type | CATALOG  |
| menu_type | MENU     |
| menu_type | BUTTON   |
| status    | ENABLED  |
| status    | DISABLED |

<h2 id="tocS_AdminMenuListItemResponse">AdminMenuListItemResponse</h2>

<a id="schemaadminmenulistitemresponse"></a>
<a id="schema_AdminMenuListItemResponse"></a>
<a id="tocSadminmenulistitemresponse"></a>
<a id="tocsadminmenulistitemresponse"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
  "menu_type": "CATALOG",
  "title": "string",
  "name": "string",
  "path": "string",
  "component": "string",
  "permission_key": "string",
  "icon": "string",
  "sort_order": 0,
  "is_hidden": true,
  "is_cache": true,
  "is_external_link": true,
  "external_link_url": "string",
  "status": "ENABLED",
  "remark": "string",
  "created_at": "2019-08-24T14:15:22Z",
  "updated_at": "2019-08-24T14:15:22Z"
}
```

AdminMenuListItemResponse

### 属性

| 名称              | 类型              | 必选  | 约束 | 中文名 | 说明           |
| ----------------- | ----------------- | ----- | ---- | ------ | -------------- |
| id                | string(uuid)      | true  | none |        | 菜单ID         |
| parent_id         | string(uuid)¦null | false | none |        | 父菜单ID       |
| menu_type         | string            | true  | none |        | 菜单类型       |
| title             | string            | true  | none |        | 菜单标题       |
| name              | string¦null       | false | none |        | 路由名称       |
| path              | string¦null       | false | none |        | 路由路径       |
| component         | string¦null       | false | none |        | 前端组件路径   |
| permission_key    | string¦null       | false | none |        | 关联的权限标识 |
| icon              | string¦null       | false | none |        | 菜单图标       |
| sort_order        | integer           | true  | none |        | 排序值         |
| is_hidden         | boolean           | true  | none |        | 是否隐藏       |
| is_cache          | boolean           | true  | none |        | 是否缓存       |
| is_external_link  | boolean           | true  | none |        | 是否为外链     |
| external_link_url | string¦null       | false | none |        | 外链URL        |
| status            | string            | true  | none |        | 菜单状态       |
| remark            | string¦null       | false | none |        | 备注           |
| created_at        | string(date-time) | true  | none |        | 创建时间       |
| updated_at        | string(date-time) | true  | none |        | 更新时间       |

#### 枚举值

| 属性      | 值       |
| --------- | -------- |
| menu_type | CATALOG  |
| menu_type | MENU     |
| menu_type | BUTTON   |
| status    | ENABLED  |
| status    | DISABLED |

<h2 id="tocS_CreateAdminMenuPayload">CreateAdminMenuPayload</h2>

<a id="schemacreateadminmenupayload"></a>
<a id="schema_CreateAdminMenuPayload"></a>
<a id="tocScreateadminmenupayload"></a>
<a id="tocscreateadminmenupayload"></a>

```json
{
  "title": "string",
  "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
  "menu_type": "CATALOG",
  "name": "string",
  "path": "string",
  "component": "string",
  "permission_key": "string",
  "icon": "string",
  "sort_order": 0,
  "is_hidden": true,
  "is_cache": true,
  "is_external_link": true,
  "external_link_url": "string",
  "status": "ENABLED",
  "remark": "string"
}
```

CreateAdminMenuPayload

### 属性

| 名称              | 类型              | 必选  | 约束 | 中文名 | 说明                                    |
| ----------------- | ----------------- | ----- | ---- | ------ | --------------------------------------- |
| title             | string            | true  | none |        | 菜单标题                                |
| parent_id         | string(uuid)¦null | false | none |        | 父菜单ID                                |
| menu_type         | string            | true  | none |        | 菜单类型                                |
| name              | string¦null       | false | none |        | 路由名称 (唯一, 可选)                   |
| path              | string¦null       | false | none |        | 路由路径                                |
| component         | string¦null       | false | none |        | 前端组件路径                            |
| permission_key    | string¦null       | false | none |        | 关联的权限标识                          |
| icon              | string¦null       | false | none |        | 菜单图标                                |
| sort_order        | integer¦null      | false | none |        | 排序值 (默认0)                          |
| is_hidden         | boolean¦null      | false | none |        | 是否隐藏 (默认false)                    |
| is_cache          | boolean¦null      | false | none |        | 是否缓存 (默认false)                    |
| is_external_link  | boolean¦null      | false | none |        | 是否为外链 (默认false)                  |
| external_link_url | string¦null       | false | none |        | 外链URL (如果 is_external_link 为 true) |
| status            | string¦null       | false | none |        | 菜单状态 (默认ENABLED)                  |
| remark            | string¦null       | false | none |        | 备注                                    |

#### 枚举值

| 属性      | 值       |
| --------- | -------- |
| menu_type | CATALOG  |
| menu_type | MENU     |
| menu_type | BUTTON   |
| status    | ENABLED  |
| status    | DISABLED |
| status    | null     |

<h2 id="tocS_UpdateAdminMenuPayload">UpdateAdminMenuPayload</h2>

<a id="schemaupdateadminmenupayload"></a>
<a id="schema_UpdateAdminMenuPayload"></a>
<a id="tocSupdateadminmenupayload"></a>
<a id="tocsupdateadminmenupayload"></a>

```json
{
  "title": "string",
  "parent_id": "1c6ca187-e61f-4301-8dcb-0e9749e89eef",
  "menu_type": "CATALOG",
  "name": "string",
  "path": "string",
  "component": "string",
  "permission_key": "string",
  "icon": "string",
  "sort_order": 0,
  "is_hidden": true,
  "is_cache": true,
  "is_external_link": true,
  "external_link_url": "string",
  "status": "ENABLED",
  "remark": "string"
}
```

UpdateAdminMenuPayload

### 属性

| 名称              | 类型              | 必选  | 约束 | 中文名 | 说明                  |
| ----------------- | ----------------- | ----- | ---- | ------ | --------------------- |
| title             | string¦null       | false | none |        | 菜单标题              |
| parent_id         | string(uuid)¦null | false | none |        | 父菜单ID              |
| menu_type         | string¦null       | false | none |        | 菜单类型              |
| name              | string¦null       | false | none |        | 路由名称 (唯一, 可选) |
| path              | string¦null       | false | none |        | 路由路径              |
| component         | string¦null       | false | none |        | 前端组件路径          |
| permission_key    | string¦null       | false | none |        | 关联的权限标识        |
| icon              | string¦null       | false | none |        | 菜单图标              |
| sort_order        | integer¦null      | false | none |        | 排序值                |
| is_hidden         | boolean¦null      | false | none |        | 是否隐藏              |
| is_cache          | boolean¦null      | false | none |        | 是否缓存              |
| is_external_link  | boolean¦null      | false | none |        | 是否为外链            |
| external_link_url | string¦null       | false | none |        | 外链URL               |
| status            | string¦null       | false | none |        | 菜单状态              |
| remark            | string¦null       | false | none |        | 备注                  |

#### 枚举值

| 属性      | 值       |
| --------- | -------- |
| menu_type | CATALOG  |
| menu_type | MENU     |
| menu_type | BUTTON   |
| menu_type | null     |
| status    | ENABLED  |
| status    | DISABLED |
| status    | null     |

<h2 id="tocS_ApiResourceModel">ApiResourceModel</h2>

<a id="schemaapiresourcemodel"></a>
<a id="schema_ApiResourceModel"></a>
<a id="tocSapiresourcemodel"></a>
<a id="tocsapiresourcemodel"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "http_method": "string",
  "path_pattern": "string",
  "display_name": "string",
  "description": "string",
  "required_permission_keys": ["string"],
  "is_active": true,
  "auto_registered": true,
  "module_tag": "string",
  "created_at": "2019-08-24T14:15:22Z",
  "updated_at": "2019-08-24T14:15:22Z"
}
```

ApiResourceModel

### 属性

| 名称                     | 类型              | 必选  | 约束 | 中文名 | 说明                                              |
| ------------------------ | ----------------- | ----- | ---- | ------ | ------------------------------------------------- |
| id                       | string(uuid)      | true  | none |        | API资源的唯一标识符。                             |
| http_method              | string            | true  | none |        | HTTP方法 (例如：GET, POST)。                      |
| path_pattern             | string            | true  | none |        | API资源的URL路径模式 (例如：/api/v1/users/{id})。 |
| display_name             | string            | true  | none |        | API资源的用户友好显示名称。                       |
| description              | string¦null       | false | none |        | API资源的详细描述。                               |
| required_permission_keys | [string]¦null     | false | none |        | 访问此资源所需的权限键列表。                      |
| is_active                | boolean           | true  | none |        | 此API资源的权限控制是否已激活。                   |
| auto_registered          | boolean           | true  | none |        | 此API资源是否由系统自动注册。                     |
| module_tag               | string¦null       | false | none |        | 用于按模块对API资源进行分组的标签。               |
| created_at               | string(date-time) | true  | none |        | API资源的创建时间戳。                             |
| updated_at               | string(date-time) | true  | none |        | API资源的最后更新时间戳。                         |

<h2 id="tocS_CreateApiResourceRequest">CreateApiResourceRequest</h2>

<a id="schemacreateapiresourcerequest"></a>
<a id="schema_CreateApiResourceRequest"></a>
<a id="tocScreateapiresourcerequest"></a>
<a id="tocscreateapiresourcerequest"></a>

```json
{
  "http_method": "string",
  "path_pattern": "string",
  "display_name": "string",
  "description": "string",
  "required_permission_keys": ["string"],
  "module_tag": "string",
  "is_active": true
}
```

CreateApiResourceRequest

### 属性

| 名称                     | 类型          | 必选  | 约束 | 中文名 | 说明                                            |
| ------------------------ | ------------- | ----- | ---- | ------ | ----------------------------------------------- |
| http_method              | string        | true  | none |        | HTTP方法。                                      |
| path_pattern             | string        | true  | none |        | URL路径模式。                                   |
| display_name             | string        | true  | none |        | API资源的显示名称。                             |
| description              | string¦null   | false | none |        | 可选的描述信息。                                |
| required_permission_keys | [string]¦null | false | none |        | 可选的所需权限键列表。                          |
| module_tag               | string¦null   | false | none |        | 可选的模块标签。                                |
| is_active                | boolean¦null  | false | none |        | 可选的是否激活标志 (如果未提供，则默认为true)。 |

<h2 id="tocS_UpdateApiResourceRequest">UpdateApiResourceRequest</h2>

<a id="schemaupdateapiresourcerequest"></a>
<a id="schema_UpdateApiResourceRequest"></a>
<a id="tocSupdateapiresourcerequest"></a>
<a id="tocsupdateapiresourcerequest"></a>

```json
{
  "display_name": "string",
  "description": "string",
  "required_permission_keys": ["string"],
  "module_tag": "string",
  "is_active": true
}
```

UpdateApiResourceRequest

### 属性

| 名称                     | 类型          | 必选  | 约束 | 中文名 | 说明                       |
| ------------------------ | ------------- | ----- | ---- | ------ | -------------------------- |
| display_name             | string¦null   | false | none |        | 可选的新的显示名称。       |
| description              | string¦null   | false | none |        | 可选的新的描述信息。       |
| required_permission_keys | [string]¦null | false | none |        | 可选的新的所需权限键列表。 |
| module_tag               | string¦null   | false | none |        | 可选的新的模块标签。       |
| is_active                | boolean¦null  | false | none |        | 可选的新的激活状态。       |

<h2 id="tocS_ApiResourceRegistration">ApiResourceRegistration</h2>

<a id="schemaapiresourceregistration"></a>
<a id="schema_ApiResourceRegistration"></a>
<a id="tocSapiresourceregistration"></a>
<a id="tocsapiresourceregistration"></a>

```json
{
  "http_method": "string",
  "path_pattern": "string",
  "display_name": "string",
  "description": "string",
  "required_permissions": ["string"],
  "module_tag": "string"
}
```

ApiResourceRegistration

### 属性

| 名称                 | 类型        | 必选  | 约束 | 中文名 | 说明             |
| -------------------- | ----------- | ----- | ---- | ------ | ---------------- |
| http_method          | string      | true  | none |        | HTTP方法。       |
| path_pattern         | string      | true  | none |        | URL路径模式。    |
| display_name         | string      | true  | none |        | 显示名称。       |
| description          | string¦null | false | none |        | 可选的描述信息。 |
| required_permissions | [string]    | true  | none |        | 所需权限键列表。 |
| module_tag           | string      | true  | none |        | 模块标签。       |

<h2 id="tocS_ListApiResourcesResponse">ListApiResourcesResponse</h2>

<a id="schemalistapiresourcesresponse"></a>
<a id="schema_ListApiResourcesResponse"></a>
<a id="tocSlistapiresourcesresponse"></a>
<a id="tocslistapiresourcesresponse"></a>

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "string",
  "data": {
    "items": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "http_method": "string",
        "path_pattern": "string",
        "display_name": "string",
        "description": "string",
        "required_permission_keys": ["string"],
        "is_active": true,
        "auto_registered": true,
        "module_tag": "string",
        "created_at": "2019-08-24T14:15:22Z",
        "updated_at": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "page": 0,
    "page_size": 1
  },
  "timestamp": "2019-08-24T14:15:22Z"
}
```

### 属性

| 名称        | 类型                                          | 必选 | 约束 | 中文名 | 说明                        |
| ----------- | --------------------------------------------- | ---- | ---- | ------ | --------------------------- |
| success     | boolean                                       | true | none |        | 请求是否成功                |
| code        | string                                        | true | none |        | 业务状态码，SUCCESS表示成功 |
| message     | string                                        | true | none |        | 对当前状态的描述信息        |
| data        | object                                        | true | none |        | 返回的业务数据主体          |
| » items     | [[ApiResourceModel](#schemaapiresourcemodel)] | true | none |        | 对象数组                    |
| » total     | integer                                       | true | none |        | 总记录数（用于分页）        |
| » page      | integer                                       | true | none |        | 当前页码（从1开始）         |
| » page_size | integer                                       | true | none |        | 每页记录数                  |
| timestamp   | string(date-time)                             | true | none |        | 服务器响应时间戳            |

#### 枚举值

| 属性 | 值      |
| ---- | ------- |
| code | SUCCESS |
| code | FAIL    |

<h2 id="tocS_BatchRegisterResponse">BatchRegisterResponse</h2>

<a id="schemabatchregisterresponse"></a>
<a id="schema_BatchRegisterResponse"></a>
<a id="tocSbatchregisterresponse"></a>
<a id="tocsbatchregisterresponse"></a>

```json
{
  "registered_count": 0,
  "skipped_count": 0,
  "resources": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "http_method": "string",
      "path_pattern": "string",
      "display_name": "string",
      "description": "string",
      "required_permission_keys": ["string"],
      "is_active": true,
      "auto_registered": true,
      "module_tag": "string",
      "created_at": "2019-08-24T14:15:22Z",
      "updated_at": "2019-08-24T14:15:22Z"
    }
  ],
  "skipped_resources": ["string"]
}
```

BatchRegisterResponse

### 属性

| 名称              | 类型                                          | 必选 | 约束 | 中文名 | 说明                            |
| ----------------- | --------------------------------------------- | ---- | ---- | ------ | ------------------------------- |
| registered_count  | integer                                       | true | none |        | 成功注册的资源数量。            |
| skipped_count     | integer                                       | true | none |        | 跳过的资源数量 (例如，已存在)。 |
| resources         | [[ApiResourceModel](#schemaapiresourcemodel)] | true | none |        | 新注册的API资源列表。           |
| skipped_resources | [string]                                      | true | none |        | 被跳过的资源标识符列表。        |

<h2 id="tocS_CleanupResponse">CleanupResponse</h2>

<a id="schemacleanupresponse"></a>
<a id="schema_CleanupResponse"></a>
<a id="tocScleanupresponse"></a>
<a id="tocscleanupresponse"></a>

```json
{
  "deleted_count": 0,
  "deleted_resources": ["string"]
}
```

CleanupResponse

### 属性

| 名称              | 类型           | 必选 | 约束 | 中文名 | 说明                       |
| ----------------- | -------------- | ---- | ---- | ------ | -------------------------- |
| deleted_count     | integer(int64) | true | none |        | 已删除的自动注册资源数量。 |
| deleted_resources | [string]       | true | none |        | 已删除资源的标识符列表。   |

<h2 id="tocS_AutoDiscoverResponse">AutoDiscoverResponse</h2>

<a id="schemaautodiscoverresponse"></a>
<a id="schema_AutoDiscoverResponse"></a>
<a id="tocSautodiscoverresponse"></a>
<a id="tocsautodiscoverresponse"></a>

```json
{
  "discovered_count": 0,
  "registered_count": 0,
  "skipped_count": 0,
  "resources": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "http_method": "string",
      "path_pattern": "string",
      "display_name": "string",
      "description": "string",
      "required_permission_keys": ["string"],
      "is_active": true,
      "auto_registered": true,
      "module_tag": "string",
      "created_at": "2019-08-24T14:15:22Z",
      "updated_at": "2019-08-24T14:15:22Z"
    }
  ],
  "modules": ["string"]
}
```

AutoDiscoverResponse

### 属性

| 名称             | 类型                                          | 必选 | 约束 | 中文名 | 说明                        |
| ---------------- | --------------------------------------------- | ---- | ---- | ------ | --------------------------- |
| discovered_count | integer                                       | true | none |        | 发现的资源数量。            |
| registered_count | integer                                       | true | none |        | 新注册的资源数量。          |
| skipped_count    | integer                                       | true | none |        | 注册时跳过的资源数量。      |
| resources        | [[ApiResourceModel](#schemaapiresourcemodel)] | true | none |        | 已注册或更新的API资源列表。 |
| modules          | [string]                                      | true | none |        | 发现的模块列表。            |

<h2 id="tocS_ValidationIssueType">ValidationIssueType</h2>

<a id="schemavalidationissuetype"></a>
<a id="schema_ValidationIssueType"></a>
<a id="tocSvalidationissuetype"></a>
<a id="tocsvalidationissuetype"></a>

```json
"MissingRequired"
```

ValidationIssueType

### 属性

| 名称                | 类型   | 必选  | 约束 | 中文名              | 说明             |
| ------------------- | ------ | ----- | ---- | ------------------- | ---------------- |
| ValidationIssueType | string | false | none | ValidationIssueType | 验证问题的类型。 |

#### 枚举值

| 属性                | 值               |
| ------------------- | ---------------- |
| ValidationIssueType | MissingRequired  |
| ValidationIssueType | InvalidFormat    |
| ValidationIssueType | InvalidValue     |
| ValidationIssueType | PermissionIssue  |
| ValidationIssueType | PathPatternIssue |
| ValidationIssueType | HttpMethodIssue  |

<h2 id="tocS_ValidationSeverity">ValidationSeverity</h2>

<a id="schemavalidationseverity"></a>
<a id="schema_ValidationSeverity"></a>
<a id="tocSvalidationseverity"></a>
<a id="tocsvalidationseverity"></a>

```json
"Error"
```

ValidationSeverity

### 属性

| 名称               | 类型   | 必选  | 约束 | 中文名             | 说明                 |
| ------------------ | ------ | ----- | ---- | ------------------ | -------------------- |
| ValidationSeverity | string | false | none | ValidationSeverity | 验证问题的严重级别。 |

#### 枚举值

| 属性               | 值      |
| ------------------ | ------- |
| ValidationSeverity | Error   |
| ValidationSeverity | Warning |
| ValidationSeverity | Info    |

<h2 id="tocS_ValidationIssue">ValidationIssue</h2>

<a id="schemavalidationissue"></a>
<a id="schema_ValidationIssue"></a>
<a id="tocSvalidationissue"></a>
<a id="tocsvalidationissue"></a>

```json
{
  "issue_type": "MissingRequired",
  "description": "string",
  "severity": "Error",
  "field": "string"
}
```

ValidationIssue

### 属性

| 名称        | 类型                                              | 必选  | 约束 | 中文名 | 说明                            |
| ----------- | ------------------------------------------------- | ----- | ---- | ------ | ------------------------------- |
| issue_type  | [ValidationIssueType](#schemavalidationissuetype) | true  | none |        | 问题类型。                      |
| description | string                                            | true  | none |        | 问题描述。                      |
| severity    | [ValidationSeverity](#schemavalidationseverity)   | true  | none |        | 严重级别。                      |
| field       | string¦null                                       | false | none |        | 与问题相关的字段名 (如果适用)。 |

<h2 id="tocS_ValidationResponse">ValidationResponse</h2>

<a id="schemavalidationresponse"></a>
<a id="schema_ValidationResponse"></a>
<a id="tocSvalidationresponse"></a>
<a id="tocsvalidationresponse"></a>

```json
{
  "resource_id": "4d5215ed-38bb-48ed-879a-fdb9ca58522f",
  "is_valid": true,
  "issues": [
    {
      "issue_type": "MissingRequired",
      "description": "string",
      "severity": "Error",
      "field": "string"
    }
  ],
  "suggestions": ["string"],
  "validated_at": "2019-08-24T14:15:22Z"
}
```

ValidationResponse

### 属性

| 名称         | 类型                                        | 必选 | 约束 | 中文名 | 说明                 |
| ------------ | ------------------------------------------- | ---- | ---- | ------ | -------------------- |
| resource_id  | string(uuid)                                | true | none |        | 被验证资源的ID。     |
| is_valid     | boolean                                     | true | none |        | 配置是否有效。       |
| issues       | [[ValidationIssue](#schemavalidationissue)] | true | none |        | 发现的验证问题列表。 |
| suggestions  | [string]                                    | true | none |        | 改进建议列表。       |
| validated_at | string(date-time)                           | true | none |        | 执行验证的时间戳。   |

<h2 id="tocS_ModuleStats">ModuleStats</h2>

<a id="schemamodulestats"></a>
<a id="schema_ModuleStats"></a>
<a id="tocSmodulestats"></a>
<a id="tocsmodulestats"></a>

```json
{
  "resource_count": 0,
  "method_distribution": {
    "property1": 0,
    "property2": 0
  },
  "active_count": 0,
  "inactive_count": 0
}
```

ModuleStats

### 属性

| 名称                       | 类型           | 必选  | 约束 | 中文名 | 说明                             |
| -------------------------- | -------------- | ----- | ---- | ------ | -------------------------------- |
| resource_count             | integer(int64) | true  | none |        | 模块下的资源总数。               |
| method_distribution        | object         | true  | none |        | 模块下各HTTP方法的资源数量分布。 |
| » **additionalProperties** | integer(int64) | false | none |        | none                             |
| active_count               | integer(int64) | true  | none |        | 模块下已激活的资源数量。         |
| inactive_count             | integer(int64) | true  | none |        | 模块下未激活的资源数量。         |

<h2 id="tocS_ModuleStatsResponse">ModuleStatsResponse</h2>

<a id="schemamodulestatsresponse"></a>
<a id="schema_ModuleStatsResponse"></a>
<a id="tocSmodulestatsresponse"></a>
<a id="tocsmodulestatsresponse"></a>

```json
{
  "modules": {
    "resource_count": 0,
    "method_distribution": {
      "property1": 0,
      "property2": 0
    },
    "active_count": 0,
    "inactive_count": 0
  },
  "total_resources": 0,
  "active_resources": 0,
  "inactive_resources": 0
}
```

ModuleStatsResponse

### 属性

| 名称               | 类型                              | 必选 | 约束 | 中文名 | 说明                  |
| ------------------ | --------------------------------- | ---- | ---- | ------ | --------------------- |
| modules            | [ModuleStats](#schemamodulestats) | true | none |        | 每个模块的统计信息。  |
| total_resources    | integer(int64)                    | true | none |        | API资源总数。         |
| active_resources   | integer(int64)                    | true | none |        | 已激活的API资源总数。 |
| inactive_resources | integer(int64)                    | true | none |        | 未激活的API资源总数。 |

<h2 id="tocS_ResourceUsageStats">ResourceUsageStats</h2>

<a id="schemaresourceusagestats"></a>
<a id="schema_ResourceUsageStats"></a>
<a id="tocSresourceusagestats"></a>
<a id="tocsresourceusagestats"></a>

```json
{
  "access_count": 0,
  "last_accessed": "2019-08-24T14:15:22Z",
  "avg_response_time": 0.1,
  "error_rate": 0.1
}
```

ResourceUsageStats

### 属性

| 名称              | 类型                   | 必选  | 约束 | 中文名 | 说明                  |
| ----------------- | ---------------------- | ----- | ---- | ------ | --------------------- |
| access_count      | integer(int64)         | true  | none |        | 资源被访问的次数。    |
| last_accessed     | string(date-time)¦null | false | none |        | 最后访问的时间戳。    |
| avg_response_time | number(double)¦null    | false | none |        | 平均响应时间 (毫秒)。 |
| error_rate        | number(double)¦null    | false | none |        | 错误率 (0.0 到 1.0)。 |

<h2 id="tocS_ApiResourceDetailResponse">ApiResourceDetailResponse</h2>

<a id="schemaapiresourcedetailresponse"></a>
<a id="schema_ApiResourceDetailResponse"></a>
<a id="tocSapiresourcedetailresponse"></a>
<a id="tocsapiresourcedetailresponse"></a>

```json
{
  "resource": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "http_method": "string",
    "path_pattern": "string",
    "display_name": "string",
    "description": "string",
    "required_permission_keys": ["string"],
    "is_active": true,
    "auto_registered": true,
    "module_tag": "string",
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  },
  "validation": {
    "resource_id": "4d5215ed-38bb-48ed-879a-fdb9ca58522f",
    "is_valid": true,
    "issues": [
      {
        "issue_type": "MissingRequired",
        "description": "string",
        "severity": "Error",
        "field": "string"
      }
    ],
    "suggestions": ["string"],
    "validated_at": "2019-08-24T14:15:22Z"
  },
  "usage_stats": {
    "access_count": 0,
    "last_accessed": "2019-08-24T14:15:22Z",
    "avg_response_time": 0.1,
    "error_rate": 0.1
  },
  "related_resources": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "http_method": "string",
      "path_pattern": "string",
      "display_name": "string",
      "description": "string",
      "required_permission_keys": ["string"],
      "is_active": true,
      "auto_registered": true,
      "module_tag": "string",
      "created_at": "2019-08-24T14:15:22Z",
      "updated_at": "2019-08-24T14:15:22Z"
    }
  ]
}
```

ApiResourceDetailResponse

### 属性

| 名称              | 类型                                            | 必选  | 约束 | 中文名 | 说明                        |
| ----------------- | ----------------------------------------------- | ----- | ---- | ------ | --------------------------- |
| resource          | [ApiResourceModel](#schemaapiresourcemodel)     | true  | none |        | 表示数据库中的API资源实体。 |
| validation        | [ValidationResponse](#schemavalidationresponse) | false | none |        | 权限验证结果。              |
| usage_stats       | [ResourceUsageStats](#schemaresourceusagestats) | false | none |        | 资源使用统计 (如果可用)。   |
| related_resources | [[ApiResourceModel](#schemaapiresourcemodel)]   | true  | none |        | 相关API资源列表。           |

<h2 id="tocS_SyncPermissionsRequest">SyncPermissionsRequest</h2>

<a id="schemasyncpermissionsrequest"></a>
<a id="schema_SyncPermissionsRequest"></a>
<a id="tocSsyncpermissionsrequest"></a>
<a id="tocssyncpermissionsrequest"></a>

```json
{
  "force": true,
  "target_modules": ["string"],
  "cleanup_unused": true
}
```

SyncPermissionsRequest

### 属性

| 名称           | 类型          | 必选  | 约束 | 中文名 | 说明                   |
| -------------- | ------------- | ----- | ---- | ------ | ---------------------- |
| force          | boolean¦null  | false | none |        | 是否强制同步。         |
| target_modules | [string]¦null | false | none |        | 指定同步的目标模块。   |
| cleanup_unused | boolean¦null  | false | none |        | 是否清理未使用的权限。 |

<h2 id="tocS_SyncOperation">SyncOperation</h2>

<a id="schemasyncoperation"></a>
<a id="schema_SyncOperation"></a>
<a id="tocSsyncoperation"></a>
<a id="tocssyncoperation"></a>

```json
"Create"
```

SyncOperation

### 属性

| 名称          | 类型   | 必选  | 约束 | 中文名        | 说明             |
| ------------- | ------ | ----- | ---- | ------------- | ---------------- |
| SyncOperation | string | false | none | SyncOperation | 同步操作的类型。 |

#### 枚举值

| 属性          | 值     |
| ------------- | ------ |
| SyncOperation | Create |
| SyncOperation | Update |
| SyncOperation | Delete |
| SyncOperation | Skip   |

<h2 id="tocS_SyncDetail">SyncDetail</h2>

<a id="schemasyncdetail"></a>
<a id="schema_SyncDetail"></a>
<a id="tocSsyncdetail"></a>
<a id="tocssyncdetail"></a>

```json
{
  "resource_id": "4d5215ed-38bb-48ed-879a-fdb9ca58522f",
  "operation": "Create",
  "description": "string",
  "success": true,
  "error": "string"
}
```

SyncDetail

### 属性

| 名称        | 类型                                  | 必选  | 约束 | 中文名 | 说明                         |
| ----------- | ------------------------------------- | ----- | ---- | ------ | ---------------------------- |
| resource_id | string(uuid)                          | true  | none |        | 同步操作所涉及资源的ID。     |
| operation   | [SyncOperation](#schemasyncoperation) | true  | none |        | 操作类型。                   |
| description | string                                | true  | none |        | 操作描述。                   |
| success     | boolean                               | true  | none |        | 操作是否成功。               |
| error       | string¦null                           | false | none |        | 如果操作失败，则为错误信息。 |

<h2 id="tocS_未命名数据模型4">未命名数据模型4</h2>

<a id="schema未命名数据模型4"></a>
<a id="schema_未命名数据模型4"></a>
<a id="tocS未命名数据模型4"></a>
<a id="tocs未命名数据模型4"></a>

```json
{
  "synced_resources": 0,
  "created_permissions": 0,
  "updated_permissions": 0,
  "deleted_permissions": 0,
  "sync_details": [
    {
      "resource_id": "4d5215ed-38bb-48ed-879a-fdb9ca58522f",
      "operation": "Create",
      "description": "string",
      "success": true,
      "error": "string"
    }
  ],
  "synced_at": "2019-08-24T14:15:22Z"
}
```

SyncPermissionsResponse

### 属性

| 名称                | 类型                              | 必选 | 约束 | 中文名 | 说明                 |
| ------------------- | --------------------------------- | ---- | ---- | ------ | -------------------- |
| synced_resources    | integer(int64)                    | true | none |        | 同步的资源数量。     |
| created_permissions | integer(int64)                    | true | none |        | 创建的权限数量。     |
| updated_permissions | integer(int64)                    | true | none |        | 更新的权限数量。     |
| deleted_permissions | integer(int64)                    | true | none |        | 删除的权限数量。     |
| sync_details        | [[SyncDetail](#schemasyncdetail)] | true | none |        | 同步操作的详细列表。 |
| synced_at           | string(date-time)                 | true | none |        | 执行同步的时间戳。   |
