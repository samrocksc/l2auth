import { LitElement, html, css } from 'https://unpkg.com/lit@2.0.0-rc.4/index.js?module';

class HeaderComponent extends LitElement {
  static get styles() {
    return css`
      header {
        background-color: var(--bg-secondary, #f0f0f0);
        padding: 1rem;
        border-bottom: 2px solid var(--accent-color, #ff00ff);
        box-shadow: 0 4px 8px var(--shadow-color, rgba(0, 0, 0, 0.1));
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: var(--font-primary);
      }

      h1 {
        margin: 0;
        font-family: var(--font-primary);
        font-size: 1.2rem;
      }
    `;
  }

  render() {
    return html`
      <header>
        <h1><a href="index.html" style="text-decoration: none; color: inherit;">Learn to Auth!</a></h1>
        <theme-toggle></theme-toggle>
      </header>

      <nav>
        <tabs-component></tabs-component>
      </nav>
    `;
  }
}

customElements.define('site-header', HeaderComponent);
