import { LitElement, html, css } from 'https://unpkg.com/lit@2.0.0-rc.4/index.js?module';
import { ref, createRef } from 'https://unpkg.com/lit@2.0.0-rc.4/directives/ref.js?module';

class ThemeToggle extends LitElement {
  static get styles() {
    return css`
      .theme-toggle {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--accent-color, #ff00ff);
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .theme-toggle:hover {
        background-color: rgba(255, 0, 255, 0.1);
        transform: rotate(15deg);
      }
    `;
  }
  static get properties() {
    return {
      theme: { type: String }
    };
  }

  constructor() {
    super();
    this.theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  firstUpdated() {
    // Update the document theme attribute when component is first rendered
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
    this.requestUpdate(); // Trigger re-render
  }

  render() {
    return html`
      <button class="theme-toggle" aria-label="Toggle theme" @click="${this.toggleTheme}">
        ${this.theme === 'light' ? '◑' : '◐'}
      </button>
    `;
  }
}

customElements.define('theme-toggle', ThemeToggle);
