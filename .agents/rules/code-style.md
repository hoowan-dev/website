---
trigger: always_on
description: Frontend coding conventions, styling guidelines, and vanilla JS best practices for hoowan.dev
---

# Code Style & Frontend Standards

## 1. Vanilla Web Stack Integrity
- Keep this codebase strictly vanilla HTML5, CSS3, and modern JavaScript (ES6+).
- Do not introduce NPM packages, bundlers (Webpack, Vite, Rollup), transpilers (Babel), or heavy UI frameworks (React, Vue, Tailwind) unless explicitly requested by the user.
- All files must be directly executable and browsable over a simple HTTP server (`python -m http.server 8000`).

## 2. HTML Conventions
- Use semantic HTML tags (`<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<nav>`).
- Accessibility:
  - All interactive elements (`<button>`, `<a>`) must have accessible names or `aria-label` / `aria-expanded` attributes.
  - Modals must preserve `aria-hidden="true/false"`, `role="dialog"`, and `aria-modal="true"`.
  - All `<img>` tags must supply descriptive `alt` text or `alt=""` with `aria-hidden="true"` if purely decorative.
- Maintain consistent 2-space indentation.

## 3. CSS Conventions
- Centralize all styling in `styles.css`. Avoid inline style attributes whenever practical.
- Design tokens & theme:
  - Backgrounds: Dark tones (`#000000`, `#05060e`) with red gradient highlights (`rgba(220, 38, 38, ...)`).
  - Accents: Red palette (`#dc2626`, `#ef4444`).
  - Glassmorphism: Translucent white borders (`rgba(148, 163, 184, 0.14)`), `backdrop-filter: blur(12px)`.
- Responsive layout:
  - Use fluid layout techniques (`width: min(1180px, calc(100% - 2rem))`, `display: grid`, `grid-template-columns: repeat(auto-fit, minmax(...))`).
  - Mobile breakpoints: Test at `<= 768px` and `<= 600px`.

## 4. JavaScript Conventions
- Wrap script logic inside `document.addEventListener('DOMContentLoaded', ...)` or ensure scripts are loaded with `defer`.
- Do not duplicate header/footer markup in HTML files. Always manage shared navigation links and footer copy through `js/components.js`.
- Always check that DOM query results exist before manipulating them (e.g. `if (header) { ... }`).
- Handle network calls via `async/await` wrapped in `try/catch` blocks, providing clear fallback or user error messages.
- Always support keyboard accessibility (e.g., closing modals with the `Escape` key).

