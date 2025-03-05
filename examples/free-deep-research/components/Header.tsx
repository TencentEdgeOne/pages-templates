import React from 'react';
import { useLanguage, LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  onDeployBtnClick: () => void;
  onGithubBtnClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onDeployBtnClick,
  onGithubBtnClick,
}) => {
  const { t } = useLanguage();

  return (
    <header>
      <div className="flex items-center justify-between max-w-screen-xl px-4 py-3 mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium text-gray-900"></span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <LanguageSwitcher />

          <button
            onClick={onGithubBtnClick}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <span>{t('buttons.github')}</span>
          </button>

          <button
            onClick={onDeployBtnClick}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-md hover:opacity-90"
          >
            <span>{t('buttons.deploy')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
