export function setupSidebarEvents(prefs, savePrefs, renderSidebarList) {
  document.getElementById("menuBtn")?.addEventListener("click", () => {
    const mobileMenu = document.getElementById("mobileMenu");
    mobileMenu.classList.toggle("hidden");
  });

  window.toggleSidebar = function () {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("translate-x-full");
    if (!sidebar.classList.contains("translate-x-full")) {
      setTimeout(() => {
        document.getElementById("searchInput")?.focus();
      }, 300);
    }
  };

  const sel = document.getElementById("langSelector");
  if (sel) sel.value = getDevutilsLang();

  renderSidebarList();

  let toggleState = true;

  document.getElementById("toggleAllBtn").addEventListener("click", () => {
    const newEnabled = toggleState;
    prefs.order.forEach((tool) => {
      prefs.enabled[tool] = newEnabled;
    });

    toggleState = !toggleState;
    document.getElementById("toggleAllBtn").textContent = newEnabled
      ? "Desmarcar todos"
      : "Selecionar todos";

    savePrefs();
    renderSidebarList(document.getElementById("searchInput").value);
  });

  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");

  searchInput.addEventListener("input", (e) => {
    const value = e.target.value;
    renderSidebarList(value);
    clearSearchBtn.style.display = value ? "block" : "none";
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    renderSidebarList();
  });

  document.getElementById("backupBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(prefs, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "devutils-prefs.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  document
    .getElementById("importPrefsInput")
    .addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const imported = JSON.parse(reader.result);
          if (!imported.order || !imported.enabled) {
            alert("Arquivo inválido");
            return;
          }
          prefs = imported;
          savePrefs();
          renderSidebarList();
        } catch (err) {
          alert("Erro ao importar configurações.");
        }
      };
      reader.readAsText(file);
    });

  document.getElementById("resetPrefsBtn").addEventListener("click", () => {
    const confirmReset = confirm(
      "Tem certeza que deseja resetar todas as configurações?"
    );
    if (confirmReset) {
      localStorage.removeItem("devutils_prefs");
      localStorage.removeItem("devutils_expanded");
      location.reload();
    }
  });
}
