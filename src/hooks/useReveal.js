import { useEffect, useRef, useCallback } from 'react';

export default function useReveal() {
  const itemsRef = useRef(new Map());
  const observerRef = useRef(null);
  const reduced = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const addRef = useCallback((id, el) => {
    if (!el) return;
    itemsRef.current.set(id, el);
  }, []);

  useEffect(() => {
    const items = itemsRef.current;

    if (reduced.current) {
      items.forEach((el) => {
        el.classList.add('in', 'settled');
      });
      return;
    }

    const groups = new Map();
    items.forEach((el) => {
      const p = el.parentElement;
      if (!groups.has(p)) groups.set(p, []);
      groups.get(p).push(el);
    });

    groups.forEach((els, parent) => {
      if (parent.classList.contains('stagger') && els.length > 1) {
        els.forEach((el, i) => {
          el.style.transitionDelay = Math.min(i * 90, 480) + 'ms';
        });
      }
    });

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target;
          observerRef.current.unobserve(el);
          el.classList.add('in');
          const delay =
            (parseFloat(getComputedStyle(el).transitionDelay) || 0) * 1000;
          setTimeout(() => {
            el.classList.add('settled');
            el.style.transitionDelay = '';
          }, 750 + delay);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -36px 0px' }
    );

    items.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return { addRef };
}
