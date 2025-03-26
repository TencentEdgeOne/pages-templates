# EdgeOne Pages MCP: 地理位置服务

此项目演示如何使用 EdgeOne Pages 函数获取用户地理位置信息，并通过 MCP（模型上下文协议）与大型语言模型集成。

## 演示

![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/f180b5ae-0e9c-40a8-a76a-b8f2a5e6108f.gif)

## 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?template=mcp-geo)

## 组件

### 1. EdgeOne Pages 函数: 地理位置

该项目包含一个 EdgeOne Pages 函数，用于获取用户地理位置信息：

* 使用 EdgeOne 请求上下文访问地理位置数据
* 以 JSON 格式返回位置信息
* 位于 `functions/get_geo.ts`

### 2. MCP 服务器集成

MCP 服务器组件为大型语言模型提供了访问地理位置数据的接口：

* 实现了模型上下文协议（MCP）
* 提供了一个可被 AI 模型使用的 `get_geolocation` 工具
* 使用 EdgeOne Pages 函数获取地理位置数据
* 位于 `mcp-server/index.ts`

## MCP 配置

要将 MCP 服务器与大型语言模型一起使用，请添加以下配置：

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

* [EdgeOne Pages](https://edgeone.ai/products/pages)
* [EdgeOne Pages 函数文档](https://edgeone.ai/document/162227908259442688)
* [模型上下文协议 (MCP)](https://modelcontextprotocol.github.io) - 了解如何将 AI 模型与外部工具和服务集成
