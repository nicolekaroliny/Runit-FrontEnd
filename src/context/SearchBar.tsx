'use client';

import React, { useState } from 'react';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="hidden lg:flex items-center bg-white/95 rounded-full shadow-md px-4 py-2.5 w-96 gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="#1E5AA8"
        strokeWidth="2"
        className="w-6 h-6 flex-shrink-0"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder="Pesquisar corridas..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-transparent outline-none text-muted-foreground text-base flex-1 placeholder:text-gray-400"
      />
    </div>
  );
}
