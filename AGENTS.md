# Repository Guidelines — STI Static Site

## Project Structure
Flat static site with no build system:
- `index.html` — page structure, sections, and semantic markup
- `css/global.css` — CSS custom properties, reset, shared typography
- `css/sections.css` — section-specific layout, animations, interactions (~1558 lines)
- `js/main.js` — client-side behavior (panel detection, card deck, spotlight)
- `js/member-data.js` — member card data array on `window.memberCards`
- `avatars/` — member avatar images
- `logo.jpg` — primary logo asset
- `CARD_EDITING.md` — guide for editing member card data

## Build, Test, and Development Commands
No build tooling. The site is plain HTML/CSS/JS served as static files.

```bash
python3 -m http.server 8000          # local dev server
open http://localhost:8000           # preview in browser (macOS)
npx prettier --write index.html "css/*.css" "js/*.js"  # format code
```

**Running a single test:** There is no automated test suite. Validate manually:
- Serve locally with `python3 -m http.server 8000`
- Check layout at mobile (375px), tablet (768px), and desktop (1440px)
- Test hover, focus, click, and right-click interactions on member cards
- Verify scroll-snap navigation across all 5 panels
- Check browser console for JavaScript errors

If adding tests later, use `tests/` directory with a naming convention like `feature-name.test.js`.

## Code Style & Conventions

### General
- 2-space indentation across HTML, CSS, and JS
- File names: lowercase with simple directory grouping
- No trailing whitespace; end files with a newline

### HTML
- Semantic elements (`section`, `article`, `header`, `main`)
- ARIA attributes on interactive components (`aria-label`, `aria-expanded`, `role`)
- Screen-reader-only utility class: `.sr-only`
- `lang="en"` on `<html>`, proper `<meta>` tags

### CSS
- Classes: kebab-case (e.g. `.panel-members`, `.card-corner`)
- Custom properties in `:root` use `--c-` prefix for colors, `--font-` for fonts, `--ease-` for timing, `--line-` for borders
- Section-scoped animation control via `--section-play-state` toggled by `.is-active`
- Group related rules under section comments (e.g. `/* ---------- Page 3: The Members ---------- */`)
- Use `clamp()` for responsive sizing; prefer `min()` for max-width constraints
- Always pair `:hover` with `:focus-within` for accessibility
- Media queries at 900px and 560px breakpoints; always include `prefers-reduced-motion: reduce`

### JavaScript
- IDs: camelCase (e.g. `initializeDeck`, `renderMemberCard`)
- IIFE wrapper in `main.js` to avoid global scope pollution
- Data lives in `member-data.js` on `window.memberCards`; consumed by `main.js`
- Guard DOM lookups: `if (!element) return`
- Use `Array.from()` for NodeList iteration
- Event listeners use `{ passive: true }` for scroll/pointer events
- Template literals for HTML generation; keep them concise
- Timer cleanup: always `clearTimeout` before setting a new one
- State flags: use boolean variables (e.g. `deckInitialized`) to prevent re-init

### Error Handling
- No try/catch needed for DOM operations; guard with null checks
- Feature-detect APIs before use (e.g. `'IntersectionObserver' in window`)
- External links use `rel="noreferrer"` and `target="_blank"`

## Member Card Data (`js/member-data.js`)
Each object in `window.memberCards` has: `letter`, `initials`, `name`, `avatar`, `previewRole`, `slogan`, `detailRole`, `description`, `website`, `websiteLabel`, `tx`, `ty`, `rot`, `z`.
- Edit data only in `js/member-data.js`, not in generated HTML
- Avatar paths are relative (e.g. `avatars/ruby.png`)
- `tx`, `ty`, `rot`, `z` control visual stack positioning

## Commit & PR Guidelines
- Short, imperative commit subjects: `Fix card draw animation timing`
- PRs should include: summary, before/after screenshots for UI changes, testing notes with browsers/viewports checked
