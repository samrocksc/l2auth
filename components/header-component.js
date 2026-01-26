import {
	css,
	html,
	LitElement,
} from "https://unpkg.com/lit@2.0.0-rc.4/index.js?module";

class HeaderComponent extends LitElement {
	static get styles() {
		return css`
      :host {
        display: block;
        contain: layout style paint;
      }

      .site-header-container {
        contain: layout style paint;
        width: 100%;
        transform: translateZ(0); /* Hardware acceleration */
      }

      header {
        background-color: var(--bg-secondary, #f0f0f0);
        padding: 1rem;
        border-bottom: 2px solid var(--accent-color, #ff00ff);
        box-shadow: 0 4px 8px var(--shadow-color, rgba(0, 0, 0, 0.1));
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: var(--font-primary);
        /* Add these to prevent flickering */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        will-change: transform;

        /* Prevent header from shifting when scrollbars appear */
        position: relative;
        width: 100%;
        box-sizing: border-box;

        /* Ensure consistent rendering */
        transform: translateZ(0);
        backface-visibility: hidden;

        /* Prevent potential transitions during page loads */
        transition: none;

        /* Ensure header renders immediately without waiting for other components */
        min-height: 60px;
      }

      .header-content {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .pizza-icon {
        width: 40px;
        height: 40px;
        /* Ensure icon loads quickly */
        contain: strict;
      }

      h1 {
        margin: 0;
        font-family: var(--font-primary);
        font-size: 1.2rem;
      }

      h1 a {
        text-decoration: none;
        color: inherit;
        /* Prevent link hover effects during page transitions */
        transition: none;
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
      <div class="site-header-container">
        <header>
          <div class="header-content">
            <img
              src="/assets/pizza-icon.svg"
              alt="Pizza Icon"
              class="pizza-icon"
              loading="eager"
            />
            <h1><a href="/">Learn to Auth!</a></h1>
          </div>
          <theme-toggle></theme-toggle>
        </header>

        <nav>
          <tabs-component></tabs-component>
        </nav>
      </div>
    `;
	}
}

customElements.define("site-header", HeaderComponent);
