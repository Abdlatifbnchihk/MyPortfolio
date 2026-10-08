export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container foot-inner">
        <p className="foot-copy">
          © <span>{new Date().getFullYear()}</span> Abdellatif Ben Cheikh.
        </p>
        <nav className="foot-links" aria-label="Footer">
          <a href="mailto:abdellatifbencheikh43@gmail.com">Email</a>
          <a href="https://github.com/Abdlatifbnchihk/MyPortfolio" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
