# UI Components

Most of the UI is plain static markup. There is one custom element, `lazy-wc-markdown`, which renders Markdown content. Page content stays in light DOM so the site theme applies.

The header, navigation, and footer are static. They are never replaced by a custom element, so they cannot flicker or shift when a new page loads.

## Bootstrap

Every page loads a small set of scripts:

```html
<script src="scripts/site-config.js"></script>
<script src="scripts/theme-init.js"></script>
<script type="module" src="scripts/site.js"></script>
```

- `site-config.js` exposes the nav and site metadata as `window.SITE_CONFIG` so classic scripts share one source.
- `theme-init.js` is a tiny classic script. It applies the saved theme before first paint.
- `site.js` registers `lazy-wc-markdown`, injects Google Tag Manager when configured, and registers the service worker.

Immediately after `<site-header>`, each page also loads:

```html
<script src="scripts/header-fallback.js"></script>
```

This synchronously injects the static header and nav, and wires the mobile toggle, theme toggle, and active link state.

## Layout

`main-wrapper` is a flex column with `min-height: 100vh`. `main` grows to fill the available space, and `.site-footer` has `margin-top: auto`, so the footer stays pinned to the bottom even on short pages. The footer is static markup in each page shell, so it cannot pop in after load.

## Vendored Markdown Renderer

`components/lazy-wc-markdown.js` is a plain custom element that imports `components/vendor/wc-markdown.js`. The vendor bundle contains the `wc-markdown` element, marked, and Prism.

Keep vendored files out of Biome formatting via the `files.includes` exclusion in `biome.json`.

## Root Paths

Each page sets `data-root` on the `<html>` element:

```html
<html lang="en" data-root="../">
```

Scripts read it with `document.documentElement.dataset.root`. Use it for any site-root asset or link:

```js
const root = document.documentElement.dataset.root || "./";
```

This keeps links portable when the site is hosted under a subpath.

## Navigation

Update `scripts/site-config.js` to add or reorder primary navigation items. `header-fallback.js` builds the links and marks the current section active, and `site.js` reads the same config for tag-manager settings.

## Accessibility

- Use semantic elements and a single `main` landmark per page.
- Provide `aria-expanded` and `aria-controls` for toggles.
- Keep a visible `:focus-visible` outline.
- Put text alternatives on meaningful images; use empty `alt` for decorative images.
- Respect `prefers-reduced-motion`.
- Do not rely on color alone to communicate state.
