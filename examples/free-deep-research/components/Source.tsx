import React, { useState } from 'react';
import { useLanguage } from '@/components/LanguageSwitcher';

interface SourceProps {
  sources?: { url: string; title: string }[];
}

export const Source: React.FC<SourceProps> = ({ sources }) => {
  const { t } = useLanguage();

  const [isOpen, setIsOpen] = useState(true);

  if (!sources?.length) return null;

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
        {t('messages.source')} ({sources.length})
      </button>
      {isOpen && (
        <div className="p-3 space-y-2 text-sm bg-white rounded-b-lg">
          {sources.map((source, index) => (
            <a
              key={index}
              onClick={(e) => {
                e.preventDefault();
                window.open(source.url, '_blank');
              }}
              className="block text-blue-600 cursor-pointer hover:text-blue-800 hover:underline"
            >
              {index + 1}. {source.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
