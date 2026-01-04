import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

// Initialize theme immediately to prevent flash
const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('marketcraft-theme') as Theme;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  }
  return 'dark'; // Default to dark
};

// Apply theme immediately on load
if (typeof window !== 'undefined') {
  const theme = getInitialTheme();
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.classList.toggle('light', theme === 'light');
}

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    
    localStorage.setItem('marketcraft-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return { theme, setTheme, toggleTheme };
};
