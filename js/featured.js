// Builds the home page "Featured Projects" cards from portfolio.html, so each project's
// image, title, and subtitle live in one place. Choose projects via data-featured on .featured-grid.
document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.querySelector('.featured-grid[data-featured]');
  if (!grid) {
    return;
  }

  const ids = grid.dataset.featured.split(/\s+/).filter(Boolean);
  if (!ids.length) {
    grid.hidden = true;
    return;
  }

  try {
    const response = await fetch('portfolio.html');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const portfolio = new DOMParser().parseFromString(await response.text(), 'text/html');

    ids.forEach((id) => {
      const article = portfolio.getElementById(id);
      const title = article && article.querySelector('h3');
      if (!title) {
        console.warn(`Featured project "${id}" was not found in portfolio.html`);
        return;
      }

      const card = document.createElement('a');
      card.className = 'experience-card featured-card';
      // The link is the fallback; js/portfolio.js opens the project's modal from projectSource instead
      card.href = `portfolio.html#${encodeURIComponent(id)}`;
      card.projectSource = document.importNode(article, true);

      const sourceImage = article.querySelector('img.project-image');
      if (sourceImage) {
        const image = document.createElement('img');
        image.src = sourceImage.getAttribute('src');
        image.alt = sourceImage.getAttribute('alt') || '';
        image.className = sourceImage.className;
        ['width', 'height'].forEach((attr) => {
          const value = sourceImage.getAttribute(attr);
          if (value) {
            image.setAttribute(attr, value);
          }
        });
        image.loading = 'lazy';
        image.decoding = 'async';
        card.append(image);
      }

      const heading = document.createElement('h3');
      heading.textContent = title.textContent.trim();
      card.append(heading);

      const subtitle = article.querySelector('.item-subtitle');
      if (subtitle) {
        const blurb = document.createElement('p');
        blurb.textContent = subtitle.textContent.trim();
        card.append(blurb);
      }

      const more = document.createElement('span');
      more.className = 'featured-more';
      more.textContent = 'Read more →';
      card.append(more);

      grid.append(card);
    });
  } catch (error) {
    console.error('Could not load featured projects:', error);
  }

  // If nothing could be built, the "See All Projects" button below still links to the portfolio
  if (!grid.children.length) {
    grid.hidden = true;
  }
});
