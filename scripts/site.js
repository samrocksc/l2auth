import "../components/lazy-wc-markdown.js";

const SITE = window.SITE_CONFIG ?? { ga4Id: "" };

function loadAnalytics() {
  if (!SITE.ga4Id || window.dataLayer) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args) => {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", SITE.ga4Id);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${SITE.ga4Id}`;
  document.head.appendChild(script);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    const swUrl = new URL("../sw.js", import.meta.url);
    navigator.serviceWorker.register(swUrl).catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  });
}

loadAnalytics();
registerServiceWorker();
