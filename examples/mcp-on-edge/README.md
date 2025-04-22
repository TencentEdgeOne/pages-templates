# EdgeOne Pages: MCP Client and Server Implementation with Functions

## Project Overview

This project showcases an intelligent chat application built with EdgeOne Pages Functions technology. It interacts with backend functions through a web interface, implementing a complete Model Context Protocol (MCP) workflow.

The system architecture consists of the following core components:

- MCP Streamable HTTP Server (`functions/mcp-server/index.ts`)
- MCP Client (`functions/mcp-client/index.ts`)
- Backend API (`functions/v1/chat/completions/index.ts`) as the MCP HOST, responsible for coordinating the entire MCP workflow

Through this architecture, users can access powerful MCP tool capabilities in the browser, enabling intelligent interactions such as "generating online webpages with a single prompt."

## Core Features

- **Interactive Chat Interface:** Modern, responsive web interface built with Next.js and React
- **High-Performance Edge Functions:** Critical business logic deployed on highly scalable EdgeOne Pages Functions
- **Complete MCP Implementation:** Model Context Protocol implementation based on the latest specifications, providing powerful context management and request routing capabilities
- **OpenAI Format Compatible:** Backend API fully supports OpenAI-formatted request and response handling

## Streamable HTTP MCP Server

Configure remote MCP services in applications that support `Streamable HTTP MCP Server`.

```json
{
  "mcpServers": {
    "edgeone-pages-mcp-server": {
      "url": "https://mcp-on-edge.edgeone.site/mcp-server"
    }
  }
}
```

## Deploy

[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?template=mcp-on-edge)

More Templates: [EdgeOne Pages](https://edgeone.ai/pages/templates)

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
- [EdgeOne Pages Functions Documentation](https://edgeone.ai/document/162227908259442688s) - Detailed explanation of EdgeOne serverless functions
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/specification/2025-03-26/changelog) - Implemented based on the 2025-03-26 version of Streamable HTTP transport
