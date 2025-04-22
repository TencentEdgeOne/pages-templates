'use client';

import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import debounce from 'lodash/debounce';

// Custom function to escape underscores in URLs
const escapeUnderscoresInLinks = (content: string) => {
  // Regex to find markdown links with underscores at the end
  // Format: [text](url_) or [text](url___)
  return content.replace(
    /\[([^\]]+)\]\(([^)]*?)(_+)(?=\))\)/g,
    (match, text, url, underscores) => {
      // Replace each underscore with its URL encoded version
      const encodedUnderscores = underscores.replace(/_/g, '%5F');
      return `[${text}](${url}${encodedUnderscores})`;
    }
  );
};

interface MessageContent {
  content: string;
  think?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  think?: string;
  source?: { title: string; url: string }[];
}

export default function Home() {
  const [userInput, setUserInput] = useState('生成一个表白网页，并部署');
  const [showKeywords, setShowKeywords] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    setIsClient(true);
  }, []);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const debouncedUpdateMessage = useCallback(
    debounce((updateFn: (prev: Message[]) => Message[]) => {
      setMessages(updateFn);
    }, 50),
    []
  );

  const processStreamResponse = async (
    response: Response,
    updateMessage: (content: MessageContent) => void
  ) => {
    const contentType = response.headers.get('content-type');

    // If we get here with a JSON response, we already tried parsing it in handleSubmit
    // So we'll treat it as an error case or try to extract any relevant error message
    if (contentType && contentType.includes('application/json')) {
      setIsSearching(false);
      try {
        const responseClone = response.clone();
        const errorData = await responseClone.json();
        return updateMessage({
          content:
            errorData?.error ||
            errorData?.message ||
            errorData?.content ||
            JSON.stringify(errorData) ||
            '抱歉，出现了错误。请重试。',
        });
      } catch (jsonError) {
        console.error('解析JSON错误响应失败:', jsonError);
        return updateMessage({
          content: '无法解析错误响应。请重试。',
        });
      }
    }

    // Check if the body exists and is readable
    if (!response.body) {
      setIsSearching(false);
      console.error('响应没有可读取的主体');
      return updateMessage({
        content: '响应没有可读取的主体。请重试。',
      });
    }

    try {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      let accumulatedContent = '';
      let accumulatedThink = '';
      let thinking = false;
      let hasReceivedContent = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (
            !line.trim() ||
            line.includes('[DONE]') ||
            !line.includes('data: ')
          )
            continue;
          try {
            const json = JSON.parse(line.replace(/^data: /, ''));
            const token = json.choices[0]?.delta?.content || '';
            const reasoningToken =
              json.choices[0]?.delta?.reasoning_content || '';

            // Turn off searching indicator when first token arrives
            if (isSearching) {
              setIsSearching(false);
            }

            // Mark that we've received some content
            hasReceivedContent = true;

            // Handle think content
            if (
              token.includes('<think>') ||
              token.includes('\u003cthink\u003e')
            ) {
              thinking = true;
              continue;
            }
            if (
              token.includes('</think>') ||
              token.includes('\u003c/think\u003e')
            ) {
              thinking = false;
              continue;
            }

            if (thinking || reasoningToken) {
              accumulatedThink += token || reasoningToken || '';
            } else {
              accumulatedContent += token || '';
            }

            updateMessage({
              content: accumulatedContent,
              think: accumulatedThink,
            });
          } catch (e) {
            console.error('解析流数据块失败:', e, line);
          }
        }
      }

      // If we didn't receive any content from the stream, try to parse the full body
      if (!hasReceivedContent) {
        const responseClone = response.clone();
        try {
          const fullText = await responseClone.text();
          if (fullText.trim()) {
            updateMessage({
              content: fullText,
            });
            return;
          }
        } catch (fullTextError) {
          console.error('处理完整响应失败:', fullTextError);
        }
      }
    } catch (streamError) {
      console.error('读取流响应失败:', streamError);
      updateMessage({
        content: '读取响应流失败。请重试。',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    setShowKeywords(false);
    setIsLoading(true);
    setIsSearching(true);
    const currentInput = textareaRef.current?.value || '';
    setUserInput('');

    // Clear previous messages and set only the current Q&A pair
    setMessages([
      { role: 'user', content: currentInput },
      { role: 'assistant', content: '' },
    ]);

    setTimeout(() => {
      messageRef.current?.scrollTo(0, messageRef.current?.scrollHeight);
    }, 300);

    try {
      const url =
        process.env.NODE_ENV === 'development'
          ? process.env.NEXT_PUBLIC_BASE_URL!
          : '/v1/chat/completions';

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: currentInput }],
        }),
      });

      if (!res.ok) {
        console.error('API响应错误:', res.status, res.statusText);
        let errorMessage = `服务器返回错误: ${res.status} ${res.statusText}`;

        try {
          // 尝试解析错误响应体
          const responseText = await res.text();
          console.error('错误响应体:', responseText);

          // 尝试将响应解析为JSON
          try {
            const errorData = JSON.parse(responseText);
            if (errorData?.error) {
              errorMessage = errorData.error;
            }
          } catch (jsonError) {
            // 如果不是有效的JSON，使用原始响应文本
            if (responseText) {
              errorMessage = `服务器错误: ${responseText}`;
            }
          }
        } catch (textError) {
          console.error('无法读取错误响应体:', textError);
        }

        // 设置错误消息到UI
        setMessages([
          { role: 'user', content: currentInput },
          { role: 'assistant', content: errorMessage },
        ]);
        setIsSearching(false);
        throw new Error(errorMessage);
      }

      // First check if it's a simple JSON response without streaming
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          // Clone the response so we can use it for stream processing if needed
          const clone = res.clone();
          const jsonData = await res.json();

          // If this has a message, content, or choices[0].message.content field, use it directly
          if (
            jsonData.message ||
            jsonData.content ||
            (jsonData.choices && jsonData.choices[0]?.message?.content)
          ) {
            const messageContent =
              jsonData.message ||
              jsonData.content ||
              jsonData.choices[0]?.message?.content;
            setMessages([
              { role: 'user', content: currentInput },
              { role: 'assistant', content: messageContent },
            ]);
            setIsLoading(false);
            setIsSearching(false);
            return;
          }

          // Otherwise, fall back to stream processing with the cloned response
          await processStreamResponse(clone, (_content: MessageContent) => {
            debouncedUpdateMessage((prev) => {
              const newMessages = structuredClone(prev);
              const lastMessage = newMessages[newMessages.length - 1];

              if (_content.think) {
                lastMessage.think = _content.think;
              }
              if (_content.content) {
                lastMessage.content = _content.content;
              }

              return newMessages;
            });
          });
          return;
        } catch (jsonError) {
          console.error('解析JSON响应失败，回退到流处理:', jsonError);
          // Continue with normal stream processing
        }
      }

      // Check if it's a plain text response
      if (contentType && contentType.includes('text/plain')) {
        try {
          const textResponse = await res.text();
          if (textResponse.trim()) {
            setMessages([
              { role: 'user', content: currentInput },
              { role: 'assistant', content: textResponse },
            ]);
            setIsLoading(false);
            setIsSearching(false);
            return;
          }
        } catch (textError) {
          console.error('解析文本响应失败:', textError);
          // Continue with normal stream processing
        }
      }

      let source: { url: string; title: string }[] = [];
      res.headers.forEach((value, name) => {
        if (name === 'results') {
          const results = JSON.parse(value);
          source = results.map((result: { url: string; title: string }) => {
            return {
              url: result.url,
              title: decodeURIComponent(result.title),
            };
          });
        }
      });

      // Check for direct message content in headers
      let directMessage = '';
      res.headers.forEach((value, name) => {
        if (
          name.toLowerCase() === 'content' ||
          name.toLowerCase() === 'message'
        ) {
          try {
            directMessage = decodeURIComponent(value);
          } catch (e) {
            directMessage = value;
          }
        }
      });

      // If we have a direct message, update immediately
      if (directMessage) {
        setMessages([
          { role: 'user', content: currentInput },
          { role: 'assistant', content: directMessage, source },
        ]);
        setIsLoading(false);
        setIsSearching(false);
        return;
      }

      setMessages((prev) => {
        const newMessages = structuredClone(prev);
        const lastMessage = newMessages[newMessages.length - 1];
        lastMessage.source = source;
        return newMessages;
      });

      await processStreamResponse(res, (_content: MessageContent) => {
        debouncedUpdateMessage((prev) => {
          const newMessages = structuredClone(prev);
          const lastMessage = newMessages[newMessages.length - 1];

          if (_content.think) {
            lastMessage.think = _content.think;
          }
          if (_content.content) {
            lastMessage.content = _content.content;
          }

          return newMessages;
        });
      });
    } catch (error) {
      console.error('请求错误:', error);
      // 如果已经设置了错误消息，就不再重复设置
      if (
        messages.length < 2 ||
        messages[1].role !== 'assistant' ||
        !messages[1].content
      ) {
        setMessages([
          { role: 'user', content: currentInput },
          {
            role: 'assistant',
            content:
              error instanceof Error
                ? error.message
                : '抱歉，出现了错误。请重试。',
          },
        ]);
      }
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const WelcomeMessage = ({ show }: { show: boolean }) => {
    if (!show) return null;

    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="max-w-3xl px-4 mx-auto text-center">
          <h2 className="mb-2 text-2xl font-semibold text-gray-800">
            在边缘使用 MCP
          </h2>
          <p className="text-gray-600">
            EdgeOne Pages 边缘 MCP Client & Server
            示例，一句话生成一个全球加速站点。
          </p>

          <p className="mt-2 text-sm text-gray-500">
            免费使用{' '}
            <a
              href="https://edgeone.ai/zh/products/pages"
              target="_blank"
              className="mt-4 text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
            >
              EdgeOne Pages
            </a>
          </p>
        </div>
      </div>
    );
  };

  const ThinkDrawer = ({ content }: { content: string }) => {
    const [isOpen, setIsOpen] = useState(true);

    if (!content.trim()) return null;

    return (
      <div className="mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-600 bg-white rounded-t-lg hover:bg-gray-100"
        >
          <svg
            className={`w-4 h-4 mr-2 transition-transform ${
              isOpen ? 'transform rotate-90' : ''
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          思考过程
        </button>
        {isOpen && (
          <div className="p-3 text-sm text-gray-400 bg-white rounded-b-lg">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {escapeUnderscoresInLinks(content)}
            </ReactMarkdown>
          </div>
        )}
      </div>
    );
  };

  const SearchingIndicator = () => {
    if (!isSearching) return null;

    return (
      <div className="mb-2">
        <div className="flex items-center justify-center w-full px-3 py-2 text-sm text-gray-600 bg-white rounded-lg shadow-sm border border-gray-100">
          <svg
            className="w-4 h-4 mr-2 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          边缘函数运行中，请稍后...
        </div>
      </div>
    );
  };

  return (
    isClient && (
      <div className="flex flex-col h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center px-6 py-3 bg-white">
          <h1 className="text-base font-semibold text-gray-800">
            EdgeOne Pages
          </h1>
          <div className="flex-grow" />
          <a
            href="https://github.com/TencentEdgeOne/pages-templates/tree/main/examples/mcp-on-edge/README_zh-CN.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900"
            aria-label="GitHub repository"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.489.5.092.682-.217.682-.48 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.918.678 1.85 0 1.338-.012 2.416-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          </a>
        </header>

        <WelcomeMessage show={showKeywords} />

        {/* Messages section */}
        <div
          ref={messageRef}
          className="flex-1 px-4 py-4 overflow-y-auto md:px-6"
        >
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`relative max-w-[100%] px-4 py-3 rounded-md ${
                    message.role === 'user'
                      ? 'bg-gray-200 text-black'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  {message.role === 'user' && (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}

                  {message.role === 'assistant' && (
                    <div
                      className="prose max-w-none prose-p:leading-relaxed prose-pre:bg-white prose-pre:border 
                  prose-pre:border-gray-200 prose-code:text-blue-600 prose-code:bg-white prose-code:px-1 prose-code:py-0.5
                  prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-strong:text-gray-900
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:no-underline prose-headings:text-gray-900
                  prose-ul:my-4 prose-li:my-0.5"
                    >
                      {message.think && <ThinkDrawer content={message.think} />}
                      {message.role === 'assistant' &&
                        index === messages.length - 1 &&
                        isSearching &&
                        !message.content &&
                        !message.think && <SearchingIndicator />}
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ node, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(
                              className || ''
                            );
                            return match ? (
                              <pre className="p-4 overflow-auto bg-white rounded-lg">
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              </pre>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                          a: (
                            props: React.AnchorHTMLAttributes<HTMLAnchorElement>
                          ) => (
                            <a
                              {...props}
                              target="_blank"
                              className="text-blue-600 hover:text-blue-800"
                            />
                          ),
                        }}
                      >
                        {escapeUnderscoresInLinks(message.content)}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input section */}
        <div className="px-4 bg-white">
          <form onSubmit={handleSubmit} className="max-w-3xl py-4 mx-auto">
            <div className="flex flex-col overflow-hidden border border-gray-200 rounded-xl">
              <textarea
                ref={textareaRef}
                value={userInput}
                onChange={handleTextareaChange}
                placeholder="输入消息..."
                disabled={isLoading}
                className={`w-full bg-white text-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none min-h-[52px] max-h-[200px] placeholder:text-gray-400 border-none ${
                  isLoading ? 'cursor-not-allowed opacity-50' : ''
                }`}
                onCompositionStart={(e) => {
                  (e.target as HTMLTextAreaElement).dataset.composing = 'true';
                }}
                onCompositionEnd={(e) => {
                  (e.target as HTMLTextAreaElement).dataset.composing = 'false';
                }}
                onKeyDown={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  const isComposing = target.dataset.composing === 'true';
                  if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <div className="flex items-center justify-end gap-2 px-4 py-2 bg-gray-50">
                <a
                  href="https://edgeone.ai/zh/document/173173997276819456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center px-2 py-1.5 rounded-lg text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors`}
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21.71 8.29l-5-5a1 1 0 0 0-1.42 0l-3 3c-.68.68-.68 1.71 0 2.38l.92.92-1.3 1.29a1 1 0 0 0 0 1.42l1 1a1 1 0 0 0 1.42 0l1.29-1.3.92.92a1.69 1.69 0 0 0 2.38 0l3-3a1 1 0 0 0 0-1.42l-.21-.21zM10.41 14l-7.7 7.71a1 1 0 0 1-1.42-1.42L9 12.59l.92.92L10.41 14z" />
                  </svg>
                  {'MCP 服务：edgeone-pages-mcp-server'}
                </a>
                <button
                  type="submit"
                  disabled={isLoading || !userInput.trim()}
                  className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                    isLoading || !userInput.trim()
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md active:transform active:scale-95'
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h14m-4 4l4-4-4-4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  );
}
