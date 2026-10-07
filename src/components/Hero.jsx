import { useEffect, useRef, useState, useCallback } from 'react';

const CODE = [
  ['const ', 'kw'], ['developer', ''], [' = ', 'pun'], ['{', 'pun'], ['\n  ', ''],
  ['name', 'prop'], [': ', 'pun'], ["'Abdellatif Ben Cheikh'", 'str'], [',', 'pun'], ['\n  ', ''],
  ['role', 'prop'], [': ', 'pun'], ["'Full-Stack Web Developer'", 'str'], [',', 'pun'], ['\n  ', ''],
  ['stack', 'prop'], [': ', 'pun'], ['[', 'pun'], ["'PHP'", 'str'], [', ', 'pun'],
  ["'Laravel'", 'str'], [', ', 'pun'], ["'React'", 'str'], [', ', 'pun'], ["'MySQL'", 'str'],
  [']', 'pun'], [',', 'pun'], ['\n  ', ''],
  ['location', 'prop'], [': ', 'pun'], ["'Agadir, Morocco'", 'str'], [',', 'pun'], ['\n  ', ''],
  ['openTo', 'prop'], [': ', 'pun'], ["'new opportunities'", 'str'], ['\n', ''],
  ['};', 'pun'],
];
const TOTAL = CODE.reduce((n, seg) => n + seg[0].length, 0);

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

function renderCode(n) {
  let html = '',
    count = 0;
  for (const seg of CODE) {
    if (count >= n) break;
    const take = Math.min(seg[0].length, n - count);
    const piece = esc(seg[0].slice(0, take));
    html += seg[1]
      ? '<span class="tok-' + seg[1] + '">' + piece + '</span>'
      : piece;
    count += take;
  }
  return html + '<span class="cursor" aria-hidden="true"></span>';
}

