/**
 * lazy-wc-markdown
 *
 * Wraps wc-markdown to prevent FOUC (flash of unrendered markdown).
 *
 * Usage — put raw markdown content inside the element:
 *   <lazy-wc-markdown>
 *   ## Hello World
 *   Some **markdown** content here.
 *   </lazy-wc-markdown>
 *
 * The component creates an internal <wc-markdown>, moves the slotted
 * content into it, polls until rendering is complete, then fades in.
 */
class LazyWcMarkdown extends HTMLElement {
  constructor() {
    super();
    this._revealed = false;
    this._pollInterval = null;

    // Create shadow DOM with a slot for light DOM content
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
        }
        :host([rendered]) {
          visibility: visible;
          opacity: 1;
          transition: opacity 0.25s ease;
        }
        :host(:not([rendered])) {
          visibility: hidden;
          opacity: 0;
        }
      </style>
      <wc-markdown></wc-markdown>
    `;
  }

  connectedCallback() {
    this._moveContentAndPoll();
  }

  disconnectedCallback() {
    this._stopPolling();
  }

  /**
   * Move slotted light-DOM content into the internal wc-markdown element,
   * then poll until wc-markdown has rendered it into its shadow DOM.
   */
  _moveContentAndPoll() {
    // Move all light-DOM children into the internal wc-markdown
    const wcMarkdown = this.shadowRoot.querySelector("wc-markdown");
    while (this.firstChild) {
      wcMarkdown.appendChild(this.firstChild);
    }

    this._startPolling(wcMarkdown);
  }

  _startPolling(wcMarkdown) {
    const MAX_TRIES = 200; // 200 * 50ms = 10s
    let tries = 0;

    this._pollInterval = setInterval(() => {
      tries++;

      if (wcMarkdown.shadowRoot && wcMarkdown.shadowRoot.innerHTML.trim().length > 0) {
        this._reveal();
        return;
      }

      if (tries >= MAX_TRIES) {
        console.warn("lazy-wc-markdown: wc-markdown did not render within 10s, revealing anyway");
        this._reveal();
      }
    }, 50);
  }

  _stopPolling() {
    if (this._pollInterval) {
      clearInterval(this._pollInterval);
      this._pollInterval = null;
    }
  }

  _reveal() {
    if (this._revealed) return;
    this._revealed = true;
    this._stopPolling();
    this.setAttribute("rendered", "");
  }
}

customElements.define("lazy-wc-markdown", LazyWcMarkdown);
