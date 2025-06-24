# Hugo 起步模板

一个使用 Ananke 主题的 Hugo 静态网站生成器起步模板。

## 部署

部署到 EdgeOne Pages。

[![EdgeOne Pages deploy](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?from=github&template=hugo-starter)

## 特性

- 使用 Ananke 主题的清新现代设计
- 响应式布局
- 分类和标签支持
- 易于定制
- 基于 NPM 的工作流

## 前置要求

开始之前，请确保已安装以下软件：
- [Node.js](https://nodejs.org/)（v18 或更高版本）
- [Git](https://git-scm.com/)
- [Hugo](https://gohugo.io/installation/)


## 快速开始

1. **克隆仓库**
   ```bash
   git clone <your-repo-url>

   cd hugo-start

   git submodule update --init
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **查看网站**
   在浏览器中访问 http://localhost:1313

## 项目结构

```
hugo-start/
├── archetypes/        # 内容模板
├── assets/           # 未处理的资源（SCSS、JS等）
├── content/          # 网站内容
│   └── get-start/    # 入门指南
├── data/            # 配置文件
├── layouts/         # 模板文件
├── static/          # 静态文件
├── themes/          # 主题文件（Ananke）
├── hugo.toml        # 网站配置
├── edgeone.json     # 部署配置
└── package.json     # NPM 配置
```

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产站点
- `npm run preview` - 本地预览生产构建
- `npm run clean` - 清理构建目录

## 内容管理

- 构建静态文件：

  ```bash
  npm run build
  ```

## 自定义设置

1. **网站配置**
   - 编辑 `hugo.toml` 修改全站设置

2. **主题自定义**
   - 在 `/layouts` 中覆盖主题模板
   - 在 `/assets` 中修改样式

3. **内容组织**
   - 在 `/content` 中组织内容
   - 创建分区和分类

## 部署

1. **构建网站**
   ```bash
   npm run build
   ```

2. **部署 `/public` 目录**
   - 上传到您的 Web 服务器
   - 部署到 EdgeOne Pages
   - 使用静态站点托管服务

## 贡献指南

1. Fork 本仓库
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建新的 Pull Request

## 支持

如需支持，请：
1. 查看 [Hugo 文档](https://gohugo.io/documentation/)
2. 在本仓库中创建 issue
3. 加入 [Hugo 社区](https://discourse.gohugo.io/)