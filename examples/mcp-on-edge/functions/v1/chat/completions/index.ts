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
    stream: z.boolean().optional(),
  })
  .passthrough();

/**
 * Handle API errors with more detailed error codes
 */
const handleApiError = (error: any) => {
  const errorCode = error.code || 'UNKNOWN_ERROR';
  const errorMessage = error.message || 'Unknown error occurred';

  return {
    error: {
      code: errorCode,
      message: errorMessage,
      phase: error.phase || 'general'
    },
    choices: [
      {
        message: {
          role: 'assistant',
          content: `很抱歉，AI服务暂时无法使用: [${errorCode}] ${errorMessage}`,
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
 * Create a streaming response
 */
const createStreamingResponse = (stream: ReadableStream) => {
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};

/**
 * Send an SSE event with the given data
 */
const sendSSE = (controller: ReadableStreamDefaultController, event: string, data: any) => {
  controller.enqueue(new TextEncoder().encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
};

/**
 * Read chat completion content from either JSON or SSE stream response.
 */
const readChatCompletionContent = async (
  response: Response,
  onDelta?: (delta: string, full: string) => void
): Promise<string> => {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('text/event-stream')) {
    if (!response.body) {
      return '';
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let full = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      buffer = buffer.replace(/\r\n/g, '\n');
      let eventEnd = buffer.indexOf('\n\n');

      while (eventEnd !== -1) {
        const eventBlock = buffer.substring(0, eventEnd);
        buffer = buffer.substring(eventEnd + 2);

        const eventLines = eventBlock.split('\n');
        for (const line of eventLines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(':') || !trimmed.startsWith('data:')) {
            continue;
          }
          const data = trimmed.slice(5).trim();
          if (data === '[DONE]') {
            return full;
          }
          try {
            const parsed = JSON.parse(data);
            const delta =
              parsed.choices?.[0]?.delta?.content ??
              parsed.choices?.[0]?.message?.content ??
              '';
            if (delta) {
              full += delta;
            }
            if (onDelta) {
              onDelta(delta, full);
            }
          } catch {
            // Ignore malformed SSE payloads.
          }
        }

        eventEnd = buffer.indexOf('\n\n');
      }
    }

    return full;
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
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
async function generateHTMLContent(
  query: string,
  openaiConfig: any,
  onStreamDelta?: (delta: string, full: string) => void
) {
  const { apiKey, baseUrl, model } = openaiConfig;

  // 1. 使用Bento Grid风格的视觉设计
  // 2. 强调超大字体或数字突出核心要点，画面中有超大视觉元素强调重点，与小元素的比例形成反差
  // 3. 中英文混用，中文大字体粗体，英文小字作为点缀
  // 4. 简洁的勾线图形化作为数据可视化或者配图元素
  // 5. 运用高亮色自身透明度渐变制造科技感，但是不同高亮色不要互相渐变
  // 6. 模仿 apple 官网的动效，向下滚动鼠标配合动效
  // 7. 数据可以引用在线的图表组件，样式需要跟主题一致
  // 8. 使用 Framer Motion （通过CDN引入）
  // 9. 使用HTML5、TailwindCSS 3.0+（通过CDN引入）和必要的JavaScript
  // 10. 使用专业图标库如Font Awesome或Material Icons（通过CDN引入）
  // 11. 避免使用emoji作为主要图标
  // 12. 不要省略内容要点
  // 13. 当问到你是谁的时候，你是一个网页部署助手，你的任务是根据用户的需求生成一个完整的HTML网页

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
8. Do not include any images in the HTML
9. The page should be aesthetically pleasing and elegant
10. When asked who you are, you are a web development assistant whose task is to generate a complete HTML webpage based on the user's requirements.

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
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = new Error(
        `AI服务请求失败: ${response.status} ${response.statusText}`
      );
      (error as any).code = 'AI_SERVICE_ERROR';
      (error as any).phase = 'html_generation';
      throw error;
    }

    const html = await readChatCompletionContent(response, onStreamDelta);

    if (!html) {
      const error = new Error(`AI服务返回内容为空`);
      (error as any).code = 'EMPTY_AI_RESPONSE';
      (error as any).phase = 'html_generation';
      throw error;
    }

    // Simply return the HTML directly from the AI
    return html.replace(/```html|```/g, '').trim();
  } catch (error) {
    const err = error instanceof Error ? error : new Error(`AI服务暂时无法使用: ${String(error)}`);
    
    if (!(err as any).code) {
      (err as any).code = 'HTML_GENERATION_ERROR';
      (err as any).phase = 'html_generation';
    }
    
    throw err;
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

export async function onRequest({ request, env }: any) {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return handleOptionsRequest();
  }

  const { BASE_URL, API_KEY, MODEL } = env;

  // Remove encoding header to avoid compression issues
  request.headers.delete('accept-encoding');

  let client: MCPClient | null = null;

  try {
    const json = await request.clone().json();
    const parseResult = messageSchema.safeParse(json);

    if (!parseResult.success) {
      return createResponse({
        error: {
          code: 'INVALID_REQUEST',
          message: parseResult.error.message,
          phase: 'request_validation'
        },
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

    const { messages, stream = false } = parseResult.data;

    // Get the user query from the last user message
    const userMessages = messages.filter((m) => m.role === 'user');
    if (userMessages.length === 0) {
      return createResponse({
        error: {
          code: 'NO_USER_MESSAGE',
          message: 'No user message found',
          phase: 'request_validation'
        },
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

    // If streaming is requested, create a streaming response
    if (stream) {
      const stream = new ReadableStream({
        async start(controller) {
          const pingIntervalMs = 5000;
          let lastPingAt = 0;
          const maybePing = () => {
            const now = Date.now();
            if (now - lastPingAt >= pingIntervalMs) {
              lastPingAt = now;
              try {
                sendSSE(controller, 'ping', { ts: now });
              } catch {
                // Ignore ping errors if the stream is already closed.
              }
            }
          };
          try {
            // Step 1: Send initial message
            sendSSE(controller, 'message', { 
              role: 'assistant', 
              content: '正在处理您的请求，请稍候...' 
            });

            // Step 2: Connect to MCP client
            try {
              sendSSE(controller, 'status', { phase: 'initialization', message: '正在连接部署服务...' });
              client = await MCPUtils.createClient('edgeone-pages', 'https://proxy.edgeone.site/mcp-server');
              sendSSE(controller, 'status', { phase: 'initialization', message: '部署服务连接成功' });
            } catch (clientError: any) {
              const error = new Error(`部署服务连接失败: ${clientError.message || String(clientError)}`);
              (error as any).code = 'MCP_CLIENT_CONNECTION_ERROR';
              (error as any).phase = 'initialization';
              throw error;
            }

            // Step 3: Generate HTML content
            try {
              sendSSE(controller, 'status', { phase: 'html_generation', message: '正在生成网页内容...' });
              const htmlContent = await generateHTMLContent(userQuery, {
                apiKey: API_KEY,
                baseUrl: BASE_URL,
                model: MODEL,
              }, () => {
                maybePing();
              });
              sendSSE(controller, 'status', { phase: 'html_generation', message: '网页内容生成成功' });

              // Step 4: Deploy HTML content
              try {
                sendSSE(controller, 'status', { phase: 'html_deployment', message: '正在部署网页...' });
                const deploymentResult = await MCPUtils.executeTool(client, 'deploy-html', {
                  value: htmlContent,
                });
                sendSSE(controller, 'status', { phase: 'html_deployment', message: '网页部署成功' });

                // Step 5: Generate AI response
                try {
                  sendSSE(controller, 'status', { phase: 'response_generation', message: '正在生成回复...' });
                  const aiResponse = await generateAIResponse(deploymentResult, {
                    apiKey: API_KEY,
                    baseUrl: BASE_URL,
                    model: MODEL,
                  }, () => {
                    maybePing();
                  });
                  
                  // Step 6: Send final message
                  sendSSE(controller, 'message', { role: 'assistant', content: aiResponse });
                  sendSSE(controller, 'done', { success: true });
                } catch (aiResponseError: any) {
                  // If AI response generation fails, use the fallback logic
                  if (!(aiResponseError as any).code) {
                    (aiResponseError as any).code = 'AI_RESPONSE_ERROR';
                    (aiResponseError as any).phase = 'response_generation';
                  }
                  
                  const urlPattern = /^https?:\/\/[^\s$.?#].[^\s]*$/i;
                  const fallbackResponse = urlPattern.test(deploymentResult)
                    ? `我已经根据您的需求创建并部署了网页。您可以通过此链接访问：${deploymentResult}`
                    : `网页处理完成。结果：${deploymentResult}`;
                  
                  sendSSE(controller, 'error', {
                    code: (aiResponseError as any).code,
                    message: aiResponseError.message,
                    phase: (aiResponseError as any).phase,
                    deploymentResult: deploymentResult
                  });
                  
                  sendSSE(controller, 'message', { role: 'assistant', content: fallbackResponse });
                  sendSSE(controller, 'done', { success: true, withErrors: true });
                }
              } catch (deployError: any) {
                if (!(deployError as any).code) {
                  (deployError as any).code = 'DEPLOYMENT_ERROR';
                  (deployError as any).phase = 'html_deployment';
                }
                throw deployError;
              }
            } catch (htmlError: any) {
              throw htmlError;
            }
          } catch (error: any) {
            // Handle any errors during the streaming process
            if (!error.code) {
              error.code = 'REQUEST_PROCESSING_ERROR';
              error.phase = 'request_processing';
            }
            
            sendSSE(controller, 'error', {
              code: error.code,
              message: error.message,
              phase: error.phase
            });
            
            sendSSE(controller, 'message', { 
              role: 'assistant', 
              content: `很抱歉，AI服务暂时无法使用: [${error.code}] ${error.message}` 
            });
            
            sendSSE(controller, 'done', { success: false });
          } finally {
            // Ensure client cleanup happens if client was created
            if (client) {
              await MCPUtils.cleanup(client);
            }
          }
        }
      });

      return createStreamingResponse(stream);
    } else {
      // Non-streaming request flow (original implementation)
      try {
        // Create MCP client and connect to the server first
        try {
          client = await MCPUtils.createClient('edgeone-pages', 'https://proxy.edgeone.site/mcp-server');
        } catch (clientError: any) {
          const error = new Error(`部署服务连接失败: ${clientError.message || String(clientError)}`);
          (error as any).code = 'MCP_CLIENT_CONNECTION_ERROR';
          (error as any).phase = 'initialization';
          throw error;
        }

        try {
          // Generate HTML content based on user query
          const htmlContent = await generateHTMLContent(userQuery, {
            apiKey: API_KEY,
            baseUrl: BASE_URL,
            model: MODEL,
          });

          try {
            // Deploy the HTML content using the already initialized MCP client
            const deploymentResult = await MCPUtils.executeTool(client, 'deploy-html', {
              value: htmlContent,
            });

            try {
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
            } catch (aiResponseError: any) {
              // If AI response generation fails, use the fallback logic but still return the deployment result
              if (!(aiResponseError as any).code) {
                (aiResponseError as any).code = 'AI_RESPONSE_ERROR';
                (aiResponseError as any).phase = 'response_generation';
              }
              
              // Use the deployment result even if AI response fails
              const urlPattern = /^https?:\/\/[^\s$.?#].[^\s]*$/i;
              const fallbackResponse = urlPattern.test(deploymentResult)
                ? `我已经根据您的需求创建并部署了网页。您可以通过此链接访问：${deploymentResult}`
                : `网页处理完成。结果：${deploymentResult}`;
              
              return createResponse({
                error: {
                  code: (aiResponseError as any).code,
                  message: aiResponseError.message,
                  phase: (aiResponseError as any).phase,
                  deploymentResult: deploymentResult // Include the deployment result
                },
                choices: [
                  {
                    message: {
                      role: 'assistant',
                      content: fallbackResponse,
                    },
                  },
                ],
              });
            }
          } catch (deployError: any) {
            if (!(deployError as any).code) {
              (deployError as any).code = 'DEPLOYMENT_ERROR';
              (deployError as any).phase = 'html_deployment';
            }
            throw deployError;
          }
        } catch (error: any) {
          // Return error as a properly formatted error response
          return createResponse(handleApiError(error));
        }
      } catch (error: any) {
        if (!error.code) {
          error.code = 'REQUEST_PROCESSING_ERROR';
          error.phase = 'request_processing';
        }
        return createResponse(handleApiError(error));
      } finally {
        // Ensure client cleanup happens if client was created
        if (client) {
          await MCPUtils.cleanup(client);
        }
      }
    }
  } catch (error: any) {
    if (!error.code) {
      error.code = 'REQUEST_PROCESSING_ERROR';
      error.phase = 'request_processing';
    }
    return createResponse(handleApiError(error));
  }
}

/**
 * Generate AI response based on deployment result
 */
async function generateAIResponse(
  deploymentResult: string,
  openaiConfig: any,
  onStreamDelta?: (delta: string, full: string) => void
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
          connectTimeout: 300000,
          readTimeout: 300000,
          writeTimeout: 300000,
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
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = new Error(
        `AI服务请求失败: ${response.status} ${response.statusText}`
      );
      (error as any).code = 'AI_SERVICE_ERROR';
      (error as any).phase = 'response_generation';
      throw error;
    }

    const content = await readChatCompletionContent(response, onStreamDelta);
    
    if (!content) {
      const error = new Error('AI服务返回内容为空');
      (error as any).code = 'EMPTY_AI_RESPONSE';
      (error as any).phase = 'response_generation';
      throw error;
    }
    
    return content;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(`AI服务暂时无法使用: ${String(error)}`);
    
    if (!(err as any).code) {
      (err as any).code = 'RESPONSE_GENERATION_ERROR';
      (err as any).phase = 'response_generation';
    }
    
    throw err;
  }
}
