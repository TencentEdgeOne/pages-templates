'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const ThinkDrawer = ({
  content,
  t,
}: {
  content: string;
  t: (en: string) => string;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const initializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!initializedRef.current) {
      setIsOpen(true);
      initializedRef.current = true;
    }
  }, []);

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
        {t('Thinking Process')}
      </button>
      {isOpen && (
        <div className="p-3 text-sm text-gray-400 bg-white rounded-b-lg">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : '';
                
                if (match) {
                  return (
                    <SyntaxHighlighter
                      style={oneDark as any}
                      language={language}
                      PreTag="div"
                      className="rounded-lg text-sm"
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  );
                }
                
                return (
                  <code className="px-1 py-0.5 bg-gray-100 rounded text-blue-600" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}; 