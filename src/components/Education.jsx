import { education } from '../data/education';

const eduIcons = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m22 10-10-5L2 10l10 5 10-5Z"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="m15.5 13 1.5 9-5-3-5 3 1.5-9"/></svg>,
];

export default function Education({ revealRef }) {
  return (
    <section className="section section-alt" id="education" aria-labelledby="education-title">
      <div className="container">
        <header className="section-head reveal" ref={(el) => revealRef('edu-head', el)}>
          <span className="section-idx" aria-hidden="true">04</span>
          <h2 id="education-title">Education<em>.</em></h2>
          <span className="section-rule" aria-hidden="true"></span>
          <span className="section-meta" aria-hidden="true">education.length === {education.length}</span>
        </header>
        <ol className="edu-list stagger">
          {education.map((item, i) => (
            <li
              className="edu-item reveal"
              key={i}
              ref={(el) => revealRef(`edu-${i}`, el)}
            >
              <span className="edu-node" aria-hidden="true">
                {eduIcons[i]}
              </span>
              <div className="edu-card">
                <h3 className="edu-title">{item.title}</h3>
                <p className="edu-org">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 21h18"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><path d="M9 7h2M9 11h2M9 15h2M13 7h2M13 11h2M13 15h2"/>
                  </svg>
                  {item.org}
                </p>
                <div className="edu-meta">
                  <span className="edu-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/>
                    </svg>
                    {item.year}
                  </span>
                  <span className="edu-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {item.location}
                  </span>
                  <span className="edu-mode">
                    <span className="edu-dot" aria-hidden="true"></span>
                    {item.mode}
                  </span>
                </div>
                <p className="edu-desc">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
