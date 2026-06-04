# 规范文档

## 📋 项目概述

- **项目名称**: E-AI
- **版本**: 1.26.0311
- **应用标识**: \_\_UNI\_\_DE9C615
- **描述**: E-AI 智能应用系统
- **Vue版本**: Vue 2.x
- **目标平台**: H5、微信小程序、Android App、iOS App、支付宝小程序、百度小程序、抖音小程序、QQ小程序等

***

## 🛠 技术栈规范

### 核心框架

| 技术      | 版本                      | 用途              |
| ------- | ----------------------- | --------------- |
| uni-app | ^2.0.2-4080720251210002 | 跨平台应用框架         |
| Vue.js  | >= 2.6.14 < 2.7         | 渐进式JavaScript框架 |
| Vuex    | ^3.2.0                  | 状态管理模式          |

### 构建工具

| 技术                           | 版本                      | 用途             |
| ---------------------------- | ----------------------- | -------------- |
| @vue/cli-service             | \~5.0.0                 | Vue CLI 服务     |
| webpack                      | 5.x                     | 模块打包工具         |
| @dcloudio/vue-cli-plugin-uni | ^2.0.2-4080720251210002 | uni-app CLI 插件 |
| babel                        | 7.x                     | JavaScript 编译器 |
| sass                         | ^1.97.2                 | CSS 预处理器       |
| less                         | ^4.5.1                  | CSS 预处理器       |

***

## 📁 项目结构规范

