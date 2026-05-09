document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const footer = document.querySelector('.footer');

  if (header) {
    header.innerHTML = `
      <a class="logo" href="index.html">hoowan</a>
      <button class="header-toggle" aria-label="Toggle navigation" aria-expanded="false">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
      <nav class="site-nav" aria-label="Primary">
        <a href="index.html#top">About</a>
        <a href="index.html#skills">Skills</a>
        <a href="index.html#education">Education</a>
        <a href="index.html#certifications">Certifications</a>
        <a href="index.html#experience">Experience</a>
        <a href="portfolio.html">Portfolio</a>
        <a href="blog.html">Blog</a>
      </nav>
    `;

    const toggleBtn = header.querySelector('.header-toggle');
    
    toggleBtn.addEventListener('click', () => {
      const isExpanded = header.classList.toggle('expanded');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Automatically close the expanded menu if a navigation link is clicked
    header.querySelectorAll('.site-nav a').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('expanded');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled', 'expanded');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (footer) {
    footer.innerHTML = `
      <p>© ${new Date().getFullYear()} Juan Becerra. Built with hopes, dreams, and free coding assistant tokens.</p>
    `;
  }
});