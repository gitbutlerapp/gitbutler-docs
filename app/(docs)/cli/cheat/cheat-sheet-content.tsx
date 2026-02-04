'use client';

import { useState } from 'react';
import type { CheatSheet } from '@/types/cheat';
import { LevelToggle } from './level-toggle';
import { CheatSheetPrintButton } from './print-button';
import { SectionsGrid } from './sections-grid';

interface CheatSheetContentProps {
  cheatSheet: CheatSheet;
  initialLevel?: 'basic' | 'all';
}

export function CheatSheetContent({ cheatSheet, initialLevel = 'basic' }: CheatSheetContentProps) {
  const [level, setLevel] = useState<'basic' | 'all'>(initialLevel);

  const filteredSections = level === 'basic'
    ? cheatSheet.sections
        .filter(section => section.level === 'basic')
        .map(section => ({
          ...section,
          items: section.items.filter(item => (item.level || 'basic') === 'basic')
        }))
        .filter(section => section.items.length > 0)
    : cheatSheet.sections;

  return (
    <>
      {/* Header Section */}
      <div className="px-8 py-12 text-white print:py-8 bg-gradient-to-r from-[#22B2B1] to-[#1a8a89] dark:from-[#0d4948] dark:to-[#0a3433]">
        <div className="mx-auto w-full">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-5xl font-bold print:text-4xl">{cheatSheet.title}</h1>
            <CheatSheetPrintButton />
          </div>
          {cheatSheet.subtitle && <p className="mb-4 text-xl opacity-90">{cheatSheet.subtitle}</p>}

          {/* Level Toggle */}
          <div className="mt-6 print:hidden">
            <LevelToggle onLevelChange={setLevel} initialLevel={initialLevel} />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 print:mb-4">
        <div className="mx-auto w-full px-8 py-8 print:px-8 print:py-4">
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {cheatSheet.description}
          </p>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="mx-auto w-full px-8 pb-16 print:px-8 print:pb-4 print:pt-0">
        <SectionsGrid sections={filteredSections} />
      </div>
    </>
  );
}
