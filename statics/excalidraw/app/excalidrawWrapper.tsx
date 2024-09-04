'use client';
import React, { useState, useEffect } from 'react';
import {
  Excalidraw,
  convertToExcalidrawElements,
} from '@excalidraw/excalidraw';

const ExcalidrawWrapper = () => {
  const [elements, setElements] = useState(() => {
    const savedElements = localStorage.getItem('excalidrawElements');
    if (savedElements) {
      return JSON.parse(savedElements);
    }
    return convertToExcalidrawElements([
      {
        type: 'rectangle',
        id: 'rect-1',
        x: 350,
        y: 100,
        width: 100,
        height: 100,
        backgroundColor: '#ffd700',
        fillStyle: 'solid',
      },
      {
        type: 'ellipse',
        id: 'circle-1',
        x: 500,
        y: 100,
        width: 100,
        height: 100,
        backgroundColor: '#4a90e2',
        fillStyle: 'solid',
      },
      {
        type: 'diamond',
        id: 'triangle-1',
        x: 650,
        y: 100,
        width: 100,
        height: 100,
        backgroundColor: '#ff0000',
        fillStyle: 'solid',
      },
    ]);
  });

  useEffect(() => {
    localStorage.setItem('excalidrawElements', JSON.stringify(elements));
  }, [elements]);

  const onChange = (elements: any) => {
    setElements(elements);
  };

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Excalidraw
        initialData={{
          elements: elements,
          appState: {
            viewBackgroundColor: '#FFFFFF',
          },
        }}
        onChange={onChange}
      />
    </div>
  );
};

export default ExcalidrawWrapper;
