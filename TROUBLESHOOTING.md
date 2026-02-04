# 🐛 问题诊断和修复指南

## 问题描述

如果您遇到以下问题：
1. ⏰ 时间一直显示"正在计算..."
2. 🔊 声音效果无法播放

## 诊断步骤

### 1. 打开浏览器控制台

按 `F12` 或右键点击页面选择"检查" → "Console"（控制台）标签

### 2. 查看日志输出

正常情况下，您应该看到类似这样的日志：

```
========================================
ovo 春节倒计时 - 二次元版 ovo
(✿◡‿◡) Made with OwO for iFlow 新春创造营 (✿◡‿◡)
========================================
DOM 元素检查:
- countdownText: ✓
- danmakuContainer: ✓
- danmakuInput: ✓
- sendBtn: ✓
启动倒计时，春节日期: 2026-02-17T00:00:00.000Z
准备启动倒计时...
倒计时已启动，interval ID: 1
========================================
初始化完成！
========================================
```

### 3. 检查错误信息

如果有任何错误信息，会以红色显示。常见错误：

#### 错误 1: "找不到倒计时元素 #countdownText"
**原因**: HTML 元素缺失或 ID 不匹配
**解决**: 确保 `index.html` 中有 `<div id="countdownText">` 元素

#### 错误 2: "音效初始化失败"
**原因**: 浏览器不支持 Web Audio API 或未启用
**解决**:
- 尝试使用现代浏览器（Chrome、Firefox、Edge）
- 检查浏览器是否禁用了音频

#### 错误 3: "音频上下文被暂停"
**原因**: 浏览器自动播放策略阻止了音频
**解决**: 点击页面任何位置激活音频

## 启用调试模式

在浏览器控制台中输入以下命令启用详细日志：

```javascript
// 启用倒计时调试
window.debugCountdown = true;

// 启用音效调试
window.debugSound = true;
```

## 手动测试功能

### 测试倒计时

在控制台中输入：

```javascript
// 手动更新倒计时
updateCountdown();

// 检查倒计时元素
document.getElementById('countdownText');
```

### 测试音频

在控制台中输入：

```javascript
// 初始化音频（如果还没初始化）
initAudio();

// 播放测试音效
playSound('button');
playSound('send');
```

### 检查配置

```javascript
// 查看当前配置
console.log(CONFIG);

// 检查音效是否启用
console.log('音效启用:', CONFIG.soundEnabled);
```

## 常见解决方案

### 方案 1: 清除浏览器缓存

1. 按 `Ctrl + Shift + Delete`
2. 选择"缓存的图像和文件"
3. 点击"清除数据"
4. 刷新页面（`Ctrl + F5`）

### 方案 2: 使用隐私模式

1. 打开浏览器的隐私/无痕模式
2. 访问页面
3. 查看是否正常工作

### 方案 3: 检查文件完整性

确保以下文件存在且没有错误：

```
新建文件夹/
├── index.html
├── style.css
├── script.js
└── 【哲风壁纸】傍晚路灯-山脉-水面.png
```

### 方案 4: 通过本地服务器运行（推荐）

直接双击 HTML 文件可能因为 CORS 策略导致某些功能受限。建议使用本地服务器：

#### 方法 A: 使用 Python

```bash
# Python 3
cd "C:\Users\15579\Desktop\新建文件夹"
python -m http.server 8000

# 然后在浏览器访问
# http://localhost:8000
```

#### 方法 B: 使用 Node.js

```bash
# 安装 http-server（如果还没安装）
npm install -g http-server

# 运行服务器
cd "C:\Users\15579\Desktop\新建文件夹"
http-server -p 8000

# 然后在浏览器访问
# http://localhost:8000
```

#### 方法 C: 使用 VS Code Live Server

1. 安装 VS Code
2. 安装 "Live Server" 扩展
3. 右键点击 `index.html`
4. 选择 "Open with Live Server"

## 联系支持

如果以上方法都无法解决问题，请：

1. 截图浏览器控制台的完整日志
2. 记录您使用的浏览器和版本
3. 描述具体的错误现象

然后提交 Issue 或联系开发者。

---

**提示**: 大多数情况下，清除缓存并刷新页面即可解决问题！
