(() => {
  const script = document.currentScript;
  const host = script?.previousElementSibling;
  if (host?.tagName !== "SITE-HEADER") {
    return;
  }

  const config = window.SITE_CONFIG ?? { nav: [] };
  const root = document.documentElement.dataset.root || "./";
  const path = window.location.pathname;
  const inConcepts = path.includes("/concepts/");

  function isActive(item) {
    if (item.section === "concepts") {
      return inConcepts;
    }
    if (inConcepts) {
      return false;
    }
    if (item.href === "index.html") {
      return path.endsWith("/") || path.endsWith("/index.html");
    }
    return path.endsWith(`/${item.href}`);
  }

  const links = config.nav
    .map(
      (item) => `
        <a
          href="${root}${item.href}"
          class="tab-button${isActive(item) ? " active" : ""}"
          ${isActive(item) ? 'aria-current="page"' : ""}
        >${item.label}</a>
      `,
    )
    .join("");

  host.innerHTML = `
    <div class="header-fallback">
      <header>
        <div class="header-left">
          <img
            src="${root}assets/pizza-icon.svg"
            alt=""
            class="pizza-icon"
            width="40"
            height="40"
          />
          <div class="site-title">
            <a href="${root}index.html">Learn to Auth!</a>
          </div>
        </div>
        <div class="header-right">
          <button
            class="hamburger"
            type="button"
            aria-label="Toggle navigation menu"
            aria-controls="site-nav-fallback"
            aria-expanded="false"
          >
            ☰
          </button>
          <button
            class="theme-toggle"
            type="button"
            aria-label="Switch to dark theme"
            aria-pressed="false"
          >
            ◑
          </button>
        </div>
      </header>
      <nav id="site-nav-fallback" aria-label="Primary">
        <div class="tabs-container">${links}</div>
      </nav>
    </div>
  `;

  const toggle = host.querySelector(".hamburger");
  const nav = host.querySelector("nav");

  toggle.addEventListener("click", () => {
    const open = !nav.classList.contains("open");
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  const themeButton = host.querySelector(".theme-toggle");
  let theme = "light";

  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      theme = saved;
    }
  } catch {
    // Ignore unavailable storage.
  }

  function applyTheme(value) {
    document.documentElement.dataset.theme = value;
    const isDark = value === "dark";
    themeButton.textContent = isDark ? "◐" : "◑";
    themeButton.setAttribute("aria-pressed", String(isDark));
    themeButton.setAttribute(
      "aria-label",
      isDark ? "Switch to light theme" : "Switch to dark theme",
    );
  }

  applyTheme(theme);

  themeButton.addEventListener("click", () => {
    theme = theme === "light" ? "dark" : "light";
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Ignore unavailable storage.
    }
    applyTheme(theme);
  });
})();
