'use client'

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/authcontext';
import React, { useState } from 'react'
import LogoNav from './LogoNav';
import Link from 'next/link';
import SearchBar from '@/context/SearchBar';
import LoginButton from '@/context/LoginButton';
import UserProfile from '@/context/UserProfile';
import HamburgerButton from '@/context/HamburgerButton';

const NavBar = () => {
    const pathname = usePathname();
    const { isAuthenticated } = useAuth();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const navLinks = [
        {name: 'Home', href: "/"},
        {name: 'Corridas', href: "/corridas"},
        {name: 'Notícias', href: "/blog"}
    ];

    return (
      <nav className="fixed top-0 left-0 right-0 z-[2000] bg-navbar-primary backdrop-blur-xl border-b border-border shadow-lg rounded-b-xl">
            <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex items-center justify-between h-24">
                    <LogoNav/>
                    <SearchBar className="hidden lg:block" />

                    <div className="hidden md:flex items-center gap-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`relative px-8 py-4 text-base font-semibold rounded-xl transition-all duration-300 ${
                                  pathname === link.href
                                    ? 'text-navbar-foreground bg-secondary/20 border-2 border-secondary'
                                    : 'text-navbar-muted-foreground hover:text-navbar-foreground hover:bg-navbar-hover/30'
                                }`}
                            >
                                {pathname === link.href ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-navbar-foreground rounded-full"/>
                                    {link.name}
                                </div>
                                ) : (
                                link.name
                                )}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        {isAuthenticated ? (
                            <UserProfile />
                        ) : (
                            <LoginButton />
                        )}
                    </div>

                    <div className="md:hidden flex items-center gap-2">
                        <HamburgerButton isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
                    </div>
                </div>
            </div>

            <div
                className={`md:hidden border-t border-navbar-primary/20 bg-navbar-primary/98 backdrop-blur-xl overflow-visible transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="px-6 py-6 space-y-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`block px-6 py-4 rounded-lg text-base font-semibold transition-all duration-300 ${
                                pathname === link.href
                                    ? 'text-navbar-foreground bg-secondary/20 border-2 border-secondary'
                                    : 'text-navbar-muted-foreground hover:text-navbar-foreground hover:bg-navbar-hover/30'
                            }`}
                            onClick={toggleMobileMenu}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="mt-6">
                        <SearchBar className="w-full" />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;