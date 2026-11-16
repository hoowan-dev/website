// Feather-style line icons shared by the sidebar, footer, and any [data-icon] element
const ICONS = {
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>',
  github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>',
  twitter: '<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>',
  music: '<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line>'
};

function iconSvg(name, size) {
  const body = ICONS[name];
  if (!body) {
    return '';
  }
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

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
        <a href="index.html#experience">Experience</a>
        <a href="index.html#skills">Skills</a>
        <a href="index.html#education">Education</a>
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
    const socials = [
      { icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/hoowan/' },
      { icon: 'github', label: 'GitHub', href: 'https://github.com/hoowan-dev' },
      { icon: 'mail', label: 'Email', href: 'mailto:becerrajuan007@gmail.com' },
      { icon: 'file', label: 'Resume (PDF)', href: 'https://github.com/hoowan-dev/resume/blob/main/out/resume.pdf' }
    ];
    const socialLinks = socials.map(({ icon, label, href }) => {
      const external = href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a class="footer-social" href="${href}" aria-label="${label}" title="${label}"${external}>${iconSvg(icon, 18)}</a>`;
    }).join('');

    // "Interested in working together?" call to action, shown above the footer on every page
    footer.insertAdjacentHTML('beforebegin', `
      <section class="section portfolio-cta" aria-labelledby="cta-heading">
        <div class="section-inner">
          <div class="cta-panel">
            <h2 id="cta-heading">Interested in working together?</h2>
            <p>I'm open to software engineering and game development roles. Grab my resume or reach out directly.</p>
            <div class="hero-actions">
              <a href="https://github.com/hoowan-dev/resume/blob/main/out/resume.pdf" class="primary-btn" target="_blank" rel="noopener noreferrer">Resume (PDF)</a>
              <a href="mailto:becerrajuan007@gmail.com" class="secondary-btn">Email Me</a>
              <a href="https://www.linkedin.com/in/hoowan/" class="secondary-btn" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://github.com/hoowan-dev" class="secondary-btn" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      </section>
    `);

    footer.innerHTML = `
      <div class="footer-socials">${socialLinks}</div>
      <p>© ${new Date().getFullYear()} Juan Becerra. Built with hopes, dreams, and #vibes.</p>
    `;
  }

  // Prepend an icon to any element marked with data-icon="name"
  document.querySelectorAll('[data-icon]').forEach((el) => {
    const svg = iconSvg(el.getAttribute('data-icon'), 16);
    if (svg) {
      el.insertAdjacentHTML('afterbegin', svg);
    }
  });
});