import React, { useState } from 'react';
import { Search, Info } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "搜索标题/内容/域名",
  onSearch 
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`relative max-w-2xl mx-auto transition-all duration-300 ${
      isFocused ? 'scale-105' : 'scale-100'
    }`}>
      <div className={`relative rounded-full shadow-md ${
        isFocused ? 'ring-2 ring-indigo-300 dark:ring-indigo-700' : ''
      }`}>
        <input 
          type="text" 
          placeholder={placeholder} 
          className="w-full py-4 px-6 rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-300 dark:focus:border-indigo-700 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 p-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
          onClick={handleSearch}
          aria-label="搜索"
        >
          <Search className="h-4 w-4 text-white" />
        </button>
        
        {/* <button 
          className="absolute right-16 top-1/2 transform -translate-y-1/2 p-2 text-slate-400 hover:text-indigo-500 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors"
          onClick={() => setShowInfo(!showInfo)}
          aria-label="搜索提示"
        >
          <Info className="h-4 w-4" />
        </button> */}
      </div>
      
      {query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-3 text-xs text-slate-600 dark:text-slate-300">
          <p>按回车键搜索 &quot;{query}&quot;</p>
        </div>
      )}
      
      {showInfo && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-4 text-sm text-slate-600 dark:text-slate-300 z-10">
          <h4 className="font-medium text-indigo-600 dark:text-indigo-400 mb-2">搜索提示</h4>
          <ul className="space-y-1 list-disc pl-5">
            <li>支持模糊搜索，输入部分关键词即可匹配</li>
            <li>可搜索标题、内容、标签和域名</li>
            <li>搜索结果按相关度排序</li>
            <li>标题和域名匹配的结果将优先显示</li>
          </ul>
        </div>
      )}
    </div>
  );
}; 