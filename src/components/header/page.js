'use client';

import { useTheme } from '@/components/theme/ThemeProvider';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const { theme, setTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Check on initial load
        checkIfMobile();

        // Add event listener for window resize
        window.addEventListener('resize', checkIfMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
    };

    // Handle closing the sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuOpen && !e.target.closest('.sidebar') && !e.target.closest('.hamburger-menu')) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    return (
        <header className="fixed left-9 right-9 z-50 mt-1">
            <div className="bg-background/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-lg">
                <nav className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo - Make sure this doesn't have a default navigation */}
                        <Link href="/" className="text-xl font-bold text-primary">
                            <motion.div  className="flex items-center mb-2">
                                                           <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 mr-3 flex items-center justify-center text-white font-bold text-xl">
                                                               C
                                                           </div>
                                <motion.span
                                    animate={{
                                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                    style={{
                                        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)',
                                        backgroundSize: '300% 300%',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}
                                >
                                    ColorsForYou
                                </motion.span>
                                                       </motion.div>
                         
                        </Link>

                        {/* Desktop navigation */}
                        <div className="hidden md:flex items-center space-x-6">
                            <Link
                                href="/"
                                className={`transition-colors ${pathname === '/'
                                        ? 'text-gray-900 dark:text-white font-medium'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                Home
                            </Link>
                            <Link
                                href="/colors"
                                className={`transition-colors ${pathname === '/colors'
                                        ? 'text-gray-900 dark:text-white font-medium'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                Colors
                            </Link>
                            <Link
                                href="/palette"
                                className={`transition-colors ${pathname === '/palette'
                                        ? 'text-gray-900 dark:text-white font-medium'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                Palette
                            </Link>
                            <Link
                                href="/image-palette"
                                className={`transition-colors ${pathname === '/image-palette'
                                        ? 'text-gray-900 dark:text-white font-medium'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                Image Palette
                            </Link>
                            <Link
                                href="/about"
                                className={`transition-colors ${pathname === '/about'
                                        ? 'text-gray-900 dark:text-white font-medium'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                About
                            </Link>
                        </div>

                        <div className="flex items-center space-x-2">
                          
                            <div className="hidden md:flex relative bg-gray-200/60 dark:bg-gray-700/60 rounded-full p-1 space-x-1 backdrop-blur-sm shadow-inner">
                                {['light', 'dark'].map((themeOption) => (
                                    <button
                                        key={themeOption}
                                        onClick={() => handleThemeChange(themeOption)}
                                        className={`
                                            relative px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300 ease-out
                                            ${theme === themeOption
                                                ? 'text-gray-900 dark:text-white z-10'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                            }
                                        `}
                                        aria-label={`Switch to ${themeOption} theme`}
                                    >
                                        {theme === themeOption && (
                                            <motion.div
                                                layoutId="pill-tab"
                                                className="absolute inset-0 bg-white dark:bg-gray-800 rounded-full shadow-md"
                                                style={{ zIndex: -1 }}
                                                transition={{ type: "spring", duration: 0.6, bounce: 0.15 }}
                                            />
                                        )}
                                        <div className="flex items-center gap-1.5">
                                            {themeOption === 'light' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            )}
                                            {themeOption === 'dark' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                                </svg>
                                            )}
                                            
                                            {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Mobile hamburger menu button */}
                            <button
                                className="md:hidden hamburger-menu flex flex-col justify-center items-center w-8 h-8"
                                onClick={() => setMenuOpen(!menuOpen)}
                                aria-label="Toggle menu"
                            >
                                <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 mb-1 ${menuOpen ? 'transform rotate-45 translate-y-1.5' : ''}`}></span>
                                <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 mt-1 ${menuOpen ? 'transform -rotate-45 -translate-y-1.5' : ''}`}></span>
                            </button>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Mobile sidebar */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="sidebar fixed top-0 right-0 h-full w-64 bg-background shadow-lg z-50 overflow-y-auto"
                        initial={{ x: 300 }}
                        animate={{ x: 0 }}
                        exit={{ x: 300 }}
                        transition={{ type: "tween", duration: 0.3 }}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex flex-col space-y-4">
                                <Link
                                    href="/"
                                    className={`py-2 transition-colors ${pathname === '/'
                                            ? 'text-gray-900 dark:text-white font-medium'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/colors"
                                    className={`py-2 transition-colors ${pathname === '/colors'
                                            ? 'text-gray-900 dark:text-white font-medium'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Colors
                                </Link>
                                <Link
                                    href="/palette"
                                    className={`py-2 transition-colors ${pathname === '/palette'
                                            ? 'text-gray-900 dark:text-white font-medium'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Palette
                                </Link>
                                <Link
                                    href="/image-palette"
                                    className={`py-2 transition-colors ${pathname === '/image-palette'
                                            ? 'text-gray-900 dark:text-white font-medium'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Image Palette
                                </Link>
                                <Link
                                    href="/about"
                                    className={`py-2 transition-colors ${pathname === '/about'
                                            ? 'text-gray-900 dark:text-white font-medium'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    About
                                </Link>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-secondary mb-2">Theme</p>
                                    <div className="flex flex-col space-y-2">
                                        {['light', 'dark', 'system'].map((themeOption) => (
                                            <button
                                                key={themeOption}
                                                onClick={() => handleThemeChange(themeOption)}
                                                className={`
                                                    px-4 py-2 text-sm font-medium rounded transition-all duration-200
                                                    ${theme === themeOption
                                                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                    }
                                                `}
                                            >
                                                {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlay when sidebar is open */}
            {menuOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black z-40"
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </header>
    );
}