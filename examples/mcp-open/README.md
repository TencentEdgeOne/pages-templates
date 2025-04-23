# EdgeOne Pages MCP

## What is MCP?

Anthropic's Model Context Protocol (MCP) is an open standard launched in 2024 that connects AI models with external tools and data sources. It creates a secure client-server framework where AI systems can interact with files, databases, and APIs while giving users control over data access.

EdgeOne Pages MCP server lets AI coding assistants deploy HTML directly to EdgeOne Pages. Developers get instant public URLs for their AI-generated code, making it easy to test and share projects in real-time.

## Why EdgeOne Pages Rocks for MCP

EdgeOne Pages is perfect for MCP services thanks to its serverless architecture. With code running at edge nodes worldwide, you can:

* Deploy AI-generated HTML instantly
* Get public URLs with minimal latency
* Scale automatically as needed
* Skip the server management headaches

## Key Features

EdgeOne Pages delivers everything you need for modern web development:

### Global Edge Network

Content delivered from nodes closest to users for lightning-fast performance worldwide.

### Serverless JavaScript/TypeScript

Run code at the edge without server management for ultra-low latency.

### Edge KV Storage

High-performance data storage ideal for dynamic content and configuration.

### Streamlined Deployment

Get from code to production quickly with minimal steps.

## See It in Action

![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/04ff9814-bcd3-442c-a2d0-eefd4ee1b13c.gif)

## Quick Setup

Here's how to set it up in Cursor:

1. Go to Settings → MCP
2. Add a new MCP Server with these details:
   * Name: edgeone-pages-mcp-server
   * Type: command
   * Command: npx edgeone-pages-mcp

![](https://write-document-release-1258344699.cos.ap-guangzhou.myqcloud.com/100026466949%2F3113c4ad09f211f0a6d15254007c27c5.png)

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

## How It Works

This MCP service plugs into EdgeOne Pages Functions to handle HTML deployment:

1. **EdgeOne Pages Functions** runs your JavaScript/TypeScript at the edge.

2. **Behind the Scenes:** 
   - Stores HTML in EdgeOne Pages KV
   - Generates unique public URLs
   - Handles errors gracefully

3. **The Process:** 
   - Send HTML via the `deploy_html` tool
   - EdgeOne Pages API generates a base URL
   - Content deploys to EdgeOne KV
   - You get back a live URL instantly

## Build Your Own MCP Services

EdgeOne Pages gives you a great foundation to build on:

1. **Explore the Platform** - Check out Functions, KV storage, and deployment options.

2. **Create Custom Services** - Build MCP services tailored to your workflow.

3. **Add New Features** - Implement auth, preview environments, or other integrations.

4. **Share Your Work** - Help grow the AI-assisted development ecosystem.

Get started by signing up at [EdgeOne Pages](https://edgeone.ai/products/pages) and diving into our docs.

## Learn More

For details, check out the [EdgeOne Pages Functions documentation](https://edgeone.ai/document/162227908259442688) and [EdgeOne Pages KV Storage Guide](https://edgeone.ai/document/162227803822321664).
