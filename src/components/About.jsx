import { useEffect, useRef } from 'react';

function animateCount(el, reduced) {
  const target = parseInt(el.dataset.count, 10) || 0;
  if (reduced) {
    el.textContent = target;
    return;
  }
  const dur = 1200;
  const start = performance.now();
  function tick(now) {
    const p = Math.min(1, (now - start) / dur);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(e * target);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

export default function About({ revealRef }) {
  const statNumsRef = useRef([]);
  const reduced = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const nums = statNumsRef.current.filter(Boolean);
    if (!nums.length) return;
    if (reduced.current) {
      nums.forEach((el) => animateCount(el, true));
      return;
    }
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            animateCount(en.target, false);
            cio.unobserve(en.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    nums.forEach((el) => cio.observe(el));
    return () => cio.disconnect();
  }, []);

  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="container">
        <header className="section-head reveal" ref={(el) => revealRef('about-head', el)}>
          <span className="section-idx" aria-hidden="true">01</span>
          <h2 id="about-title">About<em>.</em></h2>
          <span className="section-rule" aria-hidden="true"></span>
          <span className="section-meta" aria-hidden="true">dev + linguist</span>
        </header>
        <div className="about-grid">
          <aside className="about-card reveal" ref={(el) => revealRef('about-card', el)}>
            <div className="about-id">
              <div className="monogram" aria-hidden="true">AB</div>
              <div>
                <p className="about-name">Abdellatif Ben Cheikh</p>
                <p className="about-role">full-stack developer</p>
              </div>
            </div>
            <div className="stats">
              <div className="stat">
                <span
                  className="stat-num"
                  data-count="5"
                  ref={(el) => (statNumsRef.current[0] = el)}
                >
                  0
                </span>
                <span className="stat-label">Projects shipped</span>
              </div>
              <div className="stat">
                <span
                  className="stat-num"
                  data-count="4"
                  ref={(el) => (statNumsRef.current[1] = el)}
                >
                  0
                </span>
                <span className="stat-label">Frameworks in daily use</span>
              </div>
              <div className="stat">
                <span
                  className="stat-num"
                  data-count="3"
                  ref={(el) => (statNumsRef.current[2] = el)}
                >
                  0
                </span>
                <span className="stat-label">Languages spoken</span>
              </div>
            </div>
          </aside>
          <div className="about-body stagger">
            <p className="about-lead reveal" ref={(el) => revealRef('about-lead', el)}>
              I'm a full-stack developer with a strong foundation in PHP, MySQL and modern
              JavaScript frameworks, focused on building applications that are scalable,
              responsive, and easy to maintain.
            </p>
            <p className="about-p reveal" ref={(el) => revealRef('about-p', el)}>
              My background sits at an unusual crossroads: alongside development, I studied
              English Linguistics and Literature — a mix that shows up in how I write
              documentation, structure code, and communicate with teams. I'm especially
              interested in using AI-assisted development tools to work faster without
              cutting corners on quality.
            </p>
            <div className="about-langs reveal" ref={(el) => revealRef('about-langs', el)}>
              <h3 className="mini-label">// languages</h3>
              <ul className="lang-list">
                <li>
                  <span className="lang-name">Arabic</span>
                  <span className="lang-lead" aria-hidden="true"></span>
                  <span className="lang-lvl">Native</span>
                </li>
                <li>
                  <span className="lang-name">English</span>
                  <span className="lang-lead" aria-hidden="true"></span>
                  <span className="lang-lvl">Professional</span>
                </li>
                <li>
                  <span className="lang-name">French</span>
                  <span className="lang-lead" aria-hidden="true"></span>
                  <span className="lang-lvl">Professional</span>
                </li>
              </ul>
            </div>
            <div className="about-soft reveal" ref={(el) => revealRef('about-soft', el)}>
              <h3 className="mini-label">// soft skills</h3>
              <ul className="soft-chips">
                <li className="chip">Problem-solving</li>
                <li className="chip">Team collaboration</li>
                <li className="chip">Communication</li>
                <li className="chip">Fast learner</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
