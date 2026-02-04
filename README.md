# 🌸 春节倒计时 - 二次元版 v2.0 🌸

> iFlow CLI 新春创造营作品 - 采用二次元风格的春节倒计时应用，带有实时弹幕功能

**v2.1 重大更新**：全面重构，模块化架构，新增主题系统、本地存储、性能优化、倒计时彩蛋等功能！

## 📖 项目介绍

这是一个全新的春节倒计时应用，摒弃了传统的红黄配色，采用符合00后审美的二次元风格设计。应用包含动态倒计时、实时弹幕系统、多主题支持和丰富的二次元UI元素。

### ✨ v2.1 新功能

- **🎊 倒计时彩蛋系统**：
  - **1天倒计时彩蛋**：最后24小时触发盛大烟花弹幕秀
  - **最后1分钟动画**：心跳脉冲、数字放大发光、紧急边框闪烁
- **🎨 多主题系统**：5种精美主题（默认粉蓝、赛博朋克、古风雅韵、樱花纷飞、深海幽蓝）
- **💾 数据持久化**：用户设置、弹幕历史自动保存
- **⚡ 性能优化**：弹幕对象池、DOM操作优化、IntersectionObserver
- **🔧 模块化架构**：清晰的代码结构，易于维护和扩展
- **✅ 完整测试**：Vitest 单元测试，确保代码质量
- **🛡️ 安全增强**：修复 XSS 漏洞，所有用户输入都经过转义
- **📝 完整文档**：JSDoc 类型注释，完善的 API 文档

### ✨ 核心功能

- **🎯 精确倒计时**：实时显示倒计时，格式为"12天 3小时 23分钟 12秒"
- **🎊 智能彩蛋**：
  - 1天倒计时 → 15条烟花弹幕 + 烟花秀
  - 1分钟倒计时 → 心跳脉冲 + 数字放大 + 边框闪烁
- **🖼️ 壁纸背景**：使用"傍晚路灯-山脉-水面"壁纸，营造唯美氛围
- **🌫️ 高斯模糊**：背景智能模糊，确保倒计时内容清晰可读
- **💬 弹幕系统**：支持发送自定义弹幕，实时飘动效果
- **🎨 二次元风格**：柔和的粉蓝配色，星星装饰，樱花元素
- **⚡ 动画效果**：标题跳动、文字渐变、按钮悬停等多种动画
- **🎌 快捷祝福**：预设多种春节祝福语，一键发送
- **🌟 自动弹幕**：系统自动发送随机祝福弹幕，营造节日氛围
- **📱 响应式设计**：完美适配桌面和移动设备

## 🏗️ 项目结构

```
spring-festival-countdown/
├── src/                      # 源代码目录
│   ├── core/                 # 核心功能模块
│   │   ├── audio.js          # 音效管理
│   │   ├── countdown.js      # 倒计时核心
│   │   └── danmaku.js        # 弹幕系统
│   ├── ui/                   # UI 组件
│   │   ├── toast.js          # Toast 通知
│   │   └── themeSelector.js  # 主题选择器
│   └── utils/                # 工具模块
│       ├── config.js         # 配置管理
│       ├── helpers.js        # 辅助函数
│       ├── storage.js        # 本地存储
│       ├── danmakuPool.js    # 弹幕对象池
│       └── themes.js         # 主题系统
├── tests/                    # 测试文件
│   ├── setup.js             # 测试配置
│   ├── helpers.test.js      # 工具函数测试
│   └── storage.test.js      # 存储测试
├── index.html               # 入口 HTML
├── style.css                # 样式文件
├── package.json             # 项目配置
├── vite.config.js           # Vite 配置
├── vitest.config.js         # Vitest 配置
├── jsconfig.json            # JS 配置
├── eslint.config.js         # ESLint 配置
└── .prettierrc              # Prettier 配置
```

## 🎮 使用方法

### 开发模式

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 在浏览器中打开 http://localhost:3000
```

### 生产构建

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 代码质量

```bash
# 运行 ESLint
npm run lint

# 自动修复 ESLint 问题
npm run lint:fix

# 格式化代码
npm run format

# 运行测试
npm test

