document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const footer = document.querySelector('.footer');

  if (header) {
    header.innerHTML = `
      <a class="logo" href="index.html">hoowan</a>
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
  }

  if (footer) {
    footer.innerHTML = `
      <p>© ${new Date().getFullYear()} Juan Becerra. Built with hopes, dreams, and free coding assistant tokens.</p>
    `;
  }
});