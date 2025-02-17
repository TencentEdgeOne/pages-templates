'use client';

import React, { useState, useRef } from 'react';
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

export const Base = () => {
  const [userInput, setUserInput] = useState('Hi');
  const [useNetwork, setUseNetwork] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `# 👋 Welcome to DeepSeek R1

I'm an AI assistant enhanced with network search capabilities. I can help you with:

* Real-time information and news
* Answering questions about current events
* Providing data-backed responses
* Web search integration

Try asking me something like:
- Who are you？
- How did the box office perform for Nezha 2?
- What's the latest in tech news?

*Tip: Press Enter to send message, Shift + Enter for new line*`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

          if (thinking) {
            currentMessage.think = token || '';
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

    setIsLoading(true);
    const currentInput = userInput;
    setUserInput('');

    setMessages([
      { role: 'user', content: currentInput },
      { role: 'assistant', content: '' },
    ]);

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
          messages: [{ role: 'user', content: currentInput }],
          network: useNetwork,
        }),
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

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

    if (!content) return null;

    return (
      <div className="mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-400 bg-[#161B22] rounded-t-lg hover:bg-[#1C2128]"
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
          <div className="p-3 text-sm text-gray-300 bg-[#161B22] rounded-b-lg">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#0D1117]">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center px-6 py-3 border-b bg-[#161B22] border-[#30363D]">
        <h1 className="text-lg font-semibold text-gray-100">
          DeepSeek R1: Enhanced with advanced network search capability.
        </h1>
        <div className="flex-grow" />
        <a
          href="https://edgeone.ai/pages/templates/deepseek-r1-with-network"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4 px-3 py-1.5 text-sm font-medium text-gray-100 bg-[#238636] hover:bg-[#2EA043] rounded-md transition-colors"
        >
          Free Deploy
        </a>
        <a
          href="https://github.com/TencentEdgeOne/pages-templates/tree/main/examples/deepseek-r1-with-network"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 transition-colors hover:text-gray-200"
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
                className={`relative max-w-[85%] px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#1C2128] text-gray-100'
                }`}
              >
                {message.role === 'user' && (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}

                {message.role === 'assistant' && (
                  <div
                    className="prose prose-invert max-w-none  prose-p:leading-relaxed prose-pre:bg-[#161B22] prose-pre:border 
                  prose-pre:border-[#30363D] prose-code:text-blue-400 prose-code:bg-[#161B22] prose-code:px-1 prose-code:py-0.5
                  prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-strong:text-white
                  prose-a:text-blue-400 prose-a:no-underline prose-a:hover:underline prose-headings:text-white
                  prose-ul:my-4 prose-li:my-0.5"
                  >
                    {message.think && <ThinkDrawer content={message.think} />}
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          return true ? (
                            <pre className="p-4 overflow-auto rounded-lg">
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
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                    {isLoading && <Loading />}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input section */}
      <div className="border-t border-[#30363D] bg-[#161B22] px-4">
        <form onSubmit={handleSubmit} className="max-w-3xl py-4 mx-auto">
          <div className="flex items-center mb-2">
            <button
              type="button"
              onClick={() => setUseNetwork(!useNetwork)}
              className={`flex items-center px-3 py-1 rounded-md text-sm ${
                useNetwork
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-gray-700/20 text-gray-400'
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
          </div>
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={handleTextareaChange}
              placeholder="Type a message..."
              disabled={isLoading}
              className={`w-full bg-[#1C2128] text-gray-100 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-[#30363D] resize-none min-h-[52px] max-h-[200px] placeholder:text-gray-500 ${
                isLoading ? 'cursor-not-allowed opacity-50' : ''
              }`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className={`absolute right-2 bottom-2 p-1.5 rounded-lg transition-colors ${
                isLoading || !userInput.trim()
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-blue-500 hover:bg-[#30363D]'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
