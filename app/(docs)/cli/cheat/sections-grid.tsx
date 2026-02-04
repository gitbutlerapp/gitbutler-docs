'use client';

import { useState, useEffect } from 'react';
import type { CheatSheetSection } from '@/types/cheat';

interface SectionsGridProps {
  sections: CheatSheetSection[];
}

export function SectionsGrid({ sections }: SectionsGridProps) {
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1536) {
        setColumns(3); // 2xl breakpoint
      } else if (window.innerWidth >= 768) {
        setColumns(2); // md breakpoint
      } else {
        setColumns(1);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Distribute sections across columns (left to right)
  const columnArrays = Array.from({ length: columns }, () => [] as CheatSheetSection[]);
  sections.forEach((section, index) => {
    columnArrays[index % columns].push(section);
  });

  return (
    <div className="flex flex-col gap-8 md:flex-row print:flex-row print:gap-6">
      {columnArrays.map((columnSections, colIndex) => (
        <div key={colIndex} className="flex flex-1 flex-col gap-8 print:gap-6">
          {columnSections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="break-inside-avoid rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 print:border-gray-300 print:shadow-none"
            >
              {/* Section Header */}
              <div className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-800">
                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white print:text-xl">
                  {section.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 print:text-xs">
                  {section.description}
                </p>
              </div>

              {/* Diagram (if present) */}
              {section.diagram && (
                <div className="mb-6">
                  {section.diagram.type === 'ascii' ? (
                    <pre className="overflow-x-auto rounded bg-gray-200 p-4 font-mono text-sm dark:bg-gray-800 print:p-2 print:text-xs">
                      {section.diagram.content}
                    </pre>
                  ) : (
                    <div className="mermaid rounded bg-white p-4 dark:bg-gray-800">
                      {section.diagram.content}
                    </div>
                  )}
                </div>
              )}

              {/* Command Items */}
              <div className="space-y-5 print:space-y-3">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="break-inside-avoid">
                    <div className="mb-2 rounded bg-gray-800 px-4 py-2.5 font-mono text-sm text-gray-100 dark:bg-gray-950 print:bg-gray-700 print:px-3 print:py-2 print:text-xs">
                      {item.command}
                    </div>
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 print:text-xs">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