```
eAi@cli/
├── public/                      # 静态资源目录
├── src/                         # 源代码目录
│   ├── app/                     # 应用核心配置
│   │   ├── api/                 # API 接口模块
│   │   │   ├── dict.js          # 字典数据接口
│   │   │   ├── index.js         # 通用接口
│   │   │   ├── login.js         # 登录接口
│   │   │   ├── person.js        # 个人中心接口
│   │   │   └── user.js          # 用户接口
│   │   ├── app.api.js           # API 配置
│   │   ├── app.commom.js        # 通用工具
│   │   ├── app.config.js       # 应用配置
│   │   ├── app.constant.js      # 应用常量
│   │   ├── app.core.module.js   # 核心模块
│   │   ├── app.event.config.js  # 事件配置
│   │   └── app.store.config.js  # 状态存储配置
│   ├── components/              # 全局组件
│   │   ├── custom-ui/           # 自定义UI组件
│   │   │   ├── ut-bottomNav/     # 底部导航组件
│   │   │   ├── ut-circle/       # 圆形组件
│   │   │   ├── ut-cropper/      # 图片裁剪组件
│   │   │   ├── ut-expert-list/  # 专家列表组件
│   │   │   ├── ut-imgs/         # 图片组件
│   │   │   ├── ut-new/          # 新闻组件
│   │   │   ├── ut-official/     # 官方组件
│   │   │   ├── ut-picker-data/  # 数据选择器
│   │   │   ├── ut-range-time/   # 范围时间选择器
│   │   │   ├── ut-recording-effect/  # 录音效果组件
│   │   │   └── ut-tabs/         # 标签页组件
│   │   ├── e-chart/             # ECharts 图表组件
│   │   └── project-ui/         # 项目业务组件
│   │       ├── project-chat-list/       # 聊天列表
│   │       ├── project-chat-log-item/   # 聊天日志项
│   │       ├── project-file-card/       # 文件卡片
│   │       ├── project-reserve-item/    # 预约项
│   │       └── project-sign-doc-item/   # 签署文档项
│   ├── pages/                   # 页面（分包外）
│   │   ├── 404/                 # 404页面
│   │   ├── launch/              # 启动页面
│   │   └── tabs/                # TabBar 页面
│   │       ├── tab1/            # 设备预约页
│   │       └── tab5/            # 个人中心页
│   ├── providers/               # 供应商/工具库
│   │   ├── dict/                # 字典管理
│   │   │   ├── Dict.js
│   │   │   ├── DictConverter.js
│   │   │   ├── DictData.js
│   │   │   ├── DictMeta.js
│   │   │   ├── DictOptions.js
│   │   │   └── index.js
│   │   ├── utilities/          # 工具函数
│   │   │   ├── UI.js            # UI 工具
│   │   │   ├── chat.js          # 聊天工具
│   │   │   ├── crypto-js.js     # 加密工具
│   │   │   ├── decrypt_decipher.js  # 解密工具
│   │   │   ├── httpStatusCode.js   # HTTP 状态码
│   │   │   ├── jsencrypt.js     # RSA 加密
│   │   │   ├── router.js         # 路由工具
│   │   │   └── wsUtil.js        # WebSocket 工具
│   │   ├── area.js              # 地区数据
│   │   ├── dict.js              # 字典
│   │   ├── index.js             # 导出入口
│   │   ├── mixins.js            # 混入
│   │   ├── storage.js           # 存储工具
│   │   └── upload.js            # 上传工具
│   ├── static/                  # 静态资源
│   │   ├── nav/                 # 导航图标
│   │   └── styles/              # 全局样式
│   │       ├── mixins.scss      # SCSS 混入
│   │       └── public.scss      # 公共样式
│   ├── store/                   # Vuex 状态管理
│   │   ├── modules/             # 状态模块
│   │   │   ├── cancers.js       # 癌症数据模块
│   │   │   ├── dict.js          # 字典模块
│   │   │   ├── equipment.js     # 设备模块
│   │   │   └── user.js          # 用户模块
│   │   ├── getters.js           # Getter 函数
│   │   └── index.js             # Store 入口
│   ├── sub-pack/                # 分包页面
│   │   ├── chat/                # 聊天功能包
│   │   │   ├── components/      # 聊天组件
│   │   │   ├── js/              # 聊天脚本
│   │   │   ├── styles/          # 聊天样式
│   │   │   ├── chat-log.vue     # 聊天记录页
│   │   │   ├── chat-stream.vue  # 流式聊天页
│   │   │   └── preview.vue      # 预览页
│   │   ├── project-pages/       # 项目页面包
│   │   │   ├── article-detail/  # 文章详情
│   │   │   └── login/           # 登录相关页面
│   │   ├── tab1/                # Tab1 功能包
│   │   │   ├── detail/          # 详情页
│   │   │   ├── device/          # 设备详情
│   │   │   └── ocr-recog/       # OCR 识别
│   │   └── tab5/                # Tab5 功能包
│   │       ├── reserve/         # 预约管理
│   │       ├── sign-doc/        # 文档签署
│   │       └── temperature-monitoring/  # 温度监控
│   ├── uni_modules/             # uni-app 第三方模块
│   │   ├── Recorder-UniCore/    # 录音模块
│   │   ├── lyn4ever_gaodeRoutePlanning/  # 高德路线规划
│   │   └── ss-preview/          # 预览模块
│   ├── App.vue                  # 应用根组件
│   ├── main.js                  # 应用入口文件
│   ├── manifest.json            # 应用配置文件
│   ├── pages.json               # 页面配置文件
│   ├── route.js                 # 路由配置
│   ├── uni.promisify.adaptor.js # Promise 适配器
│   └── uni.scss                # uni-app 全局样式变量
├── babel.config.js              # Babel 配置
├── postcss.config.js            # PostCSS 配置
├── jest.config.js               # Jest 测试配置
├── package.json                 # 项目依赖配置
└── README.md                    # 项目说明文档
```

***

## 🎨 组件开发规范

### 1. 组件命名规范

#### 前缀规则

| 组件类型  | 前缀         | 示例                      | 路径                                      |
| ----- | ---------- | ----------------------- | --------------------------------------- |
| 业务组件  | `project-` | `project-chat-list.vue` | `components/project-ui/project-{name}/` |
| 第三方组件 | 按官方规范      | `e-charts`              | `components/e-chart/`                   |

#### 组件目录结构

```
project-{component-name}/
├── project-{component-name}.vue      # 主组件文件
├── project-{component-name}.render.js # 渲染脚本（可选）
├── project-{component-name}.wxs      # WXS 脚本（可选）
└── project-{component-name}.wxss     # 组件样式（可选）
```

### 2. 组件开发标准

#### 基础模板

```vue
<template>
  <view class="project-component-name">
    <!-- 组件内容 -->
  </view>
</template>

<script>
export default {
  name: 'rojectComponentName',
  props: {
    // 属性定义
  },
  data() {
    return {
      // 响应式数据
    }
  },
  computed: {
    // 计算属性
  },
  methods: {
    // 方法
  },
  onLoad() {
    // 生命周期
  }
}
</script>

<style lang="scss" scoped>
.ut-component-name {
  // 组件样式
}
</style>
```

