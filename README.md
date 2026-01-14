# TaskFlow - React混沌工程演练项目

<div align="center">

![TaskFlow Logo](https://img.shields.io/badge/TaskFlow-2.0.0-blue)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.1.0-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?logo=tailwind-css)

**一个功能完整的React任务管理系统，专为混沌工程演练而设计**

[快速开始](#-快速开始) • [功能特性](#-功能特性) • [混沌工程](#-混沌工程) • [文档](#-文档)

</div>

---

## 📖 项目简介

TaskFlow 是一个现代化的任务管理系统，提供直观的用户界面和完善的任务管理功能。更重要的是，它内置了完整的**混沌工程故障注入系统**，可以模拟各种真实的错误场景，用于故障分析平台的测试和演练。

### 🎯 核心特点

- ✅ **功能完整**：完整的CRUD操作、搜索筛选、状态管理
- ✅ **代码丰富**：3000+行React代码，接近真实项目规模
- ✅ **故障注入**：12种常见错误类型，一键注入
- ✅ **真实场景**：注入的是真实错误代码，非配置开关
- ✅ **易于使用**：CLI工具操作简单，文档详尽

---

## 🚀 快速开始

### 前置要求

- Node.js >= 16.x
- npm >= 7.x
- Git

### 安装步骤

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd castrel-webhook-demo

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 访问应用
# 浏览器打开 http://localhost:3000
```

### 构建生产版本

```bash
# 构建
npm run build

# 预览构建结果
npm run preview
```

---

## ✨ 功能特性

### 任务管理

- 📝 **创建任务**：支持标题、描述、优先级、截止日期、标签
- ✏️ **编辑任务**：实时更新任务信息
- 🗑️ **删除任务**：支持单个删除
- ✅ **状态管理**：待处理、进行中、已完成
- 🔍 **搜索筛选**：按标题、描述、标签搜索，按状态和优先级筛选
- 📊 **统计分析**：实时任务统计，直观了解工作进度

### 用户界面

- 🎨 **现代设计**：使用TailwindCSS，界面美观
- 📱 **响应式**：支持桌面端和移动端
- ⚡ **流畅动画**：页面切换和交互动画
- 🎯 **用户友好**：清晰的导航和操作提示

### 技术亮点

- ⚛️ **React 18**：使用最新的React特性
- 🏗️ **组件化**：高度模块化的组件设计
- 🔄 **状态管理**：Context API + Hooks
- 🎭 **错误边界**：完善的错误捕获机制
- 🚀 **性能优化**：代码分割、懒加载

---

## 🔥 混沌工程

### 什么是混沌工程？

混沌工程是一种通过主动注入故障来测试系统韧性的实践。本项目提供了完整的混沌工程工具链，可以模拟各种真实的错误场景。

### 支持的故障类型

**⚠️ 重要**：所有故障类型都会导致**构建失败，应用无法启动**

#### 🔨 语法和编译错误（4种）
- **syntax-error**：JSX语法错误，缺少闭合标签
- **import-error**：导入路径错误，模块找不到
- **typescript-error**：TypeScript类型错误
- **undefined-variable**：使用未定义的变量或函数

#### 📦 依赖和配置错误（4种）
- **dependency-missing**：依赖包缺失
- **dependency-version-conflict**：依赖版本冲突
- **env-variable-missing**：环境变量缺失
- **vite-config-error**：Vite配置错误

#### 🎨 资源和打包错误（4种）
- **css-syntax-error**：CSS语法错误
- **circular-dependency**：循环依赖
- **build-out-of-memory**：构建内存溢出
- **asset-size-exceeded**：资源文件过大

**总计：12种构建失败错误类型**

### CLI工具使用

```bash
# 查看所有故障类型
npm run chaos -- list

# 查看故障详情
npm run chaos -- info --type syntax-error

# 注入故障
npm run chaos -- inject --type syntax-error

# 恢复正常
npm run chaos -- restore
```

**⚠️ 重要提示**：
- ✅ **必须使用 `--` 分隔符**（`npm run chaos -- inject`）
- ❌ 不要写成 `npm run chaos inject`（会失败）
- 💡 `--` 用于告诉 npm 后面的参数是传递给脚本的

**🎯 快速体验**：
```bash
# 3步快速测试
npm run chaos -- inject --type syntax-error  # 1. 注入故障
git diff                                      # 2. 查看变更
npm run chaos -- restore                      # 3. 恢复正常
```

### 故障注入流程

```
1. 注入故障
   ↓
2. 提交代码到Git
   ↓
3. 推送到GitHub
   ↓
4. Vercel自动部署
   ↓
5. 构建失败（Build阶段报错）⚠️
   ↓
6. 部署失败，应用无法启动 ❌
   ↓
7. GitHub Webhook通知故障分析平台
   ↓
8. 平台获取Build日志和Commit信息
   ↓
9. 分析错误并生成报告
   ↓
10. 恢复正常状态
```

**关键特点**：
- ✅ 所有故障都在**构建阶段失败**
- ✅ 应用**无法成功部署**
- ✅ 只能通过**Build日志**分析错误
- ✅ 不存在"启动成功但访问失败"的情况

---

## 📚 文档

### 🚀 快速开始

- **[故障测试操作手册](docs/FAULT_TEST_MANUAL.md)** ⭐⭐⭐ 强烈推荐
  - 完整的命令使用说明
  - 12种故障类型详细测试步骤
  - 常见问题和解决方案
  - 使用技巧和最佳实践

### 📖 核心文档

- **[架构设计文档](docs/React混沌工程演练/DESIGN_React混沌工程演练.md)**
  - 系统架构
  - 模块设计
  - 数据流向

### 📝 项目文档

- **[需求对齐文档](docs/React混沌工程演练/ALIGNMENT_React混沌工程演练.md)**
- **[共识文档](docs/React混沌工程演练/CONSENSUS_React混沌工程演练.md)**
- **[任务拆分文档](docs/React混沌工程演练/TASK_React混沌工程演练.md)**
- **[TODO清单](docs/React混沌工程演练/TODO_React混沌工程演练.md)**

---

## 🏗️ 项目结构

```
castrel-webhook-demo/
├── src/                          # React应用源码
│   ├── components/               # 组件
│   │   ├── Layout/              # 布局组件
│   │   ├── common/              # 通用组件
│   │   └── features/            # 功能组件
│   ├── pages/                   # 页面组件
│   ├── context/                 # Context状态管理
│   ├── utils/                   # 工具函数
│   ├── styles/                  # 样式文件
│   ├── App.jsx                  # 应用根组件
│   └── main.jsx                 # 入口文件
├── scripts/                      # CLI工具
│   ├── chaos-cli.js             # CLI入口
│   ├── commands/                # 命令处理器
│   ├── core/                    # 核心模块
│   └── config/                  # 配置文件
├── chaos-templates/              # 错误代码模板
│   ├── build-errors/
│   ├── runtime-errors/
│   ├── resource-errors/
│   └── performance-issues/
├── docs/                         # 文档
├── package.json
├── vite.config.js
└── README.md
```

---

## 🛠️ 技术栈

### 前端框架
- **React 18.3.1** - UI框架
- **React Router 6.22.0** - 路由管理
- **Context API** - 状态管理

### 构建工具
- **Vite 5.1.0** - 构建工具
- **ES Modules** - 模块系统

### 样式方案
- **TailwindCSS 3.4.1** - CSS框架
- **PostCSS** - CSS处理
- **Autoprefixer** - CSS兼容

### 开发工具
- **Node.js** - CLI工具开发
- **ES6+** - JavaScript语法

### 部署平台
- **Vercel** - 自动部署
- **GitHub** - 版本控制
- **Webhook** - 事件通知

---

## 🎯 使用场景

### 1. 故障分析平台测试
- 测试平台的错误捕获能力
- 验证Build日志解析功能
- 测试Webhook集成

### 2. 混沌工程演练
- 团队混沌工程培训
- 故障响应流程演练
- 监控告警测试

### 3. 学习和研究
- 学习React最佳实践
- 了解常见错误类型
- 研究错误处理机制

---

## 📊 代码统计

- **总文件数**：60+
- **总代码行数**：5000+
- **React组件**：20+
- **CLI模块**：10+
- **错误模板**：12个
- **文档页数**：100+

---

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 如何贡献

1. Fork本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

---

## 📝 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

---

## 👥 作者

- **项目名称**：TaskFlow
- **版本**：2.0.0
- **创建日期**：2026年1月

---

## 🙏 致谢

感谢以下开源项目：

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

---

## 📞 联系方式

- **项目地址**：[GitHub Repository]
- **问题反馈**：[GitHub Issues]
- **文档**：[项目文档](docs/)

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给个Star！**

Made with ❤️ for Chaos Engineering

</div>

