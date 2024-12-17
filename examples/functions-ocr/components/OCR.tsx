'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiUpload } from 'react-icons/fi';

interface OCRState {
  imageUrl: string | null;
  base64Image: string | null;
  markdown: string;
  isLoading: boolean;
}

export const OCR = () => {
  const DEMO_IMAGE_URL =
    'https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/830c2c03-a49b-49cf-b19c-ab829a49cb02.jpg';

  const [state, setState] = useState<OCRState>({
    imageUrl: null,
    base64Image: null,
    markdown: '',
    isLoading: false,
  });

  const handleDemoClick = async () => {
    if (state.isLoading) return;

    try {
      setState((prev) => ({
        ...prev,
        imageUrl: DEMO_IMAGE_URL,
        base64Image: DEMO_IMAGE_URL,
        isLoading: true,
      }));

      const res = await fetchOCR(DEMO_IMAGE_URL);
      setState((prev) => ({
        ...prev,
        markdown: res,
        isLoading: false,
      }));
    } catch (error) {
      console.error(error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const fetchOCR = async (image: string) => {
    const host =
      process.env.NODE_ENV === 'development' ? 'http://localhost:8088' : '';

    try {
      const response = await fetch(`${host}/ocr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image }),
      });

      const res = await response.json();
      return res.data.text;
    } catch (error) {
      console.error('Error:', error);
      return 'Environment configuration is missing. Please set up the necessary environment variables in your EdgeOne Pages project settings.';
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('file.size:', file.size);
    if (file.size > 500 * 1024) {
      e.target.value = '';
      alert('File size exceeds 500KB.');
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      setState((prev) => ({
        ...prev,
        imageUrl: URL.createObjectURL(file),
        base64Image: base64,
        isLoading: true,
      }));

      const res = await fetchOCR(base64);
      setState((prev) => ({
        ...prev,
        markdown: res,
        isLoading: false,
      }));
    } catch (error) {
      console.error(error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteImage = () => {
    setState((prev) => ({
      ...prev,
      base64Image: null,
      markdown: '',
    }));
  };

  return (
    <div className="flex flex-col h-screen text-gray-100 bg-gray-900">
      {/* Title */}
      <div className="p-6 text-center border-b border-gray-700">
        <h1 className="text-3xl font-bold text-blue-500">
          <a
            href="https://edgeone.ai/pages/templates/functions-ocr"
            className="transition-colors hover:text-blue-400"
            target="_blank"
          >
            EdgeOne Pages Functions：AI OCR
          </a>
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Panel */}
        <div className="w-1/2 p-6 border-r border-gray-700">
          <div className="flex flex-col h-full">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Image Upload</h2>
              <div className="flex gap-2">
                {state.base64Image && (
                  <button
                    onClick={handleDeleteImage}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                  >
                    Delete Image
                  </button>
                )}
                <button
                  disabled={state.isLoading}
                  onClick={handleDemoClick}
                  className={`
    px-4 py-2 text-sm font-medium rounded-md
    ${
      state.isLoading
        ? 'bg-blue-300 cursor-not-allowed opacity-60'
        : 'bg-blue-500 hover:bg-blue-600'
    }
    text-white
  `}
                >
                  Try Demo Image
                </button>
              </div>
            </div>
            <div className="relative flex items-center justify-center flex-1 border-2 border-gray-700 border-dashed rounded-lg group">
              {state.base64Image ? (
                <div className="flex items-center justify-center w-full h-full">
                  <img
                    src={state.base64Image}
                    alt="Preview"
                    className="max-w-full max-h-[calc(100vh-200px)] object-contain"
                  />
                </div>
              ) : (
                <div className="p-6 text-center">
                  <FiUpload className="mx-auto mb-2 text-4xl text-gray-500" />
                  <p className="text-gray-500">
                    Drop image here or click to upload
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 p-6">
          <h2 className="mb-4 text-xl font-bold">OCR Result</h2>
          <div className="h-[calc(100%-2rem)] bg-gray-800 rounded-lg p-4 overflow-auto">
            {state.isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-12 h-12 border-4 border-gray-600 rounded-full animate-spin border-t-blue-500" />
              </div>
            ) : (
              <ReactMarkdown
                className="prose prose-invert max-w-none"
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => (
                    <p className="whitespace-pre-wrap">{children}</p>
                  ),
                  table: ({ children }) => (
                    <table className="w-full text-sm border-collapse table-auto">
                      {children}
                    </table>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-gray-800">{children}</thead>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-2 font-bold text-left border border-gray-600">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-2 border border-gray-600">
                      {children}
                    </td>
                  ),
                }}
              >
                {state.markdown}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
