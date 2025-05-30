'use client';

import { getGeo } from '@/lib/utils';
import React, { useState, useEffect } from 'react';

interface GeoData {
  asn: number;
  countryName: string;
  countryCodeAlpha2: string;
  countryCodeAlpha3: string;
  countryCodeNumeric: string;
  regionName: string;
  regionCode: string;
  cityName: string;
  latitude: number;
  longitude: number;
  cisp: string;
}

interface EdgeOneData {
  geo: GeoData;
  uuid: string;
  clientIp: string;
}

export default function Home() {
  const [data, setData] = useState<EdgeOneData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getGeo();
        setData(response.eo);
        setLoading(false);
      } catch (error) {
        console.log('error', error);
        setError('An error occurred while fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatFieldName = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gray-900 relative">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-white mb-2">
              <a
                href="https://edgeone.ai/products/pages"
                target="_blank"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                EdgeOne Pages - Geolocation
              </a>
            </h1>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-10 h-10 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-blue-400 mt-3 text-sm font-medium">
                Detecting your location...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-3 text-center">
              <p className="text-red-300 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Data Display */}
          {data && (
            <div className="space-y-4">
              {/* Client Information - Top Bar */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-xs mr-3">
                      C
                    </div>
                    <h2 className="text-lg font-bold text-white">Client Information</h2>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-300 font-medium text-sm">IP:</span>
                      <span className="text-blue-400 font-bold">{data.clientIp}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-300 font-medium text-sm">UUID:</span>
                      <span className="text-white font-mono text-xs bg-gray-600 px-2 py-1 rounded">
                        {data.uuid}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Geolocation Information - Grid Layout */}
              {data.geo && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Country Information */}
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
                    <div className="flex items-center mb-3">
                      <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center text-white font-bold text-xs mr-2">
                        🌍
                      </div>
                      <h3 className="text-md font-bold text-white">Country</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-xs">Name:</span>
                        <span className="text-white text-xs font-medium">{data.geo.countryName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-xs">Code (Alpha2):</span>
                        <span className="text-white text-xs font-medium">{data.geo.countryCodeAlpha2}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-xs">Code (Alpha3):</span>
                        <span className="text-white text-xs font-medium">{data.geo.countryCodeAlpha3}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-xs">Numeric:</span>
                        <span className="text-white text-xs font-medium">{data.geo.countryCodeNumeric}</span>
                      </div>
                    </div>
                  </div>

                  {/* Region Information */}
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
                    <div className="flex items-center mb-3">
                      <div className="w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center text-white font-bold text-xs mr-2">
                        📍
                      </div>
                      <h3 className="text-md font-bold text-white">Region</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-xs">Region:</span>
                        <span className="text-white text-xs font-medium">{data.geo.regionName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-xs">Code:</span>
                        <span className="text-white text-xs font-medium">{data.geo.regionCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-xs">City:</span>
                        <span className="text-white text-xs font-medium">{data.geo.cityName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Coordinates & Network */}
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
                    <div className="flex items-center mb-3">
                      <div className="w-6 h-6 bg-orange-600 rounded-md flex items-center justify-center text-white font-bold text-xs mr-2">
                        🌐
                      </div>
                      <h3 className="text-md font-bold text-white">Network & Location</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-xs">Latitude:</span>
                        <span className="text-white text-xs font-medium">{data.geo.latitude}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-xs">Longitude:</span>
                        <span className="text-white text-xs font-medium">{data.geo.longitude}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-xs">ASN:</span>
                        <span className="text-white text-xs font-medium">{data.geo.asn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-xs">CISP:</span>
                        <span className="text-white text-xs font-medium">{data.geo.cisp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-4 text-gray-400">
            <p className="text-xs">
              Powered by EdgeOne • Real-time geolocation detection
            </p>
            <p className="text-xs mt-1">
              <a
                href="https://github.com/TencentEdgeOne/pages-templates/tree/main/examples/functions-geolocation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 underline"
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
