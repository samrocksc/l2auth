# L2Auth

A personal knowledge site for learning CIAM (Customer Identity and Access Management) principles through interactive guides.

## What It Covers

- **Basic Auth** — Username/password authentication fundamentals
- **JWT** — JSON Web Tokens: structure, signing, and usage
- **OAuth 2.0** — Authorization flows and grant types
- **OpenID Connect** — Identity layer on top of OAuth 2.0
- **Concepts** — AuthN vs AuthZ, Strong Customer Authentication (SCA/PSD2), and more

## Quick Start

1. Serve the site locally:
   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js
   npx serve
   ```
2. Open [http://localhost:8000](http://localhost:8000) in your browser

## Project Structure

```
l2auth/
├── index.html              # Home
├── basic-auth.html         # Basic authentication
├── jwt.html                # JSON Web Tokens
├── oauth2.html             # OAuth 2.0
├── oidc.html               # OpenID Connect
├── concepts/               # Concept guides
│   ├── index.html          # Concept index
│   ├── auth-n-z.html       # AuthN vs AuthZ
│   └── sca.html            # Strong Customer Authentication
├── components/             # LitElement web components
├── styles/                # CSS (light/dark theming via CSS variables)
├── scripts/                # JavaScript utilities
└── assets/
    ├── markdown/           # OIDC reference docs
    └── pizza-icon.svg      # 🍕
```

## Tech Stack

- Vanilla HTML5/CSS3/JS — no build step
- [LitElement](https://lit.dev) web components
- CSS variables for light/dark theming
- [wc-markdown](https://github.com/vanillawc/wc-markdown) for rendering content
- [Biome](https://biomejs.dev/) for linting and formatting

## Development

```bash
make serve         # Start dev server
make format        # Format code with Biome
make lint          # Lint with Biome
make check-format  # Check formatting
make check-lint    # Check linting
```

## Browser Support

Chrome 60+, Firefox 63+, Safari 10.1+, Edge 79+