#### Easycom 规范

组件通过 `pages.json` 的 `easycom` 配置自动导入：

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^ut-(.*)": "@/components/custom-ui/ut-$1/ut-$1.vue",
      "^project-(.*)": "@/components/project-ui/project-$1/project-$1.vue",
      "e-charts": "@/components/e-chart/e-chart.vue"
    }
  }
}
```

***

## 📝 API 接口规范

### 1. 接口请求规范

#### 请求方法

- **GET**: 获取数据
- **POST**: 创建资源
- **PUT**: 更新资源
- **DELETE**: 删除资源

#### 请求封装

所有请求通过 `app.api.js` 中的 `request` 函数封装：

```javascript
import api from '@/app/api'

// GET 请求
api.get({
  url: '/api/example',
  params: { id: 1 }
})

// POST 请求
api.post({
  url: '/api/example',
  data: { name: 'test' }
})
```

### 2. 请求拦截器

#### 数据处理

- 自动移除空值、null、undefined
- 自动处理时间格式（移除时间部分的 00:00:00）
- 自动添加 Token 到请求头

#### 响应处理

| 状态码 | 处理方式           |
| --- | -------------- |
| 200 | 成功，返回数据        |
| 401 | Token 过期，跳转登录页 |
| 500 | 显示错误消息         |
| 其他  | 显示对应错误消息       |

### 3. 接口模块划分

```javascript
// app/api/index.js - 导出所有接口
export * from './dict'
export * from './login'
export * from './person'
export * from './user'
```

***

## 🗃 状态管理规范

### 1. Vuex 模块划分

| 模块   | 文件                     | 职责            |
| ---- | ---------------------- | ------------- |
| 用户模块 | `modules/user.js`      | 用户信息、权限、Token |
| 字典模块 | `modules/dict.js`      | 字典数据缓存        |
| 设备模块 | `modules/equipment.js` | 设备相关信息        |
| 癌症模块 | `modules/cancers.js`   | 癌症相关数据        |

### 2. 模块开发标准

```javascript
// modules/example.js
export default {
  namespaced: true,
  state: {
    data: []
  },
  mutations: {
    SET_DATA(state, payload) {
      state.data = payload
    }
  },
  actions: {
    updateData({ commit }, payload) {
      // 异步操作
      commit('SET_DATA', payload)
    }
  },
  getters: {
    getData: state => state.data
  }
}
```

### 3. Getter 函数规范

在 `getters.js` 中定义计算属性：

```javascript
export default {
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  permission: state => state.user.permission || []
}
```

***

## 🚀 路由管理规范

### 1. 路由配置

#### 主包页面

在 `pages.json` 的 `pages` 数组中配置：

```json
{
  "pages": [
    {
      "path": "pages/tabs/tab1/tab1",
      "name": "tab1Page",
      "style": {
        "navigationBarTitleText": "设备预约",
        "enablePullDownRefresh": false
      }
    }
  ]
}
```

#### 分包页面

在 `pages.json` 的 `subPackages` 数组中配置：

```json
{
  "subPackages": [
    {
      "root": "sub-pack/project-pages",
      "pages": [
        {
          "path": "login/login",
          "name": "login",
          "style": {
            "navigationBarTitleText": "登录"
          }
        }
      ]
    }
  ]
}
```

### 2. 路由导航工具

使用 `providers/utilities/router.js` 进行路由管理：

```javascript
import router from '@/providers/utilities/router'

// 跳转到页面
router.navTo({
  url: '/pages/tabs/tab1/tab1'
})

// 跳转登录页
router.navTo({ url: router.loginPath })

