import {
  css,
  html,
  LitElement,
} from 'https://unpkg.com/lit@2.0.0-rc.4/index.js?module';

class TabsComponent extends LitElement {
  static get styles() {
    return css`
      .tabs-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .tab-button {
        font-family: var(--font-primary);
        background-color: var(--bg-primary);
        color: var(--text-primary);
        border: 2px solid var(--accent-color);
        padding: 0.5rem 1rem;
        margin: 0.25rem;
        cursor: pointer;
        box-shadow: 4px 4px 0 var(--shadow-color);
        transition: all 0.2s;
        text-decoration: none;
        display: inline-block;
        font-size: 0.8rem;
      }

      .tab-button:hover {
        background-color: var(--accent-color);
        color: var(--bg-primary);
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 var(--shadow-color);
      }

      .tab-button.active {
        background-color: var(--accent-color);
        color: var(--bg-primary);
        box-shadow: inset 2px 2px 0 var(--shadow-color);
      }
    `;
  }

  render() {
    // Determine the current page for active state
    const currentPage =
      window.location.pathname.split('/').pop() || 'index.html';

    // Determine if we're currently in the concepts directory
    const isInConceptsDir = window.location.pathname.includes('/concepts/');

    // Set appropriate base paths
    const rootPath = isInConceptsDir ? '../' : './';
    const conceptsPath = isInConceptsDir ? './' : './concepts/';

    return html`
      <div class="tabs-container">
        <a href="${rootPath}index.html" class="tab-button ${currentPage === 'index.html' ? 'active' : ''}">Home</a>
        <a href="${rootPath}basic-auth.html" class="tab-button ${currentPage === 'basic-auth.html' ? 'active' : ''}">Basic Auth</a>
        <a href="${rootPath}jwt.html" class="tab-button ${currentPage === 'jwt.html' ? 'active' : ''}">JWT</a>
        <a href="${rootPath}oauth2.html" class="tab-button ${currentPage === 'oauth2.html' ? 'active' : ''}">OAuth 2.0</a>
        <a href="${rootPath}oidc.html" class="tab-button ${currentPage === 'oidc.html' ? 'active' : ''}">OIDC</a>
        <a href="${conceptsPath}index.html" class="tab-button ${currentPage === 'concepts/index.html' ? 'active' : ''}">Concepts</a>
      </div>
    `;
  }
}

customElements.define('tabs-component', TabsComponent);
