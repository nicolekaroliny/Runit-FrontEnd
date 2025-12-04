'use client';

import { usePathname } from 'next/navigation';
import NavBar from './navBar/NavBar';

export default function ConditionalNavBar() {
  const pathname = usePathname();
  
  // Páginas onde a NavBar não deve aparecer
  const hideNavBarRoutes = ['/signin', '/signup'];
  
  if (hideNavBarRoutes.includes(pathname)) {
    return null;
  }
  
  return <NavBar />;
}
