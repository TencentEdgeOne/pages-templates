'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun, FileText, GitPullRequest, BookOpen, Menu, X } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  onDeployBtnClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onDeployBtnClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Check system preference for dark mode
    if (typeof window !== 'undefined') {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600 dark:text-indigo-400">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-medium text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">导航站模板</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="/blog" 
            className="flex items-center gap-1 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            aria-label="博客"
          >
            <BookOpen size={16} />
            <span>博客</span>
          </Link>

          <Link 
            href="/doc" 
            className="flex items-center gap-1 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            aria-label="文档"
          >
            <FileText size={16} />
            <span>文档</span>
          </Link>

          <a 
            href="https://github.com/TencentEdgeOne/pages-templates"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            aria-label="投稿"
          >
            <GitPullRequest size={16} />
            <span>投稿</span>
          </a>
          
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="切换暗黑模式"
          >
            {isDarkMode ? 
              <Sun size={18} className="text-amber-400" /> : 
              <Moon size={18} className="text-slate-700" />
            }
          </button>
          
          <button 
            onClick={onDeployBtnClick}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-md transition-all duration-300 shadow-sm hover:shadow-md"
            aria-label="部署"
          >
            部署
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="切换暗黑模式"
          >
            {isDarkMode ? 
              <Sun size={18} className="text-amber-400" /> : 
              <Moon size={18} className="text-slate-700" />
            }
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="打开菜单"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 py-2 flex flex-col gap-2">
            <Link 
              href="/blog" 
              className="flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BookOpen size={16} />
              <span>博客</span>
            </Link>

            <Link 
              href="/doc" 
              className="flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FileText size={16} />
              <span>文档</span>
            </Link>

            <a 
              href="https://github.com/TencentEdgeOne/pages-templates"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <GitPullRequest size={16} />
              <span>投稿</span>
            </a>

            <button 
              onClick={() => {
                onDeployBtnClick?.();
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-md transition-all duration-300 shadow-sm hover:shadow-md"
            >
              部署
            </button>
          </div>
        </div>
      )}
    </header>
  );
}; 