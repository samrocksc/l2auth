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

    console.log("[lazy-wc-markdown] _reveal called");
    console.log("[lazy-wc-markdown] WCMarkdown exists?", typeof WCMarkdown !== 'undefined');
    console.log("[lazy-wc-markdown] WCMarkdown.highlight exists?", typeof WCMarkdown.highlight === 'function');

    // Create a container div to hold the highlighted content
    const container = document.createElement("div");
    container.className = "lazy-wc-markdown-content";

    // Highlight the HTML string
    const temp = document.createElement("div");
    temp.innerHTML = html;
    console.log("[lazy-wc-markdown] temp.innerHTML before highlight:", temp.innerHTML.substring(0, 200) + (temp.innerHTML.length > 200 ? "..." : ""));

    try {
      WCMarkdown.highlight(temp); // Apply Prism syntax highlighting
      console.log("[lazy-wc-markdown] WCMarkdown.highlight(temp) executed");
    } catch (e) {
      console.error("[lazy-wc-markdown] ERROR during WCMarkdown.highlight:", e);
      // Fallback: just use raw html
      temp.innerHTML = html;
    }

    const highlightedHtml = temp.innerHTML;
    console.log("[lazy-wc-markdown] temp.innerHTML after highlight:", highlightedHtml.substring(0, 200) + (highlightedHtml.length > 200 ? "..." : ""));
    console.log("[lazy-wc-markdown] highlightedHtml contains '<span class=' ?", highlightedHtml.includes('<span class='));
    console.log("[lazy-wc-markdown] highlightedHtml.contains('class=\"token\"') ?", highlightedHtml.includes('class="token"'));

    // Set the container's innerHTML
    container.innerHTML = highlightedHtml;

    // Clear this element and append the container
    this.innerHTML = ""; // clear any existing content
    this.appendChild(container);

    // Inject a <style> tag into the document head (light DOM) to style our content
    // We use !important to override the leaking :root * { ... } rule
    const styleId = "lazy-wc-markdown-prism-style";
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        /* Target only our markdown content's descendants */
        .lazy-wc-markdown-content {
          display: block;
          background-color: #000000 !important;
          color: #f8f8f2 !important;
          font-family: var(--font-sans) !important;
          line-height: 1.5;
          padding: 16px;
          border-radius: 8px;
          overflow: auto;
          margin: 0.5em 0;
        }
        /* Prism token styles - !important to override :root * */
        .lazy-wc-markdown-content .token.comment,
        .lazy-wc-markdown-content .token.prolog,
        .lazy-wc-markdown-content .token.doctype,
        .lazy-wc-markdown-content .token.cdata {
          color: #6272a4 !important;
        }
        .lazy-wc-markdown-content .token.punctuation {
          color: #f8f8f2 !important;
        }
        .lazy-wc-markdown-content .token.property,
        .lazy-wc-markdown-content .token.tag,
        .lazy-wc-markdown-content .token.constant,
        .lazy-wc-markdown-content .token.symbol,
        .lazy-wc-markdown-content .token.deleted {
          color: #ff5555 !important;
        }
        .lazy-wc-markdown-content .token.boolean,
        .lazy-wc-markdown-content .token.number {
          color: #ffb86c !important;
        }
        .lazy-wc-markdown-content .token.selector,
        .lazy-wc-markdown-content .token.attr-name,
        .lazy-wc-markdown-content .token.string,
        .lazy-wc-markdown-content .token.char,
        .lazy-wc-markdown-content .token.builtin,
        .lazy-wc-markdown-content .token.inserted {
          color: #50fa7b !important;
        }
        .lazy-wc-markdown-content .token.operator,
        .lazy-wc-markdown-content .token.entity,
        .lazy-wc-markdown-content .token.url,
        .lazy-wc-markdown-content .language-css .token.string,
        .lazy-wc-markdown-content .style .token.token {
          color: #f1fa8c !important;
        }
        .lazy-wc-markdown-content .token.atrule,
        .lazy-wc-markdown-content .token.attr-value,
        .lazy-wc-markdown-content .token.keyword {
          color: #bd93f9 !important;
        }
        .lazy-wc-markdown-content .token.function {
          color: #8be9fd !important;
        }
        .lazy-wc-markdown-content .token.regex,
        .lazy-wc-markdown-content .token.important,
        .lazy-wc-markdown-content .token.variable {
          color: #ff79c6 !important;
        }
        .lazy-wc-markdown-content .token.important,
        .lazy-wc-markdown-content .token.bold {
          font-weight: bold !important;
        }
        .lazy-wc-markdown-content .token.italic {
          font-style: italic !important;
        }
        /* Ensure pre/code blocks are styled correctly */
        .lazy-wc-markdown-content pre[class*="language-"] {
          background-color: #000000 !important;
          color: #f8f8f2 !important;
          overflow: auto;
          padding: 1em;
          margin: 0.5em 0;
          border-radius: 6px;
        }
        .lazy-wc-markdown-content code[class*="language-"] {
          background: none !important;
          padding: 0 !important;
          margin: 0 !important;
          color: inherit !important;
        }
      `;
      document.head.appendChild(style);
      console.log("[lazy-wc-markdown] prism style injected into document.head");
    }

    this.setAttribute("rendered", "");
  }
}

customElements.define("lazy-wc-markdown", LazyWcMarkdown);