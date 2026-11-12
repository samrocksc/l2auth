import { WCMarkdown } from "./vendor/wc-markdown.js";

/**
 * Renders markdown either from an inline body or from a `src` attribute.
 *
 * Inline:
 *   <lazy-wc-markdown>
 *   ## Hello
 *   </lazy-wc-markdown>
 *
 * External:
 *   <lazy-wc-markdown src="../content/example.md"></lazy-wc-markdown>
 *
 * The rendered HTML is placed in light DOM so the site theme applies to it.
 */
class LazyWcMarkdown extends HTMLElement {
  static get observedAttributes() {
    return ["src"];
  }

  constructor() {
    super();
    this._rendered = false;
  }

  connectedCallback() {
    if (this._rendered) {
      return;
    }
    this._render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (
      name === "src" &&
      oldValue !== newValue &&
      this.isConnected &&
      oldValue
    ) {
      this._rendered = false;
      this._render();
    }
  }

  async _render() {
    this.setAttribute("aria-busy", "true");

    const src = this.getAttribute("src");
    let markdown = this.textContent;

    if (src) {
      try {
        const response = await fetch(new URL(src, document.baseURI));
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        markdown = await response.text();
      } catch (error) {
        console.error(`lazy-wc-markdown: failed to load ${src}`, error);
        const root = document.documentElement.dataset.root || "./";
        this.innerHTML =
          "<p>Sorry, this page could not be loaded. Try refreshing or " +
          `<a href="${root}index.html">returning home</a>.</p>`;
        this.removeAttribute("aria-busy");
        this.setAttribute("rendered", "");
        return;
      }
    }

    const dedented = WCMarkdown.dedentText(markdown);
    const prepared = WCMarkdown.prepare(dedented);
    this.innerHTML = WCMarkdown.toHtml(prepared);
    WCMarkdown.highlight(this);
    this.removeAttribute("aria-busy");
    this.setAttribute("rendered", "");
    this._rendered = true;
  }
}

customElements.define("lazy-wc-markdown", LazyWcMarkdown);
