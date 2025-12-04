'use client';

import React from 'react';
import Link from 'next/link';

export default function LoginButton() {
  return (
    <Link href="/signin">
      <button className="bg-white text-navbar-primary font-bold rounded-full px-6 py-2.5 shadow-md 
                       hover:shadow-lg hover:scale-105 transition-all duration-200 border border-white">
        Login
      </button>
    </Link>
  );
}
