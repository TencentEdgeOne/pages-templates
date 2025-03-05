import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from './LanguageSwitcher';

interface ThinkDrawerProps {
  title: string;
  content: string;
}

export const Drawer: React.FC<ThinkDrawerProps> = ({ title, content }) => {
  const { t } = useLanguage();
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
        {title}
      </button>
      {isOpen && (
        <div className="p-3 text-sm text-gray-400 bg-white rounded-b-lg">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};
