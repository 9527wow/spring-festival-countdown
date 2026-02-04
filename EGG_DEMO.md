# 🎉 倒计时彩蛋功能演示

## 📺 功能预览

### 场景一：1天倒计时彩蛋

**时间**: 距离春节还有 1天 0小时 0分 0秒

**触发效果**:

1. 🎇 全屏庆祝脉冲动画（每3秒循环）
2. 📢 金色Toast通知："距离春节还有1天！马年即将到来！🐴"
3. 🎆 15条烟花弹幕连续发送（每800ms一条）
4. 🎇 3秒后触发完整烟花秀
5. 🔔 庆祝音效播放

**弹幕内容**:

```
🎊 明天就是春节啦！ovo
🐴 马年最后一天！OwO
(✿◡‿◡) 跨年倒计时！24小时！(✿◡‿◡)
🎆 准备迎接马年！一码当先！🎆
(｡♥‿♥｡) 新年快乐！倒计时1天！(｡♥‿♥｡)
```

---

### 场景二：最后一分钟倒计时

**时间**: 距离春节还有 0天 0小时 0分 59秒（及更少）

**触发效果**:

1. 💓 倒计时容器心跳脉冲（每1秒循环）
2. 📊 数字放大到1.3倍 + 发光效果
3. 🔴 边框红色闪烁 + 4px光晕
4. 📢 橙红色Toast："最后1分钟！准备迎接春节！🎊"
5. 🎯 每秒数字都有跳动动画
6. 🔔 提示音效

---

## 🎬 动画详情

### 1天彩蛋动画

#### 全屏庆祝动画

```css
animation: body-celebration 3s ease-in-out infinite;
```

- 亮度：1.0 → 1.1 → 1.0
- 饱和度：1.0 → 1.2 → 1.0
- 周期：3秒

#### Toast 脉冲

```css
animation: toast-celebration-pulse 2s ease-in-out infinite;
```

- 缩放：1.0 → 1.05 → 1.0
- 阴影：动态变化
- 颜色：金色渐变 (#FFD700 → #FFA500)

---

### 最后一分钟动画

#### 容器心跳脉冲

```css
animation: urgent-pulse 1s ease-in-out infinite;
```

- 缩放：1.0 → 1.02 → 1.0
- 周期：1秒

#### 数字放大发光

```css
animation: final-number-pulse 1s ease-in-out infinite;
```

- 缩放：1.0 → 1.3 → 1.0
- 颜色：默认 → #FF6B6B → 默认
- 阴影：0 0 10px → 0 0 30px + 0 0 40px

#### 紧急边框

```css
animation: border-urgent 0.8s ease-in-out infinite;
```

- 颜色：渐变 → #FF6B6B → 渐变
- 光晕：4px rgba(255, 107, 107, 0.3)
- 缩放：1.0 → 1.02 → 1.0

---

## 🧪 快速测试

### 步骤1：打开页面

双击 `index.html` 或使用开发服务器：

```bash
npm run dev
```

### 步骤2：打开控制台

按 `F12` 打开开发者工具，切换到 Console 标签

### 步骤3：执行测试命令

```javascript
// 测试1天彩蛋
testOneDayEgg();

// 测试最后一分钟彩蛋
testLastMinuteEgg();

// 模拟到1天前
simulateCountdown(1, 0, 0, 0);

// 模拟到最后一分钟
simulateCountdown(0, 0, 0, 59);

// 模拟到30秒
simulateCountdown(0, 0, 0, 30);
```

---

## 📊 时间线演示

```
倒计时: 1天 0小时 0分钟 0秒
  ↓
🎊 触发1天彩蛋！
  ↓
  ├─ 全屏庆祝动画开始
  ├─ 金色Toast通知显示
  ├─ 15条烟花弹幕开始（每0.8秒一条）
  └─ 3秒后触发烟花秀

倒计时: 0天 0小时 0分钟 59秒
  ↓
⏰ 进入最后一分钟！
  ↓
  ├─ 容器心跳脉冲启动
  ├─ 数字放大发光
  ├─ 边框红色闪烁
  ├─ Toast提示显示
  └─ 提示弹幕发送

倒计时: 0天 0小时 0分钟 0秒
  ↓
🎊 春节到啦！
  ↓
  ├─ 停止倒计时
  ├─ 显示新年祝福
  ├─ 彩蛋弹幕雨
  └─ 庆祝音效
```

---

## 🎨 配色方案

### 1天彩蛋配色

- **主色**: 金色 #FFD700
- **辅色**: 橙色 #FFA500
- **强调色**: 橙红 #FF6B00

### 最后一分钟配色

- **主色**: 红色 #FF6B6B
- **辅色**: 橙色 #FFA500
- **警告色**: 深红 #FF4500

---

## 💡 技术亮点

### 1. 智能时间检测

```javascript
// 每秒检测一次，不浪费性能
if (days === 1 && hours === 0 && !oneDayEggTriggered) {
  triggerOneDayEgg();
}
```

### 2. 状态管理

```javascript
// 防止重复触发
let oneDayEggTriggered = false;
let isLastMinute = false;

// 进入/退出最后一分钟时动态切换
if (lastMinute && !isLastMinute) {
  isLastMinute = true;
  triggerLastMinuteAnimation();
} else if (!lastMinute && isLastMinute) {
  isLastMinute = false;
  removeLastMinuteAnimation();
}
```

### 3. CSS 性能优化

- 使用 `transform` 而非 `width/height`
- 使用 `will-change` 提示浏览器优化
- 合理的动画时长（0.8s - 3s）
- 避免同时运行过多动画

---

## 🐛 常见问题

### Q1: 如何关闭动画？

A: 可以在浏览器控制台执行：

```javascript
// 移除最后一分钟动画
removeLastMinuteAnimation();

// 重置彩蛋状态
oneDayEggTriggered = false;
isLastMinute = false;
```

### Q2: 动画太卡顿怎么办？

A:

1. 关闭其他浏览器标签
2. 降低 `simulateCountdown` 测试频率
3. 检查浏览器是否支持硬件加速

### Q3: 如何自定义彩蛋消息？

A: 编辑 `script.js` 第577-581行：

```javascript
const oneDayMessages = [
  "你的自定义消息1",
  "你的自定义消息2",
  // ...
];
```

---

## 🎯 延伸功能建议

### 可添加的功能：

1. **倒计时时彩蛋**
   - 倒计时1小时彩蛋
   - 倒计时10分钟彩蛋
   - 倒计时10秒彩蛋

2. **自定义触发时间**
   - 允许用户设置彩蛋触发时间
   - 支持多个自定义彩蛋

3. **彩蛋开关**
   - 添加设置面板控制彩蛋
   - 允许用户关闭某些彩蛋

4. **统计功能**
   - 记录彩蛋触发次数
   - 统计用户互动数据

---

**享受倒计时的最后时刻，迎接马年到来！🐴🎊**
