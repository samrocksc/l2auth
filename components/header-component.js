import {
  css,
  html,
  LitElement,
} from 'https://unpkg.com/lit@2.0.0-rc.4/index.js?module';

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

      .header-content {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .pizza-icon {
        width: 40px;
        height: 40px;
      }

      h1 {
        margin: 0;
        font-family: var(--font-primary);
        font-size: 1.2rem;
      }

      @media (max-width: 768px) {
        .pizza-icon {
          width: 30px;
          height: 30px;
        }

        h1 {
          font-size: 1rem;
        }
      }
    `;
  }

  render() {
    return html`
      <header>
        <div class="header-content">
          <img src="/assets/pizza-icon.svg" alt="Pizza Icon" class="pizza-icon" />
          <h1><a href="index.html" style="text-decoration: none; color: inherit;">Learn to Auth!</a></h1>
        </div>
        <theme-toggle></theme-toggle>
      </header>

      <nav>
        <tabs-component></tabs-component>
      </nav>
    `;
  }
}

customElements.define('site-header', HeaderComponent);
