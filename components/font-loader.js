import {
  css,
  html,
  LitElement,
} from 'https://unpkg.com/lit@2.0.0-rc.4/index.js?module';

class FontLoader extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        visibility: visible; /* Always visible by default to prevent flicker */
      }

      /* Fallback for when JavaScript is disabled */
      @media (scripting: none) {
        :host {
          visibility: visible;
        }
      }
    `;
  }

  static get properties() {
    return {
      loaded: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.loaded = false;

    // Much shorter timeout to prevent noticeable delays
    setTimeout(() => {
      if (!this.loaded) {
        this.onFontsLoaded();
      }
    }, 500); // Reduced from 3000ms to 500ms
  }

  connectedCallback() {
    super.connectedCallback();

    // Check if fonts are already ready
    if (document.fonts.check('1em "Press Start 2P"')) {
      this.onFontsLoaded();
    } else {
      // Listen for font loading
      document.fonts.ready.then(() => {
        this.onFontsLoaded();
      }).catch(() => {
        // Fallback if there's an error
        this.onFontsLoaded();
      });
    }
  }

  onFontsLoaded() {
    if (this.loaded) return; // Prevent double execution

    this.loaded = true;
    // No need to change classes since we're always visible now
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('font-loader', FontLoader);