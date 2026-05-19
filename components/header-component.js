import {
	css,
	html,
	LitElement,
} from "https://unpkg.com/lit@2.0.0-rc.4/index.js?module";

class HeaderComponent extends LitElement {
	static get properties() {
		return {
			_navOpen: { type: Boolean, state: true },
		};
	}

	static get styles() {
		return css`
      :host {
        display: block;
        contain: layout style paint;
      }

      .site-header-container {
        contain: layout style paint;
        width: 100%;
        transform: translateZ(0);
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
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        will-change: transform;
        position: relative;
        width: 100%;
        box-sizing: border-box;
        transform: translateZ(0);
        backface-visibility: hidden;
        transition: none;
        min-height: 60px;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .pizza-icon {
        width: 40px;
        height: 40px;
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
        transition: none;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .hamburger {
        display: none;
        background: none;
        border: 2px solid var(--accent-color);
        color: var(--accent-color);
        font-size: 1.3rem;
        cursor: pointer;
        padding: 0.4rem 0.6rem;
        font-family: var(--font-primary);
        box-shadow: 3px 3px 0 var(--shadow-color);
        transition: all 0.15s;
        line-height: 1;
      }

      .hamburger:hover {
        background-color: var(--accent-color);
        color: var(--bg-primary);
        transform: translate(1px, 1px);
        box-shadow: 2px 2px 0 var(--shadow-color);
      }

      nav {
        background-color: var(--bg-secondary);
        padding: 0.5rem;
        border-bottom: 1px solid var(--border-color);
        box-shadow: 0 2px 4px var(--shadow-color);
      }

      @media (max-width: 768px) {
        .hamburger {
          display: inline-block;
        }

        nav {
          display: none;
        }

        nav.open {
          display: block;
        }

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

	constructor() {
		super();
		this._navOpen = false;
	}

	_toggleNav() {
		this._navOpen = !this._navOpen;
	}

	render() {
		return html`
      <div class="site-header-container">
        <header>
          <div class="header-left">
            <img
              src="/assets/pizza-icon.svg"
              alt="Pizza Icon"
              class="pizza-icon"
              loading="eager"
            />
            <h1><a href="/">Learn to Auth!</a></h1>
          </div>
          <div class="header-right">
            <button
              class="hamburger"
              @click="${this._toggleNav}"
              aria-label="Toggle navigation menu"
            >
              ☰
            </button>
            <theme-toggle></theme-toggle>
          </div>
        </header>

        <nav class="${this._navOpen ? 'open' : ''}">
          <tabs-component></tabs-component>
        </nav>
      </div>
    `;
	}
}

customElements.define("site-header", HeaderComponent);
