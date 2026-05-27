import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    localStorage.setItem('adminTheme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
    
    if (isDark) {
      document.documentElement.style.setProperty('--bg-body', '#0a0a0f');
      document.documentElement.style.setProperty('--bg-card', '#1a1a23');
      document.documentElement.style.setProperty('--bg-card-hover', '#1f1f2e');
      document.documentElement.style.setProperty('--bg-elevated', '#1f1f2a');
      document.documentElement.style.setProperty('--bg-input', 'rgba(255,255,255,0.05)');
      document.documentElement.style.setProperty('--bg-hover', 'rgba(255,255,255,0.04)');
      document.documentElement.style.setProperty('--text-primary', '#ffffff');
      document.documentElement.style.setProperty('--text-secondary', '#9ca3af');
      document.documentElement.style.setProperty('--text-muted', '#6b7280');
      document.documentElement.style.setProperty('--border', 'rgba(255,255,255,0.05)');
      document.documentElement.style.setProperty('--border-strong', 'rgba(255,255,255,0.1)');
      document.documentElement.style.setProperty('--sidebar-bg', '#111118');
      document.documentElement.style.setProperty('--navbar-bg', 'rgba(10,10,15,0.9)');
    } else {
      // Clean light theme
      document.documentElement.style.setProperty('--bg-body', '#f0f2f5');
      document.documentElement.style.setProperty('--bg-card', '#ffffff');
      document.documentElement.style.setProperty('--bg-card-hover', '#f8fafc');
      document.documentElement.style.setProperty('--bg-elevated', '#ffffff');
      document.documentElement.style.setProperty('--bg-input', '#f1f5f9');
      document.documentElement.style.setProperty('--bg-hover', '#f8fafc');
      document.documentElement.style.setProperty('--text-primary', '#0f172a');
      document.documentElement.style.setProperty('--text-secondary', '#475569');
      document.documentElement.style.setProperty('--text-muted', '#94a3b8');
      document.documentElement.style.setProperty('--border', '#e2e8f0');
      document.documentElement.style.setProperty('--border-strong', '#cbd5e1');
      document.documentElement.style.setProperty('--sidebar-bg', '#ffffff');
      document.documentElement.style.setProperty('--navbar-bg', 'rgba(255,255,255,0.95)');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;