// 返回上一页
router.navBack()
```

### 3. 路由守卫

在 `app.core.module.js` 中实现：

```javascript
// Token 过期自动跳转登录
if (statusCode == 401 || code == 401) {
  router.navTo({
    url: router.loginPath
  })
}
```

***

## 🎯 页面开发规范

### 1. 页面生命周期

| 生命周期     | 触发时机   | 用途           |
| -------- | ------ | ------------ |
| onLaunch | 应用启动   | 初始化全局数据、检查更新 |
| onShow   | 应用显示   | 恢复应用状态       |
| onHide   | 应用隐藏   | 保存应用状态       |
| onLoad   | 页面加载   | 获取页面参数、初始化数据 |
| onShow   | 页面显示   | 每次显示时执行      |
| onReady  | 页面渲染完成 | 首次渲染完成       |
| onUnload | 页面卸载   | 清理定时器、监听器    |

### 2. 页面配置

每个页面在 `pages.json` 中配置：

```json
{
  "path": "pages/tabs/tab1/tab1",
  "name": "tab1Page",
  "style": {
    "navigationBarTitleText": "设备预约",
    "enablePullDownRefresh": false,
    "navigationStyle": "custom",
    "navigationBarTextStyle": "black",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8"
  }
}
```

### 3. 全局样式

在 `App.vue` 中导入全局样式：

```vue
<style lang="scss">
@import '@/uni_modules/uview-ui/index.scss';
@import '@/static/styles/public.scss';
</style>
```

***

## 🔧 代码风格规范

### 1. 命名规范

| 类型     | 规范                 | 示例                               |
| ------ | ------------------ | -------------------------------- |
| 组件名    | PascalCase         | `UserProfile.vue`                |
| 变量名    | camelCase          | `userName`, `isLoading`          |
| 常量名    | UPPER\_SNAKE\_CASE | `MAX_COUNT`, `API_URL`           |
| 方法名    | camelCase          | `getUserInfo()`, `handleClick()` |
| CSS 类名 | kebab-case         | `.user-profile`, `.btn-primary`  |
| 文件名    | kebab-case         | `user-profile.vue`, `utils.js`   |

### 2. 代码格式

#### JavaScript 代码规范

- 使用 2 空格缩进
- 使用单引号 `''` 包裹字符串
- 使用分号结束语句
- 使用 `const` 和 `let`，避免使用 `var`
- 使用箭头函数
- 使用解构赋值

```javascript
// ✅ 正确示例
const getUserInfo = async (userId) => {
  const { data, code } = await api.get({
    url: `/api/user/${userId}`
  })
  return data
}

// ❌ 错误示例
var getUserInfo = function(userId) {
  var result = api.get({
    url: "/api/user/" + userId
  })
  return result.data
}
```

#### Vue 组件规范

- 组件 props 应有默认值和类型定义
- 组件 data 应使用函数形式
- 组件方法应放在 methods 中
- 组件样式应使用 scoped
- 组件应有明确的 name 属性

```vue
<template>
  <view class="user-card">
    <text>{{ title }}</text>
  </view>
</template>

<script>
export default {
  name: 'UserCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    userId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      localData: []
    }
  },
  methods: {
    handleClick() {
      this.$emit('click', this.userId)
    }
  }
}
</script>

<style lang="scss" scoped>
.user-card {
  padding: 20rpx;
}
</style>
```

### 3. 注释规范

```javascript
/**
 * 获取用户信息
 * @param {Number|String} userId - 用户ID
 * @returns {Promise<Object>} 用户信息
 */
const getUserInfo = async (userId) => {
  // TODO: 优化数据缓存
  // FIXME: 修复Token过期问题
}
```

***

## 📦 分包加载规范

### 1. 分包策略

采用主包 + 分包模式，减少主包体积：

| 包类型 | 内容        | 说明              |
| --- | --------- | --------------- |
| 主包  | 核心页面、公共组件 | TabBar 页面必须放在主包 |
| 分包  | 功能模块页面    | 按功能模块划分         |

### 2. 分包配置

```json
{
  "subPackages": [
    {
      "root": "sub-pack/project-pages",
      "pages": [
        { "path": "login/login" }
      ]
    },
    {
      "root": "sub-pack/tab1",
      "pages": [
        { "path": "device/detail" }
      ]
    }
  ]
}
```

### 3. 分包加载限制

- 单个分包/主包体积不能超过 2MB
- 总体积不能超过 8MB（微信小程序限制）
- 分包页面不能使用主包的非公共组件

***

## 🔒 权限控制规范

### 1. 权限管理

在 `app.commom.js` 中实现权限判断：

```javascript
Vue.prototype.hasMenu = (value) => {
  const permission = store.getters.permission
  const paths = permission.filter(item => item.type === 'path')
  return paths.findIndex(item => item.action === value) > -1
}

Vue.prototype.hasAction = (value) => {
  const permission = store.getters.permission
  const actions = permission.filter(item => item.type === 'action')
  return actions.findIndex(item => item.action === value) > -1
}

