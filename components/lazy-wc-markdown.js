import "./wc-markdown.js";

/**
 * lazy-wc-markdown
 *
 * Prevents FOUC when loading <wc-markdown> content.
 *
 * Usage — put raw markdown inside:
 *   <lazy-wc-markdown>
 *   ## Hello World
 *   Some **markdown** here.
 *   </lazy-wc-markdown>
 *
 * How it works:
 *   1. On connect, moves all light-DOM children into the inner <wc-markdown>
 *   2. <wc-markdown> parses and renders the markdown into its own innerHTML
 *   3. Polls until <wc-markdown> has rendered content
 *   4. Sets [rendered] attribute → CSS reveals the content
 *
 * CSS in main.css handles visibility:
 *   lazy-wc-markdown:not([rendered])  { visibility: hidden; }
 *   lazy-wc-markdown[rendered]        { visibility: visible; transition: opacity 0.25s; }
 */
class LazyWcMarkdown extends HTMLElement {
  constructor() {
    super();
    this._revealed = false;
    this._pollInterval = null;

    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `<wc-markdown></wc-markdown>`;
  }

  connectedCallback() {
    const wc = this.shadowRoot.querySelector("wc-markdown");

    // Move all light-DOM markdown content into wc-markdown
    while (this.firstChild) {
      wc.appendChild(this.firstChild);
    }

    this._startPolling(wc);
  }

  disconnectedCallback() {
    this._stopPolling();
  }

  _startPolling(wc) {
    const MAX_TRIES = 200; // 200 * 50ms = 10s
    let tries = 0;

    this._pollInterval = setInterval(() => {
      tries++;

      // wc-markdown renders into its own innerHTML
      if (wc.innerHTML.trim().length > 0) {
        this._reveal();
        return;
      }

      if (tries >= MAX_TRIES) {
        console.warn(
          "lazy-wc-markdown: wc-markdown did not render within 10s, revealing anyway"
        );
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
