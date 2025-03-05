import React from 'react';
import { useLanguage } from './LanguageSwitcher';
import { Step } from '../types';

interface InputSectionProps {
  step: Step;
  userInput: string;
  isLoading: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  handleTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  step,
  userInput,
  isLoading,
  textareaRef,
  handleTextareaChange,
  handleSubmit,
}) => {
  const { t } = useLanguage();

  const getPlaceholder = () => {
    switch (step) {
      case 'query':
        return t('input.query');
      case 'clarify':
        return t('input.clarify');
      default:
        return t('input.default');
    }
  };

  return (
    <div className="px-4 bg-white">
      <form onSubmit={handleSubmit} className="max-w-3xl py-4 mx-auto">
        <div className="flex flex-col overflow-hidden border border-gray-200 rounded-xl">
          <textarea
            ref={textareaRef}
            value={userInput}
            onChange={handleTextareaChange}
            placeholder={getPlaceholder()}
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
  );
};