Vue.prototype.hasData = (value) => {
  const permission = store.getters.permission
  const datas = permission.filter(item => item.type === 'data')
  return datas.findIndex(item => item.action === value) > -1
}
```

### 2. Token 管理

```javascript
// 获取 Token
import { getToken } from '@/providers/storage'

// 设置 Token
import { setToken } from '@/providers/storage'

// 删除 Token
import { delToken } from '@/providers/storage'
```

***

## 🧪 调试规范

### 1. 开发环境调试

```bash
# H5 开发
npm run serve

# 微信小程序开发
npm run dev:mp

# App 开发
npm run dev:app-plus
```

### 2. Console 使用

```javascript
// 开发环境日志
console.log('Debug info:', data)

// 警告日志
console.warn('Warning:', message)

// 错误日志
console.error('Error:', error)
```

### 3. VConsole 使用

在 H5 开发模式下自动启用，方便移动端调试。

***

## 🚢 构建发布规范

### 1. 构建命令

```bash
# H5 构建
npm run build

# 微信小程序构建
npm run build:mp

# App 构建
npm run build:app-plus
```

### 2. 版本管理

在 `manifest.json` 中管理版本：

```json
{
  "versionName": "2.26.0126",
  "versionCode": "100"
}
```

### 3. 小程序发布

- 使用微信开发者工具上传代码
- 在微信公众平台提交审核
- 审核通过后自动发布

***

## 📊 性能优化规范

### 1. 图片优化

- 使用合适的图片格式（WebP > PNG > JPG）
- 使用图片懒加载
- 压缩图片资源

### 2. 代码分割

- 使用分包加载
- 组件按需引入
- 使用 Tree-shaking

### 3. 数据缓存

- 合理使用本地缓存
- 定期清理过期数据
- 缓存用户信息减少请求

### 4. 请求优化

- 合并频繁请求
- 使用请求缓存
- 合理设置超时时间

***

## 🔧 开发工具链

| 工具           | 版本  | 用途             |
| ------------ | --- | -------------- |
| HBuilderX    | 最新版 | uni-app 官方 IDE |
| 微信开发者工具      | 最新版 | 微信小程序开发调试      |
| Vue Devtools | -   | Vue 组件树调试      |
| Postman      | -   | API 接口调试       |

***

## 📦 依赖说明

### 生产依赖 (dependencies)

#### 1. uni-app 核心框架

| 依赖                     | 版本                      | 用途           |
| ---------------------- | ----------------------- | ------------ |
| @dcloudio/uni-app      | ^2.0.2-4080720251210002 | uni-app 核心框架 |
| @dcloudio/uni-app-plus | ^2.0.2-4080720251210002 | App 端增强模块    |
| @dcloudio/uni-h5       | ^2.0.2-4080720251210002 | H5 平台支持      |
| @dcloudio/uni-i18n     | ^2.0.2-4080720251210002 | 国际化支持        |

#### 2. 小程序平台支持

| 依赖                       | 版本                      | 用途     |
| ------------------------ | ----------------------- | ------ |
| @dcloudio/uni-mp-weixin  | ^2.0.2-4080720251210002 | 微信小程序  |
| @dcloudio/uni-mp-alipay  | ^2.0.2-4080720251210002 | 支付宝小程序 |
| @dcloudio/uni-mp-baidu   | ^2.0.2-4080720251210002 | 百度小程序  |
| @dcloudio/uni-mp-toutiao | ^2.0.2-4080720251210002 | 抖音小程序  |
| @dcloudio/uni-mp-qq      | ^2.0.2-4080720251210002 | QQ 小程序 |
| @dcloudio/uni-mp-xhs     | ^2.0.2-4080720251210002 | 小红书小程序 |
| @dcloudio/uni-mp-harmony | ^2.0.2-4080720251210002 | 鸿蒙小程序  |

#### 3. Vue 生态

| 依赖          | 版本              | 用途          |
| ----------- | --------------- | ----------- |
| vue         | >= 2.6.14 < 2.7 | Vue.js 核心框架 |
| vuex        | ^3.2.0          | 状态管理        |
| @vue/shared | ^3.0.0          | 跨平台共享模块     |

#### 4. 其他生产依赖

| 依赖                  | 版本            | 用途            |
| ------------------- | ------------- | ------------- |
| flyio               | ^0.6.2        | HTTP 请求库      |
| markdown-it         | ^14.1.0       | Markdown 解析器  |
| highlight.js        | ^11.11.1      | 代码高亮          |
| github-markdown-css | ^5.8.1        | Markdown 样式   |
| recorder-core       | ^1.3.25011100 | 音频录制          |
| vconsole            | ^3.15.1       | 移动端调试         |
| clipboard           | ^2.0.2        | 剪贴板操作         |
| uni-read-pages      | 1.0.5         | 页面配置读取        |
| core-js             | ^3.8.3        | ES6+ polyfill |

### 开发依赖 (devDependencies)

| 依赖                           | 版本                      | 用途             |
| ---------------------------- | ----------------------- | -------------- |
| @vue/cli-service             | \~5.0.0                 | Vue CLI 服务     |
| @vue/cli-plugin-babel        | \~5.0.0                 | Babel 插件       |
| @dcloudio/vue-cli-plugin-uni | ^2.0.2-4080720251210002 | uni-app CLI 插件 |
| sass                         | ^1.97.2                 | SCSS 编译器       |
| sass-loader                  | ^10.5.2                 | Sass 加载器       |
| less                         | ^4.5.1                  | Less 编译器       |
| less-loader                  | ^12.3.0                 | Less 加载器       |
| jest                         | ^25.4.0                 | 测试框架           |
| cross-env                    | ^7.0.2                  | 环境变量设置         |

### uni\_modules 第三方模块

| 模块                           | 用途       | 官方文档                                       |
| ---------------------------- | -------- | ------------------------------------------ |
| Recorder-UniCore             | 录音功能     | <https://ext.dcloud.net.cn/plugin?id=764>  |
| lyn4ever\_gaodeRoutePlanning | 高德地图路线规划 | <https://ext.dcloud.net.cn/plugin?id=2391> |
| ss-preview                   | 文档预览组件   | -                                          |
| uview-ui                     | UI 组件库   | <https://www.uviewui.com/>                 |
| z-paging                     | 分页组件     | <https://z-paging.zxlee.cn/>               |

***

## 🔧 构建脚本命令

### 开发命令

```bash
# H5 开发服务器
npm run serve

