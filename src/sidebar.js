import { tools } from "./tools/index.js";
import { tTool } from "./utils/i18n-global.js";

export function setupSidebarEvents(prefs, savePrefs) {
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const list = document.getElementById("sortable");

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
      updateSidebarCount(prefs);
    }
  };

  let toggleState = Object.values(prefs.enabled).some((v) => !v);

  document.getElementById("toggleAllBtn")?.addEventListener("click", () => {
    const newEnabled = toggleState;
    prefs.order.forEach((tool) => {
      prefs.enabled[tool] = newEnabled;
    });

    toggleState = !toggleState;
    document.getElementById("toggleAllBtn").textContent = newEnabled
      ? "Desmarcar todos"
      : "Selecionar todos";

    savePrefs();
    renderSidebarList(prefs, savePrefs, list, searchInput.value);
  });

  searchInput?.addEventListener("input", (e) => {
    const value = e.target.value;
    renderSidebarList(prefs, savePrefs, list, value);
    clearSearchBtn.style.display = value ? "block" : "none";
  });

  clearSearchBtn?.addEventListener("click", () => {
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    renderSidebarList(prefs, savePrefs, list);
  });

  document.getElementById("backupBtn")?.addEventListener("click", () => {
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
    ?.addEventListener("change", (e) => {
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
          Object.assign(prefs, imported);
          savePrefs();
          renderSidebarList(prefs, savePrefs, list);
        } catch (err) {
          alert("Erro ao importar configurações.");
        }
      };
      reader.readAsText(file);
    });

  document.getElementById("resetPrefsBtn")?.addEventListener("click", () => {
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

function updateSidebarCount(prefs) {
  const countTotalEl = document.getElementById("countTotal");
  const countOnEl = document.getElementById("countOn");
  if (!countTotalEl || !countOnEl) return;

  countTotalEl.textContent = prefs.order.length;
  countOnEl.textContent = Object.values(prefs.enabled).filter(Boolean).length;
}

export async function renderSidebarList(prefs, savePrefs, list, filter = "") {
  list.innerHTML = "";
  const ordered = [...prefs.order].sort((a, b) => {
    const aChecked = prefs.enabled[a] ? 0 : 1;
    const bChecked = prefs.enabled[b] ? 0 : 1;
    return aChecked - bChecked;
  });

  ordered.forEach((tool) => {
    const mod = tools[tool];
    if (!mod) return;
    const title = tTool(tool, "title") || mod.title;

    if (filter && !title.toLowerCase().includes(filter.toLowerCase())) return;

    const li = document.createElement("li");
    li.className =
      "bg-gray-100 dark:bg-gray-700 p-2 rounded cursor-move border border-gray-300 dark:border-gray-600";
    li.setAttribute("data-id", tool);

    li.innerHTML = `
      <div class="flex items-center gap-3 w-full justify-between">
        <span class="text-gray-500 dark:text-gray-400 cursor-grab select-none">☰</span>
        <label class="flex items-center gap-2 flex-1 justify-between cursor-pointer">
          <span class="flex-1 text-gray-900 dark:text-white">${title}</span>
          <input type="checkbox" class="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400" ${
            prefs.enabled[tool] ? "checked" : ""
          } />
        </label>
      </div>
    `;

    const checkbox = li.querySelector("input");
    checkbox.addEventListener("click", (e) => e.stopPropagation());
    checkbox.addEventListener("change", (e) => {
      prefs.enabled[tool] = e.target.checked;
      updateSidebarCount(prefs);
      savePrefs();
      renderSidebarList(prefs, savePrefs, list, filter);
    });

    list.appendChild(li);
  });

  if (!window.sortableLoaded) {
    await import(
      "https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"
    );
    window.sortableLoaded = true;
  }

  new Sortable(list, {
    animation: 150,
    handle: ".cursor-grab",
    onEnd: () => {
      const newOrder = Array.from(
        document.querySelectorAll("#sortable li")
      ).map((li) => li.getAttribute("data-id"));
      prefs.order = newOrder;
      savePrefs();
    },
  });
}
