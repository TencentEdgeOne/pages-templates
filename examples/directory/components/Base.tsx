'use client';

import React, { useState, useEffect } from 'react';
import { DirectoryItemProps } from '@/lib/directory-data';
import { fuzzySearch, extractDomain } from '@/lib/search-utils';
import { Header } from './common/Header';
import { DirectoryItem } from './common/DirectoryItem';
import { SearchBar } from './common/SearchBar';
import { FilterSection } from './common/FilterSection';
import { ArrowRight, Info, X } from 'lucide-react';

interface BaseProps {
  initialDirectoryItems: DirectoryItemProps[];
  initialTags: string[];
}

export const Base = ({ initialDirectoryItems, initialTags }: BaseProps) => {
  const [directoryItems, setDirectoryItems] = useState<DirectoryItemProps[]>(
    initialDirectoryItems
  );
  const [allDirectoryItems] = useState<DirectoryItemProps[]>(
    initialDirectoryItems
  );
  const [allTags] = useState<string[]>(initialTags);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [isHydrated, setIsHydrated] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSiteEnv, setIsSiteEnv] = useState(false);

  // Mark component as hydrated after initial render
  useEffect(() => {
    setIsHydrated(true);
    // Check if we're in site environment
    setIsSiteEnv(window.location.href.includes('.site'));
    // Set a small timeout to ensure smooth transition
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('raindropTags', JSON.stringify(allTags));
    }
  }, [allTags, isHydrated]);

  // Helper function to open URLs based on environment
  const openUrl = (siteEnvUrl: string, defaultUrl: string) => {
    const url = isSiteEnv ? siteEnvUrl : defaultUrl;
    window.open(url, '_blank');
  };

  // Handle deploy button click
  const onDeployBtnClick = () => {
    openUrl(
      'https://console.cloud.tencent.com/edgeone/pages/new?from=github&template=directory',
      'https://edgeone.ai/pages/templates/directory'
    );
  };

  // Group directory items by tags
  const groupItemsByTag = (items: DirectoryItemProps[]) => {
    const groupedItems: Record<string, DirectoryItemProps[]> = {};
    
    // Initialize groups for all tags
    allTags.forEach(tag => {
      groupedItems[tag] = [];
    });
    
    // Add items to their respective tag groups
    // For items with multiple tags, use the first tag as the primary group
    items.forEach(item => {
      if (item.tags.length > 0) {
        const primaryTag = item.tags[0];
        if (groupedItems[primaryTag]) {
          groupedItems[primaryTag].push(item);
        }
      }
    });
    
    // Filter out empty groups
    return Object.entries(groupedItems)
      .filter(([_, items]) => items.length > 0)
      .sort(([tagA], [tagB]) => tagA.localeCompare(tagB));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);

    setTimeout(() => {
      if (!query) {
        setDirectoryItems(allDirectoryItems);
        setIsLoading(false);
        return;
      }

      // Use fuzzy search to find and rank matches
      const searchResults = allDirectoryItems.map(item => {
        // Calculate match scores for different fields
        const titleScore = fuzzySearch(item.title, query);
        
        // Get the best tag score
        const tagScore = Math.max(
          ...item.tags.map(tag => fuzzySearch(tag, query)),
          0 // Default if no tags
        );
        
        // Content scores
        const excerptScore = item.excerpt ? fuzzySearch(item.excerpt, query) : 0;
        const noteScore = item.note ? fuzzySearch(item.note, query) : 0;
        
        // Domain score
        const domain = item.link ? extractDomain(item.link) : '';
        const domainScore = fuzzySearch(domain, query);
        
        // Calculate final score - prioritize title and domain matches
        const maxScore = Math.max(
          titleScore * 1.2, // Title matches are most important
          tagScore * 1.1,   // Tag matches are also important
          excerptScore,
          noteScore,
          domainScore * 1.1 // Domain matches are important too
        );
        
        return {
          item,
          score: maxScore
        };
      });
      
      // Filter items with a score above the threshold and sort by score
      const threshold = 0.2; // Minimum score to be considered a match
      const filtered = searchResults
        .filter(result => result.score > threshold)
        .sort((a, b) => b.score - a.score) // Sort by score descending
        .map(result => result.item);

      setDirectoryItems(filtered);
      setIsLoading(false);
    }, 400);
  };

  const handleFilterChange = (filters: { tag?: string }) => {
    setIsLoading(true);
    setSelectedTag(filters.tag || '');

    setTimeout(() => {
      let filtered = [...allDirectoryItems];

      if (searchQuery) {
        // Use the same fuzzy search logic
        const searchResults = filtered.map(item => {
          // Calculate match scores for different fields
          const titleScore = fuzzySearch(item.title, searchQuery);
          
          // Get the best tag score
          const tagScore = Math.max(
            ...item.tags.map(tag => fuzzySearch(tag, searchQuery)),
            0 // Default if no tags
          );
          
          // Content scores
          const excerptScore = item.excerpt ? fuzzySearch(item.excerpt, searchQuery) : 0;
          const noteScore = item.note ? fuzzySearch(item.note, searchQuery) : 0;
          
          // Domain score
          const domain = item.link ? extractDomain(item.link) : '';
          const domainScore = fuzzySearch(domain, searchQuery);
          
          // Calculate final score - prioritize title and domain matches
          const maxScore = Math.max(
            titleScore * 1.2, // Title matches are most important
            tagScore * 1.1,   // Tag matches are also important
            excerptScore,
            noteScore,
            domainScore * 1.1 // Domain matches are important too
          );
          
          return {
            item,
            score: maxScore
          };
        });
        
        // Filter items with a score above the threshold and sort by score
        const threshold = 0.2; // Minimum score to be considered a match
        filtered = searchResults
          .filter(result => result.score > threshold)
          .sort((a, b) => b.score - a.score) // Sort by score descending
          .map(result => result.item);
      }

      if (filters.tag) {
        filtered = filtered.filter((item) =>
          item.tags.some((tag) => tag === filters.tag)
        );
      }

      setDirectoryItems(filtered);
      setIsLoading(false);
    }, 300);
  };

  const handleReset = () => {
    setSearchQuery('');
    setIsLoading(true);
    setSelectedTag('');

    setTimeout(() => {
      setDirectoryItems(allDirectoryItems);
      setIsLoading(false);
    }, 300);
  };

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="directory-item rounded-xl overflow-hidden backdrop-blur-sm bg-white/60 dark:bg-slate-800/60 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-3 mb-3 p-4">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg shimmer"></div>
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3 shimmer"></div>
          </div>
          <div className="flex gap-2 mb-3 px-4">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16 shimmer"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20 shimmer"></div>
          </div>
          <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-full mb-4 mx-4 shimmer"></div>
          <div className="flex gap-2 p-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12 shimmer"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-14 shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Add CSS for shimmer effect
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .shimmer {
          background: linear-gradient(90deg, 
            rgba(0,0,0,0.06) 25%, 
            rgba(0,0,0,0.1) 37%, 
            rgba(0,0,0,0.06) 63%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          animation-timing-function: ease-in-out;
        }
        .dark .shimmer {
          background: linear-gradient(90deg, 
            rgba(255,255,255,0.06) 25%, 
            rgba(255,255,255,0.1) 37%, 
            rgba(255,255,255,0.06) 63%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          animation-timing-function: ease-in-out;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <Header onDeployBtnClick={onDeployBtnClick} />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400 dark:from-blue-400 dark:to-cyan-300">独立开发者</span>
              <span className="ml-2 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-pink-500 dark:from-fuchsia-400 dark:to-pink-400">出海工具箱</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
              {'灵感、设计、开发、增长、变现、工具、资源'}
            </p>

            <SearchBar onSearch={handleSearch} />
          </div>

          {isHydrated && (
            <FilterSection
              onFilterChange={handleFilterChange}
              onReset={handleReset}
              selectedTag={selectedTag}
              allTags={allTags}
            />
          )}

          <div className="mb-16">
            {isLoading || initialLoading ? (
              <SkeletonLoader />
            ) : directoryItems.length > 0 ? (
              selectedTag === '' ? (
                // Display items grouped by tags when no tag is selected
                <div className="space-y-10">
                  {groupItemsByTag(directoryItems).map(([tag, items]) => (
                    <div key={tag} className="relative">
                      <div className="mb-6">
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-5 py-2 bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 dark:from-indigo-900/30 dark:to-violet-900/30 dark:text-indigo-300 rounded-lg font-medium border border-indigo-100 dark:border-indigo-800/40">
                            {tag}
                          </span>
                          <div className="flex-1 h-[1px] bg-gradient-to-r from-indigo-200/50 to-transparent dark:from-indigo-700/30"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                          <DirectoryItem key={`${tag}-${item.id}`} {...item} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Display items in a regular grid when a tag is selected
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {directoryItems.map((item) => (
                    <DirectoryItem key={item.id} {...item} />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-16 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl shadow-inner">
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  没有找到符合条件的内容。
                </p>
                <button
                  className="btn-secondary inline-flex items-center gap-2 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-md transition-colors shadow-sm border border-slate-200 dark:border-slate-700"
                  onClick={handleReset}
                >
                  重置筛选条件
                </button>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-2xl p-8 md:p-12 text-center mb-16 border border-indigo-100/50 dark:border-indigo-800/20 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-medium mb-4 font-serif text-indigo-800 dark:text-indigo-200">
              准备创建您自己的导航站？
            </h2>
            <p className="text-indigo-700 dark:text-indigo-300 mb-8 max-w-2xl mx-auto">
              使用我们的 EdgeOne Pages
              模板，几分钟内即可构建美观、响应式的导航网站。
            </p>
            <button 
              onClick={onDeployBtnClick}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-8 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center mx-auto group">
              开始使用 <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 border-t border-slate-200/50 dark:border-slate-700/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0"></div>

            <div className="text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} Directory. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
