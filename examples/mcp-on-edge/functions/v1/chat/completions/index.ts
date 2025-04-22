import { z } from 'zod';
import { MCPClient } from '../../../mcp-client';

// Schema definitions
const messageSchema = z
  .object({
    messages: z.array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string(),
      })
    ),
  })
  .passthrough();

/**
 * Handle API errors
 */
const handleApiError = (error: any) => {
  const errorMessage = error.message || 'Unknown error occurred';

  return {
    error: errorMessage,
    choices: [
      {
        message: {
          role: 'assistant',
          content: `很抱歉，AI服务暂时无法使用: ${errorMessage}`,
        },
      },
    ],
  };
};

/**
 * Create a standard API response
 */
const createResponse = (data: any) => {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};

/**
 * Handle OPTIONS requests (CORS)
 */
const handleOptionsRequest = () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};

/**
 * Generate HTML content based on user request
 */
async function generateHTMLContent(query: string, openaiConfig: any) {
  const { apiKey, baseUrl, model } = openaiConfig;

  const systemPrompt = `You are an expert HTML developer that creates complete, functional web pages.
Your task is to generate a complete HTML web page based on the user's request.

IMPORTANT INSTRUCTIONS:
1. Create a COMPLETE, ready-to-deploy HTML document including <!DOCTYPE html>, <html>, <head>, and <body> tags
2. Include all CSS styling directly in a <style> tag in the head section
3. Include all JavaScript directly in <script> tags at the end of the body
4. Make the design visually appealing with modern CSS styling
5. Make all content responsive to work on both desktop and mobile devices
6. DO NOT use external resources (CSS frameworks, image CDNs) - everything must be self-contained
7. ONLY return the complete HTML code without any explanation or markdown code blocks

Your HTML must be valid, complete, and ready to deploy as-is.`;

  try {
    const response = await (fetch as any)(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      eo: {
        timeoutSetting: {
          connectTimeout: 600000,
          readTimeout: 600000,
          writeTimeout: 600000,
        },
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: `Create a complete HTML web page based on this request: ${query}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `AI服务请求失败: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const html = data.choices?.[0]?.message?.content || '';

    if (!html) {
      throw new Error(`AI服务返回内容为空`);
    }

    // Simply return the HTML directly from the AI
    return html.replace(/```html|```/g, '').trim();
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error(`AI服务暂时无法使用: ${String(error)}`);
  }
}

/**
 * MCP utility functions for abstracting MCP capabilities
 */
const MCPUtils = {
  /**
   * Create and initialize an MCP client
   * @param clientName The name of the client
   * @param serverUrl The server URL to connect to
   * @returns Initialized MCP client
   */
  createClient: async (clientName: string, serverUrl: string): Promise<MCPClient> => {
    const client = new MCPClient(clientName);
    await client.connectToServer(serverUrl);
    await client.listTools();
    return client;
  },
  
  /**
   * Find a tool by name in the MCP client
   * @param client The MCP client
   * @param toolName The name of the tool to find
   * @returns The tool object or null if not found
   */
  findTool: (client: MCPClient, toolName: string): any => {
    const tool = client.tools.find((t) => t.name === toolName);
    return tool || null;
  },
  
  /**
   * Execute a tool with the provided parameters
   * @param client The MCP client
   * @param toolName The name of the tool to execute
   * @param params The parameters to pass to the tool
   * @returns Result of the tool execution
   */
  executeTool: async (client: MCPClient, toolName: string, params: any): Promise<string> => {
    const tool = MCPUtils.findTool(client, toolName);
    if (!tool) {
      throw new Error(`部署服务暂时不可用: 找不到 ${toolName} 工具`);
    }
    return await client.callTool(toolName, params);
  },
  
  /**
   * Clean up the MCP client
   * @param client The MCP client to clean up
   */
  cleanup: async (client: MCPClient): Promise<void> => {
    await client.cleanup();
  }
};

/**
 * Deploy HTML content using MCP client
 */
async function deployHtml(htmlContent: string): Promise<string> {
  let client: MCPClient | null = null;
  
  try {
    // Create MCP client and connect to the server
    client = await MCPUtils.createClient('edgeone-pages', 'https://proxy.edgeone.site/mcp-server');
    
    // Execute the deploy-html tool
    const result = await MCPUtils.executeTool(client, 'deploy-html', {
      value: htmlContent,
    });
    
    return result;
  } catch (e: any) {
    throw new Error(`部署服务暂时不可用: ${e.message || String(e)}`);
  } finally {
    // Ensure client cleanup happens
    if (client) {
      await MCPUtils.cleanup(client);
    }
  }
}

export async function onRequest({ request, env }: any) {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return handleOptionsRequest();
  }

  const { BASE_URL, API_KEY, MODEL } = env;

  // Remove encoding header to avoid compression issues
  request.headers.delete('accept-encoding');

  try {
    const json = await request.clone().json();
    const parseResult = messageSchema.safeParse(json);

    if (!parseResult.success) {
      return createResponse({
        error: parseResult.error.message,
        choices: [
          {
            message: {
              role: 'assistant',
              content: `I'm sorry, but there was an issue with your request: ${parseResult.error.message}`,
            },
          },
        ],
      });
    }

    const { messages } = parseResult.data;

    // Get the user query from the last user message
    const userMessages = messages.filter((m) => m.role === 'user');
    if (userMessages.length === 0) {
      return createResponse({
        error: 'No user message found',
        choices: [
          {
            message: {
              role: 'assistant',
              content: `I couldn't find any message in your request. Please send a message to continue.`,
            },
          },
        ],
      });
    }

    const userQuery = userMessages[userMessages.length - 1].content;

    try {
      // Generate HTML content based on user query
      const htmlContent = await generateHTMLContent(userQuery, {
        apiKey: API_KEY,
        baseUrl: BASE_URL,
        model: MODEL,
      });

      // Deploy the HTML content using MCP client
      const deploymentResult = await deployHtml(htmlContent);

      // Generate AI response based on the deployment result
      const aiResponse = await generateAIResponse(deploymentResult, {
        apiKey: API_KEY,
        baseUrl: BASE_URL,
        model: MODEL,
      });

      // Return the result to the user with AI-generated response
      return createResponse({
        choices: [
          {
            message: {
              role: 'assistant',
              content: aiResponse,
            },
          },
        ],
      });
    } catch (error: any) {
      // Return error as a properly formatted error response
      return createResponse(handleApiError(error));
    }
  } catch (error: any) {
    return createResponse(handleApiError(error));
  }
}

/**
 * Generate AI response based on deployment result
 */
async function generateAIResponse(
  deploymentResult: string,
  openaiConfig: any
): Promise<string> {
  const { apiKey, baseUrl, model } = openaiConfig;

  const systemPrompt = `你是一个网页部署助手。基于部署结果，生成一个友好的回复。
- 如果结果是一个URL，告知用户网页已成功部署，并提供访问链接
- 如果结果包含错误信息，提供一个友好的错误提示，并附上技术细节
- 对于其他情况，给出一个清晰的说明`;

  try {
    const response = await (fetch as any)(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      eo: {
        timeoutSetting: {
          connectTimeout: 30000,
          readTimeout: 30000,
          writeTimeout: 30000,
        },
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: `这是网页部署的结果，请根据结果生成一个友好的回复：${deploymentResult}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `AI服务请求失败: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '网页处理完成';
  } catch (error) {
    // Fallback response if AI call fails
    const urlPattern = /^https?:\/\/[^\s$.?#].[^\s]*$/i;
    if (urlPattern.test(deploymentResult)) {
      return `我已经根据您的需求创建并部署了网页。您可以通过此链接访问：${deploymentResult}`;
    } else {
      return `网页处理完成。结果：${deploymentResult}`;
    }
  }
}
