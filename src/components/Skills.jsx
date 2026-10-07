import { useState, useEffect, useRef, useCallback } from 'react';
import { skills } from '../data/skills';
import SkillCard from './SkillCard';

export default function Skills({ revealRef }) {
  const [activeTab, setActiveTab] = useState('frontend');
  const gridRef = useRef(null);
  const touchedRef = useRef(false);
  const reduced = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const filteredSkills = skills.filter((s) => s.category === activeTab);

  const animateBars = useCallback(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.sk-card');
    cards.forEach((card) => {
      if (card.style.display === 'none') return;
      const fill = card.querySelector('.sk-fill');
      const pct = card.querySelector('.sk-pct');
      if (!fill) return;
      const val = parseFloat(fill.dataset.val) || 0;
      if (reduced.current) {
        fill.style.width = val + '%';
        if (pct) pct.textContent = val + '%';
        return;
      }
      const dur = 1100;
      const start = performance.now();
      function tick() {
        const p = Math.min(1, (performance.now() - start) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        fill.style.width = (e * val).toFixed(1) + '%';
        if (pct) pct.textContent = Math.round(e * val) + '%';
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, []);

  // Initial animation on mount
  useEffect(() => {
    if (reduced.current) {
      animateBars();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            animateBars();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, [animateBars]);

  const handleTabChange = (cat) => {
    if (cat === activeTab) return;
    setActiveTab(cat);
    touchedRef.current = true;
    setTimeout(() => {
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.sk-card');
        cards.forEach((card, i) => {
          if (reduced.current) return;
          const d = Math.min(i * 70, 350);
          card.classList.remove('in', 'settled');
          card.style.transitionDelay = d + 'ms';
          void card.offsetWidth;
          card.classList.add('in');
          setTimeout(() => {
            card.classList.add('settled');
            card.style.transitionDelay = '';
          }, 800 + d);
        });
      }
      setTimeout(animateBars, 150);
    }, 10);
  };

  const categories = [
    { key: 'frontend', label: 'frontend' },
    { key: 'backend', label: 'backend' },
    { key: 'tools', label: 'tools & ai' },
  ];

  return (
    <section className="section section-alt" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <header className="section-head reveal" ref={(el) => revealRef('skills-head', el)}>
          <span className="section-idx" aria-hidden="true">02</span>
          <h2 id="skills-title">Skills<em>.</em></h2>
          <span className="section-rule" aria-hidden="true"></span>
          <span className="section-meta" aria-hidden="true">skills.length === {skills.length}</span>
        </header>
        <p className="skills-sub reveal" ref={(el) => revealRef('skills-sub', el)}>
          Technologies and tools I work with
        </p>

        <div className="skills-tabs reveal" role="tablist" aria-label="Skill categories" ref={(el) => revealRef('skills-tabs', el)}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`skill-tab${activeTab === cat.key ? ' active' : ''}`}
              role="tab"
              aria-selected={activeTab === cat.key}
              onClick={() => handleTabChange(cat.key)}
            >
              {cat.label}<em>()</em>
            </button>
          ))}
        </div>

        <div className="skills-grid stagger" id="skills-grid" ref={gridRef}>
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.name}
              skill={skill}
              revealRef={revealRef}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
