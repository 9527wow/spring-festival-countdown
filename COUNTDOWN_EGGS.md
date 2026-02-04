# 🎉 倒计时彩蛋功能说明

## 新增功能

### 1. 🎊 1天倒计时彩蛋

当倒计时进入最后1天（24小时）时，系统会自动触发：

**视觉效果：**

- 全屏庆祝动画（亮度/饱和度脉冲效果）
- 金色主题的 Toast 通知
- 连续15条烟花弹幕
- 完整的烟花秀表演
- 特殊音效播放

**触发条件：**

```javascript
days === 1 && hours === 0;
```

**彩蛋消息：**

```
🎊 明天就是春节啦！ovo
🐴 马年最后一天！OwO
(✿◡‿◡) 跨年倒计时！24小时！(✿◡‿◡)
🎆 准备迎接马年！一码当先！🎆
(｡♥‿♥｡) 新年快乐！倒计时1天！(｡♥‿♥｡)
```

---

### 2. ⏰ 最后一分钟倒计时

当倒计时进入最后1分钟（59秒内）时，系统会自动进入"冲刺模式"：

**视觉效果：**

- 倒计时容器心跳脉冲动画
- 倒计时数字放大发光效果
- 边框紧急红色闪烁动画
- 橙红色主题的 Toast 通知
- 每秒数字都有缩放跳动效果

**触发条件：**

```javascript
days === 0 && hours === 0 && minutes === 0 && seconds <= 59;
```

**动画特点：**

- 整体容器：1秒周期的心跳脉冲
- 数字：1.3倍放大 + 红色 + 发光阴影
- 边框：红色闪烁 + 4px 光晕
- Toast：橙红渐变 + 摇晃进入动画

---

## 🧪 测试功能

### 方法一：控制台测试

打开浏览器控制台（F12），输入以下命令：

```javascript
// 测试1天彩蛋
testOneDayEgg();

// 测试最后一分钟彩蛋
testLastMinuteEgg();

// 模拟倒计时到指定时间
simulateCountdown(1, 0, 0, 0); // 1天0时0分0秒
simulateCountdown(0, 0, 0, 59); // 0天0时0分59秒
simulateCountdown(0, 0, 1, 0); // 0天0时1分0秒
```

### 方法二：修改配置测试

在 `script.js` 或 `src/utils/config.js` 中修改春节日期：

```javascript
// 测试1天彩蛋
const CONFIG = {
  springFestival: new Date(Date.now() + 24 * 60 * 60 * 1000), // 明天
  // ... 其他配置
};

// 测试最后一分钟
const CONFIG = {
  springFestival: new Date(Date.now() + 60 * 1000), // 1分钟后
  // ... 其他配置
};
```

---

## 📋 完整时间线

| 倒计时     | 触发的彩蛋                          |
| ---------- | ----------------------------------- |
| 1天0时0分  | 🎊 1天彩蛋（15条烟花弹幕 + 烟花秀） |
| 0天0时59分 | ⏰ 最后一分钟动画启动               |
| 0天0时30分 | ⏰ 最后一分钟动画持续               |
| 0天0时1分  | ⏰ 最后一分钟动画持续               |
| 0天0时0分  | 🎊 春节到啦！新年祝福               |

---

## 🎨 动画效果详解

### 1天彩蛋动画

```css
/* 全屏庆祝效果 */
.countdown-one-day-egg {
  animation: body-celebration 3s ease-in-out infinite;
}

/* Toast 脉冲 */
.toast-countdown-egg {
  background: linear-gradient(135deg, #ffd700, #ffa500);
  animation: toast-celebration-pulse 2s ease-in-out infinite;
}
```

### 最后一分钟动画

```css
/* 容器心跳脉冲 */
.last-minute-countdown {
  animation: urgent-pulse 1s ease-in-out infinite;
}

/* 数字放大发光 */
.final-countdown-pulse .countdown-number {
  animation: final-number-pulse 1s ease-in-out infinite;
  /* 放大到 1.3 倍，红色，发光阴影 */
}

/* 紧急边框 */
.urgent-border {
  animation: border-urgent 0.8s ease-in-out infinite;
  border-color: #ff6b6b;
  box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.3);
}
```

---

## 🔧 自定义配置

### 修改彩蛋消息

在 `script.js` 的 `triggerOneDayEgg()` 函数中修改：

```javascript
const oneDayMessages = [
  "🎊 明天就是春节啦！ovo",
  "🐴 马年最后一天！OwO",
  // 添加你的自定义消息...
];
```

### 修改动画参数

在 `style.css` 中修改动画时长和效果：

```css
/* 修改脉冲速度 */
.urgent-border {
  animation: border-urgent 0.8s ease-in-out infinite; /* 改为其他值 */
}

/* 修改数字放大倍数 */
@keyframes final-number-pulse {
  50% {
    transform: scale(1.3); /* 改为 1.5 或其他值 */
  }
}
```

---

## 💡 实现原理

### 时间检测逻辑

```javascript
// 每秒检测一次
setInterval(() => {
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // 检测1天彩蛋
  if (days === 1 && hours === 0 && !oneDayEggTriggered) {
    triggerOneDayEgg();
  }

  // 检测最后一分钟
  const lastMinute = days === 0 && hours === 0 && minutes === 0 && seconds <= 59;
  if (lastMinute && !isLastMinute) {
    triggerLastMinuteAnimation();
  }
}, 1000);
```

### 状态管理

使用布尔变量防止重复触发：

```javascript
let oneDayEggTriggered = false; // 1天彩蛋只触发一次
let oneMinuteEggTriggered = false; // 1分钟彩蛋只触发一次
let isLastMinute = false; // 跟踪是否在最后一分钟
```

---

## 🎯 最佳实践

### 1. 避免过度动画

最后一分钟的动画比较强烈，建议：

- 不要同时运行多个强动画
- 考虑添加"关闭动画"选项

### 2. 性能优化

已经实现的优化：

- ✅ 使用 CSS 动画而非 JS 动画
- ✅ 使用 `transform` 而非 `width/height`
- ✅ 使用 `will-change` 提示浏览器
- ✅ 最后分钟才启用强动画

### 3. 用户体验

- ✅ 显示 Toast 通知，不会突兀
- ✅ 动画平滑过渡，不闪烁
- ✅ 提供测试函数方便调试

---

## 🐛 已知限制

1. **精确时间**: 依赖于系统时间，确保设备时间准确
2. **时区问题**: 所有时间计算都基于本地时区
3. **浏览器支持**: 需要支持 CSS 动画的现代浏览器

---

## 📝 更新日志

- **v2.1.0** (2026-02-04)
  - ✅ 新增1天倒计时彩蛋
  - ✅ 新增最后一分钟动画效果
  - ✅ 添加测试函数
  - ✅ 完整文档说明

---

**享受倒计时的最后时刻！🎊🐴**
