document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const footer = document.querySelector('.footer');

  if (header) {
    header.innerHTML = `
      <a class="logo" href="index.html">
        <img src="favicon.ico" alt="" width="24" height="24" aria-hidden="true">
        hoowan
      </a>
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
    
    toggleBtn.addEventListener('click', () => {
      const isExpanded = header.classList.toggle('expanded');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Automatically close the expanded menu if a navigation link is clicked
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

    // Create a placeholder element to prevent layout shift when header becomes fixed
    const headerPlaceholder = document.createElement('div');
    headerPlaceholder.style.display = 'none';
    header.parentNode.insertBefore(headerPlaceholder, header);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        if (!header.classList.contains('scrolled')) {
          headerPlaceholder.style.height = `${header.offsetHeight}px`;
          headerPlaceholder.style.display = 'block';
          header.classList.add('scrolled');
        }
      } else {
        if (header.classList.contains('scrolled') || header.classList.contains('expanded')) {
          headerPlaceholder.style.display = 'none';
          header.classList.remove('scrolled', 'expanded');
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  if (footer) {
    footer.innerHTML = `
      <p>© ${new Date().getFullYear()} Juan Becerra. Built with hopes, dreams, and free coding assistant tokens.</p>
    `;
  }
});