export default function Hero() {
  const canvasRef = useRef(null);
  const preRef = useRef(null);
  const fadeRef = useRef(null);
  const cueRef = useRef(null);
  const rafRef = useRef(false);
  const starsRef = useRef([]);
  const meteorsRef = useRef([]);
  const lastMeteorRef = useRef(0);
  const nextMeteorInRef = useRef(2500);

  const reduced = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const mqHeroFixed = useRef(window.matchMedia('(min-width: 1000px)').matches);

  // Scroll parallax
  useEffect(() => {
    const onScroll = () => {
      if (!mqHeroFixed.current || reduced.current) return;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (y - vh * 0.12) / (vh * 0.5)));
      if (fadeRef.current) {
        fadeRef.current.style.opacity = (1 - p).toFixed(3);
        fadeRef.current.style.transform =
          'translateY(' + (-48 * p).toFixed(1) + 'px)';
      }
      if (cueRef.current) {
        cueRef.current.style.opacity = Math.max(
          0,
          1 - y / (vh * 0.3)
        ).toFixed(3);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Typing effect
  useEffect(() => {
    if (!preRef.current) return;
    if (reduced.current) {
      preRef.current.innerHTML = renderCode(TOTAL);
      return;
    }
    let pos = 0;
    const type = () => {
      pos += Math.random() < 0.22 ? 2 : 1;
      if (preRef.current) preRef.current.innerHTML = renderCode(Math.min(pos, TOTAL));
      if (pos < TOTAL) setTimeout(type, 14 + Math.random() * 36);
    };
    const timer = setTimeout(type, 600);
    return () => clearTimeout(timer);
  }, []);

  // Canvas star animation
  const buildStars = useCallback((W, H) => {
    const count = Math.max(90, Math.round((W * H) / 8500));
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.35 + Math.random() * 1.05,
        base: 0.25 + Math.random() * 0.55,
        amp: 0.15 + Math.random() * 0.3,
        speed: 0.3 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
        tint: Math.random() < 0.18,
      });
    }
    return stars;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = 0,
      H = 0;
    let rafRunning = false;

    function sizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      starsRef.current = buildStars(W, H);
      if (reduced.current) {
        ctx.clearRect(0, 0, W, H);
        drawStars(ctx, starsRef.current, 0);
      }
    }

    function drawStars(c, stars, t) {
      for (const s of stars) {
        const a = s.base + Math.sin(t * s.speed + s.phase) * s.amp;
        if (a <= 0.02) continue;
        c.globalAlpha = Math.min(1, a);
        c.fillStyle = s.tint ? '#bcd2ff' : '#ffffff';
        c.beginPath();
        c.arc(s.x, s.y, s.r, 0, 6.2832);
        c.fill();
        if (s.r > 1.1) {
          c.globalAlpha = Math.min(1, a * 0.4);
          c.strokeStyle = '#ffffff';
          c.lineWidth = 0.6;
          const L = s.r * 4.2;
          c.beginPath();
          c.moveTo(s.x - L, s.y);
          c.lineTo(s.x + L, s.y);
          c.moveTo(s.x, s.y - L);
          c.lineTo(s.x, s.y + L);
          c.stroke();
        }
      }
      c.globalAlpha = 1;
    }

    function spawnMeteor() {
      const dir = Math.random() < 0.5 ? 1 : -1;
      const ang = 0.35 + Math.random() * 0.25;
      const speed = 5.5 + Math.random() * 4;
      meteorsRef.current.push({
        x: dir > 0 ? Math.random() * W * 0.45 : W * 0.55 + Math.random() * W * 0.45,
        y: 20 + Math.random() * H * 0.35,
        vx: Math.cos(ang) * speed * dir,
        vy: Math.sin(ang) * speed,
        len: 70 + Math.random() * 80,
        life: 0,
        ttl: 60 + Math.random() * 35,
      });
    }

    function drawMeteors() {
      for (let i = meteorsRef.current.length - 1; i >= 0; i--) {
        const m = meteorsRef.current[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life++;
        const p = Math.min(1, m.life / m.ttl);
        if (p >= 1 || m.x < -160 || m.x > W + 160 || m.y > H + 160) {
          meteorsRef.current.splice(i, 1);
          continue;
        }
        const a = Math.sin(Math.PI * p);
        const mag = Math.hypot(m.vx, m.vy) || 1;
        const tx = m.x - (m.vx / mag) * m.len;
        const ty = m.y - (m.vy / mag) * m.len;
        const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
        g.addColorStop(0, 'rgba(255,255,255,' + (0.85 * a).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,' + a.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.5, 0, 6.2832);
        ctx.fill();
      }
    }

    function frame(now) {
      if (window.scrollY < window.innerHeight) {
        const t = now / 1000;
        ctx.clearRect(0, 0, W, H);
        drawStars(ctx, starsRef.current, t);
        if (now - lastMeteorRef.current > nextMeteorInRef.current) {
          spawnMeteor();
          lastMeteorRef.current = now;
          nextMeteorInRef.current = 3800 + Math.random() * 5200;
        }
        drawMeteors();
        requestAnimationFrame(frame);
      } else {
        rafRunning = false;
      }
    }

    function startLoop() {
      if (rafRunning || reduced.current) return;
      rafRunning = true;
      requestAnimationFrame(frame);
    }

    sizeCanvas();
    startLoop();

    window.addEventListener('resize', sizeCanvas);
    window.addEventListener('scroll', startLoop, { passive: true });

    return () => {
      window.removeEventListener('resize', sizeCanvas);
      window.removeEventListener('scroll', startLoop);
    };
  }, [buildStars]);

  return (
    <>
      <section className="hero" id="home" aria-label="Introduction">
        <canvas ref={canvasRef} id="stars" aria-hidden="true" />
        <div className="hero-fade" ref={fadeRef}>
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="hero-kicker">
                Full-stack web developer
                <span className="sep" aria-hidden="true">·</span>
                Agadir, Morocco
              </p>
              <h1>Abdellatif Ben Cheikh</h1>
              <p className="hero-desc">
                I build scalable, responsive web applications with PHP, Laravel and
                modern JavaScript — from relational schemas to the pixels people click on.
                Clean, maintainable code, delivered with the help of AI-assisted workflows.
              </p>
              <div className="hero-actions">
                <a className="btn btn-solid" href="https://drive.google.com/file/d/1cakM_UzpJ3lAJo5gn-VmPsjYV-LEP4R2/view?usp=sharing">View My Cv</a>
                <a className="btn btn-ghost" href="#contact">Get in touch</a>
              </div>
            </div>
            <div className="terminal">
              <div className="terminal-bar">
                <span className="t-dot r" aria-hidden="true"></span>
                <span className="t-dot y" aria-hidden="true"></span>
                <span className="t-dot g" aria-hidden="true"></span>
                <span className="terminal-title">profile.js</span>
              </div>
              <div className="terminal-body">
                <pre ref={preRef} aria-hidden="true"></pre>
                <p className="sr-only">
                  const developer = {'{'} name: &apos;Abdellatif Ben Cheikh&apos;,
                  role: &apos;Full-Stack Web Developer&apos;, stack: [&apos;PHP&apos;,
                  &apos;Laravel&apos;, &apos;React&apos;, &apos;MySQL&apos;], location:
                  &apos;Agadir, Morocco&apos;, openTo: &apos;new opportunities&apos; {'}'};
                </p>
              </div>
            </div>
          </div>
        </div>
        <a className="scroll-cue" ref={cueRef} href="#about" aria-label="Scroll down to the about section">
          <span>scroll</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </a>
      </section>
      <div className="hero-spacer" aria-hidden="true"></div>
    </>
  );
}
