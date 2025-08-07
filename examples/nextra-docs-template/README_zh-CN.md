# Nextra 文档模板

这是一个使用 [Nextra](https://nextra.site) 创建文档的模板。Nextra 是一个简单、强大且灵活的站点生成框架，集成了 Next.js 的所有优秀特性。

你可以将它作为自己项目的起始模板。

## 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?template=nextra-docs-template)

## 安装

```bash
npm i
```

## 本地开发

### 启动项目

```bash
npm dev
```

此命令启动本地开发服务器并打开浏览器窗口。然后访问 localhost:3000。

### 新建文档基础方法

在 Nextra 框架中，创建新的文档页面非常直观。只需在 `/pages` 目录下创建一个新的 `.mdx` 文件，系统将自动将其添加到文档结构中。导航菜单会根据文件名自动生成相应的路径和链接。

**示例：**

- 创建 `/pages/getting-started.mdx` 将在导航中生成"Getting Started"条目
- 创建 `/pages/advanced/configuration.mdx` 将在"Advanced"分类下生成"Configuration"条目

### 自定义导航与结构

如果需要对导航结构进行精细控制，可以通过编辑 `/pages/_meta.js` 文件来实现自定义：

- 重新排序导航项
- 自定义显示名称（不受文件名限制）
- 设置导航层级和分组
- 隐藏特定页面
- 添加外部链接

`_meta.js` 文件允许您完全掌控文档的呈现方式，确保用户获得最佳的导航体验。

### 最佳实践

- 使用清晰、描述性的文件名，以便在未配置 `_meta.js` 时也能有合理的导航结构
- 为常见内容模式创建一致的目录结构
- 在处理大型文档时，确保通过 `_meta.js` 精心设计导航结构

这种灵活的页面创建机制使 Nextra 成为构建结构化文档网站的理想选择。

## 构建

```bash
npm run build
```
