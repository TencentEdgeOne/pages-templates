# EdgeOne Makers: MCP Client and Server Implementation with Functions

## Project Overview

This project showcases an intelligent chat application built with EdgeOne Makers Functions technology. It interacts with backend functions through a web interface, implementing a complete Model Context Protocol (MCP) workflow.

The system architecture consists of the following core components:

- MCP Streamable HTTP Server (`functions/mcp-server/index.ts`)
- MCP Client (`functions/mcp-client/index.ts`)
- Backend API (`functions/v1/chat/completions/index.ts`) as the MCP HOST, responsible for coordinating the entire MCP workflow

Through this architecture, users can access powerful MCP tool capabilities in the browser, enabling intelligent interactions such as "generating online webpages with a single prompt."

## Core Features

- **Interactive Chat Interface:** Modern, responsive web interface built with Next.js and React
- **High-Performance Edge Functions:** Critical business logic deployed on highly scalable EdgeOne Makers Functions
- **Complete MCP Implementation:** Model Context Protocol implementation based on the latest specifications, providing powerful context management and request routing capabilities
- **OpenAI Format Compatible:** Backend API fully supports OpenAI-formatted request and response handling

## Streamable HTTP MCP Server

Configure remote MCP services in applications that support `Streamable HTTP MCP Server`.

```json
{
  "mcpServers": {
    "edgeone-makers-mcp-server": {
      "url": "https://mcp-on-edge.edgeone.site/mcp-server"
    }
  }
}
```

## Deploy

[![Deploy with EdgeOne Makers](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/makers/new?template=mcp-on-edge)

More Templates: [EdgeOne Makers](https://pages.edgeone.ai/templates)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AI_GATEWAY_BASE_URL` | Yes | Gateway base URL. For Makers Models, use `https://ai-gateway.edgeone.link/v1`. |
| `AI_GATEWAY_API_KEY` | Yes | Model gateway API key. Use your Makers Models API Key, or any OpenAI-compatible provider key. |
| `AI_GATEWAY_MODEL` | No | Model ID. Defaults to `@makers/deepseek-v4-flash` (a built-in Makers model). |

[About Changing Model Invocations](https://pages.edgeone.ai/document/agents-quick-start#038ab1c2-6bd9-4380-a1ee-191262c5d0ec)

## Local Development

### Environment Setup

First, install dependencies and start the development server:

```bash
# Install dependencies
npm install
# Or use other package managers
# yarn install / pnpm install / bun install

# Start development server
npm run dev
# Or use other package managers
# yarn dev / pnpm dev / bun dev
```

Configure environment variables: Copy the `.env.example` file and rename it to `.env`, then fill in your AI service interface configuration information.

After starting, visit [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Project Structure

- Frontend Interface: `app/page.tsx` contains the main page logic and UI components
- Backend Functions: All edge functions are in the `functions` directory
  - Chat API: `functions/v1/chat/completions`
  - MCP Server: `functions/mcp-server`
  - MCP Client: `functions/mcp-client`

## Technical Documentation

Learn more about related technologies:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js framework features and API
- [EdgeOne Makers Functions Documentation](https://pages.edgeone.ai/document/pages-functions-overview) - Detailed explanation of EdgeOne serverless functions
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/specification/2025-03-26/changelog) - Implemented based on the 2025-03-26 version of Streamable HTTP transport
