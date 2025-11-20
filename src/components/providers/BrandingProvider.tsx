'use client';

import { useEffect } from 'react';

interface TenantBranding {
    primaryColor: string;
    backgroundDark: string;
    backgroundLight: string;
    accentColor: string;
    textOnDark: string;
    textOnLight: string;
}

export default function BrandingProvider({ branding }: { branding: TenantBranding }) {
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', branding.primaryColor);
        root.style.setProperty('--background-dark', branding.backgroundDark);
        root.style.setProperty('--background-light', branding.backgroundLight);
        root.style.setProperty('--accent-color', branding.accentColor);
        root.style.setProperty('--text-on-dark', branding.textOnDark);
        root.style.setProperty('--text-on-light', branding.textOnLight);
    }, [branding]);

    return null; // Headless component
}
