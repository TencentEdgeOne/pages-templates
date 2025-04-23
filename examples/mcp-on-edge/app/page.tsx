"use client";

import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
  useMemo,
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
  const [userInput, setUserInput] = useState('');
  const [showKeywords, setShowKeywords] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const placeholderIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const placeholderRef = useRef<string>('帮我生成一个表白网页');
  const showCursorRef = useRef<boolean>(true);
  
  useLayoutEffect(() => {
    setIsClient(true);
  }, []);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 快捷提示数组
  const promptSuggestions = [
    { title: '表白网页', prompt: '生成一个表白网页，并部署' },
    { title: '个人简历', prompt: '生成一个漂亮的个人简历，并部署' },
    { title: '博客站点', prompt: '生成一个简约风格的博客站点，并部署' },
    { title: '作品集', prompt: '生成一个展示作品的网站，并部署' },
  ];

  // 使用useMemo包装占位符数组，避免每次渲染重新创建
  const placeholderVariants = useMemo(() => [
    '表白网页',
    '个人简历',
    '博客站点',
    '商城应用',
    '作品集',
    '电子相册',
    '在线简历',
    '婚礼邀请函',
    '落地页',
    '产品展示页',
    '个人主页',
    '旅行博客',
  ], []);

  // 先定义setupCursorBlinking函数，再在useEffect中使用它
  // 提取光标闪烁逻辑为单独函数，方便重用
  const setupCursorBlinking = useCallback(() => {
    const cursorInterval = setInterval(() => {
      showCursorRef.current = !showCursorRef.current;
      // 只在textarea没有焦点时更新placeholder光标
      if (textareaRef.current && document.activeElement !== textareaRef.current && showKeywords) {
        const currentPlaceholder = textareaRef.current.getAttribute('placeholder') || '';
        if (currentPlaceholder.endsWith('|')) {
          textareaRef.current.setAttribute('placeholder', currentPlaceholder.slice(0, -1));
        } else if (!currentPlaceholder.endsWith('|')) {
          textareaRef.current.setAttribute('placeholder', currentPlaceholder + '|');
        }
      }
    }, 600); // 光标闪烁间隔
    
    placeholderIntervalRef.current = cursorInterval;
    return cursorInterval;
  }, [showKeywords]);

  // 移除自动聚焦到输入框的效果，简化focus/blur处理
  useEffect(() => {
    // 页面加载后不再自动聚焦到输入框
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    
    // 聚焦时完全清除placeholder
    const handleFocus = () => {
      textarea.setAttribute('data-placeholder', textarea.getAttribute('placeholder') || '');
      textarea.setAttribute('placeholder', '');
      // 停止所有placeholder相关的动画
      if (placeholderIntervalRef.current) {
        clearInterval(placeholderIntervalRef.current);
        placeholderIntervalRef.current = null;
      }
    };
    
    // 失焦时恢复placeholder，但只在没有输入内容且聊天未开始时
    const handleBlur = () => {
      if (!textarea.value.trim() && showKeywords) {
        const savedPlaceholder = textarea.getAttribute('data-placeholder');
        if (savedPlaceholder) {
          // 先恢复原始placeholder
          textarea.setAttribute('placeholder', savedPlaceholder.endsWith('|') 
            ? savedPlaceholder.slice(0, -1) // 移除末尾可能存在的光标
            : savedPlaceholder);
            
          // 重新启动光标闪烁动画和placeholder动画
          if (!placeholderIntervalRef.current) {
            setupCursorBlinking();
          }
        }
      }
    };
    
    textarea.addEventListener('focus', handleFocus);
    textarea.addEventListener('blur', handleBlur);
    
    return () => {
      textarea.removeEventListener('focus', handleFocus);
      textarea.removeEventListener('blur', handleBlur);
    };
  }, [isClient, showKeywords, setupCursorBlinking]);

  // 优化光标闪烁效果 - 使用ref而不是state
  useEffect(() => {
    const cursorInterval = setupCursorBlinking();
    
    return () => {
      if (cursorInterval) {
        clearInterval(cursorInterval);
      }
    };
  }, [isClient, showKeywords, setupCursorBlinking]);

  // 优化后的动态placeholder实现
  useEffect(() => {
    if (!isClient || !textareaRef.current) return;
    
    // 聊天开始后不再显示placeholder动画
    if (!showKeywords) return;
    
    // 移除前缀，直接显示变化部分
    let variantIndex = 0;
    let charIndex = 0;
    let direction: 'typing' | 'deleting' = 'typing';
    let currentVariant = placeholderVariants[variantIndex];
    let pauseCounter = 0;
    const typingPause = 60; // 打字完成后的停顿帧数增加
    const deletingPause = 30; // 删除完成后的停顿帧数
    const completeShowPause = 150; // 完整显示后的停顿帧数，大约5秒
    
    const updatePlaceholder = () => {
      if (!textareaRef.current) return;
      
      // 只在textarea没有焦点且聊天未开始时更新placeholder内容
      if (document.activeElement === textareaRef.current || !showKeywords) {
        return;
      }
      
      if (direction === 'typing') {
        if (charIndex < currentVariant.length) {
          if (pauseCounter > 0) {
            pauseCounter--;
          } else {
            charIndex++;
            // 增加随机停顿，模拟真实打字效果
            if (Math.random() < 0.2 && charIndex < currentVariant.length) {
              pauseCounter = Math.floor(Math.random() * 5) + 1;
            }
          }
          const variantText = currentVariant.substring(0, charIndex);
          // 直接修改DOM属性，不触发重新渲染
          const cursorChar = showCursorRef.current ? '|' : '';
          textareaRef.current.setAttribute('placeholder', `帮我生成一个${variantText}${cursorChar}`);
        } else {
          // 完整显示后长时间停顿，增强可读性
          if (pauseCounter < completeShowPause) {
            pauseCounter++;
            // 在等待期间仍然更新光标
            const variantText = currentVariant.substring(0, charIndex);
            const cursorChar = showCursorRef.current ? '|' : '';
            textareaRef.current.setAttribute('placeholder', `帮我生成一个${variantText}${cursorChar}`);
          } else {
            pauseCounter = 0;
            direction = 'deleting';
          }
        }
      } else {
        if (charIndex > 0) {
          if (pauseCounter > 0) {
            pauseCounter--;
          } else {
            charIndex--;
            // 删除时偶尔停顿，看起来更自然
            if (Math.random() < 0.1) {
              pauseCounter = Math.floor(Math.random() * 3) + 1;
            }
          }
          const variantText = currentVariant.substring(0, charIndex);
          // 直接修改DOM属性，不触发重新渲染
          const cursorChar = showCursorRef.current ? '|' : '';
          textareaRef.current.setAttribute('placeholder', `帮我生成一个${variantText}${cursorChar}`);
        } else {
          // 完成删除后短暂停顿再切换到下一个占位符
          if (pauseCounter < deletingPause) {
            pauseCounter++;
            // 在等待期间仍然更新光标
            const variantText = currentVariant.substring(0, charIndex);
            const cursorChar = showCursorRef.current ? '|' : '';
            textareaRef.current.setAttribute('placeholder', `帮我生成一个${variantText}${cursorChar}`);
          } else {
            pauseCounter = 0;
            direction = 'typing';
            // 随机选择下一个占位符，避免重复
            const prevIndex = variantIndex;
            while (variantIndex === prevIndex) {
              variantIndex = Math.floor(Math.random() * placeholderVariants.length);
            }
            currentVariant = placeholderVariants[variantIndex];
          }
        }
      }
    };
    
    // 使用较短的时间间隔使动画更流畅
    const timeoutId = setInterval(() => {
      updatePlaceholder();
    }, 30); // 使用固定的较短间隔，通过内部逻辑控制速度变化
    
    return () => clearInterval(timeoutId);
  }, [isClient, placeholderVariants, showKeywords]);

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
    if (!response.ok || !response.body) {
      throw new Error(`HTTP错误：${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let content = '';
    let thinking = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // 尝试解析完整的JSON对象
        let boundary = buffer.indexOf('\n');
        while (boundary !== -1) {
          const line = buffer.substring(0, boundary).trim();
          buffer = buffer.substring(boundary + 1);
          
          if (line) {
            try {
              const data = JSON.parse(line);
              
              if (data.content !== undefined) {
                content = data.content;
              }
              
              if (data.thinking !== undefined) {
                thinking = data.thinking;
              }
              
              // 更新消息内容
              updateMessage({ 
                content: content, 
                think: thinking 
              });
            } catch (e) {
              console.error('解析JSON出错:', e, line);
            }
          }
          
          boundary = buffer.indexOf('\n');
        }
      }
      
      // 处理可能剩余在缓冲区的数据
      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer.trim());
          
          if (data.content !== undefined) {
            content = data.content;
          }
          
          if (data.thinking !== undefined) {
            thinking = data.thinking;
          }
          
          // 更新最终消息内容
          updateMessage({ 
            content: content, 
            think: thinking 
          });
        } catch (e) {
          console.error('解析最终JSON出错:', e);
        }
      }
    } catch (error) {
      console.error('处理流响应出错:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    // 聊天开始时立即设置showKeywords为false
    setShowKeywords(false);
    
    // 聊天开始后，清除placeholder并不再显示
    if (textareaRef.current) {
      textareaRef.current.setAttribute('placeholder', '');
    }
    
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
        throw new Error(`HTTP error: ${res.status}`);
      }

      // 处理流式响应
      if (res.headers.get('content-type')?.includes('text/event-stream')) {
        await processStreamResponse(res, (messageContent) => {
          debouncedUpdateMessage((prevMessages) => [
            prevMessages[0],
            {
              role: 'assistant',
              content: messageContent.content || '',
              think: messageContent.think || '',
            },
          ]);
        });
      } else {
        // 处理常规JSON响应
        const data = await res.json();
        setMessages([
          { role: 'user', content: currentInput },
          {
            role: 'assistant',
            content: data.content || data.choices?.[0]?.message?.content || '',
            think: data.thinking || '',
          },
        ]);
      }
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

  // 处理快捷提示的点击
  const handleSuggestionClick = (prompt: string) => {
    setUserInput(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
      // 自动调整高度
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const ThinkDrawer = ({ content }: { content: string }) => {
    const [isOpen, setIsOpen] = useState(true);

    if (!content.trim()) return null;

    return (
      <div className="mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 rounded-t-lg hover:bg-zinc-700 transition-colors"
        >
          <svg
            className={`w-4 h-4 mr-2 transition-transform duration-300 ${
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
          <div className="p-4 text-sm text-zinc-400 bg-zinc-800 border border-t-0 border-zinc-700 rounded-b-lg shadow-sm">
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
      <div className="flex items-center justify-center py-3 animate-pulse">
        <svg
          className="w-5 h-5 mr-3 animate-spin text-blue-500"
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
        <span className="text-zinc-300">边缘函数运行中，请稍后...</span>
      </div>
    );
  };

  return (
    isClient && (
      <div className="flex flex-col h-screen bg-deep-gradient">
        {/* Header - 与背景融为一体 */}
        <header className="sticky top-0 z-50 flex items-center px-6 py-3">
          <div className="flex items-center">
            <a 
              href="https://edgeone.ai/zh/products/pages" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-100 transition-colors"
            >
              <h1 className="text-base font-semibold">
                EdgeOne Pages
              </h1>
            </a>
          </div>
          <div className="flex-grow" />
          <a
            href="https://github.com/TencentEdgeOne/pages-templates/tree/main/examples/mcp-on-edge/README_zh-CN.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-800"
            aria-label="GitHub repository"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.489.5.092.682-.217.682-.48 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.918.678 1.85 0 1.338-.012 2.416-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          </a>
        </header>

        {/* 主内容区 */}
        <div className="flex-1 flex flex-col min-h-0">
          {showKeywords ? (
            <WelcomeMessage 
              show={showKeywords} 
              userInput={userInput} 
              setUserInput={setUserInput}
              handleSubmit={handleSubmit}
              handleTextareaChange={handleTextareaChange}
              handleSuggestionClick={handleSuggestionClick}
              textareaRef={textareaRef}
              isLoading={isLoading}
              promptSuggestions={promptSuggestions}
            />
          ) : (
            <>
              {/* Messages section */}
              <div
                ref={messageRef}
                className="flex-1 px-4 py-6 overflow-y-auto md:px-6 scrollbar-thin"
              >
                <div className="max-w-3xl mx-auto space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      } animate-fade-in`}
                    >
                      <div
                        className={`relative max-w-[90%] shadow-md ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white px-5 py-3 chat-bubble-user'
                            : 'bg-slate-800/70 text-slate-100 border border-zinc-700 px-5 py-4 chat-bubble-assistant'
                        }`}
                      >
                        {message.role === 'user' && (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        )}

                        {message.role === 'assistant' && (
                          <div
                            className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:border 
                        prose-pre:border-zinc-700 prose-code:text-blue-400 prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5
                        prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-strong:text-slate-200
                        prose-a:text-blue-500 hover:prose-a:underline prose-headings:text-slate-200
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
                                    <pre className="p-4 overflow-auto bg-zinc-900 rounded-lg">
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
                                    className="text-blue-500 hover:text-blue-400 transition-colors"
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

              {/* Input section - 简化的输入框 */}
              <div className="py-4 px-4 z-10">
                <div className="max-w-3xl mx-auto">
                  <form onSubmit={handleSubmit}>
                    <div className="input-gradient-border">
                      <div className="flex relative overflow-hidden minimal-input rounded-xl">
                        <textarea
                          ref={textareaRef}
                          value={userInput}
                          onChange={handleTextareaChange}
                          placeholder="帮我生成一个表白网页"
                          disabled={isLoading}
                          className={`w-full bg-transparent text-slate-200 px-5 py-4 focus:outline-none resize-none min-h-[120px] placeholder:text-zinc-500 border-none ${
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
                        <button
                          type="submit"
                          disabled={isLoading || !userInput.trim()}
                          className={`absolute right-3 bottom-3 flex items-center justify-center rounded-full h-10 w-10 transition-all duration-200 ${
                            isLoading || !userInput.trim()
                              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'
                              : 'bg-blue-600 text-white hover:shadow-md hover:shadow-blue-600/25'
                          }`}
                          aria-label="发送"
                        >
                          {isLoading ? (
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 12h14m-4 4l4-4-4-4"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                  
                  {/* 快捷提示标签 - 更加精致的样式 */}
                  <div className="mt-5 flex flex-wrap gap-3 justify-center">
                    {promptSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion.prompt)}
                        disabled={isLoading}
                        className="px-4 py-2 bg-transparent text-zinc-300 hover:text-blue-400 rounded-full text-sm transition-all border border-zinc-700/60 hover:border-blue-500 shadow-sm backdrop-blur-sm flex items-center group"
                      >
                        <span>{suggestion.title}</span>
                        <svg className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
            
        {/* 页脚 - MCP服务信息，始终显示在底部 */}
        <footer className="py-3 px-4 border-t border-zinc-800/50 w-full">
          <div className="max-w-3xl mx-auto flex justify-center">
            <a 
              href="https://edgeone.cloud.tencent.com/pages/document/173172415568367616" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-400 text-sm transition-colors"
            >
              Powered by EdgeOne Pages MCP Server
            </a>
          </div>
        </footer>
      </div>
    )
  );
}

// WelcomeMessage组件，从父组件接收props
interface WelcomeMessageProps {
  show: boolean;
  userInput: string;
  setUserInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSuggestionClick: (prompt: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  isLoading: boolean;
  promptSuggestions: { title: string; prompt: string }[];
}

const WelcomeMessage = ({ 
  show, 
  userInput, 
  setUserInput, 
  handleSubmit, 
  handleTextareaChange, 
  handleSuggestionClick, 
  textareaRef, 
  isLoading, 
  promptSuggestions 
}: WelcomeMessageProps) => {
  if (!show) return null;

  return (
    <div className="flex flex-col items-center justify-center flex-grow animate-fade-in px-4">
      <div className="relative max-w-3xl w-full flex flex-col items-center">
        {/* 主标题和副标题 - 增加间距 */}
        <h1 className="text-5xl font-bold text-center mb-5 gradient-text-blue-purple">
          网页版 MCP
        </h1>
        <h2 className="text-2xl font-medium text-center mb-6 text-white">
          一句话生成一个全球加速站点
        </h2>
        <p className="text-base text-zinc-300 text-center mb-16 w-full px-4">
          基于 EdgeOne 边缘函数实现的 MCP Client 与 MCP Server
        </p>

        {/* 输入框部分 */}
        <div className="w-full relative">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="input-gradient-border">
              <div className="flex relative overflow-hidden minimal-input rounded-xl">
                <textarea
                  ref={textareaRef}
                  value={userInput}
                  onChange={handleTextareaChange}
                  placeholder="帮我生成一个表白网页"
                  disabled={isLoading}
                  rows={3}
                  className="w-full bg-transparent text-slate-200 px-5 py-4 focus:outline-none resize-none min-h-[120px] placeholder:text-zinc-500 border-none"
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
                <button
                  type="submit"
                  disabled={isLoading || !userInput.trim()}
                  className={`absolute right-3 bottom-3 flex items-center justify-center rounded-full h-10 w-10 transition-all duration-200 ${
                    isLoading || !userInput.trim()
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'
                      : 'bg-blue-600 text-white hover:shadow-md hover:shadow-blue-600/25'
                  }`}
                  aria-label="发送"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h14m-4 4l4-4-4-4"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </form>
          
          {/* 添加快捷提示按钮在欢迎页面上 - 更加精致的样式 */}
          <div className="mt-5 flex flex-wrap gap-3 justify-center">
            {promptSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.prompt)}
                disabled={isLoading}
                className="px-4 py-2 bg-transparent text-zinc-300 hover:text-blue-400 rounded-full text-sm transition-all border border-zinc-700/60 hover:border-blue-500 shadow-sm backdrop-blur-sm flex items-center group"
              >
                <span>{suggestion.title}</span>
                <svg className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
