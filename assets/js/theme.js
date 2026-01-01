// Theme toggle (light/dark) with persistence.
// - Default: system preference (CSS `prefers-color-scheme`)
// - Override: `data-theme="light|dark"` on <html>
// - Persisted in localStorage as key `theme`

(function () {
  var STORAGE_KEY = "theme";
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var metaThemeColor = document.querySelector('meta[name="theme-color"]');

  if (!toggle) return;

  function systemTheme() {
    try {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch (_e) {
      return "light";
    }
  }

  function currentTheme() {
    return root.getAttribute("data-theme") || systemTheme();
  }

  function setMetaThemeColor(theme) {
    if (!metaThemeColor) return;
    metaThemeColor.setAttribute("content", theme === "dark" ? "#1a1816" : "#f7f3ec");
  }

  function apply(theme, persist) {
    if (theme !== "light" && theme !== "dark") return;
    root.setAttribute("data-theme", theme);
    toggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
    setMetaThemeColor(theme);
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (_e) {
        // localStorage may be unavailable (private browsing)
      }
    }
  }

  // Initialize from storage if available
  var stored;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch (_e) {
    stored = null;
  }

  if (stored === "light" || stored === "dark") {
    apply(stored, false);
  } else {
    // Just set meta color to match system
    setMetaThemeColor(systemTheme());
  }

  toggle.addEventListener("click", function () {
    apply(currentTheme() === "dark" ? "light" : "dark", true);
  });
})();
