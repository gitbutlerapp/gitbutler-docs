'use client';

import { useState, useEffect } from 'react';

interface LevelToggleProps {
  onLevelChange: (level: 'basic' | 'all') => void;
  initialLevel?: 'basic' | 'all';
}

export function LevelToggle({ onLevelChange, initialLevel = 'basic' }: LevelToggleProps) {
  const [selectedLevel, setSelectedLevel] = useState<'basic' | 'all'>(initialLevel);

  useEffect(() => {
    setSelectedLevel(initialLevel);
  }, [initialLevel]);

  const handleChange = (level: 'basic' | 'all') => {
    setSelectedLevel(level);
    onLevelChange(level);
  };

  return (
    <div className="flex gap-2 rounded-lg bg-white/10 p-1">
      <button
        onClick={() => handleChange('basic')}
        className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
          selectedLevel === 'basic'
            ? 'bg-white text-teal-700 shadow-sm'
            : 'text-white hover:bg-white/10'
        }`}
      >
        Basic
      </button>
      <button
        onClick={() => handleChange('all')}
        className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
          selectedLevel === 'all'
            ? 'bg-white text-teal-700 shadow-sm'
            : 'text-white hover:bg-white/10'
        }`}
      >
        All Commands
      </button>
    </div>
  );
}
