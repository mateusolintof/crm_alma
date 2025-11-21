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

const ThemeContext = createContext<ThemeContextType>({ theme: 'light', toggleTheme: () => { } });

export const useTheme = () => useContext(ThemeContext);

export default function BrandingProvider({ branding, children }: { branding: TenantBranding, children: React.ReactNode }) {
    const [theme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', branding.primaryColor);
        root.style.setProperty('--primary-strong', branding.primaryColor);
        root.style.setProperty('--accent-color', branding.accentColor);

        // Light-only background and text
        root.style.setProperty('--background-main', branding.backgroundLight);
        root.style.setProperty('--bg-app', branding.backgroundLight || '#f5f7fb');
        root.style.setProperty('--bg-surface', '#ffffff');
        root.style.setProperty('--bg-surface-2', '#f1f5f9');
        root.style.setProperty('--bg-muted', '#e9eef5');
        root.style.setProperty('--border-color', '#e2e8f0');

        root.style.setProperty('--text-main', branding.textOnLight);
        root.style.setProperty('--text-strong', '#0f172a');
        root.style.setProperty('--text-muted', '#475569');

        // Keep original variables for reference if needed
        root.style.setProperty('--background-dark', branding.backgroundDark);
        root.style.setProperty('--background-light', branding.backgroundLight);
        root.style.setProperty('--text-on-dark', branding.textOnDark);
        root.style.setProperty('--text-on-light', branding.textOnLight);

        // Set body background explicitly
        document.body.style.backgroundColor = branding.backgroundLight;
        document.body.style.color = branding.textOnLight;

    }, [branding, theme]);

    const toggleTheme = () => {}; // no-op, light only

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
