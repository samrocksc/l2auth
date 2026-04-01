import { WCMarkdown } from "./wc-markdown.js";

console.debug("lazy-wc-markdown: module loaded");

/**
 * lazy-wc-markdown
 *
 * Prevents FOUC when loading markdown content.
 *
 * Usage — put raw markdown inside the element:
 *   <lazy-wc-markdown>
 *   ## Hello World
 *   Some **markdown** here.
 *   </lazy-wc-markdown>
 *
 * Renders markdown → HTML using the same marked library as wc-markdown,
 * polls until content is rendered, then sets [rendered] attribute →
 * CSS reveals with animation.
 */
class LazyWcMarkdown extends HTMLElement {
  constructor() {
    super();
    this._revealed = false;
    this._pollInterval = null;
    console.debug("lazy-wc-markdown: instance created");
  }

  connectedCallback() {
    this._startPolling();
  }

  disconnectedCallback() {
    this._stopPolling();
  }

  _startPolling() {
    const MAX_TRIES = 200; // 200 * 50ms = 10s
    let tries = 0;

    // Initial debug: what does the element actually contain?
    console.debug("lazy-wc-markdown: connectedCallback", {
      textContentLength: this.textContent.length,
      textContentPreview: JSON.stringify(this.textContent.slice(0, 200)),
      innerHTMLLength: this.innerHTML.length,
      innerHTMLPreview: JSON.stringify(this.innerHTML.slice(0, 200)),
      childElementCount: this.children.length,
    });

    this._pollInterval = setInterval(() => {
      tries++;

      const raw = this.textContent;
      if (raw.trim().length > 0) {
        const dedented = WCMarkdown.dedentText(raw);
        const prepared = WCMarkdown.prepare(dedented);
        const html = WCMarkdown.toHtml(prepared);
        if (html.trim().length > 0) {
          this._reveal(html);
          return;
        }
        // Debug: show why we think it’s empty
        console.debug("lazy-wc-markdown debug", {
          rawLength: raw.length,
          dedentedLength: dedented.length,
          preparedLength: prepared.length,
          htmlLength: html.length,
          rawPreview: JSON.stringify(raw.slice(0, 100)),
          dedentedPreview: JSON.stringify(dedented.slice(0, 100)),
          preparedPreview: JSON.stringify(prepared.slice(0, 100)),
          htmlPreview: JSON.stringify(html.slice(0, 100)),
        });
      }

      if (tries >= MAX_TRIES) {
        console.warn(
          "lazy-wc-markdown: rendering timed out, showing raw content"
        );
        this._reveal(this.textContent);
      }
    }, 50);
  }

  _stopPolling() {
    if (this._pollInterval) {
      clearInterval(this._pollInterval);
      this._pollInterval = null;
    }
  }

  _reveal(html) {
    if (this._revealed) return;
    this._revealed = true;
    this._stopPolling();

    this.innerHTML = html;
    // Debug: verify we actually have highlighted code blocks
    const codeBlocks = this.querySelectorAll('code[class*="language-"]');
    if (codeBlocks.length) {
      console.debug("lazy-wc-markdown: found", codeBlocks.length, "code blocks to highlight");
    } else {
      console.debug("lazy-wc-markdown: no code blocks found in rendered HTML", {
        htmlLength: html.length,
        htmlPreview: html.slice(0, 200)
      });
    }
    WCMarkdown.highlight(this); // Apply Prism syntax highlighting to code blocks
    this.setAttribute("rendered", "");
  }
}

customElements.define("lazy-wc-markdown", LazyWcMarkdown);