'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageContent {
  content: string;
  think?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  think?: string;
}

interface KeywordButton {
  text: string;
  query: string;
}

const KEYWORD_BUTTONS: KeywordButton[] = [
  {
    text: 'How to write Amazon product titles for wireless earphones with ANC and 40h battery life?',
    query:
      'How to write Amazon product titles for wireless earphones with ANC and 40h battery life?',
  },
  {
    text: 'Generate a professional email template to handle customer complaints about product quality',
    query:
      'Generate a professional email template to handle customer complaints about product quality',
  },
  {
    text: 'Help optimize Python code for quick sort algorithm with time complexity analysis',
    query:
      'Help optimize Python code for quick sort algorithm with time complexity analysis',
  },
  {
    text: 'Create a comparison table of marketing strategies between TikTok and Instagram Reels',
    query:
      'Create a comparison table of marketing strategies between TikTok and Instagram Reels',
  },
];

export const Base = () => {
  const [userInput, setUserInput] = useState('Hi');
  const [useNetwork, setUseNetwork] = useState(false);
  const [showKeywords, setShowKeywords] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [answered, setAnswered] = useState(false);

  useLayoutEffect(() => {
    setIsClient(true);
    setIsMobile(window.innerWidth < 640);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getEdgeOneAILink = () => {
    if (
      typeof window !== 'undefined' &&
      window.location.href.includes('.site')
    ) {
      return 'https://edgeone.cloud.tencent.com/pages/document/169925463311781888';
    }
    return 'http://edgeone.ai/document/169927753925951488';
  };

  const getGithubLink = () => {
    if (
      typeof window !== 'undefined' &&
      window.location.href.includes('.site')
    ) {
      return 'https://github.com/TencentEdgeOne/pages-templates/blob/main/examples/deepseek-r1-edge/README_zh-CN.md';
    }
    return 'https://github.com/TencentEdgeOne/pages-templates/tree/main/examples/deepseek-r1-edge';
  };

  const getDeployLink = () => {
    if (
      typeof window !== 'undefined' &&
      window.location.href.includes('.site')
    ) {
      return 'https://console.cloud.tencent.com/edgeone/pages/new?from=github&template=deepseek-r1-edge';
    }
    return 'https://edgeone.ai/pages/templates/deepseek-r1-edge';
  };

  const getDisplayButtons = () => {
    if (isMobile) {
      const randomIndex = Math.floor(Math.random() * KEYWORD_BUTTONS.length);
      return [KEYWORD_BUTTONS[randomIndex]];
    }
    return KEYWORD_BUTTONS;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `## EdgeOne Pages AI: DeepSeek R1 on the Edge

EdgeOne Pages AI enables seamless serverless deployment of AI models, eliminating the complexities of infrastructure scaling and maintenance.

Available for free on [EdgeOne Pages](https://edgeone.ai/products/pages).
`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeywordClick = (query: string) => {
    setUserInput(query);
    setShowKeywords(false);
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    });
  };

  const processStreamResponse = async (
    response: Response,
    updateMessage: (content: MessageContent) => void
  ) => {
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    let thinking = false;
    while (true) {
      let currentMessage: MessageContent = { content: '', think: '' };
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim() || line.includes('[DONE]')) continue;
        try {
          const json = JSON.parse(line.replace(/^data: /, ''));
          const token = json.choices[0]?.delta?.content || '';
          const reasoningToken =
            json.choices[0]?.delta?.reasoning_content || '';

          // Handle think content
          if (
            token.includes('<think>') ||
            token.includes('\u003cthink\u003e')
          ) {
            thinking = true;
            currentMessage.think = '';
            continue;
          }
          if (
            token.includes('</think>') ||
            token.includes('\u003c/think\u003e')
          ) {
            thinking = false;
            currentMessage.think = '';
            continue;
          }

          if (thinking || reasoningToken) {
            currentMessage.think = token || reasoningToken || '';
          } else {
            currentMessage.content = token || '';
          }

          updateMessage(currentMessage);
        } catch (e) {
          console.error('Failed to parse chunk:', e);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    setShowKeywords(false);
    setIsLoading(true);
    const currentInput = textareaRef.current?.value || '';
    setUserInput('');

    // setMessages([
    //   { role: 'user', content: currentInput },
    //   { role: 'assistant', content: '' },
    // ]);

    // Create conversation history
    let conversationHistory = [...messages];

    if (messages[0]?.role === 'assistant') {
      setMessages([]);
      conversationHistory = [];
    }

    // Add new user message
    conversationHistory.push({ role: 'user', content: currentInput });

    // Add empty assistant message that will be streamed
    setMessages([...conversationHistory, { role: 'assistant', content: '' }]);

    try {
      const url =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:8088/v1/chat/completions'
          : '/v1/chat/completions';

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          network: useNetwork,
        }),
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      setAnswered(true);

      await processStreamResponse(res, (_content: MessageContent) => {
        setMessages((prev) => {
          const newMessages = structuredClone(prev);
          const content = structuredClone(_content);
          const lastMessage = newMessages[newMessages.length - 1];
          if (content.think) {
            lastMessage.think = (lastMessage.think ?? '') + content.think;
          }
          if (content.content) {
            lastMessage.content += content.content;
          }
          return newMessages;
        });
      });
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const Loading = () => {
    return (
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-blue-500/60 rounded-full animate-pulse"></div>
        <div className="w-1.5 h-1.5 bg-blue-500/60 rounded-full animate-pulse delay-150"></div>
        <div className="w-1.5 h-1.5 bg-blue-500/60 rounded-full animate-pulse delay-300"></div>
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
          Thinking Process
        </button>
        {isOpen && (
          <div className="p-3 text-sm text-gray-700 bg-white rounded-b-lg">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    );
  };

  const Source = () => {
    if (!answered) {
      return null;
    }
    return (
      <div className="mb-4 text-sm text-gray-600">
        Generated by{' '}
        <a
          href={getEdgeOneAILink()}
          target="_blank"
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          EdgeOne Edge AI
        </a>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center px-6 py-3 bg-white">
        <h1 className="text-base font-semibold text-gray-800">
          EdgeOne Pages AI
        </h1>
        <div className="flex-grow" />
        <a href={getDeployLink()} target="_blank" className="mr-4">
          <img
            src="https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg"
            alt="Deploy to EdgeOne Pages"
            className="h-7"
          />
        </a>
        <a
          href={getGithubLink()}
          target="_blank"
          className="text-gray-600 transition-colors hover:text-gray-900"
        >
          <svg height="24" width="24" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
      </header>

      {/* Messages section */}
      <div className="flex-1 px-4 py-4 overflow-y-auto md:px-6">
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
                    <Source />
                    {message.think && <ThinkDrawer content={message.think} />}
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          return true ? (
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
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            target="_blank"
                            className="text-blue-600 hover:text-blue-800 "
                          />
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                    {/* {isLoading && <Loading />} */}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showKeywords && isClient && (
        <div className="px-4 bg-white animate-fade-in">
          <div className="max-w-3xl mx-auto mb-4">
            <div className="grid grid-cols-1 gap-2 p-2 rounded-lg sm:grid-cols-2">
              {getDisplayButtons().map((button) => (
                <button
                  key={button.text}
                  onClick={() => handleKeywordClick(button.query)}
                  className="px-3 py-2 text-sm font-medium text-left text-gray-700 transition-colors duration-200 bg-white border border-gray-200 rounded-md hover:bg-gray-100 hover:text-gray-900"
                >
                  {button.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input section */}
      <div className="px-4 bg-white">
        <form onSubmit={handleSubmit} className="max-w-3xl py-4 mx-auto">
          <div className="flex flex-col overflow-hidden border border-gray-200 rounded-xl">
            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={handleTextareaChange}
              placeholder="Type a message..."
              disabled={isLoading}
              className={`w-full bg-white text-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none min-h-[52px] max-h-[200px] placeholder:text-gray-400 border-none ${
                isLoading ? 'cursor-not-allowed opacity-50' : ''
              }`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="flex items-center justify-end gap-2 px-4 py-2 bg-gray-50">
              <button
                type="button"
                onClick={() => setUseNetwork(!useNetwork)}
                className={`flex items-center px-2 py-1.5 rounded-lg text-sm ${
                  useNetwork
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                {useNetwork ? 'Network: On' : 'Network: Off'}
              </button>
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
  );
};
