# 🚀 创建新GitHub仓库指南

## 步骤1：在GitHub上创建新仓库

### 1.1 访问GitHub

打开浏览器，访问：https://github.com/new

### 1.2 填写仓库信息

**Repository name** (仓库名称):

- 建议使用英文名称，例如：
  - `spring-festival-countdown`
  - `chinese-new-year-countdown`
  - `anime-countdown-2026`

**Description** (描述):

```
🌸 春节倒计时 - 二次元版
🎆 马年春节倒计时应用，包含实时弹幕、多主题切换、倒计时彩蛋等功能
✨ 采用二次元风格设计，支持5种精美主题
💾 本地数据持久化，完整模块化架构
```

**可见性设置**:

- ☑️ Public (公开) - 推荐
- ⬜ Private (私有)

**初始化设置**:

- ❌ **不要**勾选 "Add a README file"（我们已有README.md）
- ❌ **不要**勾选 "Add .gitignore"（我们已有.gitignore）
- ❌ **不要**勾选 "Choose a license"（可以稍后添加）

### 1.3 点击 "Create repository" 创建仓库

---

## 步骤2：连接本地仓库到新的GitHub仓库

### 2.1 删除旧的远程仓库连接

在项目目录打开终端/命令行：

```bash
cd "C:\Users\15579\Desktop\新建文件夹"
git remote remove origin
```

### 2.2 添加新的远程仓库

**⚠️ 重要**: 将下面的 `YOUR_USERNAME` 替换为你的GitHub用户名！

```bash
# 替换 YOUR_USERNAME 为你的GitHub用户名
git remote add origin https://github.com/YOUR_USERNAME/spring-festival-countdown.git
```

**示例**:

```bash
# 如果你的用户名是 9527wow
git remote add origin https://github.com/9527wow/spring-festival-countdown.git
```

### 2.3 验证远程仓库连接

```bash
git remote -v
```

应该显示：

```
origin  https://github.com/YOUR_USERNAME/spring-festival-countdown.git (fetch)
origin  https://github.com/YOUR_USERNAME/spring-festival-countdown.git (push)
```

---

## 步骤3：推送代码到新仓库

### 3.1 推送主分支

```bash
git push -u origin master
```

**参数说明**:

- `-u` : 设置上游分支，首次推送时需要
- `origin` : 远程仓库名称
- `master` : 分支名称

### 3.2 等待推送完成

成功后会显示：

```
Branch 'master' set up to track remote branch 'master' from 'origin'.
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
Writing objects: 100% (XX/XX), done.
```

---

## 🎯 完成后的操作

### 访问你的新仓库

仓库创建成功后，URL为：

```
https://github.com/YOUR_USERNAME/spring-festival-countdown
```

### 可选：配置GitHub Pages

如果你想在公网访问你的倒计时应用：

1. **进入仓库的 Settings 页面**

2. **左侧菜单找到 "Pages"**

3. **Source**: 选择 `Deploy from a branch`

4. **Branch**: 选择 `master` (或 `main`)

5. **点击 "Save"**

6. **等待几分钟**，GitHub Pages会生成访问地址：
   ```
   https://YOUR_USERNAME.github.io/spring-festival-countdown/
   ```

---

## 🔧 常见问题

### Q1: 忘记了GitHub密码怎么办？

A: 使用 Personal Access Token（推荐）：

1. GitHub → Settings → Developer settings
   2 → Personal access tokens → Tokens (classic)
   3 → Generate new token
   4 → 勾选 `repo` 权限
   5 → 生成并保存token
2. 推送时使用token作为密码

### Q2: 推送失败提示 "Authentication failed"？

A:

1. 检查用户名和密码/token是否正确
2. 尝试使用 HTTPS 方式：
   ```bash
   git remote set-url origin https://github.com/YOUR_USERNAME/spring-festival-countdown.git
   ```

### Q3: 仓库名称可以修改吗？

A: 可以！先在GitHub创建仓库，然后：

```bash
# 修改远程仓库地址
git remote set-url origin https://github.com/YOUR_USERNAME/new-repo-name.git
```

---

## 📋 推荐的仓库配置

### 仓库名称建议（选一个）

**选项1**: `spring-festival-countdown` （推荐）
**选项2**: `chinese-new-year-countdown`
**选项3**: `anime-countdown-2026`
**选项4**: `马年春节倒计时`

### 仓库描述模板

```
🌸 春节倒计时 - 二次元版 | Spring Festival Countdown - Anime Style

✨ 功能特点：
- 精确的倒计时显示（天/时/分/秒）
- 实时弹幕系统，支持自定义和自动弹幕
- 5种精美主题：默认粉蓝、赛博朋克、古风雅韵、樱花纷飞、深海幽蓝
- 倒计时彩蛋：1天彩蛋、最后1分钟心跳脉冲动画
- 数据持久化：用户设置和弹幕历史自动保存
- 本地化运行：无需后端，纯前端实现

🎨 技术栈：
- HTML5 + CSS3 + JavaScript (ES6+)
- 模块化架构
- Vite + Vitest
- ESLint + Prettier

🐴 2026 马年春节 | Made with ❤️ for iFlow CLI
```

---

## ⚡ 快速命令参考

```bash
# 1. 删除旧远程仓库
git remote remove origin

# 2. 添加新远程仓库（替换YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/spring-festival-countdown.git

# 3. 验证连接
git remote -v

# 4. 推送代码
git push -u origin master

# 5. 查看状态
git status

# 6. 查看远程信息
git remote show origin
```

---

准备好后告诉我，我会帮你完成后续操作！🚀
