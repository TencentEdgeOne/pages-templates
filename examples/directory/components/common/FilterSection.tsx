import React, { useState, useEffect } from 'react';

interface FilterSectionProps {
  onFilterChange?: (filters: {
    tag?: string;
  }) => void;
  onReset?: () => void;
  selectedTag?: string;
  allTags: string[];
}

export const FilterSection: React.FC<FilterSectionProps> = ({ 
  onFilterChange,
  onReset,
  selectedTag = '',
  allTags = []
}) => {
  // Remove the local state and useEffect since we're now receiving tags as props
  
  const handleTagClick = (tag: string) => {
    const newTag = selectedTag === tag ? '' : tag;
    
    if (onFilterChange) {
      onFilterChange({
        tag: newTag || undefined
      });
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="mb-10">
      <div className="flex flex-wrap gap-3 justify-center">
        <button 
          className={`px-5 py-2 rounded-full transition-all duration-300 shadow-sm ${
            selectedTag === '' 
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium shadow-md' 
              : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700'
          }`}
          onClick={handleReset}
        >
          全部
        </button>
        
        {allTags.map((tag, index) => (
          <button 
            key={index}
            className={`px-5 py-2 rounded-full transition-all duration-300 shadow-sm ${
              selectedTag === tag 
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium shadow-md' 
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700'
            }`}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}; 