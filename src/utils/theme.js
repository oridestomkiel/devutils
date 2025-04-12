(() => {
  const sunSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 18a6 6 0 100-12 6 6 0 000 12zm0 4a1 1 0 011-1h.01a1 1 0 010 2H13a1 1 0 01-1-1zm0-18a1 1 0 011-1h.01a1 1 0 010 2H13a1 1 0 01-1-1zm10 9a1 1 0 01-1-1v-.01a1 1 0 012 0V11a1 1 0 01-1 1zM2 12a1 1 0 01-1-1v-.01a1 1 0 012 0V11a1 1 0 01-1 1zm16.24 5.66a1 1 0 01-1.41-1.41l.01-.01a1 1 0 011.42 1.41zM5.17 6.34a1 1 0 01-1.41-1.41l.01-.01a1 1 0 011.41 1.42zm0 11.32a1 1 0 01-1.41 1.41l-.01-.01a1 1 0 011.42-1.41zM18.83 6.34a1 1 0 01-1.41-1.41l.01-.01a1 1 0 011.41 1.42z"/>
    </svg>`;

  const moonSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/>
    </svg>`;

  const updateIcon = (isDark) => {
    const btn = document.getElementById("themeToggleBtn");
    if (btn) btn.innerHTML = isDark ? sunSVG : moonSVG;
  };

  const userTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const initialDark = userTheme === "dark" || (!userTheme && systemPrefersDark);

  document.documentElement.classList.toggle("dark", initialDark);

  const waitForButton = setInterval(() => {
    const btn = document.getElementById("themeToggleBtn");
    if (btn) {
      updateIcon(initialDark);
      clearInterval(waitForButton);
    }
  }, 50);

  window.toggleTheme = function () {
    const html = document.documentElement;
    const isDark = html.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateIcon(isDark);
  };
})();
