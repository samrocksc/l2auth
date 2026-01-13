import { LitElement, html } from 'https://unpkg.com/lit@2.0.0-rc.4/index.js?module';

class TabsComponent extends LitElement {
  render() {
    // Determine the current page for active state
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    return html`
      <div class="tabs-container">
        <a href="index.html" class="tab-button ${currentPage === 'index.html' ? 'active' : ''}">Home</a>
        <a href="basic-auth.html" class="tab-button ${currentPage === 'basic-auth.html' ? 'active' : ''}">Basic Auth</a>
        <a href="jwt.html" class="tab-button ${currentPage === 'jwt.html' ? 'active' : ''}">JWT</a>
        <a href="oauth2.html" class="tab-button ${currentPage === 'oauth2.html' ? 'active' : ''}">OAuth 2.0</a>
        <a href="oidc.html" class="tab-button ${currentPage === 'oidc.html' ? 'active' : ''}">OIDC</a>
      </div>
    `;
  }
}

customElements.define('tabs-component', TabsComponent);
