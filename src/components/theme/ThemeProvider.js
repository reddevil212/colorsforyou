'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Create the theme context
const ThemeContext = createContext({
    theme: 'system',
    setTheme: () => { },
});

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('system');
    // Add a mounted state to prevent hydration mismatch
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Get saved theme from localStorage or default to system
        const savedTheme = localStorage.getItem('theme') || 'system';
        setTheme(savedTheme);
        applyTheme(savedTheme);

        // Listen for changes to the prefers-color-scheme media query
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = () => {
            if (theme === 'system') {
                applyTheme('system');
            }
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, [theme]);

    // Apply theme to document
    const applyTheme = (newTheme) => {
        const root = document.documentElement;

        if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.add('light');
            root.classList.remove('dark');
        }

        // Store the theme preference
        if (newTheme !== 'system') {
            localStorage.setItem('theme', newTheme);
        }
    };

    const value = {
        theme,
        setTheme: (newTheme) => {
            setTheme(newTheme);
            applyTheme(newTheme);
        },
    };

    // Return a placeholder during SSR to prevent hydration issues
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

// Custom hook to use the theme context
export function useTheme() {
    return useContext(ThemeContext);
}