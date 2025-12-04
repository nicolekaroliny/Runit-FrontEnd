'use client';

import React, { useState, useEffect } from 'react';

const sunIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const moonIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
  </svg>
);

export default function ThemeToggleButton() {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
      htmlElement.classList.remove('light');
      htmlElement.style.colorScheme = 'dark';
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.classList.add('light');
      htmlElement.style.colorScheme = 'light';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full overflow-hidden
                 bg-white/10 dark:bg-white/10 backdrop-blur-md
                 border border-white/20 dark:border-white/20
                 hover:bg-white/20 dark:hover:bg-white/20
                 transition-all duration-300
                 flex items-center justify-center
                 theme-toggle-btn"
      aria-label="Alternar tema"
      tabIndex={0}
    >
      <div className="relative w-full h-full">
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            theme === 'light' ? 'text-black opacity-100' : 'text-black opacity-0'
          } transition-opacity duration-300 theme-icon-moon`}
        >
          {moonIcon}
        </div>
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            theme === 'dark' ? 'text-white opacity-100' : 'text-white opacity-0'
          } transition-opacity duration-300 theme-icon-sun`}
        >
          {sunIcon}
        </div>
      </div>
    </button>
  );
}
