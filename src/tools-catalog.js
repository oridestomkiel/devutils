import "./style.css";
import "./utils/lang.js";
import "./utils/theme.js";
import {
  includeAndTranslate,
  applyI18nToElement,
} from "./utils/include-partial.js";
import { loadGlobalI18n, tGlobal as t } from "./utils/i18n-global.js";

const toolsList = document.getElementById("toolsList");
const searchInput = document.getElementById("search");
const toolsCountEl = document.getElementById("toolsCount");

const lang = window.getDevutilsLang?.() || "en";

let allTools = {};

async function loadToolsCatalog() {
  try {
    const res = await fetch(`/i18n/${lang}.json`);
    allTools = await res.json();
    renderCatalog();
  } catch (e) {
    console.error(t("tools.errorLoading"), e);
    toolsList.innerHTML = `<p class="text-red-500">${t(
      "tools.errorLoading"
    )}</p>`;
  }
}

function renderCatalog(filter = "") {
  toolsList.innerHTML = "";

  const entries = Object.entries(allTools)
    .map(([key, data]) => ({ key, ...data }))
    .filter((t) => t.title.toLowerCase().includes(filter.toLowerCase()));

  toolsCountEl.textContent = t("tools.count").replace(
    "{count}",
    entries.length
  );

  const grouped = {};
  entries.forEach((tool) => {
    const cat = tool.category || t("tools.otherCategory");
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(tool);
  });

  const sortedCategories = Object.keys(grouped).sort();

  sortedCategories.forEach((category) => {
    const section = document.createElement("section");
    const toolsHtml = grouped[category]
      .sort((a, b) => a.title.localeCompare(b.title))
      .map(
        (t) => `
        <li>
          <a
            href="/tool.html?slug=${t.key}"
            class="block bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            ${t.title}
          </a>
        </li>
      `
      )
      .join("");

    section.innerHTML = `
    <h2 class="text-xl font-bold mb-4 mt-4 text-gray-900 dark:text-white">${category}</h2>
    <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      ${toolsHtml}
    </ul>
  `;

    toolsList.appendChild(section);
  });
}

searchInput.addEventListener("input", (e) => {
  renderCatalog(e.target.value);
});

window.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadGlobalI18n(lang);

    await includeAndTranslate("header-placeholder", "/partials/header.html");
    await includeAndTranslate("footer-placeholder", "/partials/footer.html");
    await includeAndTranslate("mobileMenu", "/partials/mobile-menu.html");

    // 🔥 Aplica a tradução para todo o documento após os partials
    applyI18nToElement(document);

    loadToolsCatalog();
  } catch (err) {
    console.error("Erro ao carregar partials:", err);
  }
});
