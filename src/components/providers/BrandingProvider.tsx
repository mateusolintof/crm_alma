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

// ThemeContext removed as per "no dark mode" requirement

export default function BrandingProvider({
  branding,
  children,
}: {
  branding: TenantBranding;
  children: React.ReactNode;
}) {
  // User requested "no dark mode" and "professional look".
  // We will strictly enforce the light mode professional palette defined in globals.css
  // We only inject the primary color from the tenant if it exists, otherwise we stick to the default Royal Blue.

  useEffect(() => {
    const root = document.documentElement;

    // Only override primary color if needed, but for now let's stick to the defined professional blue
    // unless the tenant specifically requests a different BRAND color.
    // The user said "lost all customization", so we should probably respect the primary color
    // BUT ensure it doesn't break the professional feel.

    if (branding.primaryColor) {
      root.style.setProperty('--primary-color', branding.primaryColor);
      // We might need to calculate hover/light variants here if we were fully dynamic,
      // but for MVP let's trust the CSS variables or just set the main one.
    }

    // We explicitly DO NOT override backgrounds to ensure the "professional" slate palette is used.
    // root.style.setProperty('--bg-app', ...); // REMOVED
  }, [branding]);

  return <>{children}</>;
}
