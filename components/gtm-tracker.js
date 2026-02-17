import { LitElement, html, css } from 'https://unpkg.com/lit@2.0.0-rc.4/index.js';

/**
 * Google Tag Manager tracker component
 * Usage: <gtm-tracker id="GTM-MDJ26VZ"></gtm-tracker>
 */
class GtmTracker extends LitElement {
  static properties = {
    id: { type: String, attribute: true },
  };

  static styles = css`
    /* Hidden component - no visible styles */
  `;

  firstUpdated() {
    const gtmId = this.id || this.getAttribute('id');
    if (!gtmId) {
      console.warn('GTM Tracker: No ID provided');
      return;
    }

    // Inject GTM noscript tag
    const gtmNoscript = document.createElement('noscript');
    gtmNoscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    this.shadowRoot.appendChild(gtmNoscript);

    // Inject GTM script tag in head
    const gtmScript = document.createElement('script');
    gtmScript.textContent = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`;
    document.head.appendChild(gtmScript);

    // Cleanup shadow DOM since we've injected into document
    this.shadowRoot.innerHTML = '';
  }

  render() {
    return html``;
  }
}

customElements.define('gtm-tracker', GtmTracker);
