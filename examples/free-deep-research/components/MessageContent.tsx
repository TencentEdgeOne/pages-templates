import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import React from 'react';
import { Drawer } from '@/components/Drawer';
import { Source } from '@/components/Source';
import { useLanguage } from '@/components/LanguageSwitcher';
import { Message } from '@/types';

interface MessageContentProps {
  message: Message;
  isLoading: boolean;
}

const SearchingIndicator = () => {
  const { t } = useLanguage();
  return (
    <div className="mb-2 flex">
      <div className="flex items-center px-3 py-2 text-sm text-gray-600 bg-white rounded-lg shadow-sm border border-gray-100 max-w-xs">
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
        {t('messages.processing')}
      </div>
    </div>
  );
};

export const MessageContent: React.FC<MessageContentProps> = ({
  message,
  isLoading,
}) => {
  const { t } = useLanguage();

  return (
    <>
      {message.role === 'user' && (
        <p className="whitespace-pre-wrap text-right">{message.content}</p>
      )}

      {message.role === 'assistant' && (
        <div
          className="prose max-w-none prose-p:leading-relaxed prose-pre:bg-white prose-pre:border 
                  prose-pre:border-gray-200 prose-code:text-blue-600 prose-code:bg-white prose-code:px-1 prose-code:py-0.5
                  prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-strong:text-gray-900
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:no-underline prose-headings:text-gray-900
                  prose-ul:my-4 prose-li:my-0.5"
        >
          {/* <GeneratedByAI /> */}
          {!message.think && !message.content && !message?.source?.length && (
            <SearchingIndicator />
          )}
          {message.think && (
            <Drawer title={t('messages.process')} content={message.think} />
          )}
          {message.goal && (
            <Drawer title={t('messages.goal')} content={message.goal} />
          )}
          {message.query && (
            <Drawer title={t('messages.query')} content={message.query} />
          )}
          {message.source && <Source sources={message.source} />}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return true ? (
                  <pre className="p-4 whitespace-pre-wrap break-words bg-white rounded-lg">
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
        </div>
      )}
    </>
  );
};
