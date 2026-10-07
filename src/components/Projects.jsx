import { projects } from '../data/projects.jsx';
import ProjectCard from './ProjectCard';

export default function Projects({ revealRef }) {
  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <header className="section-head reveal" ref={(el) => revealRef('projects-head', el)}>
          <span className="section-idx" aria-hidden="true">03</span>
          <h2 id="projects-title">Projects<em>.</em></h2>
          <span className="section-rule" aria-hidden="true"></span>
          <span className="section-meta" aria-hidden="true">projects.length === {projects.length}</span>
        </header>
        <div className="projects-grid stagger">
          {projects.map((project) => (
            <ProjectCard
              key={project.idx}
              project={project}
              revealRef={revealRef}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
