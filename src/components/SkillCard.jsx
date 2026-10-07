import { useEffect, useRef } from 'react';

export default function SkillCard({ skill, revealRef }) {
  const fillRef = useRef(null);
  const pctRef = useRef(null);
  const reduced = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const fill = fillRef.current;
    const pct = pctRef.current;
    if (!fill || reduced.current) {
      if (fill) fill.style.width = skill.value + '%';
      if (pct) pct.textContent = skill.value + '%';
    } else {
      fill.style.width = '0%';
    }
  }, [skill.value]);

  const animateBar = () => {
    const fill = fillRef.current;
    const pct = pctRef.current;
    if (!fill) return;
    const val = skill.value;
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
  };

  return (
    <article
      className="sk-card reveal"
      data-cat={skill.category}
      ref={(el) => {
        revealRef(`skill-${skill.name}`, el);
      }}
      data-animate-bar={animateBar}
    >
      <div className="sk-top">
        <h3 className="sk-name">{skill.name}</h3>
        <span className="sk-idx" aria-hidden="true">{skill.idx}</span>
      </div>
      <span className={`sk-level ${skill.level}`}>{skill.level}</span>
      <div className="sk-bar-row">
        <span className="sk-bar" aria-hidden="true">
          <span
            className="sk-fill"
            data-val={skill.value}
            ref={fillRef}
          ></span>
        </span>
        <span className="sk-pct" ref={pctRef}>0%</span>
      </div>
    </article>
  );
}
