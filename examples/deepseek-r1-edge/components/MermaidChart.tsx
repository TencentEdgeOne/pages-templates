'use client';

import React, { useRef, useState, useEffect } from 'react';
import mermaid from 'mermaid';

export const MermaidChart = ({ chart }: { chart: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const chartIdRef = useRef<string>(`mermaid-${Math.random().toString(36).substr(2, 9)}`);
  const initializedRef = useRef<boolean>(false);


  useEffect(() => {
    if (!initializedRef.current) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          primaryColor: '#3b82f6',
          primaryTextColor: '#1f2937',
          primaryBorderColor: '#e5e7eb',
          lineColor: '#6b7280',
          secondaryColor: '#f3f4f6',
          tertiaryColor: '#ffffff',
          background: '#ffffff',
          mainBkg: '#ffffff',
          secondBkg: '#f9fafb',
          tertiaryBkg: '#f3f4f6'
        },
        securityLevel: 'loose',
        fontFamily: 'Inter, system-ui, sans-serif',
        deterministicIds: true,
        deterministicIDSeed: 'mermaid-seed',
        flowchart: {
          htmlLabels: true,
          curve: 'basis'
        }
      });
      initializedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!ref.current || !chart.trim()) return;

    let isCancelled = false;
    setIsRendering(true);
    setError(null);

    const renderChart = async () => {
      try {
        const { svg } = await mermaid.render(chartIdRef.current, chart);
        
        
        if (isCancelled) return;
        
        if (ref.current) {
          ref.current.style.opacity = '0.5';
          ref.current.innerHTML = svg;
          
          const svgElement = ref.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.maxWidth = '100%';
            svgElement.style.height = 'auto';
            svgElement.style.background = 'transparent';
            svgElement.style.display = 'block';
            svgElement.removeAttribute('style');
            svgElement.style.maxWidth = '100%';
            svgElement.style.height = 'auto';
            svgElement.style.background = 'transparent';
          }
          
          requestAnimationFrame(() => {
            if (ref.current && !isCancelled) {
              ref.current.style.opacity = '1';
            }
          });
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Mermaid render error:', err);
          setError('Chart render failed');
        }
      } finally {
        if (!isCancelled) {
          setIsRendering(false);
        }
      }
    };

    renderChart();


    return () => {
      isCancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
        <p className="text-red-600 text-sm">Error: {error}</p>
        <pre className="text-xs text-gray-600 mt-2 overflow-auto">{chart}</pre>
      </div>
    );
  }

  return (
    <div className="mermaid-container overflow-auto">
      <div 
        ref={ref} 
        className="mermaid-chart transition-opacity duration-200 flex justify-center items-center"
        style={{ minHeight: isRendering ? '200px' : 'auto' }}
      />
      {isRendering && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-medium">Rendering chart...</span>
          </div>
        </div>
      )}
    </div>
  );
}; 