import { LitElement, html, css } from 'https://unpkg.com/lit@2.0.0-rc.4/index.js?module';

class SiteFooter extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        text-align: center;
        padding: 1rem;
        background-color: var(--bg-secondary);
        border-top: 1px solid var(--border-color);
        margin-top: 2rem;
        box-shadow: 0 -2px 4px var(--shadow-color);
      }

      p {
        margin: 0;
        color: var(--text-primary);
      }
    `;
  }

  render() {
    return html`
      <p>L2Auth Newb</p>
    `;
  }
}

customElements.define('site-footer', SiteFooter);
