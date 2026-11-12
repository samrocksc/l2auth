(() => {
  let theme = "light";
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      theme = saved;
    }
  } catch {
    // localStorage can be unavailable in private or restricted contexts.
  }
  document.documentElement.dataset.theme = theme;
})();
