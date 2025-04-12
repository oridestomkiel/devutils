import "./style.css";
import { tools } from "./tools/index.js";
import "./utils/lang.js";
import "./utils/theme.js";
import { loadGlobalI18n, tGlobal } from "./utils/i18n-global.js";
import { includeAndTranslate } from "./utils/include-partial.js";

(async () => {
  const lang = window.getDevutilsLang?.() || "en";
  await loadGlobalI18n(lang);

  const headTranslations = {
    headTitle: "tool.head.title",
    metaDescription: "tool.head.description",
    ogTitle: "tool.head.title",
    ogDescription: "tool.head.description",
    twitterTitle: "tool.head.title",
    twitterDescription: "tool.head.description",
  };

  for (const [id, key] of Object.entries(headTranslations)) {
    const el = document.getElementById(id);
    if (!el) continue;
    const value = tGlobal(key);
    if (!value) continue;
    if (el.tagName === "TITLE") {
      el.textContent = value;
    } else {
      el.setAttribute("content", value);
    }
  }

  await includeAndTranslate("header-placeholder", "/partials/header.html");
  await includeAndTranslate("footer-placeholder", "/partials/footer.html");
  await includeAndTranslate("mobileMenu", "/partials/mobile-menu.html");

  const container = document.getElementById("toolContainer");
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get("slug");
  const tool = tools[slug];

  if (!tool) {
    document.title = tGlobal("tool.notFoundTitle");
    container.innerHTML = `<p class="text-red-600 dark:text-red-400">${tGlobal(
      "tool.notFound"
    ).replace("{slug}", slug)}</p>`;
    return;
  }

  tool.slug = slug;

  if (tool.loadI18n) await tool.loadI18n();

  const title = tool.i18n?.title || tool.title;
  const description = tool.i18n?.description || tool.description || "";

  document.title = `${title} - DevUtils`;

  const meta = document.createElement("meta");
  meta.name = "description";
  meta.content = description;
  document.head.appendChild(meta);

  container.innerHTML = "";
  setupAddToHomeButton(slug, title);

  const section = document.createElement("section");
  section.className = "mt-6";

  const card = document.createElement("div");
  card.className =
    "bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-4 rounded-xl shadow";
  card.innerHTML = `
    <p class="text-gray-700 dark:text-gray-400 mb-2">${description}</p>
    <div class="mt-6">${tool.render()}</div>  
    <div class="text-sm text-gray-600 dark:text-gray-400 mt-6">
      <strong>${tGlobal("tags")}:</strong> ${(
    tool.i18n?.tags ||
    tool.tags ||
    []
  ).join(", ")}<br/>
      <strong>${tGlobal("category")}:</strong> ${
    tool.i18n?.category || tool.category || tGlobal("other")
  } |
      <strong>${tGlobal("author")}:</strong> ${
    tool.i18n?.author || tool.author || "devutils"
  }
    </div>
    <div class="mt-4">
      <button id="showSourceBtn" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
        ${tGlobal("viewSource")}
      </button>
      <div id="sourceContainer" class="mt-2 hidden border border-gray-300 dark:border-gray-700 rounded">
        <div class="relative bg-gray-100 dark:bg-gray-800 rounded-t" style="height: 25px">
          <span id="copiadoMsg" class="text-green-600 dark:text-green-400 absolute right-2 top-1 hidden">${tGlobal(
            "copied"
          )}</span>
          <button id="copiarBtn" class="absolute right-2 top-1 text-blue-600 dark:text-blue-400 hover:underline">${tGlobal(
            "copy"
          )}</button>
        </div>
        <pre class="line-numbers bg-gray-200 dark:bg-gray-900 rounded-b text-xs">
          <code id="sourceCode" class="language-javascript block p-4 text-green-700 dark:text-green-400 font-mono whitespace-pre-wrap"></code>
        </pre>
      </div>
    </div>
  `;

  section.appendChild(card);
  container.appendChild(section);
  tool.init?.();
  setupSourceViewer(slug);
})();

function setupSourceViewer(slug) {
  const showBtn = document.getElementById("showSourceBtn");
  const container = document.getElementById("sourceContainer");
  const copiarBtn = document.getElementById("copiarBtn");
  const msg = document.getElementById("copiadoMsg");

  let carregado = false;

  showBtn.addEventListener("click", async () => {
    const isHidden = container.classList.contains("hidden");

    if (isHidden) {
      container.classList.remove("hidden");
      showBtn.textContent = tGlobal("hideSource");

      if (!carregado) {
        const filePath = `/assets/tools/${slug}.js`;
        try {
          const res = await fetch(filePath);
          if (!res.ok) throw new Error("loadError");

          await Promise.all([
            loadCSS("/vendor/prism.min.css"),
            loadScript("/vendor/prism.min.js"),
          ]);

          const code = await res.text();
          const escaped = code
            .trim()
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
          document.getElementById("sourceCode").innerHTML = escaped;
          Prism.highlightAll();
          carregado = true;
        } catch (err) {
          document.getElementById("sourceCode").textContent =
            tGlobal("loadError");
        }
      }
    } else {
      container.classList.add("hidden");
      showBtn.textContent = tGlobal("viewSource");
    }
  });

  copiarBtn.addEventListener("click", () => {
    const code = document.getElementById("sourceCode").textContent;
    navigator.clipboard.writeText(code).then(() => {
      copiarBtn.classList.add("hidden");
      msg.classList.remove("hidden");
      setTimeout(() => {
        copiarBtn.classList.remove("hidden");
        msg.classList.add("hidden");
      }, 2000);
    });
  });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

function loadCSS(href) {
  return new Promise((resolve, reject) => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    l.onload = resolve;
    l.onerror = reject;
    document.head.appendChild(l);
  });
}

function setupAddToHomeButton(slug, title) {
  const prefs = JSON.parse(localStorage.getItem("devutils_prefs") || "{}");
  const order = prefs.order || [];
  const enabled = prefs.enabled || {};

  const btn = document.createElement("button");
  btn.innerHTML = `➕ ${tGlobal("addToHome")}`;
  btn.className =
    "absolute top-2 right-2 bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white px-2 py-1 text-xs rounded shadow";
  btn.style.zIndex = 10;

  if (enabled[slug]) {
    btn.innerHTML = `✅ ${tGlobal("inHome")}`;
    btn.disabled = true;
    btn.classList.add("opacity-50", "cursor-default");
  }

  btn.addEventListener("click", () => {
    if (!order.includes(slug)) {
      const lastActiveIndex = order.reduce(
        (last, key, i) => (enabled[key] ? i : last),
        -1
      );
      order.splice(lastActiveIndex + 1, 0, slug);
    }

    enabled[slug] = true;
    localStorage.setItem("devutils_prefs", JSON.stringify({ order, enabled }));

    btn.innerHTML = `✅ ${tGlobal("added")}`;
    btn.disabled = true;
    btn.classList.add("opacity-50", "cursor-default");
  });

  const header = document.createElement("div");
  header.className = "relative";
  header.appendChild(btn);

  const toolContainer = document.getElementById("toolContainer");
  const titleEl = document.createElement("h1");
  titleEl.className = "text-2xl font-bold mb-4 text-gray-900 dark:text-white";
  titleEl.textContent = title;

  toolContainer.innerHTML = "";
  toolContainer.appendChild(header);
  toolContainer.appendChild(titleEl);
}
