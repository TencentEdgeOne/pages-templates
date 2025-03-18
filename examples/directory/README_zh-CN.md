# 导航站点模板 - 以独立开发者出海工具箱为例

这是一个基于 EdgeOne Pages 和 Raindrop.io API 构建的导航站点模板。本示例以"独立开发者出海工具箱"为主题，展示了如何快速搭建一个美观、实用的导航网站。

## 特色功能

- 🎨 现代化 UI 设计，支持亮色/暗色模式
- 🏷️ 基于标签的智能分类系统
- 🔍 强大的模糊搜索功能
- 📱 完全响应式设计
- ⚡ 基于 Next.js 的高性能架构
- 🔄 实时数据同步（通过 Raindrop.io）

## 一键部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?template=directory)

## 开始使用

### 1. 设置 Raindrop.io

1. 在 [Raindrop.io](https://raindrop.io) 创建账号
2. 访问 [集成设置页面](https://app.raindrop.io/settings/integrations) 创建应用
3. 生成并复制 API 令牌
4. 在项目根目录创建 `.env.local` 文件并添加令牌：

```
NEXT_PUBLIC_RAINDROP_API_TOKEN=your_raindrop_api_token_here
```

可以参考 `.env.local.example` 文件作为模板。

### 2. 添加你的导航内容

1. 在 Raindrop.io 中添加书签
2. 为每个书签添加合适的标签进行分类
3. 添加描述和笔记以提供更多上下文信息
4. 可选：自定义封面图片

### 3. 本地开发

```bash
# 安装依赖
npm install
# 或
yarn
# 或
pnpm install
# 或
bun install

# 启动开发服务器
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看你的导航站点。

## 自定义主题

本项目使用了 Tailwind CSS 进行样式设计。你可以通过修改以下文件来自定义主题：

- `app/globals.css` - 全局样式
- `components/Base.tsx` - 主要布局组件
- `components/common/*` - 通用组件

## 了解更多

- [Next.js 文档](https://nextjs.org/docs)
- [Raindrop.io API 文档](https://developer.raindrop.io)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
