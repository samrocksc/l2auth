import {
  css,
  html,
  LitElement,
} from "https://unpkg.com/lit@2.0.0-rc.4/index.js?module";

class TryMeModal extends LitElement {
  static get properties() {
    return {
      _open: { type: Boolean, state: true },
      _endpoint: { type: String, state: true },
      _title: { type: String, state: true },
      _content: { type: String, state: true },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        padding: 1rem;
      }

      .modal-overlay.open {
        display: flex;
      }

      .modal-content {
        background-color: var(--bg-secondary, #f0f0f0);
        border: 2px solid var(--accent-color, #ff00ff);
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        font-family: var(--font-sans);
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
        background-color: var(--bg-secondary);
        position: sticky;
        top: 0;
        z-index: 1;
      }

      .modal-header h2 {
        margin: 0;
        font-family: var(--font-primary);
        font-size: 1rem;
        color: var(--accent-color);
      }

      .close-button {
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: var(--accent-color);
        padding: 0;
        margin: 0;
        font-family: var(--font-sans);
        line-height: 1;
      }

      .close-button:hover {
        color: var(--highlight);
      }

      .modal-body {
        padding: 1rem;
      }
    `;
  }

  constructor() {
    super();
    this._open = false;
    this._endpoint = "";
    this._title = "";
    this._content = "";
  }

  render() {
    return html`
      <div
        class="modal-overlay ${this._open ? "open" : ""}"
        @click="${this._onOverlayClick}"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h2>${this._title}</h2>
            <button class="close-button" @click="${this._close}" aria-label="Close">
              &times;
            </button>
          </div>
          <div class="modal-body">
            <lazy-wc-markdown>${this._content}</lazy-wc-markdown>
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this._onKeyDown = (e) => {
      if (e.key === "Escape" && this._open) this._close();
    };
    document.addEventListener("keydown", this._onKeyDown);
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this._onKeyDown);
    super.disconnectedCallback();
  }

  open(endpoint, title) {
    this._endpoint = endpoint;
    this._title = title;
    this._content = "*_Loading..._*";
    this._open = true;
    this._loadContent();
    document.body.style.overflow = "hidden";
  }

  _close() {
    this._open = false;
    this._content = "";
    document.body.style.overflow = "";
  }

  _onOverlayClick(e) {
    if (e.target === e.currentTarget) {
      this._close();
    }
  }

  async _loadContent() {
    try {
      const res = await fetch(`/assets/markdown/${this._endpoint}.md`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this._content = await res.text();
    } catch (err) {
      console.error("Failed to load markdown:", err);
      this._content = "# Error\n\nFailed to load endpoint information.";
    }
  }
}

customElements.define("try-me-modal", TryMeModal);
