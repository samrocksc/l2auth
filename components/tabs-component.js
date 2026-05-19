import {
  css,
  html,
  LitElement,
} from 'https://unpkg.com/lit@2.0.0-rc.4/index.js?module';

class TabsComponent extends LitElement {
  static get properties() {
    return {
      _menuOpen: { type: Boolean, state: true },
      _isMobile: { type: Boolean, state: true },
    };
  }

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

      .mobile-nav {
        display: none;
      }

      @media (max-width: 768px) {
        .tabs-container {
          display: none;
        }
        .mobile-nav {
          display: block;
        }
        .hamburger-btn {
          font-family: var(--font-primary);
          background: none;
          color: var(--accent-color);
          border: 2px solid var(--accent-color);
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.5rem 0.75rem;
          box-shadow: 4px 4px 0 var(--shadow-color);
          transition: all 0.15s;
        }
        .hamburger-btn:hover {
          background-color: var(--accent-color);
          color: var(--bg-primary);
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 var(--shadow-color);
        }
        .mobile-header-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .mobile-active-label {
          flex: 1;
          text-align: center;
        }
        .mobile-tabs {
          display: flex;
          flex-direction: column;
          margin-top: 0.5rem;
        }
        .mobile-tabs .tab-button {
          width: 100%;
          box-sizing: border-box;
          text-align: left;
        }
      }
    `;
  }

  constructor() {
    super();
    this._menuOpen = false;
    this._isMobile = window.innerWidth <= 768;
  }

  connectedCallback() {
    super.connectedCallback();
    this._mediaQuery = window.matchMedia('(max-width: 768px)');
    this._boundHandleMediaChange = (e) => {
      this._isMobile = e.matches;
      if (!e.matches) this._menuOpen = false;
    };
    this._mediaQuery.addEventListener('change', this._boundHandleMediaChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._mediaQuery?.removeEventListener(
      'change',
      this._boundHandleMediaChange,
    );
  }

  _toggleMenu() {
    this._menuOpen = !this._menuOpen;
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

    const tabs = [
      {
        href: `${rootPath}index.html`,
        label: 'Home',
        active: currentPage === 'index.html',
      },
      {
        href: `${rootPath}basic-auth.html`,
        label: 'Basic Auth',
        active: currentPage === 'basic-auth.html',
      },
      {
        href: `${rootPath}jwt.html`,
        label: 'JWT',
        active: currentPage === 'jwt.html',
      },
      {
        href: `${rootPath}oauth2.html`,
        label: 'OAuth 2.0',
        active: currentPage === 'oauth2.html',
      },
      {
        href: `${rootPath}oidc.html`,
        label: 'OIDC',
        active: currentPage === 'oidc.html',
      },
      {
        href: `${conceptsPath}index.html`,
        label: 'Concepts',
        active: currentPage === 'concepts/index.html',
      },
    ];

    // Desktop: show all tabs inline
    if (!this._isMobile) {
      return html`
        <div class="tabs-container">
          ${tabs.map(
            (t) => html`
              <a
                href="${t.href}"
                class="tab-button ${t.active ? 'active' : ''}"
                >${t.label}</a
              >
            `,
          )}
        </div>
      `;
    }

    // Mobile: hamburger + active tab visible; full list toggled
    const activeTab = tabs.find((t) => t.active) || tabs[0];

    return html`
      <div class="mobile-nav">
        <div class="mobile-header-row">
          <button
            class="hamburger-btn"
            @click="${this._toggleMenu}"
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>
          <a
            href="${activeTab.href}"
            class="tab-button active mobile-active-label"
            >${activeTab.label}</a
          >
        </div>
        ${this._menuOpen
          ? html`
              <div class="mobile-tabs">
                ${tabs.map(
                  (t) => html`
                    <a
                      href="${t.href}"
                      class="tab-button ${t.active ? 'active' : ''}"
                      >${t.label}</a
                    >
                  `,
                )}
              </div>
            `
          : ''}
      </div>
    `;
  }
}

customElements.define('tabs-component', TabsComponent);
