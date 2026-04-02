# Repository Guidelines

## Project Structure & Module Organization
This repository is a small static site with a flat, easy-to-scan layout:
- `index.html` contains the page structure and content.
- `css/global.css` defines shared tokens, resets, and site-wide rules.
- `css/sections.css` holds section-specific layout, animation, and interaction styles.
- `js/main.js` contains client-side behavior.
- `logo.jpg` stores the primary image asset.

Keep new assets in clearly named top-level folders such as `images/` or `fonts/` rather than mixing them into existing directories.

## Build, Test, and Development Commands
No build system is configured; this site runs as plain HTML, CSS, and JavaScript.
- `python3 -m http.server 8000` — serve the project locally from the repo root.
- `open index.html` — quick manual preview on systems that support `open`.
- `npx prettier --check index.html "css/*.css" "js/*.js"` — optional formatting check if Prettier is available.

When testing visual changes, prefer a local server so relative asset paths and browser behavior match production more closely.

## Coding Style & Naming Conventions
Use 2-space indentation across HTML, CSS, and JavaScript. Match the existing naming style:
- CSS classes: kebab-case, e.g. `.panel-identity`, `.vision-item`
- JavaScript identifiers: camelCase
- File names: lowercase with simple directory grouping

Favor semantic HTML, small focused functions, and reusable CSS custom properties before adding one-off values. Keep interactions accessible with labels, headings, and keyboard support.

## Testing Guidelines
There is no automated test suite yet. Validate changes with manual checks in a browser:
- confirm layout across the full page flow
- test hover, focus, and click interactions
- verify responsive behavior at mobile and desktop widths
- check the browser console for JavaScript errors

If automated tests are added later, place them in a `tests/` directory and name them by feature, such as `members-panel.test.js`.

## Commit & Pull Request Guidelines
This workspace does not include `.git` history, so no repository-specific commit convention is available locally. Use short, imperative commit subjects such as `Add member card hover polish`.

For pull requests, include:
- a brief summary of the change
- before/after screenshots or a short screen recording for UI updates
- testing notes listing browsers and viewport sizes checked
- linked issue or task reference when applicable
