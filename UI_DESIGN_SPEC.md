# E-AI UI 设计规范文档

## 🎨 设计概述

本文档详细说明 E-AI 项目的 UI 设计规范，包括颜色、字体、间距、组件样式等设计标准。

---

## 📐 设计原则

### 1. 统一性
- 保持跨平台（H5、小程序、App）的视觉一致性
- 使用统一的设计语言和组件库

### 2. 简洁性
- 界面简洁清晰，避免过度装饰
- 突出核心功能和内容

### 3. 易用性
- 符合用户操作习惯
- 提供清晰的视觉反馈

### 4. 响应性
- 适配不同屏幕尺寸
- 考虑安全区域（刘海屏、底部横条等）

---

## 🎨 颜色系统

### 1. 品牌色

#### 主色调
| 名称 | 色值 | 用途 |
|------|------|------|
| 主色 | `#3B7EFF` | 主要按钮、链接、选中状态 |
| 主色浅 | `#5178FF` | 次要按钮、背景装饰 |
| 主色渐变 | `linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%)` | 重要按钮、强调区域 |

#### 渐变色
```scss
// 主色渐变（从左到右）
background: linear-gradient(to right, #00DEFF 0%, #0C5FFF 100%);

// 主色渐变（135 度角）
background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
```

### 2. 功能色

| 类型 | 色值 | 用途 |
|------|------|------|
| 成功色 | `#5ac725` | 成功状态、完成提示 |
| 警告色 | `#f9ae3d` | 警告提示、注意信息 |
| 错误色 | `#f56c6c` | 错误提示、删除操作 |
| 信息色 | `#909399` | 普通信息、辅助说明 |

### 3. 文字色

| 类型 | 色值 | 用途 |
|------|------|------|
| 主要文字 | `#303133` | 标题、重要内容 |
| 常规文字 | `#606266` | 正文内容 |
| 次要文字 | `#909193` | 辅助信息、提示 |
| 禁用文字 | `#c0c4cc` | 禁用状态、不可用内容 |
| 占位文字 | `#808080` | 输入框占位符 |

### 4. 背景色

| 类型 | 色值 | 用途 |
|------|------|------|
| 页面背景 | `#f5f5f5` | 整体页面背景 |
| 卡片背景 | `#ffffff` | 卡片、容器背景 |
| 悬停背景 | `#f1f1f1` | 鼠标悬停状态 |
| 遮罩背景 | `rgba(0, 0, 0, 0.4)` | 弹窗遮罩 |
| 浅色背景 | `#f3f4f6` | 次要区域背景 |

### 5. 边框色

| 类型 | 色值 | 用途 |
|------|------|------|
| 边框色 | `#c8c7cc` | 常规边框 |
| 浅色边框 | `#dadbde` | 次要边框、分割线 |
| 分割线 | `#eaeaea` | 列表项分割线 |

---

## 📏 尺寸规范

### 1. 字体大小

| 类型 | 大小 (rpx) | 大小 (px) | 用途 |
|------|-----------|----------|------|
| 超大标题 | 36rpx | 18px | 重要按钮、强调文字 |
| 大标题 | 32rpx | 16px | 页面标题、卡片标题 |
| 常规标题 | 30rpx | 15px | 小标题、分组标题 |
| 正文 | 28rpx | 14px | 常规文本内容 |
| 辅助文字 | 26rpx | 13px | 描述性文字、备注 |
| 小字 | 24rpx | 12px | 标签、次要信息 |
| 微小字 | 20rpx | 10px | 提示信息、时间戳 |
| 最小字 | 18rpx | 9px | 特殊场景极小文字 |

### 2. 字体粗细

| 粗细值 | 名称 | 用途 |
|--------|------|------|
| 400 | normal | 常规文字 |
| 500 | medium | 中等强调 |
| 600 | semibold | 标题、重要信息 |
| 700 | bold | 特别强调 |

