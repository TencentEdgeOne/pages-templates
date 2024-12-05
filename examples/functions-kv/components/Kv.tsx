'use client';

import { getVisitCount } from '@/lib/utils';
import React, { useState, useEffect } from 'react';

export default function Kv() {
  const [visitCount, setVisitCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVisitCount() {
      try {
        const count = await getVisitCount();
        setVisitCount(count);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message);
        setIsLoading(false);
      }
    }

    fetchVisitCount();
  }, []);

  const renderKVDocumentationLink = () => {
    const isCloudDomain = location.href.includes('.site');
    const docUrl = isCloudDomain
      ? 'https://edgeone.cloud.tencent.com/document/162936897742577664'
      : 'https://edgeone.ai/document/162227803822321664';

    return (
      <p className="text-white">
        For additional details, check out our{' '}
        <a
          href={docUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-yellow-300 transition duration-300 ease-in-out hover:underline"
        >
          KV documentation
        </a>
      </p>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-100">
          <a
            href="https://edgeone.ai/products/pages"
            target="_blank"
            className="hover:underline"
          >
            EdgeOne Pages: KV Store
          </a>
        </h1>
        <div className="text-center">
          <p className="mb-4 text-gray-300">Thank you for visiting!</p>
          {error ? (
            <div className="p-4 mb-4 bg-red-500 rounded-md">
              <span className="text-white">
                {error} {renderKVDocumentationLink()}
              </span>
            </div>
          ) : (
            <div className="p-4 bg-gray-800 rounded-md">
              <span className="block mb-2 text-gray-400">Total Visits:</span>
              {isLoading ? (
                <div className="w-24 h-8 mx-auto bg-gray-700 rounded animate-pulse"></div>
              ) : (
                <span className="text-4xl font-bold text-white">
                  {visitCount}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
