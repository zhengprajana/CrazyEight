# 疯狂 8 点 (Crazy Eights) - 部署指南

这是一个使用 React + Vite + Tailwind CSS 构建的精品纸牌游戏。

## 如何部署到 GitHub 和 Vercel

### 第一步：同步到 GitHub
1. 在 GitHub 上创建一个新的仓库（不要初始化 README）。
2. 在本地终端执行以下命令：
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Crazy Eights Game"
   git branch -M main
   git remote add origin https://github.com/您的用户名/仓库名.git
   git push -u origin main
   ```

### 第二步：部署到 Vercel
1. 登录 [Vercel 官网](https://vercel.com/)。
2. 点击 **"Add New"** -> **"Project"**。
3. 导入您刚刚创建的 GitHub 仓库。
4. **关键步骤：配置环境变量**
   - 在部署设置的 "Environment Variables" 部分，添加以下变量：
     - `GEMINI_API_KEY`: 您的 Google Gemini API 密钥。
5. 点击 **"Deploy"**。

## 技术栈
- **前端**: React 19
- **动画**: Motion (framer-motion)
- **样式**: Tailwind CSS 4
- **图标**: Lucide React
- **构建工具**: Vite

## 环境变量说明
本应用在构建时会读取 `GEMINI_API_KEY`。如果您在 Vercel 上部署，请务必在 Vercel 控制面板中设置该变量，否则涉及 AI 的功能可能无法正常工作。
