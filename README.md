# L2Auth

Layer 2 Authentication Service

## Description

This project provides authentication services for Layer 2 protocols.

## Installation

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local web server (for development purposes)
- Git (to clone the repository)

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/l2auth.git
   cd l2auth
   ```

2. Serve the files locally:
   
   Option 1 - Using Python (if installed):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   Option 2 - Using Node.js (if installed):
   ```bash
   npx serve
   ```
   
   Option 3 - Using VS Code:
   Install the "Live Server" extension and right-click index.html -> "Open with Live Server"

3. Open your browser and navigate to http://localhost:8000 (or the port specified by your server)

### Project Structure

```
l2auth/
├── index.html          # Main entry point
├── basic-auth.html     # Basic authentication guide
├── jwt.html            # JWT authentication guide
├── oauth2.html         # OAuth 2.0 guide
├── oidc.html           # OpenID Connect guide
├── styles/             # CSS stylesheets
├── components/         # Web components (LitElement)
├── assets/             # Images and other static assets
└── scripts/            # JavaScript utilities
```

### Technologies Used

- HTML5/CSS3 for structure and styling
- JavaScript with LitElement for web components
- Responsive design for mobile and desktop
- CSS Variables for theme management

### Development

No build step is required. The project uses modern browser features directly:
- ES Modules for JavaScript organization
- CSS Variables for theming
- Web Components for reusable UI elements

Simply edit the HTML, CSS, or JS files and refresh your browser to see changes.

### Customization

To modify themes:
1. Edit the CSS variables in `styles/main.css`
2. The dark/light theme toggle is available in the header
3. Colors are controlled via CSS custom properties:
   ```css
   :root {
     --bg-primary: #ffffff;    /* Primary background */
     --bg-secondary: #f0f0f0;  /* Secondary background */
     --text-primary: #000000;  /* Primary text */
     --accent-color: #ff00ff;  /* Accent/magic color */
   }
   ```

### Browser Support

This project uses modern web technologies and is compatible with:
- Chrome 60+
- Firefox 63+
- Safari 10.1+
- Edge 79+

For older browsers, polyfills may be required for Web Components.
