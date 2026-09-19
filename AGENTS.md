# l2auth Agent Guide

**l2auth** is an interactive learning platform for CIAM (Customer Identity and Access Management) fundamentals. It teaches authentication and authorization flows through a choose-your-own-adventure interface.

## Quick Start

Serve the site locally:
```bash
python -m http.server 8000
# or
npx serve
```

Open [http://localhost:8000](http://localhost:8000) in your browser and pick a flow.

## What This Project Does

- **Interactive Flow Trainer**: Three major authentication flows (PKCE, OAuth 2.0, SAML 2.0)
- **Branching Paths**: At each step, you make choices that determine the flow
- **Real Protocol Details**: HTTP requests/responses, JWT payloads, XML assertions
- **Security Education**: Attack scenarios, key concepts, signature verification

## Key Flows

### 🔑 PKCE (Public Clients)
For browser and mobile apps that cannot securely store secrets. Uses code_verifier and code_challenge.

### 🔐 OAuth 2.0 (Confidential Clients)
For backend servers. Two methods:
- **Client Secret**: Symmetric authentication with shared secret
- **Private Key JWT**: Asymmetric authentication with RS256 signatures

### 🏢 SAML 2.0 (Enterprise SSO)
Assertion-based protocol for corporate identity federations. Uses digitally-signed XML assertions.

## Project Structure

```
l2auth/
├── l2auth_ciam_adventure.html     ← Main interactive trainer
├── index.html                      ← Home page
├── basic-auth.html                 ← Basic auth concepts
├── oauth2.html                     ← OAuth 2.0 reference
├── oidc.html                       ← OpenID Connect guide
├── concepts/                       ← Concept deep-dives
├── components/                     ← LitElement web components
├── styles/                         ← CSS (light/dark theme)
├── assets/                         ← Images and icons
└── README.md                       ← Project documentation
```

## Tech Stack

- Vanilla HTML5/CSS3/JavaScript (no build step)
- Google Fonts (Press Start 2P, IBM Plex Mono)
- CSS variables for light/dark theming
- SVG swimlane diagrams for flow visualization

## Development

```bash
make serve         # Start dev server
make format        # Format code with Biome
make lint          # Lint with Biome
make check-format  # Check formatting
make check-lint    # Check linting
```

## Learning Path

1. **Start with PKCE** if you're new to OAuth flows
2. **Compare with OAuth 2.0** (Client Secret and Private Key JWT)
3. **Learn SAML** for enterprise context
4. **Deep-dive into Concepts** for specific topics (JWT, scopes, claims, etc.)

## Key Takeaways

- **PKCE**: For public clients (browsers, mobile) - uses cryptographic proof
- **OAuth Client Secret**: For confidential clients - simple but less secure if leaked
- **OAuth Private Key JWT**: For confidential clients - more secure, asymmetric
- **SAML**: For enterprise SSO - assertion-based, not token-based, optimized for web apps

## Files to Know

- `l2auth_ciam_adventure.html` - Main interactive tool (66 KB, self-contained)
- `index.html` - Entry point linking to all flows
- `README.md` - Full project documentation
- `Makefile` - Development commands

---

*This project is part of l2auth, a personal knowledge site for CIAM principles.*