# 运行测试 UI
npm run test:ui
```

## 🎨 主题系统

### 可用主题

| 主题 ID     | 名称     | 描述                           |
| ----------- | -------- | ------------------------------ |
| `default`   | 默认粉蓝 | 柔和的粉蓝配色，经典二次元风格 |
| `cyberpunk` | 赛博朋克 | 霓虹灯效果，未来科技感         |
| `ancient`   | 古风雅韵 | 传统中国风，典雅水墨           |
| `sakura`    | 樱花纷飞 | 樱花主题，浪漫唯美             |
| `ocean`     | 深海幽蓝 | 深蓝配色，宁静深邃             |

### 切换主题

- **UI 切换**：点击右下角主题按钮 🎨
- **快捷键**：
  - `Alt + 1-5`：快速切换到对应主题
  - `Alt + T`：循环切换主题

## 📦 模块说明

### 核心模块

#### `core/countdown.js`

倒计时核心功能

- `startCountdown()` - 启动倒计时
- `stopCountdown()` - 停止倒计时
- `getCountdown()` - 获取当前倒计时值

#### `core/danmaku.js`

弹幕系统

- `createDanmaku(text, isAuto, specialType)` - 创建弹幕
- `sendDanmaku(text)` - 发送弹幕
- `startAutoDanmaku()` - 启动自动弹幕
- `triggerFireworkShow()` - 触发烟花弹幕

#### `core/audio.js`

音效管理

- `initAudio()` - 初始化音频系统
- `playSound(type)` - 播放音效
- `suspendAudio()` / `resumeAudio()` - 暂停/恢复音频

### UI 组件

#### `ui/toast.js`

Toast 通知系统

- `toast.show(message, type, duration)` - 显示通知
- `toast.hide(toast)` - 隐藏通知

#### `ui/themeSelector.js`

主题选择器

- `createThemeSelector()` - 创建主题选择器
- `initThemeSelector()` - 初始化主题选择器

### 工具模块

#### `utils/helpers.js`

辅助函数

- `throttle(func, limit)` - 节流
- `debounce(func, wait)` - 防抖
- `escapeHtml(text)` - HTML 转义
- `randomItem(array)` - 随机数组元素

#### `utils/storage.js`

本地存储管理

- `SettingsManager` - 用户设置管理
- `DanmakuHistoryManager` - 弹幕历史管理

#### `utils/themes.js`

主题系统

- `ThemeManager` - 主题管理器
- `THEMES` - 主题配置

#### `utils/danmakuPool.js`

弹幕对象池（性能优化）

- `DanmakuPool` - 对象池类
- `createPooledDanmaku()` - 使用对象池创建弹幕

## 🔧 配置说明

### 用户设置

用户设置保存在 `localStorage` 中，包含以下配置：

```javascript
{
  soundEnabled: true,        // 是否启用音效
  soundVolume: 0.3,         // 音量（0-1）
  danmakuSpeed: 15000,      // 弹幕速度
  danmakuInterval: 2000,    // 自动弹幕间隔
  maxDanmakuOnScreen: 15,   // 屏幕最大弹幕数
  mouseFollowEnabled: false,// 鼠标跟随效果
  theme: 'default'          // 当前主题
}
```

### 修改默认配置

编辑 `src/utils/config.js` 文件：

```javascript
export const DEFAULT_CONFIG = {
  springFestival: new Date("2026-02-17T00:00:00"),
  danmakuSpeed: 15000,
  danmakuInterval: 2000,
  // ... 更多配置
};
```

## 🧪 测试

项目使用 Vitest 进行单元测试。

```bash
# 运行所有测试
npm test

# 监听模式
npm test -- --watch

# 覆盖率报告
npm test -- --coverage
```

## 🎯 键盘快捷键

| 快捷键         | 功能         |
| -------------- | ------------ |
| `Enter`        | 发送弹幕     |
| `Esc`          | 清空输入框   |
| `Ctrl + Enter` | 发送特殊弹幕 |
| `Alt + F`      | 触发烟花秀   |
| `Alt + S`      | 切换音效开关 |
| `Alt + 1-5`    | 切换主题     |
| `Alt + T`      | 循环切换主题 |

## 🚀 部署

### 在线部署

可以部署到以下平台：

- **GitHub Pages**

  ```bash
  npm run build
  # 将 dist 目录推送到 gh-pages 分支
  ```

- **Vercel**

  ```bash
  npm run build
  vercel --prod
  ```

- **Netlify**
  ```bash
  npm run build
  # 将 dist 目录部署到 Netlify
  ```

## 📝 开发指南

### 添加新主题

在 `src/utils/themes.js` 中添加：

```javascript
export const THEMES = {
  // ... 现有主题
  myTheme: {
    name: "我的主题",
    description: "主题描述",
    colors: {
      primaryPink: "#...",
      // ... 其他颜色
    },
    gradient: "linear-gradient(...)",
    background: "...",
  },
};
```

### 添加新的弹幕样式

1. 在 `style.css` 中添加样式类
2. 在 `src/core/danmaku.js` 的 `styles` 数组中添加样式名

### 调试技巧

```javascript
// 在浏览器控制台中访问配置
window.DanmakuConfig;

// 查看弹幕对象池状态
import { getDanmakuPool } from "./src/utils/danmakuPool.js";
getDanmakuPool().getStatus();
```

## 🐛 已知问题

- 首次访问需要用户交互才能启用音效（浏览器限制）
- 移动端 Safari 可能存在动画性能问题
- 某些旧版浏览器不支持 ES2022 特性

## 🔮 未来计划

- [ ] 添加后端同步弹幕功能
- [ ] 支持自定义上传背景图
- [ ] 添加更多主题和动画效果
- [ ] 支持多语言（英文、日文）
- [ ] PWA 离线支持
- [ ] 添加音效库（多种音效选择）

## 📄 开源协议

MIT License

## 🙏 致谢

- iFlow 平台提供的新春创造营活动
- 所有参与测试的朋友们
- 开源社区的灵感和支持

---

**作者**：iFlow CLI 用户
**活动**：iFlow 2026 新春创造营
**版本**：v2.0.0
**时间**：2026年1月30日 - 2月10日

**祝大家春节快乐，马年到，一码当先！🐴**
