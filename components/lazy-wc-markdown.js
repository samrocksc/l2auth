/**
 * lazy-wc-markdown
 *
 * Prevents FOUC (flash of unrendered markdown) by keeping content hidden
 * until <wc-markdown> has finished parsing and rendering into its shadow DOM.
 *
 * Uses a polling approach since wc-markdown doesn't expose a ready event.
 * Polls the shadow DOM of the child wc-markdown element every 50ms for up to 10s.
 *
 * Usage:
 *   <lazy-wc-markdown>...markdown content...</lazy-wc-markdown>
 */
class LazyWcMarkdown extends HTMLElement {
  constructor() {
    super();
    this._revealed = false;
    this._pollInterval = null;
  }

  connectedCallback() {
    // Start hidden (CSS handles visibility)
    this._startPolling();
  }

  disconnectedCallback() {
    this._stopPolling();
  }

  _startPolling() {
    const MAX_TRIES = 200; // 200 * 50ms = 10 seconds max wait
    let tries = 0;

    this._pollInterval = setInterval(() => {
      tries++;

      // Check if wc-markdown has rendered into its shadow DOM
      const wcMarkdown = this.querySelector("wc-markdown");

      if (wcMarkdown && wcMarkdown.shadowRoot && wcMarkdown.shadowRoot.innerHTML.trim().length > 0) {
        this._reveal();
        return;
      }

      // Fallback: also consider it ready if wc-markdown itself is gone (replaced by rendered content)
      if (!wcMarkdown && this.innerHTML.trim().length > 0) {
        this._reveal();
        return;
      }

      // Give up after 10s
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

    // Add attribute for CSS targeting
    this.setAttribute("rendered", "");

    // Fade in on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.style.opacity = "1";
        this.style.transition = "opacity 0.25s ease";
      });
    });
  }
}

customElements.define("lazy-wc-markdown", LazyWcMarkdown);
