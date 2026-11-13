# Learn to Auth!

A personal knowledge site for learning authentication, authorization, and Customer Identity and Access Management (CIAM) principles through plain-language guides.

## What It Covers

- **Basic Auth** - Username/password authentication fundamentals
- **JWT** - JSON Web Tokens: structure, validation, and safe storage
- **OAuth 2.0** - Delegated authorization, PKCE, and grant types
- **OpenID Connect** - Identity on top of OAuth 2.0
- **Concepts** - AuthN vs AuthZ, SCA, bcrypt, scopes and claims, discovery, JWKS, and more

## Quick Start

```bash
make serve
# or
npm run serve
```

Then open <http://localhost:8080>.

There is no build step for the site itself. It is plain HTML, CSS, JavaScript, and Markdown served as static files. Diagrams are pre-rendered from Excalidraw scenes.

## Project Structure

```text
l2auth/
├── index.html, oidc.html, ...     # Thin page shells
├── content/                       # Page content as Markdown
│   └── concepts/                  # Concept content
├── components/                    # Markdown custom element + vendored renderer
│   └── vendor/                    # Vendored wc-markdown bundle
├── diagrams/                      # Editable Excalidraw scenes
├── scripts/
│   ├── site.js                    # Registers the Markdown element, GTM, and SW
│   ├── site-config.js             # Navigation and site metadata
│   ├── header-fallback.js         # Renders the static header
│   ├── theme-init.js              # Applies the saved theme before paint
│   ├── render-diagrams.mjs        # Renders .excalidraw scenes to SVG
│   └── check-links.mjs            # Local link checker
├── styles/main.css                # Theme, layout, and Markdown styles
├── docs/                          # Contributor documentation
├── assets/                        # Icons and rendered diagrams
├── manifest.json, sw.js           # PWA assets
├── offline.html, 404.html
├── robots.txt, sitemap.xml
└── Makefile, package.json, biome.json
```

## Content Model

Each page is a thin shell with one content element:

```html
<lazy-wc-markdown src="content/oidc.md"></lazy-wc-markdown>
```

The Markdown lives in `content/`. `lazy-wc-markdown` fetches the file, renders it with `marked`, applies syntax highlighting with Prism, and places the result in light DOM so the site theme applies.

- Prefer Markdown for page content.
- Use raw HTML inside Markdown only when Markdown cannot express the layout.
- Keep the `src` path relative to the page, not to the Markdown file.

See [docs/MARKDOWN.md](docs/MARKDOWN.md) for details.

## Diagrams

Flow diagrams are editable Excalidraw scenes in `diagrams/`. Rendered SVGs live in `assets/diagrams/` and are referenced from Markdown like normal images.

```bash
make diagrams       # or: npm run diagrams
```

Edit a scene in Excalidraw, save it to `diagrams/`, then re-render. The renderer drops the unused ZCOOL font from the SVG to keep file sizes small.

## Components

The only custom element is `lazy-wc-markdown`, which renders Markdown from inline text or a `src` file.

The header, navigation, and footer are static markup. The header is injected by `scripts/header-fallback.js`, which also wires the mobile toggle, theme toggle, and active link state. Keeping the shell static prevents it from re-rendering or shifting on page loads, and the flex layout pins the footer to the bottom.

Each page sets `data-root` on `<html>` (`./` or `../`). Scripts use it to resolve root-relative assets without hardcoding paths. This keeps the site portable when hosted under a subpath.

See [docs/WEB_COMPONENTS.md](docs/WEB_COMPONENTS.md).

## Development

```bash
make install       # Install dev dependencies
make serve         # Serve on port 8080
make format        # Format with Biome
make lint          # Lint with Biome
make check         # Biome checks
make check-html    # Validate HTML
make check-links   # Check local links and service-worker paths
make check-all     # Run every check
make diagrams      # Render Excalidraw scenes to SVG
```

CI runs the same checks on every pull request.

## PWA and Offline

`sw.js` precaches every page, content file, component, and core asset. Navigation requests use network-first with an offline fallback; static assets use cache-first; fonts use stale-while-revalidate. The service worker is registered from `scripts/site.js`.

## Deployment

The site is deployed to GitHub Pages by `.github/workflows/pages.yml`.

- Every push to `main` builds a clean `_site/` directory and deploys it.
- You can also run the workflow manually from the Actions tab.
- The build is only a file copy: HTML pages, `content/`, `concepts/`, `components/`, `assets/`, `styles/`, and the four runtime scripts. There is no bundler or build step.

The site is designed to work at a domain root or under a subpath. All asset paths are relative and the manifest uses a relative `start_url` and `scope`.

Update the domain in `robots.txt` and `sitemap.xml` if the site moves. GitHub Pages must be configured with **Source: GitHub Actions** (the workflow switches this automatically when merged).

## Third-Party Code

wc-markdown, marked, Prism, and the fonts are third-party works. See [THIRD_PARTY.md](THIRD_PARTY.md) for versions, licenses, and provenance.

## Browser Support

Modern evergreen browsers: Chrome, Firefox, Safari, and Edge. The site relies on ES modules, custom elements, and optional chaining.

## Contributing

1. Add a Markdown file under `content/`.
2. Copy a page shell from an existing page and set the `src` to the new file.
3. Add the page to `scripts/site-config.js` if it belongs in the primary navigation.
4. Add it to `content/concepts/index.md` if it is a concept.
5. Add it to `sw.js` precache and `sitemap.xml`.
6. Run `make check-all`.
