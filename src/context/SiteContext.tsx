import React, { createContext, useContext, useState, useEffect } from 'react';

interface SiteSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  logo: string;
  siteName_ar: string;
  siteName_en: string;
  heroTitle_ar: string;
  heroTitle_en: string;
  heroSub_ar: string;
  heroSub_en: string;
  aboutText_ar: string;
  aboutText_en: string;
  contactEmail: string;
  contactPhone: string;
  address_ar: string;
  address_en: string;
  sliderImages: string;
}

interface User {
  email: string;
  role: string;
}

interface SiteContextType {
  settings: SiteSettings | null;
  user: User | null;
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshSettings: () => Promise<void>;
  translate: (text: string) => Promise<string>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const refreshSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (e) {
      console.error('Failed to fetch settings', e);
    }
  };

  useEffect(() => {
    refreshSettings();
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const translate = async (text: string) => {
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: lang })
      });
      const data = await res.json();
      return data.translatedText || text;
    } catch (e) {
      return text;
    }
  };

  useEffect(() => {
    if (settings) {
      document.documentElement.style.setProperty('--primary', settings.primaryColor);
      document.documentElement.style.setProperty('--secondary', settings.secondaryColor);
      document.documentElement.style.setProperty('--bg', settings.backgroundColor);
      document.documentElement.style.setProperty('--text', settings.textColor);
      document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [settings, lang]);

  return (
    <SiteContext.Provider value={{ settings, user, lang, setLang, login, logout, refreshSettings, translate }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSite must be used within SiteProvider');
  return context;
};
