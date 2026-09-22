# Agent Context: hoowan-dev/website

This file provides context and operational guidelines for AI coding agents operating in this repository.

---

## Project Overview

- **Repository**: `hoowan-dev/website`
- **Domain**: [hoowan.dev](https://hoowan.dev) (configured via `CNAME`)
- **Hosting**: GitHub Pages (`main` branch)
- **Author**: Juan Becerra (Software Engineer & Game Developer)
- **Tech Stack**: Pure Vanilla Web (HTML5, CSS3, ES6+ JavaScript). Zero build pipelines, zero npm dependencies.

---

## Architectural Rules

1. **Shared Navigation & Footer**:
   - `<header class="site-header">` and `<footer class="footer">` are injected dynamically at runtime via `js/components.js`.
   - Never hardcode navigation items or footer content in individual `.html` files. Edit `js/components.js` instead.
2. **Project Modal System**:
   - `portfolio.html` and `blog.html` use `js/portfolio.js` to open cards in a modal dialog.
   - Long-form article content is kept in `subpage-content/` and fetched asynchronously via `data-content-url`.
3. **Styling & Design System**:
   - All styles live in `styles.css`.
   - Theme is dark mode (`#000000` / `#05060e`) with red accents (`#dc2626`, `#ef4444`) and frosted glassmorphism (`backdrop-filter: blur(...)`).
   - Mobile breakpoints are defined around `768px` and `600px`.
4. **Local Development**:
   - Serve using `python -m http.server 8000` to allow `fetch()` requests for subpage content to succeed without local file:// CORS restrictions.

---

## Code Style & Conventions

- **HTML**: Semantic HTML5 tags (`<main>`, `<section>`, `<article>`, `<header>`, `<footer>`, `<aside>`), 2-space indentation.
- **CSS**: Vanilla CSS with modern flex/grid layouts. Keep specificity low and reuse utility/component classes.
- **JS**: Native ES6+ JavaScript, strict DOMContentLoaded listeners, defensive null-checking, and async/await with try/catch.
- **Tone**: Keep existing playful, technical personality intact across bio and descriptions.

