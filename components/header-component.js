import { LitElement, html } from 'https://unpkg.com/lit@2.0.0-rc.4/index.js?module';

class HeaderComponent extends LitElement {
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
