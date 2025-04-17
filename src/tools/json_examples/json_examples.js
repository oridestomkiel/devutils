import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const json_examples = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "2.5.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
<div class="space-y-4 text-sm text-gray-800 dark:text-white">
  <p>${t("intro")}</p>

  <div>
    <label class="block mb-1 font-medium">${t("label.selectExample")}</label>
    <select id="jsonExampleSelect" class="w-full p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
      <option value="">${t("label.selectPlaceholder")}</option>
    </select>
  </div>

  <div class="flex items-center justify-between gap-2">
    <div class="flex gap-2">
      <button id="toggleViewBtn" class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1 rounded">
        🪵 Árvore / 📄 Texto
      </button>
      <button id="expandAllBtn" class="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-xs px-3 py-1 rounded">
        🔼 Expandir tudo
      </button>
      <button id="collapseAllBtn" class="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-xs px-3 py-1 rounded">
        🔽 Colapsar tudo
      </button>
    </div>
    <input id="jsonSearch" type="text" placeholder="🔍 Buscar..." class="w-40 text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white" />
  </div>

  <div>
    <label class="block mb-1 font-medium">${t("label.output")}</label>
    <div id="jsonTreeWrapper" class="border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-800 overflow-auto max-h-[70vh] text-xs font-mono leading-snug"></div>
  </div>

  <div class="flex gap-2">
    <button id="copyJsonExampleBtn" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded">
      ${tGlobal("copy")}
    </button>
    <button id="downloadJsonExampleBtn" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded">
      ${t("btn.download")}
    </button>
  </div>
</div>`;
  },

  init() {
    const $ = (id) => document.getElementById(id);

    const select = $("jsonExampleSelect");
    const wrapper = $("jsonTreeWrapper");
    const copyBtn = $("copyJsonExampleBtn");
    const downloadBtn = $("downloadJsonExampleBtn");
    const toggleBtn = $("toggleViewBtn");
    const expandBtn = $("expandAllBtn");
    const collapseBtn = $("collapseAllBtn");
    const searchInput = $("jsonSearch");

    let currentJson = "";
    let examples = {};
    let viewMode = "text"; // padrão agora é texto

    const renderText = (json) => {
      wrapper.innerHTML = "";
      const pre = document.createElement("pre");
      pre.className =
        "whitespace-pre-wrap break-words text-xs font-mono leading-snug";
      pre.textContent = json;
      wrapper.appendChild(pre);
    };

    const renderTree = (data, searchTerm = "") => {
      wrapper.innerHTML = "";

      const createNode = (value, key = "") => {
        const container = document.createElement("div");
        container.className = "ml-4 mb-1";

        const matchesSearch = (txt) =>
          txt.toLowerCase().includes(searchTerm.toLowerCase());

        if (Array.isArray(value)) {
          const details = document.createElement("details");
          details.open = true;
          const summary = document.createElement("summary");
          summary.className = "cursor-pointer select-none";
          summary.textContent = `${key ? `"${key}": ` : ""}[${value.length}]`;
          details.appendChild(summary);
          value.forEach((item, i) => {
            details.appendChild(createNode(item, i));
          });
          container.appendChild(details);
        } else if (value && typeof value === "object") {
          const details = document.createElement("details");
          details.open = true;
          const summary = document.createElement("summary");
          summary.className = "cursor-pointer select-none";
          summary.textContent = `${key ? `"${key}": ` : ""}{${
            Object.keys(value).length
          }}`;
          details.appendChild(summary);
          for (const [k, v] of Object.entries(value)) {
            details.appendChild(createNode(v, k));
          }
          container.appendChild(details);
        } else {
          if (
            searchTerm &&
            !matchesSearch(key) &&
            !matchesSearch(JSON.stringify(value))
          )
            return document.createElement("span");

          const line = document.createElement("div");
          line.textContent = key
            ? `"${key}": ${JSON.stringify(value)}`
            : JSON.stringify(value);
          container.appendChild(line);
        }

        return container;
      };

      wrapper.appendChild(createNode(data));
    };

    const loadExamplesJson = () =>
      fetch("/data/json-examples.json").then((res) => res.json());

    loadExamplesJson()
      .then((data) => {
        examples = data;

        for (const key of Object.keys(examples)) {
          const opt = document.createElement("option");
          opt.value = key;
          opt.textContent = key;
          select.appendChild(opt);
        }

        select.addEventListener("change", () => {
          const val = select.value;
          if (!val) return;
          const json = examples[val];
          currentJson = JSON.stringify(json, null, 2);
          viewMode === "tree" ? renderTree(json) : renderText(currentJson);
        });

        toggleBtn.addEventListener("click", () => {
          if (!currentJson) return;
          viewMode = viewMode === "tree" ? "text" : "tree";
          const json = JSON.parse(currentJson);
          viewMode === "tree"
            ? renderTree(json, searchInput.value.trim())
            : renderText(currentJson);
        });

        expandBtn.addEventListener("click", () => {
          wrapper.querySelectorAll("details").forEach((d) => (d.open = true));
        });

        collapseBtn.addEventListener("click", () => {
          wrapper.querySelectorAll("details").forEach((d) => (d.open = false));
        });

        searchInput.addEventListener("input", (e) => {
          if (!currentJson || viewMode !== "tree") return;
          const json = JSON.parse(currentJson);
          renderTree(json, e.target.value.trim());
        });
      })
      .catch((err) => {
        wrapper.innerHTML = `<div class="text-red-500">Erro: ${err.message}</div>`;
      });

    copyBtn.addEventListener("click", () => {
      if (!currentJson) return;
      navigator.clipboard.writeText(currentJson).then(() => {
        copyBtn.textContent = tGlobal("copied");
        setTimeout(() => (copyBtn.textContent = tGlobal("copy")), 1500);
      });
    });

    downloadBtn.addEventListener("click", () => {
      if (!currentJson) return;
      const blob = new Blob([currentJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${select.value || "example"}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  },
};

export default json_examples;
