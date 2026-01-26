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
        visibility: hidden;
      }

      :host(.fonts-loaded) {
        visibility: visible;
      }

      :host(.fonts-loading) {
        visibility: hidden;
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
    this.classList.add('fonts-loading');

    // Fallback timeout in case font loading takes too long
    setTimeout(() => {
      if (!this.loaded) {
        this.onFontsLoaded();
      }
    }, 3000);
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
    this.classList.remove('fonts-loading');
    this.classList.add('fonts-loaded');
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('font-loader', FontLoader);