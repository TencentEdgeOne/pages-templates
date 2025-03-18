import React from 'react';
import { DirectoryItemProps } from '@/lib/directory-data';
import { ExternalLink } from 'lucide-react';

export const DirectoryItem: React.FC<DirectoryItemProps> = ({
  title,
  tags,
  excerpt,
  link,
  media,
  note,
  cover,
}) => {
  return (
    <a 
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block no-underline"
      aria-label={`访问 ${title}`}
    >
      <div className="directory-item group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-5 transition-all duration-300 hover:translate-y-[-2px]">
        {cover && (
          <div className="mb-4 overflow-hidden rounded-lg h-32 flex items-center justify-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
            <img 
              src={cover} 
              alt={`${title} 封面`} 
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        
        <div className="flex items-center gap-3 mb-3">
          <span className="text-indigo-700 dark:text-indigo-300 font-medium line-clamp-1">{title}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full border border-indigo-100/50 dark:border-indigo-800/30"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 whitespace-pre-line min-h-[2.5rem]">
          {note || excerpt || ''}
        </p>

        <div className="flex justify-end">
          <span className="p-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 transition-colors group-hover:scale-110 transform duration-300">
            <ExternalLink size={16} className="text-indigo-600 dark:text-indigo-400" />
          </span>
        </div>
      </div>
    </a>
  );
};
