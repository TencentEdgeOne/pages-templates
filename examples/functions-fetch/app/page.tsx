'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [pathname, setPathname] = useState('');
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current pathname
    setPathname(window.location.pathname);

    // Fetch current page to get response headers
    fetch(window.location.href)
      .then((response) => {
        const headersObj: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          if (key.startsWith('x-')) {
            headersObj[key] = value;
          }
        });
        setHeaders(headersObj);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const examplePaths = [
    '/about',
    '/docs',
    '/product/123',
    '/user/demo',
    '/blog/my-post',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">
              EdgeOne Pages Functions
            </h1>
            <p className="text-xl text-blue-400 mb-4">Custom Fetch Demo</p>
            <div className="text-gray-300 text-sm max-w-2xl mx-auto">
              <p className="font-medium">
                This example demonstrates how to create Edge Functions at the root path to fetch and return static resources.
              </p>
            </div>
          </div>

          {/* Current Path Info */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl mb-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
              Current Path Information
            </h2>
            <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Pathname:</span>
                <span className="text-blue-400 font-mono text-lg font-bold">
                  {pathname || '/'}
                </span>
              </div>
            </div>
          </div>

          {/* Response Headers */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl mb-6">
            <h2 className="text-lg font-bold text-white mb-4">
              Edge Function Headers
            </h2>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : Object.keys(headers).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(headers).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-gray-900 border border-gray-600 rounded-lg p-3 flex items-center justify-between"
                  >
                    <span className="text-gray-400 font-mono text-sm">{key}:</span>
                    <span className="text-green-400 font-mono text-sm">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">
                No custom headers found
              </p>
            )}
          </div>

          {/* Try Other Paths */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4">
              Try Dynamic Paths
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Click any link below to see how the Edge Function handles different routes:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {examplePaths.map((path) => (
                <Link
                  key={path}
                  href={path}
                  className="bg-gray-900 border border-gray-600 hover:border-blue-500 rounded-lg p-3 text-center text-blue-400 hover:text-blue-300 font-mono text-sm transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  {path}
                </Link>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500 text-xs space-y-2">
            <p>
              Powered by{' '}
              <a
                href="https://pages.edgeone.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                EdgeOne Pages
              </a>
            </p>
            <p>
              <a
                href="https://github.com/TencentEdgeOne/pages-templates/tree/main/examples/functions-fetch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-300 underline"
              >
                View Source Code
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
