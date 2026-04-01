/**
 * lazy-wc-markdown
 *
 * Prevents FOUC when loading <wc-markdown> content.
 * Wraps wc-markdown in the light DOM; polls until wc-markdown has rendered,
 * then sets [rendered] attribute → CSS reveals with animation.
 *
 * Usage — put raw markdown inside the element:
 *   <lazy-wc-markdown>
 *   ## Hello World
 *   Some **markdown** here.
 *   </lazy-wc-markdown>
 */
class LazyWcMarkdown extends HTMLElement {
  constructor() {
    super();
    this._revealed = false;
    this._pollInterval = null;

    // Create wc-markdown as a light-DOM child (no shadow DOM)
    // We use a div as the lazy-wrapper container
    this._wrapper = document.createElement("div");
    this._wrapper.style.display = "contents";

    const wc = document.createElement("wc-markdown");
    this._wrapper.appendChild(wc);
  }

  connectedCallback() {
    // Move all slotted light-DOM markdown content into the inner wc-markdown
    const wc = this._wrapper.querySelector("wc-markdown");
    while (this.firstChild) {
      wc.appendChild(this.firstChild);
    }

    // Insert our wrapper + wc-markdown into the actual DOM
    this.appendChild(this._wrapper);

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

    // Remove the display:contents so the wrapper participates in layout
    this._wrapper.style.display = "";

    // Transfer wc-markdown's rendered content up into the lazy-wc-markdown element
    // so it sits exactly where the element is in the document
    const wc = this._wrapper.querySelector("wc-markdown");
    const rendered = wc.innerHTML;

    // Move rendered content to the host element
    this.innerHTML = rendered;

    // Remove the now-redundant wrapper
    this._wrapper.remove();

    this.setAttribute("rendered", "");
  }
}

customElements.define("lazy-wc-markdown", LazyWcMarkdown);
