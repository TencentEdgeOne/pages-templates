#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer({
  name: 'edgeone-geo-mcp-server',
  version: '1.0.0',
  description: 'An MCP service for getting user geolocation information',
});

const handleApiError = (error: any) => {
  console.error('API Error:', error);
  const errorMessage = error.message || 'Unknown error occurred';
  return {
    content: [
      {
        type: 'text' as const,
        text: `Error: ${errorMessage}`,
      },
    ],
    isError: true,
  };
};

export async function getGeoLocation(): Promise<any> {
  try {
    const res = await fetch('https://mcp-geo.edgeone.app/get_geo');
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Failed to get geolocation:', error);
    throw error;
  }
}

server.tool(
  'get_geolocation',
  "Get the user's geolocation information",
  {},
  async () => {
    try {
      const geoData = await getGeoLocation();

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(geoData, null, 2),
          },
        ],
      };
    } catch (e) {
      return handleApiError(e);
    }
  }
);

console.log('Starting edgeone-geo-mcp-server...');
const transport = new StdioServerTransport();
await server.connect(transport);
console.log('edgeone-geo-mcp-server started successfully!');
