import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    console.log('ThemeProvider: Initializing theme state'); // Debug log
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        console.log('Found saved theme:', savedTheme);
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    console.log('ThemeProvider: useEffect triggered, isDark:', isDark); // Debug log
    const root = document.documentElement;
    const body = document.body;
    
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      body.classList.add('light');
      body.classList.remove('dark');
    }
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    console.log('Theme applied:', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    console.log('ThemeProvider: toggleTheme called, current isDark:', isDark);
    setIsDark(prevIsDark => {
      console.log('ThemeProvider: Changing from', prevIsDark, 'to', !prevIsDark);
      return !prevIsDark;
    });
  };

  const setTheme = (theme) => {
    console.log('ThemeProvider: setTheme called with:', theme);
    setIsDark(theme === 'dark');
  };

  const value = {
    isDark,
    toggleTheme,
    setTheme,
    theme: isDark ? 'dark' : 'light'
  };

  console.log('ThemeProvider: Rendering with value:', value); // Debug log

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  console.log('useTheme: context received:', context); // Debug log
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;