### 3. 行高

| 类型 | 行高值 | 用途 |
|------|--------|------|
| 紧凑 | 1.2 | 标题、短文本 |
| 常规 | 1.5 | 正文内容 |
| 宽松 | 1.8 | 长文本、文章段落 |

### 4. 圆角

| 类型 | 大小 (rpx) | 大小 (px) | 用途 |
|------|-----------|----------|------|
| 小圆角 | 4rpx | 2px | 小按钮、标签 |
| 常规圆角 | 8rpx | 4px | 常规按钮、卡片 |
| 大圆角 | 12rpx | 6px | 大卡片、弹窗 |
| 圆形 | 50% | 50% | 头像、圆形按钮 |
| 超圆角 | 80rpx | 40px | 胶囊按钮 |

### 5. 间距系统

#### 水平间距
| 类型 | 大小 (rpx) | 大小 (px) | 用途 |
|------|-----------|----------|------|
| 超小间距 | 10rpx | 5px | 紧凑元素间 |
| 小间距 | 20rpx | 10px | 相关元素间 |
| 中间距 | 30rpx | 15px | 常规元素间 |
| 大间距 | 40rpx | 20px | 大模块间 |
| 超大间距 | 60rpx | 30px | 页面级间距 |

#### 垂直间距
| 类型 | 大小 (rpx) | 大小 (px) | 用途 |
|------|-----------|----------|------|
| 超小间距 | 8rpx | 4px | 紧凑元素间 |
| 小间距 | 16rpx | 8px | 相关元素间 |
| 中间距 | 24rpx | 12px | 常规元素间 |
| 大间距 | 32rpx | 16px | 大模块间 |

#### 内边距
| 类型 | 大小 (rpx) | 用途 |
|------|-----------|------|
| 小内边距 | 20rpx | 小卡片、按钮 |
| 常规内边距 | 30rpx | 常规卡片、容器 |
| 大内边距 | 32rpx | 大卡片、页面内容区 |

---

## 🧩 组件规范

### 1. 按钮组件

#### 主要按钮
```scss
.btn-primary {
  width: 320rpx;
  height: 80rpx;
  font-size: 36rpx;
  color: #fff;
  background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
  border-radius: 80rpx;
}
```

#### 次要按钮
```scss
.btn-secondary {
  width: 320rpx;
  height: 80rpx;
  font-size: 36rpx;
  color: #5178FF;
  background: rgba(81, 120, 255, 0.1);
  border-radius: 80rpx;
}
```

#### 标签按钮
```scss
.tag-plain {
  padding: 9rpx 15rpx;
  font-size: 24rpx;
  color: #fff;
  background-color: #5178FF;
  border: 1rpx solid #ECF3FF;
  border-radius: 34rpx;
}

.tag-plain-boder {
  padding: 9rpx 15rpx;
  font-size: 24rpx;
  color: #5178FF;
  background-color: #ECF3FF;
  border: 1rpx solid #5178FF;
  border-radius: 34rpx;
}
```

#### 禁用状态
```scss
.tag-plain-boder.dis {
  color: #999;
  background-color: #F8F8F8;
  border-color: #999;
}
```

### 2. 卡片组件

#### 基础卡片
```scss
.base-block {
  padding: 32rpx;
  border-radius: 20rpx;
  background-color: #fff;
}
```

#### AI 风格卡片
```scss
.pubBoxAI {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}
```

#### 通用视图块
```scss
.ut-view {
  width: 100%;
  min-height: 200rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-sizing: border-box;
}
```

### 3. 输入框组件

#### 文本输入区
```scss
.writeArea {
  position: relative;
  
  .writeBox {
    .u-textarea {
      .textarea-placeholder {
        display: flex;
        align-items: center;
      }
      
      .uni-textarea-textarea {
        padding-top: 21rpx;
      }
    }
    
    .voiceBox {
      height: 98rpx;
      color: #c0c4cc;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .fTip {
        font-weight: bold;
        color: #000000;
      }
    }
  }
}
```

