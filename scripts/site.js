import "../components/lazy-wc-markdown.js";

const SITE = window.SITE_CONFIG ?? { gtmId: "" };

function loadGoogleTagManager() {
  if (!SITE.gtmId || window.dataLayer) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${SITE.gtmId}`;
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

loadGoogleTagManager();
registerServiceWorker();
