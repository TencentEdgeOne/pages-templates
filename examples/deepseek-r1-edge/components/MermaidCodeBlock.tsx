'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MermaidChart } from './MermaidChart';

export const MermaidCodeBlock = ({ code }: { code: string }) => {
  const [showChart, setShowChart] = useState(false);

  const toggleView = () => {
    setShowChart(!showChart);
  };

  return (
    <div className="my-4 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <svg className="w-4 h-4 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-700">Mermaid Chart</span>
        </div>
        <button
          onClick={toggleView}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-cyan-700 bg-white border border-cyan-200 rounded-md hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {showChart ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Show Code
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Show Chart
            </>
          )}
        </button>
      </div>
      
      <div className="relative">
        {showChart ? (
          <div className="p-6 bg-white min-h-[200px] flex items-center justify-center">
            <MermaidChart chart={code} />
          </div>
        ) : (
          <div className="relative bg-gray-50/30">
            <SyntaxHighlighter
              style={oneLight as any}
              language="mermaid"
              PreTag="div"
              className="!my-0 !rounded-none !bg-transparent"
              customStyle={{
                margin: 0,
                borderRadius: 0,
                padding: '20px',
                fontSize: '13px',
                lineHeight: '1.6',
                backgroundColor: 'transparent',
                border: 'none',
                fontFamily: 'JetBrains Mono, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              }}
            >
              {code}
            </SyntaxHighlighter>
            <div className="absolute top-3 right-3">
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="p-2 text-gray-500 hover:text-gray-700 bg-white/80 hover:bg-white border border-gray-200 rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
                title="Copy Code"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 