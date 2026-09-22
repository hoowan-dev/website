document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const footer = document.querySelector('.footer');

  if (header) {
    header.innerHTML = `
      <a class="logo" href="index.html">
        <img src="favicon.ico" alt="" width="22" height="22" aria-hidden="true">
        <span>hoowan</span>
      </a>
      <button class="header-toggle" aria-label="Toggle navigation" aria-expanded="false">
        <svg class="icon-menu" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        <svg class="icon-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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
    const navLinks = header.querySelectorAll('.site-nav a');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const isHomePage = currentPath === '' || currentPath === 'index.html';

    // Highlight active navigation link based on current URL
    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      if (isHomePage) {
        if (linkHref === 'index.html#top' && (!window.location.hash || window.location.hash === '#top' || window.location.hash === '#about')) {
          link.classList.add('active');
        } else if (window.location.hash && linkHref === `index.html${window.location.hash}`) {
          link.classList.add('active');
        }
      } else if (linkHref === currentPath) {
        link.classList.add('active');
      }
    });
    
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = header.classList.toggle('expanded');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Automatically close mobile menu if a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('expanded');
        toggleBtn.setAttribute('aria-expanded', 'false');
        if (isHomePage && link.getAttribute('href').startsWith('index.html#')) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && header.classList.contains('expanded')) {
        header.classList.remove('expanded');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && header.classList.contains('expanded')) {
        header.classList.remove('expanded');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Smooth scroll indicator on sticky bar
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  if (footer) {
    footer.innerHTML = `
      <p>© ${new Date().getFullYear()} Juan Becerra. Built with hopes, dreams, and free coding assistant tokens.</p>
    `;
  }
});