### 4. 列表组件

#### 带线条标题
```scss
.pubLineTitle {
  height: 100rpx;
  position: relative;
  padding: 0 30rpx;
  color: #333;
  font-size: 32rpx;
  line-height: 100rpx;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 5rpx;
    height: 30rpx;
    border-radius: 15rpx;
    background: #d7ab70;
  }
  
  .moreBtn {
    position: absolute;
    right: 30rpx;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
    font-size: 26rpx;
  }
}
```

#### 文件列表项
```scss
.file {
  position: relative;
  padding: 10rpx 80rpx 10rpx 90rpx;
  height: 80rpx;
  background: #ECEDF0;
  border-radius: 10rpx;
  overflow: hidden;
  margin-bottom: 10rpx;
  
  .cover {
    position: absolute;
    left: 0;
    top: 0;
    width: 80rpx;
    height: 80rpx;
    border-radius: 10rpx;
  }
  
  .name {
    height: 40rpx;
    color: #0F0F0F;
    font-size: 24rpx;
    line-height: 40rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  
  .size {
    height: 20rpx;
    color: #84878A;
    font-size: 18rpx;
    line-height: 20rpx;
  }
}
```

### 5. 分割线

#### 半像素底部细线
```scss
.pubBotLine {
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    background: #eaeaea;
    width: 100%;
    height: 1px;
    -webkit-transform: scaleY(0.5);
    -webkit-transform-origin: 0 bottom;
  }
}
```

#### 半像素顶部细线
```scss
.pubTopLine {
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    background: #eaeaea;
    width: 100%;
    height: 1px;
    -webkit-transform: scaleY(0.5);
    -webkit-transform-origin: 0 top;
  }
}
```

#### 半像素四周边框线
```scss
.pubLine {
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 200%;
    height: 200%;
    border: 2rpx solid #eaeaea;
    -webkit-transform: scale(0.5);
    -webkit-transform-origin: right top;
    box-sizing: border-box;
  }
}
```

### 6. 底部操作区

#### 共用底部按钮
```scss
.pubBotBtn {
  background: #fff;
  padding: 20rpx;
  display: flex;
  align-items: center;
  width: 100%;
  
  .wrap {
    display: flex;
    
    .btn {
      flex: 1;
      background: transparent !important;
      color: #000 !important;
      border-color: #fff !important;
      
      &::before {
        content: '';
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 1rpx;
        height: 50rpx;
        background: #ddd;
      }
      
      &:last-child {
        &::before {
          width: 0;
        }
      }
      
      &.blue {
        color: #1777ff !important;
      }
    }
  }
}
```

#### 底部操作栏
```scss
.pubBotHandle {
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 15rpx;
  
  .btn {
    flex-direction: column !important;
    padding: 0 20rpx !important;
    margin: 0 0 0 20rpx !important;
    color: #000 !important;
    font-size: 24rpx !important;
    line-height: 40rpx !important;
  }
}
```

---

## 📝 文字样式

### 1. 标题样式

#### 一级标题
```scss
.h1 {
  color: #000;
  font-size: 32rpx;
  font-weight: 600;
  letter-spacing: 2rpx;
}
```

#### 二级标题
```scss
.h2 {
  color: #222;
  font-size: 28rpx;
  font-weight: 500;
  line-height: 1.8;
}
```

#### 卡片标题
```scss
.card-title {
  font-weight: 500;
  font-size: 30rpx;
  color: #000;
}
```

### 2. 正文样式

#### 基础文字
```scss
.base-font {
  font-size: 28rpx;
  color: #000;
}
```

#### 描述文字
```scss
.font-desc {
  font-size: 26rpx;
  color: #666;
}
```

#### 辅助文字
```scss
.font-qs {
  font-size: 26rpx;
  color: #C6C6C6;
}
```

