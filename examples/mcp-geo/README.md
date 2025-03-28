# MCP with Pages Functions ：Geo Location Demo 

This project demonstrates how to use EdgeOne Pages Functions to retrieve user geolocation information and integrate it with large language models through MCP (Model Context Protocol).

## Demo

![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/f180b5ae-0e9c-40a8-a76a-b8f2a5e6108f.gif)

## Deploy

[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?template=mcp-geo)

More Templates: [EdgeOne Pages](https://edgeone.ai/pages/templates)

## Components

### 1. EdgeOne Pages Functions: Geolocation

The project includes an EdgeOne Pages Function that retrieves user geolocation information:

* Uses the EdgeOne request context to access geolocation data
* Returns location information in a JSON format
* Located in `functions/get_geo.ts`

### 2. MCP Server Integration

The MCP server component provides an interface for large language models to access geolocation data:

* Implements the Model Context Protocol (MCP)
* Exposes a `get_geolocation` tool that can be used by AI models
* Uses the EdgeOne Pages Function to fetch geolocation data
* Located in `mcp-server/index.ts`

## MCP Configuration

To use the MCP server with large language models, add the following configuration:

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

## Learn More

* [EdgeOne Pages](https://edgeone.ai/products/pages)
* [EdgeOne Pages Functions documentation](https://edgeone.ai/document/162227908259442688)
* [Model Context Protocol (MCP)](https://modelcontextprotocol.github.io) - Learn about integrating AI models with external tools and services
