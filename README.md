# 🚀 BetterExam - 沉浸式高级刷题神器

BetterExam 是一个专为追求极致体验的学习者打造的**现代化全栈刷题与查阅系统**。
本项目打破了传统刷题软件枯燥、死板的排版，引入了极其华丽的“暗黑毛玻璃”美学，并完美复刻了专业级机考系统（如雅思、托福官方模考）的交互逻辑，旨在让刷题变成一种流畅的享受。

---

## ✨ 核心特性 (Features)

### 🎨 1. 殿堂级 UI 美学
- **玻璃拟物化 (Glassmorphism)**：全局深邃的渐变背景与半透明玻璃卡片交相辉映，减少视觉疲劳，尽显高级质感。
- **高对比度护眼表格**：针对试题中复杂的 HTML 表格进行了全局定制，增加了浅蓝边框、深色表头高亮以及斑马交替纹理，保证了极佳的可读性。
- <img width="1280" height="800" alt="{B15F786D-9CCC-404E-BC96-C956729C06B4}" src="https://github.com/user-attachments/assets/85aa2a17-3ace-4a78-81a4-d5be85476186" />


### 🪟 2. 专业级智能分屏 (Split-pane Sticky)
- **左题干右题目**：在处理带有大段背景材料（如阅读理解、大型图表综合题）的试卷时，支持一键开启分屏。
- **智能吸附 (Sticky)**：在长列表模式下，左侧的背景题干会**智能吸附**在屏幕一侧。随着你往下滚动解答右侧的小题，左侧大题干纹丝不动，彻底告别来回上下翻页的痛苦。
-

### 📜 3. 双轨制刷题系统
提供两种完全不同的沉浸式刷题排版，随时无缝切换：
- **单题卡片模式 (Card Mode)**：专注眼前一道题。底部配有丝滑的快捷翻页控制条，沉浸感拉满。
- **长列表全景模式 (List Mode)**：像长卷轴一样展示所有题目。配合右侧强大的“直升机导航条”，提供：
  - ⬆️ 一键回到顶部 / ⬇️ 一键滑到底部
  - ⏩ **自动巡航**：智能定位并飞跃到“第一个未作答”的题目位置。
  <img width="1280" height="800" alt="{E65AFCC6-2BEB-49C1-B59B-631460E67FEC}" src="https://github.com/user-attachments/assets/1177cf63-adc2-48cd-be3a-8789078c2f98" />

### 👁️ 4. 尊享查阅模式 (Browse Mode)
不仅能用来考试，还可以作为极佳的学习资料浏览器：
- 支持**一键隐藏/显示全卷答案**。
- 支持单题独立切换答案显示状态。
- 如果忘了大题的背景材料？只需点击小题旁边的“回到题干”快捷门，页面平滑上移，瞬间带你回顾。
 <img width="1280" height="800" alt="{CF3E7400-35B1-4285-8809-5E9EC0F201ED}" src="https://github.com/user-attachments/assets/7245f1f9-5a8c-4974-9a69-49ff39f64153" />


### 📊 5. 错题本与个人知识库
- **智能纠错记录**：考卷提交后，所有选错的题目会自动无感地收录进「错题本」，方便考前突击重温。
- **一键收藏**：无论是在刷题还是查阅，点击题目右上角的“⭐”，即可将其永久珍藏至「收藏夹」。
- **历史战绩**：所有的交卷成绩和答题记录都会保存在历史面板中，见证你的每一次进步。
<img width="1280" height="800" alt="{9FE34540-86EC-43F0-AA18-769F34569428}" src="https://github.com/user-attachments/assets/9e0befb2-dc6c-4c4c-8ac0-a9c5de551fcd" />
<img width="1277" height="795" alt="{8E4D7634-C096-40FA-8D5C-3613B2EBA709}" src="https://github.com/user-attachments/assets/f64c1a98-0371-44b2-b614-35206d7a1b23" />
<img width="1280" height="800" alt="{437389B3-4748-45CE-95F2-0EFCD5BAF376}" src="https://github.com/user-attachments/assets/c4d12183-d071-438c-8f6e-42a8f6dac2a0" />

---

## 🛠️ 技术栈 (Tech Stack)

- **前端 (Frontend)**: React 18 + Vite + Tailwind CSS + Lucide Icons + React Router
- **后端 (Backend)**: Node.js + Express.js + CORS
- **数据库 (Database)**: SQLite3 (本地轻量级数据库，无需额外安装配置环境)

---

## 🚀 快速启动 (Getting Started)

本项目做到了高度的开箱即用，所有的前后端交互和数据库配置均已内嵌。

### 方案一：一键启动 (推荐 Windows 用户)
1. 确保你的电脑已安装 **Node.js**。
2. 双击项目根目录下的 `start.bat` 文件。
3. 脚本会自动为你安装所有前后端依赖，并同时启动后台服务器和前端页面！
4. 浏览器会自动弹开并访问 `http://localhost:5173`。
5. <img width="566" height="119" alt="{D7D16B5B-05D7-4399-B571-1F41E05D7335}" src="https://github.com/user-attachments/assets/1d72ea96-9ace-46e0-9be4-a29642f8898e" />


### 方案二：手动启动
如果你需要在类 Unix 系统上运行，或喜欢手动掌控：

**1. 启动后端服务器**
```bash
cd backend
npm install
node server.js
```
*后端将在 `http://localhost:3001` 上运行。*

**2. 启动前端应用**
```bash
cd frontend
npm install
npm run dev
```
*前端将在 `http://localhost:5173` 上运行。*

---

## 📁 目录结构 (Directory Structure)

```text
better-exam-app/
├── start.bat               # Windows 一键启动脚本
├── backend/                # 后端及数据库逻辑
│   ├── server.js           # Express API 核心服务
│   ├── database.js         # SQLite 数据库配置及表结构初始化
│   ├── exam.db             # (运行时生成) 保存所有题目、错题、收藏及历史记录
│   ├── package.json
│   └── data/               # 存放供导入的原 JSON 试题数据
└── frontend/               # React 前端视图
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx        # 前端入口
        ├── App.jsx         # 核心路由及布局控制
        ├── index.css       # 全局样式及暗黑表格定制
        └── pages/          # 所有的功能页面组件 (Dashboard, Study, Browse 等)
```
