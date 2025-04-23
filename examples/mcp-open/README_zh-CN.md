# EdgeOne Pages MCP

## 什么是 MCP？

MCP（Model Context Protocol，模型上下文协议）是一种开放协议，让 AI 模型能够安全地与本地和远程资源进行交互。

只需在支持 MCP 的客户端（如 Cline、Cursor、Claude 等）进行统一配置。OpenAI 已于 2025 年 3 月宣布支持 MCP 协议，使这一功能在所有主流 AI 平台上得到广泛应用。

## EdgeOne Pages Deploy MCP

### 什么是 EdgeOne Pages Deploy MCP？

EdgeOne Pages Deploy MCP 是一项专用服务，能够将 HTML 内容快速部署到 EdgeOne Pages 并生成公开访问链接。这使您能够立即预览和分享 AI 生成的网页内容。

![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/04ff9814-bcd3-442c-a2d0-eefd4ee1b13c.gif)

### 配置方法

在 Cursor 中配置:

1. 转到设置 → MCP
2. 添加新的 MCP 服务器:
   - 名称: `edgeone-pages-mcp-server`
   - 类型: 命令
   - 命令: `npx edgeone-pages-mcp`

![](https://write-document-release-1258344699.cos.ap-guangzhou.myqcloud.com/100026466949%2F3113c4ad09f211f0a6d15254007c27c5.png)

在任何支持 MCP 的客户端中，您也可以使用以下 JSON 配置:

```json
{
  "mcpServers": {
    "edgeone-pages-mcp-server": {
      "command": "npx",
      "args": ["edgeone-pages-mcp"]
    }
  }
}
```

## 为什么选择 EdgeOne Pages?

EdgeOne Pages 凭借其无服务器架构，是构建 MCP 服务的理想选择:

- **全球加速**: 内容从离用户最近的节点分发，确保极速访问体验
- **自动扩展**: 根据需求自动调整资源，无需手动干预
- **零运维**: 无需服务器管理，专注于创意与内容

### 核心优势

EdgeOne Pages 为现代 Web 开发提供全套解决方案:

- **全球边缘网络**: 内容在全球范围内高速分发
- **无服务器计算**: 边缘执行 JavaScript/TypeScript，实现超低延迟
- **边缘 KV 存储**: 高性能数据存储，适用于动态内容
- **高效部署流程**: 从代码到上线，只需几步操作

### 构建自己的 MCP 服务

您可以参考我们的地理位置 MCP 示例项目，构建自己的服务: [MCP with Pages Functions: Geo Location Demo](https://github.com/TencentEdgeOne/mcp-geo)

简单来说，MCP 允许 AI 在对话过程中调用外部服务。例如，当 AI 需要获取用户地理位置时，可以通过[get_geo 接口](https://mcp-geo.edgeone.app/get_geo)自动获取这些信息，然后推荐附近的餐厅或景点。

在支持 MCP 的客户端中，您可以配置如下 JSON 配置:

```json
{
  "mcpServers": {
    "edgeone-geo-mcp-server": {
      "command": "tsx",
      "args": ["path/to/mcp-server/index.ts"]
    }
  }
}
```

## 了解更多

- [EdgeOne Pages 产品介绍](https://edgeone.ai/products/pages)
- [EdgeOne Pages Functions 开发文档](https://edgeone.ai/document/162227908259442688)
- [EdgeOne Pages KV 存储指南](https://edgeone.ai/document/162227803822321664)
