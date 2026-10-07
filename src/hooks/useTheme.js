import { useState, useEffect, useCallback } from 'react';

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  const applyTheme = useCallback((t, persist = false) => {
    document.documentElement.setAttribute('data-theme', t);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#11141a' : '#f6f5f2');
    if (persist) {
      try { localStorage.setItem('theme', t); } catch {}
    }
  }, []);

  useEffect(() => {
    applyTheme(theme, false);
  }, [applyTheme, theme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      let saved = null;
      try { saved = localStorage.getItem('theme'); } catch {}
      if (!saved) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme, false);
      }
    };
    if (mq.addEventListener) mq.addEventListener('change', handler);
    return () => { if (mq.removeEventListener) mq.removeEventListener('change', handler); };
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next, true);
  }, [theme, applyTheme]);

  return { theme, toggleTheme };
}
