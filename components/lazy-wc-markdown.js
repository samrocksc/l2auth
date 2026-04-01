import { WCMarkdown } from "./wc-markdown.js";

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

        if (tries >= MAX_TRIES) {
          console.warn(
            "lazy-wc-markdown: rendering timed out, showing raw content"
          );
          this._reveal(this.textContent);
        }
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

    // Create shadow root and inject highlighted HTML there → immune to external mutation
    const shadow = this.attachShadow({ mode: "open" });

    // Inject a dark Prism theme <style> into the shadow root
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        background-color: #000000;
        color: #f8f8f2;
        font-family: var(--font-sans);
      }
      /* Token styles */
      .token.comment,
      .token.prolog,
      .token.doctype,
      .token.cdata {
        color: #6272a4;
      }
      .token.punctuation {
        color: #f8f8f2;
      }
      .token.property,
      .token.tag,
      .token.constant,
      .token.symbol,
      .token.deleted {
        color: #ff5555;
      }
      .token.boolean,
      .token.number {
        color: #ffb86c;
      }
      .token.selector,
      .token.attr-name,
      .token.string,
      .token.char,
      .token.builtin,
      .token.inserted {
        color: #50fa7b;
      }
      .token.operator,
      .token.entity,
      .token.url,
      .language-css .token.string,
      .style .token.token {
        color: #f1fa8c;
      }
      .token.atrule,
      .token.attr-value,
      .token.keyword {
        color: #bd93f9;
      }
      .token.function {
        color: #8be9fd;
      }
      .token.regex,
      .token.important,
      .token.variable {
        color: #ff79c6;
      }
      .token.important,
      .token.bold {
        font-weight: bold;
      }
      .token.italic {
        font-style: italic;
    `;
    shadow.appendChild(style);

    // Highlight the HTML string: create a temp container, set innerHTML, highlight, then capture result
    const temp = document.createElement("div");
    temp.innerHTML = html;
    WCMarkdown.highlight(temp); // Apply Prism syntax highlighting to code blocks inside temp
    const highlightedHtml = temp.innerHTML;

    shadow.innerHTML += highlightedHtml; // append after <style>

    this.setAttribute("rendered", "");
  }
}

customElements.define("lazy-wc-markdown", LazyWcMarkdown);