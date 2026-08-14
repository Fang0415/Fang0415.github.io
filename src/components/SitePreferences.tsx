'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Languages, Moon, Sun } from 'lucide-react';

export type SiteTheme = 'light' | 'dark';
export type SiteLocale = 'en' | 'zh';

type SitePreferencesValue = {
  theme: SiteTheme;
  locale: SiteLocale;
  toggleTheme: () => void;
  toggleLocale: () => void;
};

const SitePreferencesContext = createContext<SitePreferencesValue | null>(null);

function applyTheme(theme: SiteTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111214' : '#ffffff');
}

function applyLocale(locale: SiteLocale) {
  document.documentElement.dataset.locale = locale;
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
}

export function SitePreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<SiteTheme>('light');
  const [locale, setLocale] = useState<SiteLocale>('en');

  useEffect(() => {
    const initialTheme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    const initialLocale = document.documentElement.dataset.locale === 'zh' ? 'zh' : 'en';
    setTheme(initialTheme);
    setLocale(initialLocale);
    applyTheme(initialTheme);
    applyLocale(initialLocale);
  }, []);

  const value = useMemo<SitePreferencesValue>(() => ({
    theme,
    locale,
    toggleTheme: () => {
      const nextTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(nextTheme);
      applyTheme(nextTheme);
      window.localStorage.setItem('fang-theme', nextTheme);
    },
    toggleLocale: () => {
      const nextLocale = locale === 'en' ? 'zh' : 'en';
      setLocale(nextLocale);
      applyLocale(nextLocale);
      window.localStorage.setItem('fang-locale', nextLocale);
    },
  }), [locale, theme]);

  return <SitePreferencesContext.Provider value={value}>{children}</SitePreferencesContext.Provider>;
}

export function useSitePreferences() {
  const context = useContext(SitePreferencesContext);
  if (!context) throw new Error('useSitePreferences must be used inside SitePreferencesProvider');
  return context;
}

export function SiteText({ en, zh }: { en: ReactNode; zh: ReactNode }) {
  const { locale } = useSitePreferences();
  return <>{locale === 'zh' ? zh : en}</>;
}

export function SitePreferenceControls({ mobile = false }: { mobile?: boolean }) {
  const { theme, locale, toggleTheme, toggleLocale } = useSitePreferences();
  const ThemeIcon = theme === 'light' ? Moon : Sun;
  const themeAction = theme === 'light'
    ? (locale === 'zh' ? '切换到黑夜模式' : 'Switch to dark mode')
    : (locale === 'zh' ? '切换到白天模式' : 'Switch to light mode');
  const localeAction = locale === 'en' ? '切换到中文' : 'Switch to English';

  return (
    <div className={`folio-preferences ${mobile ? 'folio-preferences--mobile' : ''}`} aria-label={locale === 'zh' ? '显示偏好' : 'Display preferences'}>
      <button
        className="folio-preference-button"
        type="button"
        onClick={toggleTheme}
        aria-label={themeAction}
        title={themeAction}
      >
        <ThemeIcon aria-hidden="true" />
      </button>
      <button
        className="folio-preference-button folio-preference-button--locale"
        type="button"
        onClick={toggleLocale}
        aria-label={localeAction}
        title={localeAction}
      >
        <Languages aria-hidden="true" />
        <span>{locale === 'en' ? 'EN' : '中'}</span>
      </button>
    </div>
  );
}
