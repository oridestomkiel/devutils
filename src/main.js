import "./style.css";
import { tools } from "./tools/index.js";
import "./utils/lang.js";
import "./utils/theme.js";
import { loadGlobalI18n, tTool } from "./utils/i18n-global.js";
import { renderSidebarList, setupSidebarEvents } from "./sidebar.js";
import { includeAndTranslate } from "./utils/include-partial.js";

(async () => {
  const lang = window.getDevutilsLang?.() || "en";
  await loadGlobalI18n(lang);

  const t = window.tGlobal;
  const container = document.getElementById("cardContainer");
  const expandedPrefs = JSON.parse(
    localStorage.getItem("devutils_expanded") || "{}"
  );

  const defaultEnabled =
    lang === "pt"
      ? [
          "gerador_de_cnpj",
          "gerador_de_cpf",
          "advanced_jwt_viewer",
          "json_formatter",
          "random_password_generator",
        ]
      : [
          "advanced_jwt_viewer",
          "json_formatter",
          "random_password_generator",
          "image_to_base64_converter",
          "uuid_generator",
        ];

  const allTools = Object.keys(tools);
  const localPrefs = localStorage.getItem("devutils_prefs");
  let prefs;

  if (!localPrefs) {
    const remainingTools = allTools.filter((k) => !defaultEnabled.includes(k));
    const initialOrder = [...defaultEnabled, ...remainingTools];
    prefs = {
      order: initialOrder,
      enabled: Object.fromEntries(
        allTools.map((k) => [k, defaultEnabled.includes(k)])
      ),
    };
    localStorage.setItem("devutils_prefs", JSON.stringify(prefs));
  } else {
    prefs = JSON.parse(localPrefs);
    allTools.forEach((key) => {
      if (!prefs.order.includes(key)) prefs.order.push(key);
      if (!(key in prefs.enabled)) prefs.enabled[key] = false;
    });

    const stillValid = Object.entries(prefs.enabled).some(
      ([key, enabled]) => enabled && tools[key]
    );
    if (!stillValid) {
      console.warn(
        "⚠️ Nenhuma ferramenta habilitada válida encontrada. Aplicando padrão do idioma."
      );
      const remainingTools = allTools.filter(
        (k) => !defaultEnabled.includes(k)
      );
      const initialOrder = [...defaultEnabled, ...remainingTools];
      prefs = {
        order: initialOrder,
        enabled: Object.fromEntries(
          allTools.map((k) => [k, defaultEnabled.includes(k)])
        ),
      };
    }
  }

  function savePrefs() {
    localStorage.setItem("devutils_prefs", JSON.stringify(prefs));
    renderCards();
  }

  function cycleCardSize(card, slug, btn) {
    const states = ["", "col-span-2", "col-span-3"];
    const current = expandedPrefs[slug] || "";
    const index = states.indexOf(current);
    const nextClass = states[(index + 1) % states.length];

    states.filter(Boolean).forEach((cls) => card.classList.remove(cls));
    if (nextClass) card.classList.add(nextClass);

    expandedPrefs[slug] = nextClass;
    localStorage.setItem("devutils_expanded", JSON.stringify(expandedPrefs));
    btn.textContent = nextClass === "col-span-3" ? "🡼" : "⛶";
  }

  async function renderCards() {
    container.innerHTML = "";

    for (const key of prefs.order) {
      if (prefs.enabled[key] && tools[key]) {
        const tool = tools[key];
        const slug = tool.slug?.trim() || key;

        if (!slug) {
          console.warn(`⚠️ Ferramenta com slug inválido encontrada:`, tool);
          continue;
        }

        if (tool.loadI18n) await tool.loadI18n();

        const card = document.createElement("div");
        card.setAttribute("data-slug", slug);
        card.className =
          "tool-card transition-all duration-300 ease-in-out bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg relative";

        const cardSize = expandedPrefs[slug];
        if (cardSize) card.classList.add(cardSize);

        card.innerHTML = `
          <div class="absolute right-2 top-2 flex gap-1">
            <button class="resize-btn text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800">
              ${cardSize === "col-span-3" ? "🡼" : "⛶"}
            </button>
            <a href="/tool.html?slug=${slug}" class="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
              🔗
            </a>
          </div>
          <h2 class="text-lg font-bold mb-4 text-gray-800 dark:text-white">${tTool(
            slug,
            "title"
          )}</h2>
          ${tool.render()}
        `;

        container.appendChild(card);

        const btn = card.querySelector(".resize-btn");
        btn?.addEventListener("click", () => cycleCardSize(card, slug, btn));

        tool.init?.();
      }
    }
  }

  renderCards();

  window.expandCard = (btn, slug) => {
    const card = btn.closest(".tool-card");
    if (!card) return;
    cycleCardSize(card, slug, btn);
  };

  const headTranslations = {
    headTitle: "head.title",
    metaDescription: "head.description",
    ogTitle: "head.title",
    ogDescription: "head.description",
    twitterTitle: "head.title",
    twitterDescription: "head.description",
  };

  for (const [id, key] of Object.entries(headTranslations)) {
    const el = document.getElementById(id);
    const value = t(key);
    if (!el || !value) continue;
    if (el.tagName === "TITLE") el.textContent = value;
    else el.setAttribute("content", value);
  }

  await includeAndTranslate("header-placeholder", "/partials/header.html");
  await includeAndTranslate("footer-placeholder", "/partials/footer.html");
  await includeAndTranslate("sidebar-placeholder", "/partials/sidebar.html");
  await includeAndTranslate("mobileMenu", "/partials/mobile-menu.html");

  document.getElementById("settings-btn").classList.remove("hidden");

  const waitSidebar = setInterval(() => {
    const list = document.getElementById("sortable");
    if (list) {
      clearInterval(waitSidebar);
      renderSidebarList(prefs, savePrefs, list);
      setupSidebarEvents(prefs, savePrefs);
    }
  }, 50);
})();