#### 最小文字
```scss
.min-font {
  font-size: 24rpx;
  color: #C6C6C6;
}
```

### 3. 特殊文字

#### 灰色文字
```scss
.grey {
  color: #999;
}
```

#### 蓝色文字
```scss
.blue {
  color: #3B7EFFFF;
}

.click-color {
  color: #3B7EFF;
}

.base-font-color {
  color: #3B7EFF !important;
}
```

### 4. 文本溢出处理

#### 单行省略
```scss
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

#### 两行省略
```scss
.ellipsis2 {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
```

---

## 🎯 布局规范

### 1. Flex 布局

#### 基础 Flex
```scss
.flex {
  display: flex;
  align-items: center;
}
```

#### 垂直 Flex
```scss
.flex-clm {
  flex-direction: column;
}
```

#### 两端对齐
```scss
.j-c {
  justify-content: space-between;
}

.js-b {
  justify-content: space-between;
}
```

#### 居中对齐
```scss
.j-c-c {
  justify-content: center;
}

.jc-c {
  justify-content: center;
}

.jc-c-c {
  align-items: center;
  justify-content: center;
}

.ai-c {
  align-items: center;
}
```

#### Flex 占比
```scss
.flex1 {
  flex: 1;
}
```

### 2. 内容区域

#### 通用内容区
```scss
.content {
  padding: 30rpx;
  box-sizing: border-box;
}
```

#### 搜索框
```scss
.searchBox {
  position: relative;
  width: 100%;
  padding: 20rpx 32rpx;
  margin: 0 auto;
  box-sizing: border-box;
  min-height: 80rpx;
}
```

### 3. 对齐方式

#### 文本居中
```scss
.text-center {
  text-align: center;
}
```

#### 左浮动
```scss
.pull-left {
  float: left;
}
```

#### 右浮动
```scss
.pull-right {
  float: right;
}
```

#### 清除浮动
```scss
.clearfix:after,
.clearfix:before {
  content: '';
  display: block;
  clear: both;
}
```

---

## 🎨 主题变量

### 1. uView 主题变量

#### 主色系统
```scss
$u-primary: #3c9cff;
$u-primary-dark: #398ade;
$u-primary-disabled: #9acafc;
$u-primary-light: #ecf5ff;
```

#### 警告色系统
```scss
$u-warning: #f9ae3d;
$u-warning-dark: #f1a532;
$u-warning-disabled: #f9d39b;
$u-warning-light: #fdf6ec;
```

#### 成功色系统
```scss
$u-success: #5ac725;
$u-success-dark: #53c21d;
$u-success-disabled: #a9e08f;
$u-success-light: #f5fff0;
```

#### 错误色系统
```scss
$u-error: #f56c6c;
$u-error-dark: #e45656;
$u-error-disabled: #f7b2b2;
$u-error-light: #fef0f0;
```

#### 信息色系统
```scss
$u-info: #909399;
$u-info-dark: #767a82;
$u-info-disabled: #c4c6c9;
$u-info-light: #f4f4f5;
```

#### 文字颜色
```scss
$u-main-color: #303133;
$u-content-color: #606266;
$u-tips-color: #909193;
$u-light-color: #c0c4cc;
$u-border-color: #dadbde;
$u-bg-color: #f3f4f6;
$u-disabled-color: #c8c9cc;
```

### 2. uni-app 内置变量

#### 行为相关颜色
```scss
$uni-color-primary: #007aff;
$uni-color-success: #4cd964;
$uni-color-warning: #f0ad4e;
$uni-color-error: #dd524d;
```

#### 文字基本颜色
```scss
$uni-text-color: #333;
$uni-text-color-inverse: #fff;
$uni-text-color-grey: #999;
$uni-text-color-placeholder: #808080;
$uni-text-color-disable: #c0c0c0;
```

#### 背景颜色
```scss
$uni-bg-color: #fff;
$uni-bg-color-grey: #f8f8f8;
$uni-bg-color-hover: #f1f1f1;
$uni-bg-color-mask: rgba(0, 0, 0, 0.4);
```

#### 边框颜色
```scss
$uni-border-color: #c8c7cc;
```

#### 文字尺寸
```scss
$uni-font-size-sm: 12px;
$uni-font-size-base: 14px;
$uni-font-size-lg: 16px;
```

#### 图片尺寸
```scss
$uni-img-size-sm: 20px;
$uni-img-size-base: 26px;
$uni-img-size-lg: 40px;
```

#### 圆角
```scss
$uni-border-radius-sm: 2px;
$uni-border-radius-base: 3px;
$uni-border-radius-lg: 6px;
$uni-border-radius-circle: 50%;
```

#### 水平间距
```scss
$uni-spacing-row-sm: 5px;
$uni-spacing-row-base: 10px;
$uni-spacing-row-lg: 15px;
```

#### 垂直间距
```scss
$uni-spacing-col-sm: 4px;
$uni-spacing-col-base: 8px;
$uni-spacing-col-lg: 12px;
```

---

## 📱 响应式设计

### 1. 安全区域适配

#### 底部安全区域
```scss
.safe-area-inset-bottom {
  padding-bottom: calc(constant(safe-area-inset-bottom));
  padding-bottom: calc(env(safe-area-inset-bottom));
}
```

#### 动态底部间距
```scss
@mixin x-padding-bottom($val: 0px) {
  padding-bottom: $val;
  padding-bottom: calc((#{$val} + constant(safe-area-inset-bottom)) / 2);
  padding-bottom: calc((#{$val} + env(safe-area-inset-bottom)) / 2);
}
```

#### 动态底部外边距
```scss
@mixin x-margin-bottom($val: 0px) {
  margin-bottom: $val;
  margin-bottom: calc(#{$val / 2} + constant(safe-area-inset-bottom));
  margin-bottom: calc(#{$val / 2} + env(safe-area-inset-bottom));
}
```

#### 动态高度
```scss
@mixin x-height-bottom($val: 0px) {
  height: calc(100vh - #{$val} - constant(safe-area-inset-bottom));
  height: calc(100vh - #{$val} - env(safe-area-inset-bottom));
}
```

### 2. 平台适配

#### 跨平台 Flex
```scss
@mixin flex($direction: row) {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: $direction;
}
```

---

## 🎭 交互状态

### 1. 点击态

#### 按钮点击
```scss
.btn {
  &:active {
    opacity: 0.8;
  }
}
```

#### 悬停效果
```scss
.active-hover {
  background-color: #f4f4f4;
  border-radius: 8rpx;
}
```

### 2. 禁用态

#### 禁用文字
```scss
.tag-plain-boder.dis {
  color: #999;
  background-color: #F8F8F8;
  border-color: #999;
}
```

#### 禁用透明度
```scss
$uni-opacity-disabled: 0.3;
```

### 3. 加载态

#### 空数据状态
```scss
.pubEmptyData {
  padding: 140rpx 0;
}
```

---

## 📊 样式工具类

### 1. 边距工具

#### 上边距
```scss
.m-t1 { margin-top: 10rpx; }
.m-t2 { margin-top: 20rpx; }
.m-t3 { margin-top: 30rpx; }
.m-t4 { margin-top: 40rpx; }
.m-t6 { margin-top: 60rpx; }
```

#### 右边距
```scss
.m-r1 { margin-right: 10rpx; }
.m-r2 { margin-right: 20rpx; }
.m-r3 { margin-right: 30rpx; }
```

### 2. 宽度工具

```scss
.width {
  width: 100%;
}
```

### 3. 相对定位

```scss
.relative {
  position: relative;
}
```

---

## 🎨 背景图片

### 1. 背景图片混入

```scss
@mixin background-image($val) {
  background-image: url(https://genepiapi.ypzlfx.com/file/eai/temp/#{$val});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
```

### 2. 渐变背景

```scss
@mixin gradient-background($val: right) {
  background: linear-gradient(to $val, #ffaa31 0%, #ec6e08 100%) !important;
}
```

---

## 📋 最佳实践

### 1. 样式编写规范

#### 使用 SCSS 预处理
```scss
// ✅ 推荐：使用 SCSS 变量和混入
.card {
  padding: $uni-spacing-row-lg;
  @include flex(row);
}

// ❌ 不推荐：硬编码数值
.card {
  padding: 15px;
  display: flex;
  flex-direction: row;
}
```

#### 命名规范
```scss
// ✅ 推荐：使用语义化命名
.user-card { }
.user-avatar { }
.user-name { }

// ❌ 不推荐：使用无意义命名
.box1 { }
.txt { }
```

### 2. 响应式适配

#### 使用 rpx 单位
```scss
// ✅ 推荐：使用 rpx 自动适配
.container {
  padding: 30rpx;
}

// ❌ 不推荐：使用 px 固定值
.container {
  padding: 15px;
}
```

#### 考虑安全区域
```scss
// ✅ 推荐：考虑底部安全区域
.footer {
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}
```

### 3. 性能优化

#### 避免过度嵌套
```scss
// ✅ 推荐：扁平化选择器
.card-title { }
.card-content { }

// ❌ 不推荐：过度嵌套
.card {
  .content {
    .title {
      .text { }
    }
  }
}
```

#### 复用公共样式
```scss
// ✅ 推荐：使用公共样式类
.title {
  @extend .h1;
}

// ❌ 不推荐：重复定义
.title {
  color: #000;
  font-size: 32rpx;
  font-weight: 600;
}
```

---

## 📚 相关文件

### 样式文件位置

| 文件 | 路径 | 用途 |
|------|------|------|
| 公共样式 | `src/static/styles/public.scss` | 全局公共样式 |
| 混入样式 | `src/static/styles/mixins.scss` | SCSS 混入定义 |
| 主题变量 | `src/uni_modules/uview-ui/theme.scss` | uView 主题变量 |
| 内置变量 | `src/uni.scss` | uni-app 内置变量 |
| 全局样式 | `src/App.vue` | 应用根组件样式 |

### 引用顺序

```scss
// 在 App.vue 或页面中
@import '@/uni_modules/uview-ui/index.scss';  // uView 组件库
@import '@/static/styles/public.scss';       // 公共样式
```

---

## 🤝 维护记录

- **创建日期**: 2026-06-01
- **文档版本**: 1.0.0
- **最后更新**: 2026-06-01

---

## 📞 设计资源

### 官方文档
- [uni-app 官方文档](https://uniapp.dcloud.io/)
- [uView UI 文档](https://www.uviewui.com/)
- [SCSS 官方文档](https://sass-lang.com/)

### 设计工具
- [Color Hunt - 配色方案](https://colorhunt.co/)
- [Coolors - 快速配色](https://coolors.co/)
- [Material Design Colors](https://materialui.co/colors)

---

## 📝 附录：常用样式速查

### 快速使用示例

```vue
<template>
  <view class="page">
    <!-- 卡片 -->
    <view class="base-block">
      <text class="h1">标题</text>
      <text class="font-desc">描述文字</text>
    </view>
    
    <!-- 按钮 -->
    <view class="d-flex j-c">
      <view class="btn-prev">上一步</view>
      <view class="btn-next">下一步</view>
    </view>
    
    <!-- 标签 -->
    <view class="tag-plain">标签</view>
    <view class="tag-plain-boder">边框标签</view>
  </view>
</template>

<style lang="scss">
.page {
  @include page();
  background: $u-bg-color;
  padding: 30rpx;
}
</style>
```
