import { useState, useEffect, useCallback, useRef } from 'react';
import useTheme from './hooks/useTheme';
import useReveal from './hooks/useReveal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { addRef } = useReveal();
  const [activeSection, setActiveSection] = useState('');

  // Scroll spy for nav
  useEffect(() => {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    let sectionTops = [];

    const cacheSectionTops = () => {
      sectionTops = Array.from(sections).map(
        (s) => s.getBoundingClientRect().top + window.scrollY
      );
    };

    const updateSpy = () => {
      const pos = window.scrollY + window.innerHeight * 0.35;
      let current = '';
      sectionTops.forEach((top, i) => {
        if (top <= pos) current = sections[i].id;
      });
      setActiveSection(current);
    };

    cacheSectionTops();
    updateSpy();

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          updateSpy();
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', cacheSectionTops);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', cacheSectionTops);
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="grain"></div>
      <Navbar theme={theme} toggleTheme={toggleTheme} activeSection={activeSection} />
      <Hero />
      <main id="main" tabIndex="-1">
        <About revealRef={addRef} />
        <Skills revealRef={addRef} />
        <Projects revealRef={addRef} />
        <Education revealRef={addRef} />
        <Contact revealRef={addRef} />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

export default App;
