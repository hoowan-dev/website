# Agent Context & Workspace Guidelines: hoowan.dev

Welcome to the **hoowan-dev/website** repository. This document outlines the project architecture, tech stack, conventions, and operational workflows for AI pair programmers and automated tools.

---

## 1. Project Overview

- **Repository**: `hoowan-dev/website`
- **Domain**: [hoowan.dev](https://hoowan.dev) (configured via `CNAME`)
- **Hosting**: GitHub Pages (`main` branch)
- **Purpose**: Personal portfolio and technical blog for **Juan Becerra**, Senior Software Engineer & Game Developer (specializing in Unreal Engine, C++, tools, tech-art, graphics, and AI/ML animation pipelines).

---

## 2. Tech Stack & Core Philosophy

- **Zero-Build Vanilla Architecture**: Pure HTML5, modern CSS3, and ES6+ JavaScript.
- **No Build Tools or Bundlers**: No Node.js/npm dependencies, Webpack, Vite, or TypeScript. Do not introduce package managers or bundlers unless explicitly requested.
- **Static & Instant**: Edits directly affect the live browser view upon page refresh.
- **Tone & Identity**: Maintain the clean, technical yet witty tone present in the copy (e.g., game dev experience, session musician gigs, lighthearted personality notes).

---

## 3. Directory Layout & File Roles

```
c:\dev\website\
├── index.html              # Home page: About/Hero, Contact, Skills, Education, Certifications, Experience
├── portfolio.html          # Portfolio page: Game dev and software engineering project showcase
├── blog.html               # Blog page: Technical writeups and research posts
├── styles.css              # Global styles, layout grids, dark-mode design system, glassmorphism
├── js/
│   ├── components.js       # Dynamic injection of shared <header> and <footer>, mobile menu, sticky scroll
│   └── portfolio.js        # Interactive modal system for project and blog details, async HTML loader
├── subpage-content/        # HTML fragments dynamically fetched into modals (e.g., ml-driven-animation.html)
├── media/                  # Image assets organized by section
│   ├── blog/               # Blog post screenshots and diagrams
│   ├── index/              # Profile images and headshots
│   └── portfolio/          # Project thumbnails and game screenshots
├── files/                  # Static downloadable files (e.g., Resume.pdf)
├── CNAME                   # GitHub Pages domain (hoowan.dev)
└── website.code-workspace  # VS Code / Antigravity workspace config
```

---

## 4. Architectural Rules & Component Guidelines

### Shared Navigation and Footer (`js/components.js`)
- **Header & Footer Injection**: The `<header class="site-header">` and `<footer class="footer">` elements are dynamically injected at runtime by `js/components.js`.
- **CRITICAL**: Do **not** hardcode header `<nav>` links or footer content directly inside individual `.html` files. All navigation link changes, site titles, and footer copy must be updated in `js/components.js`.
- **Header Behavior**: Handles sticky scroll shrink/backdrop transitions and responsive mobile menu toggling (`.expanded` class, `aria-expanded` updates).

### Modal System & Dynamic Content (`js/portfolio.js`)
- `portfolio.html` and `blog.html` share an accessible dialog modal (`.project-modal`).
- Cards in `.skill-grid` with `.experience-card` trigger modal population.
- If an `.experience-details` container has a `data-content-url` attribute, `js/portfolio.js` asynchronously fetches the fragment from `subpage-content/` with loading and error states.
- Modal supports closing via close button (`[data-modal-close]`), backdrop click, and the `Escape` key.

### Design System & Styling (`styles.css`)
- **Theme**: Dark mode palette (`#000000` / `#05060e`) with red accents (`#dc2626`, `#ef4444`) and subtle ambient gradients.
- **Glassmorphism**: Translucent frosted panels using `backdrop-filter: blur(...)`, subtle borders (`rgba(148, 163, 184, 0.14)`), and deep soft box-shadows.
- **Typography**: Inter / system UI sans-serif stack, readable body line height (`1.7`).
- **Responsive Layout**: Fluid grids (`.skill-grid`, `.certification-grid`) and responsive layouts (`.hero-layout`) collapsing gracefully on mobile viewports (`@media (max-width: 768px)` and `@media (max-width: 600px)`).

---

## 5. Development & Local Testing Workflows

### Running Locally
Because this is a static site without a build step, serve the directory using any static HTTP server (HTTP serving is required for `fetch()` in `js/portfolio.js` to work without CORS file:// restrictions):

```powershell
# Using Python's built-in HTTP server:
python -m http.server 8000

# Open in browser:
http://localhost:8000
```

### Verification Checklist Before Committing
1. **Navigation Consistency**: Check that all nav links in `js/components.js` correctly resolve to sections (`index.html#skills`, etc.) or pages.
2. **Modal Functionality**: Test card clicks on both `portfolio.html` and `blog.html`; verify that `Escape` closes the modal.
3. **Responsiveness**: Verify that the header mobile toggle opens/closes smoothly on small screens.
4. **Accessibility**: Ensure images include meaningful `alt` text and interactive controls have descriptive labels and ARIA attributes.
5. **Asset Paths**: Use relative paths (`media/...`, `files/...`, `styles.css`) so assets resolve accurately on both local preview and `https://hoowan.dev`.

