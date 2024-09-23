'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Markmap } from 'markmap-view';
import { Transformer } from 'markmap-lib';
import { wrapFunction } from 'markmap-common';
import content from './content.md';

const MarkmapEditor = () => {
  const [markdown, setMarkdown] = useState(content);
  const svgRef = useRef<SVGSVGElement>(null);
  const markmapRef = useRef<Markmap | null>(null);

  useEffect(() => {
    const loadMarkmapLibs = async () => {
      const { Markmap } = await import('markmap-view');

      if (svgRef.current && !markmapRef.current) {
        markmapRef.current = Markmap.create(svgRef.current, {
          initialExpandLevel: 2,
          fitRatio: 2,
        });
        // Initial render
        const transformer = new Transformer([
          {
            name: 'target-blank',
            transform(transformHooks) {
              transformHooks.parser.tap((md) => {
                md.renderer.renderAttrs = wrapFunction(
                  md.renderer.renderAttrs,
                  (renderAttrs, token: any) => {
                    let attrs = renderAttrs(token);
                    if (token.type === 'link_open') {
                      attrs += ' target="_blank"';
                    }
                    return attrs;
                  }
                );
              });
              return {};
            },
          },
        ]);
        const { root, features } = transformer.transform(markdown);
        markmapRef.current.setData(root);
        markmapRef.current.setOptions({
          ...markmapRef.current.options,
          ...features,
        });
        markmapRef.current.fit();
      }
    };

    loadMarkmapLibs();
  }, []);

  useEffect(() => {
    if (markmapRef.current) {
      const transformer = new Transformer();
      const { root, features } = transformer.transform(markdown);
      markmapRef.current.setData(root);
      markmapRef.current.setOptions({
        ...markmapRef.current.options,
        ...features,
      });
    }
  }, [markdown]);

  return (
    <div className="flex h-[75vh] bg-gray-100">
      <div className="w-2/3 p-4 bg-white">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
      <div className="w-1/3 p-4">
        <textarea
          className="w-full h-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="Write your markdown here..."
        />
      </div>
    </div>
  );
};

export default MarkmapEditor;
