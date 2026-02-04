'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export function MermaidInit() {
  useEffect(() => {
    // Initialize mermaid when it's loaded
    if (typeof window !== 'undefined' && (window as any).mermaid) {
      (window as any).mermaid.initialize({
        startOnLoad: true,
        theme: 'base',
        themeVariables: {
          primaryColor: '#22B2B1',
          primaryTextColor: '#fff',
          primaryBorderColor: '#1a8a89',
          lineColor: '#1a8a89',
          secondaryColor: '#f3f4f6',
          tertiaryColor: '#e5e7eb',
        },
      });
    }
  }, []);

  const handleLoad = () => {
    if (typeof window !== 'undefined' && (window as any).mermaid) {
      (window as any).mermaid.initialize({
        startOnLoad: true,
        theme: 'base',
        themeVariables: {
          primaryColor: '#22B2B1',
          primaryTextColor: '#fff',
          primaryBorderColor: '#1a8a89',
          lineColor: '#1a8a89',
          secondaryColor: '#f3f4f6',
          tertiaryColor: '#e5e7eb',
        },
      });
      // Manually run mermaid on existing diagrams
      (window as any).mermaid.run();
    }
  };

  return (
    <Script
      src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"
      onLoad={handleLoad}
    />
  );
}
