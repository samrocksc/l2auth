import { WCMarkdown } from "./wc-markdown.js";

/**
 * lazy-wc-markdown
 *
 * DISABLED: This component has been disabled to prevent interference with the page theme.
 * It does nothing and renders nothing.
 *
 * To re-enable: restore the _reveal() method to process and highlight markdown content.
 */
class LazyWcMarkdown extends HTMLElement {
  constructor() {
    super();
    // Do nothing. Do not create shadow root. Do not inject styles. Do not touch the DOM.
  }

  connectedCallback() {
    // Intentionally left blank — do not start polling, do not reveal anything
  }

  disconnectedCallback() {
    // Intentionally left blank
  }
}

customElements.define("lazy-wc-markdown", LazyWcMarkdown);