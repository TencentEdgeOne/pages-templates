import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import readline from 'readline/promises';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;
const MODEL = process.env.MODEL as string;

if (!API_KEY || !BASE_URL || !MODEL) {
  throw new Error('Missing required environment variables');
}

interface Tool {
  name: string;
  description: string | undefined;
  inputSchema: Record<string, any>;
}

class MCPClient {
  private mcp: Client;
  private openai: OpenAI;
  private transport: StdioClientTransport | null = null;
  private tools: Tool[] = [];

  constructor() {
    this.openai = new OpenAI({
      apiKey: API_KEY,
      baseURL: BASE_URL,
    });
    this.mcp = new Client({ name: 'mcp-client-cli', version: '1.0.0' });
  }

  // 服务器连接管理
  async connectToServer(serverScriptPath: string) {
    try {
      const isJs = serverScriptPath.endsWith('.js');
      const isPy = serverScriptPath.endsWith('.py');
      if (!isJs && !isPy) {
        throw new Error('Server script must be a .js or .py file');
      }
      const command = isPy
        ? process.platform === 'win32'
          ? 'python'
          : 'python3'
        : process.execPath;

      this.transport = new StdioClientTransport({
        command,
        args: [serverScriptPath],
      });
      this.mcp.connect(this.transport);

      const toolsResult = await this.mcp.listTools();
      this.tools = toolsResult.tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      }));

      console.log(
        'Connected to server with tools:',
        this.tools.map((tool) => tool.name)
      );
    } catch (e) {
      console.log('Failed to connect to MCP server: ', e);
      throw e;
    }
  }

  // Extract tool calls from model response text
  private extractToolCalls(
    responseText: string
  ): Array<{ name: string; args: any }> {
    const toolCalls: Array<{ name: string; args: any }> = [];

    // Look for patterns like: callTool('toolName', {...}) or callTool("toolName", {...})
    const toolCallRegex =
      /callTool\s*\(\s*['"]([^'"]+)['"]\s*,\s*(\{[^}]*\})\s*\)/g;
    let match;

    while ((match = toolCallRegex.exec(responseText)) !== null) {
      try {
        const toolName = match[1];
        const argsString = match[2];
        const args = JSON.parse(argsString);
        toolCalls.push({ name: toolName, args });
      } catch (error) {
        console.error('Failed to parse tool call:', match[0], error);
      }
    }

    return toolCalls;
  }

  // 创建适合工具调用的系统提示
  private createSystemPrompt(): string {
    let prompt =
      'You are an AI assistant that can use tools to help answer questions. ';

    if (this.tools.length > 0) {
      prompt += 'You have access to the following tools:\n\n';

      this.tools.forEach((tool) => {
        prompt += `Tool: ${tool.name}\n`;
        prompt += `Description: ${tool.description}\n`;
        prompt += `Parameters: ${JSON.stringify(
          tool.inputSchema,
          null,
          2
        )}\n\n`;
      });

      prompt +=
        'IMPORTANT: To use a tool, you MUST include the exact string \'callTool("toolName", {parameters})\' in your response.\n';
      prompt +=
        'For example: callTool("search", {"query": "weather in San Francisco"})\n';
      prompt +=
        'To use a tool with no parameters, use an empty object: callTool("get_geolocation", {})\n';
      prompt +=
        "Do not describe what you're going to do - just use the callTool syntax directly.\n";
      prompt +=
        'If you need to use multiple tools, include multiple callTool statements in your response.\n';
      prompt +=
        'After receiving tool results, provide a final answer without any callTool statements.';
    }

    return prompt;
  }

  // 交互式聊天界面
  async chatLoop() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    try {
      console.log('\nMCP Client Started!');
      console.log("Type your queries or 'quit' to exit.");

      while (true) {
        const message = await rl.question('\nQuery: ');
        if (message.toLowerCase() === 'quit') {
          break;
        }

        // 处理查询并获取详细结果信息
        const { finalResponse, toolCallsInfo } =
          await this.processQueryWithDetails(message);

        // 如果有工具调用，显示工具调用过程
        if (toolCallsInfo.length > 0) {
          console.log('\n====== Tool Calls Process ======');
          toolCallsInfo.forEach((info, index) => {
            console.log(`\n[Tool Call ${index + 1}]`);
            console.log(`Tool: ${info.name}`);
            console.log(`Arguments: ${JSON.stringify(info.args, null, 2)}`);
            console.log(`Result: ${info.result}`);
          });
          console.log('\n====== Final Response ======');
        }

        console.log('\n' + finalResponse);
      }
    } finally {
      rl.close();
    }
  }

  // 查询处理逻辑
  async processQuery(query: string): Promise<string> {
    const { finalResponse } = await this.processQueryWithDetails(query);
    return finalResponse;
  }

  // 查询处理逻辑 (带详细结果)
  async processQueryWithDetails(query: string): Promise<{
    finalResponse: string;
    toolCallsInfo: Array<{ name: string; args: any; result: string }>;
  }> {
    const systemPrompt = this.createSystemPrompt();
    const toolCallsInfo: Array<{ name: string; args: any; result: string }> =
      [];

    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: query,
      },
    ];

    console.log('\n===== INPUT MESSAGES TO MODEL =====');
    console.log(JSON.stringify(messages, null, 2));
    console.log('===============================\n');

    console.log('Sending request to LLM...');

    try {
      // First request without tools API
      let response = await this.openai.chat.completions.create({
        model: MODEL,
        messages: messages,
      });

      console.log('\n===== RAW MODEL RESPONSE =====');
      console.log(JSON.stringify(response, null, 2));
      console.log('==============================\n');

      let responseContent = response.choices[0].message.content || '';
      console.log('Response content:', responseContent);

      // Check if the response contains tool calls
      const toolCalls = this.extractToolCalls(responseContent);

      if (toolCalls.length > 0) {
        console.log('Tool calls detected:', toolCalls.length);

        // Add the assistant message to conversation
        messages.push({
          role: 'assistant',
          content: responseContent,
        });

        // Process each tool call
        for (const toolCall of toolCalls) {
          const toolName = toolCall.name;
          const toolArgs = toolCall.args;

          console.log(
            `Calling MCP tool: ${toolName} with args: ${JSON.stringify(
              toolArgs
            )}`
          );

          try {
            const result = await this.mcp.callTool({
              name: toolName,
              arguments: toolArgs,
            });

            // 正确处理工具调用结果，确保复杂对象被序列化
            const resultContent =
              typeof result.content === 'object'
                ? JSON.stringify(result.content, null, 2)
                : (result.content as string);

            console.log(`Tool ${toolName} result:`, resultContent);

            // Save tool call info for display
            toolCallsInfo.push({
              name: toolName,
              args: toolArgs,
              result: resultContent,
            });

            // Add tool result as a user message
            messages.push({
              role: 'user',
              content: `Tool result for ${toolName}: ${resultContent}`,
            });
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            console.error(`Error calling tool ${toolName}:`, errorMessage);

            // Save error info for display
            toolCallsInfo.push({
              name: toolName,
              args: toolArgs,
              result: `Error: ${errorMessage}`,
            });

            // Add error as a user message
            messages.push({
              role: 'user',
              content: `Error executing tool ${toolName}: ${errorMessage}`,
            });
          }
        }

        console.log('\n===== FOLLOW-UP MESSAGES TO MODEL =====');
        console.log(JSON.stringify(messages, null, 2));
        console.log('=======================================\n');

        // Send follow-up request with tool results
        console.log('Sending second request to LLM with tool results...');
        response = await this.openai.chat.completions.create({
          model: MODEL,
          messages: messages,
        });

        console.log('\n===== RAW FOLLOW-UP MODEL RESPONSE =====');
        console.log(JSON.stringify(response, null, 2));
        console.log('=======================================\n');

        responseContent = response.choices[0].message.content || '';
      }

      // Return the final response (without any tool calls in the text)
      const finalResponse =
        responseContent
          .replace(/callTool\s*\(\s*['"][^'"]+['"]\s*,\s*\{[^}]*\}\s*\)/g, '')
          .trim() || 'No response content.';
      return { finalResponse, toolCallsInfo };
    } catch (error) {
      console.error('Error during LLM API call:', error);
      const errorMessage =
        error instanceof OpenAI.APIError
          ? `LLM API Error: ${error.status} ${error.name} ${error.message}`
          : `Error processing query: ${
              error instanceof Error ? error.message : String(error)
            }`;

      return { finalResponse: errorMessage, toolCallsInfo };
    }
  }

  async cleanup() {
    await this.mcp.close();
  }
}

async function main() {
  if (process.argv.length < 3) {
    console.log('Usage: node index.ts <path_to_server_script>');
    return;
  }
  const mcpClient = new MCPClient();
  try {
    await mcpClient.connectToServer(process.argv[2]);
    await mcpClient.chatLoop();
  } finally {
    await mcpClient.cleanup();
    process.exit(0);
  }
}

main();
