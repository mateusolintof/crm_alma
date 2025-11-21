'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface TenantBranding {
    primaryColor: string;
    backgroundDark: string;
    backgroundLight: string;
    accentColor: string;
    textOnDark: string;
    textOnLight: string;
}

interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'dark', toggleTheme: () => { } });

export const useTheme = () => useContext(ThemeContext);

export default function BrandingProvider({ branding, children }: { branding: TenantBranding, children: React.ReactNode }) {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        const root = document.documentElement;
        const isDark = theme === 'dark';

        root.style.setProperty('--primary-color', branding.primaryColor);
        root.style.setProperty('--accent-color', branding.accentColor);

        // Dynamic background and text based on theme
        root.style.setProperty('--background-main', isDark ? branding.backgroundDark : branding.backgroundLight);
        root.style.setProperty('--text-main', isDark ? branding.textOnDark : branding.textOnLight);

        // Keep original variables for reference if needed
        root.style.setProperty('--background-dark', branding.backgroundDark);
        root.style.setProperty('--background-light', branding.backgroundLight);
        root.style.setProperty('--text-on-dark', branding.textOnDark);
        root.style.setProperty('--text-on-light', branding.textOnLight);

        // Set body background explicitly
        document.body.style.backgroundColor = isDark ? branding.backgroundDark : branding.backgroundLight;
        document.body.style.color = isDark ? branding.textOnDark : branding.textOnLight;

    }, [branding, theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
