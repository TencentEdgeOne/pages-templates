import React from 'react';

interface KeywordButton {
  text: string;
  query: string;
}

interface KeywordButtonsProps {
  buttons: KeywordButton[];
  onKeywordClick: (query: string) => void;
}

export const KeywordButtons: React.FC<KeywordButtonsProps> = ({
  buttons,
  onKeywordClick,
}) => {
  return (
    <div className="grid grid-cols-1 gap-2 p-2 rounded-lg sm:grid-cols-2">
      {buttons.map((button) => (
        <button
          key={button.text}
          onClick={() => onKeywordClick(button.query)}
          className="px-3 py-2 text-sm text-left text-gray-700 transition-colors duration-200 bg-white border border-gray-200 rounded-md hover:bg-gray-100 hover:text-gray-900"
        >
          {button.text}
        </button>
      ))}
    </div>
  );
};
