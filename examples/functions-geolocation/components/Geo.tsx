'use client';

import { getGeo } from '@/lib/utils';
import React, { useState, useEffect } from 'react';

export const Geo = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getGeo();
        setData(response.geo);
        setLoading(false);
      } catch (error) {
        console.log('error', error);
        setError('An error occurred while fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden text-white bg-black">
      <div className="z-10 w-full max-w-xl p-6 bg-gray-900 rounded-lg shadow-xl">
        <h1 className="mb-6 text-3xl font-bold">
          <a
            href="https://edgeone.ai/products/pages"
            target="_blank"
            className="hover:underline"
          >
            EdgeOne Pages: Geolocation
          </a>
        </h1>

        {loading && <p className="text-blue-400">Loading...</p>}

        {error && <p className="text-red-400">{error}</p>}

        {data && (
          <div className="space-y-4">
            {Object.entries(data).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between pb-2 border-b border-gray-700"
              >
                <span className="text-gray-400 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="font-semibold">{JSON.stringify(value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
