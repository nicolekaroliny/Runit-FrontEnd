'use client';

import { usePathname } from 'next/navigation';
import NavBar from './navBar/NavBar';
import { useEffect, useState } from 'react';

export default function ConditionalNavBar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Páginas onde a NavBar não deve aparecer
  const hideNavBarRoutes = ['/signin', '/signup'];
  
  if (!mounted || hideNavBarRoutes.includes(pathname)) {
    return null;
  }
  
  return <NavBar />;
}
