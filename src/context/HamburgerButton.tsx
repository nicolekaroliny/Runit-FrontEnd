'use client';

import React from 'react';

type HamburgerButtonProps = {
  isOpen: boolean;
  toggleMenu: () => void;
};

const HamburgerButton = ({ isOpen, toggleMenu }: HamburgerButtonProps) => {
  return (
    <button
      className="flex flex-col items-center justify-center w-8 h-8 text-navbar-foreground backdrop-blur-md 
                 transition-all duration-300 hover:scale-105 active:scale-95"
      onClick={toggleMenu}
      aria-label="Toggle mobile menu"
    >
      <span
        className={`block h-0.5 w-5 bg-navbar-foreground rounded-full my-0.5 transition-all duration-300 origin-center ${
          isOpen ? 'rotate-45 translate-y-1.5' : 'rotate-0 translate-y-0'
        }`}
      ></span>
      <span
        className={`block h-0.5 w-5 bg-navbar-foreground rounded-full my-0.5 transition-all duration-300 ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}
      ></span>
      <span
        className={`block h-0.5 w-5 bg-navbar-foreground rounded-full my-0.5 transition-all duration-300 origin-center ${
          isOpen ? '-rotate-45 -translate-y-1.5' : 'rotate-0 translate-y-0'
        }`}
      ></span>
    </button>
  );
};

export default HamburgerButton;