# 微信小程序开发
npm run dev:mp

# App 开发
npm run dev:app-plus
```

### 构建命令

```bash
# H5 生产构建
npm run build

# 微信小程序构建
npm run build:mp

# App 构建
npm run build:app-plus

# 其他平台
npm run build:mp-alipay     # 支付宝
npm run build:mp-baidu      # 百度
npm run build:mp-toutiao    # 抖音
npm run build:mp-qq         # QQ
npm run build:mp-xhs        # 小红书
npm run build:mp-harmony    # 鸿蒙
```

### 测试命令

```bash
npm run test:h5             # H5 测试
npm run test:mp-weixin      # 微信小程序测试
npm run test:android        # Android 测试
npm run test:ios            # iOS 测试
```

***

## ⚠️ 注意事项

### Node.js 版本要求

- **推荐**: Node.js >= 14.x
- **当前**: Node.js 24.15.0
- **最低**: Node.js 12.x

### 平台特定依赖

- **微信小程序**: 需要微信开发者工具
- **App 开发**: 需要 HBuilderX 或 Android Studio/Xcode
- **iOS 开发**: 需要 Xcode

### 依赖冲突解决

```bash
npm install --legacy-peer-deps
```

***

## 📄 附录

### A. 环境变量

```bash
# 开发环境
NODE_ENV=development
UNI_PLATFORM=h5

# 生产环境
NODE_ENV=production
UNI_PLATFORM=h5
```

### B. 跨平台编译宏

```javascript
// #ifdef H5
// 仅 H5 平台编译
// #endif

// #ifdef MP-WEIXIN
// 仅微信小程序编译
// #endif
```

### C. 常用路径别名

```javascript
'@/'    ->  src/
'@/components/'   ->  src/components/
'@/static/'       ->  src/static/
'@/store/'        ->  src/store/
'@/providers/'    ->  src/providers/
```

***

## 🤝 维护记录

- **创建日期**: 2026-06-01
- **文档版本**: 1.0.0
- **最后更新**: 2026-06-01

***

## 📞 技术支持

- 技术支持: 查看 README.md
- 问题反馈: 通过项目 Issue 提交

