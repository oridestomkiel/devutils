import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const query_params_playground = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.2.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
      <textarea
        id="qpInput"
        class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded mb-2 font-mono text-sm dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
        rows="4"
        placeholder="${t("placeholder")}"
      ></textarea>

      <div class="flex gap-2 mb-4">
        <button id="qpAnalyzeBtn" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm text-white dark:bg-blue-500 dark:hover:bg-blue-600">${t(
          "analyze"
        )}</button>
        <button id="qpClearBtn" class="hidden bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm text-white dark:bg-gray-600 dark:hover:bg-gray-500">${tGlobal(
          "clear"
        )}</button>
        <button id="qpCopyBtn" class="hidden bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm text-white dark:bg-gray-600 dark:hover:bg-gray-500">${tGlobal(
          "copy"
        )}</button>
        <button id="qpOpenBtn" class="hidden bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm text-white dark:bg-gray-600 dark:hover:bg-gray-500" disabled>${t(
          "open"
        )}</button>
      </div>

      <div id="errorURL" class="text-sm font-mono mb-3 text-red-600 bg-white border border-red-300 p-3 rounded break-words hidden dark:bg-gray-900 dark:border-red-500 dark:text-red-400"></div>

      <div id="qpExtras" class="hidden">
        <div id="qpPreview" class="text-sm font-mono mb-3 text-green-600 bg-white border border-gray-300 p-3 rounded break-words dark:bg-gray-900 dark:border-gray-700 dark:text-green-400"></div>

        <div id="qpMeta" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm text-gray-800 dark:text-gray-300"></div>

        <table class="w-full text-sm text-gray-800 mb-4 border border-gray-300 rounded border-collapse dark:text-gray-200 dark:border-gray-700" id="qpParamsTable">
          <thead class="bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
            <tr>
              <th class="text-center px-2 py-1 w-[20px]">✖</th>
              <th class="text-left px-2 py-1">${t("key")}</th>
              <th class="text-left px-2 py-1">${t("value")}</th>
            </tr>
          </thead>
          <tbody id="qpParamsBody"></tbody>
        </table>

        <div class="grid grid-cols-2 gap-4 mb-3">
          <input id="qpKey" type="text" placeholder="${t(
            "key"
          )}" class="p-2 bg-white border border-gray-300 text-gray-800 text-sm rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400" />
          <input id="qpValue" type="text" placeholder="${t(
            "value"
          )}" class="p-2 bg-white border border-gray-300 text-gray-800 text-sm rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400" />
        </div>

        <button id="qpAddBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm text-white dark:bg-blue-500 dark:hover:bg-blue-600">${t(
          "add_param"
        )}</button>
      </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const input = document.getElementById("qpInput");
    const preview = document.getElementById("qpPreview");
    const errorURL = document.getElementById("errorURL");
    const meta = document.getElementById("qpMeta");
    const paramsTable = document.getElementById("qpParamsBody");
    const copyBtn = document.getElementById("qpCopyBtn");
    const clearBtn = document.getElementById("qpClearBtn");
    const analyzeBtn = document.getElementById("qpAnalyzeBtn");
    const addBtn = document.getElementById("qpAddBtn");
    const keyInput = document.getElementById("qpKey");
    const valInput = document.getElementById("qpValue");
    const openBtn = document.getElementById("qpOpenBtn");

    let currentUrl;
    const queryParams = [];
    const extras = document.getElementById("qpExtras");

    const toggleUI = (show) => {
      extras.classList.toggle("hidden", !show);
      copyBtn.classList.toggle("hidden", !show);
      clearBtn.classList.toggle("hidden", !show);
      openBtn.classList.toggle("hidden", !show);
      openBtn.disabled = !show;
    };

    const renderPreview = () => {
      if (!currentUrl) return;
      preview.innerHTML = `
        <span class="text-gray-400">${currentUrl.protocol}//</span>
        <span class="text-yellow-400">${currentUrl.hostname}</span>
        <span class="text-gray-400">${
          currentUrl.port ? ":" + currentUrl.port : ""
        }${currentUrl.pathname}</span>
        <span class="text-blue-400">${currentUrl.search}</span>
      `;
    };

    const updateMeta = () => {
      meta.innerHTML = `
        <div><strong>protocol: </strong>${currentUrl.protocol}</div>
        <div><strong>hostname: </strong>${currentUrl.hostname}</div>
        <div><strong>port: </strong>${currentUrl.port || "-"}</div>
        <div><strong>pathname: </strong>${currentUrl.pathname}</div>
      `;
    };

    const renderParams = () => {
      paramsTable.innerHTML = "";
      queryParams.forEach((param, i) => {
        const tr = document.createElement("tr");

        const del = document.createElement("td");
        del.className = "text-center";
        const delBtn = document.createElement("button");
        delBtn.textContent = "✖";
        delBtn.title = t("remove_key");
        delBtn.className = "text-red-400 hover:text-red-300 text-xs";
        delBtn.addEventListener("click", () => {
          queryParams.splice(i, 1);
          renderParams();
          updateURL();
        });
        del.appendChild(delBtn);

        const keyTd = document.createElement("td");
        keyTd.className = "px-2 py-1";
        const keyField = document.createElement("input");
        keyField.value = param.key;
        keyField.className =
          "w-full p-1 rounded bg-white border border-gray-300 text-gray-800 dark:bg-gray-700 dark:border-gray-700 dark:text-white";
        keyField.addEventListener("input", (e) => {
          queryParams[i].key = e.target.value;
          updateURL();
        });
        keyTd.appendChild(keyField);

        const valTd = document.createElement("td");
        valTd.className = "px-2 py-1";
        const valField = document.createElement("input");
        valField.value = param.value;
        valField.className =
          "w-full p-1 rounded bg-white border border-gray-300 text-gray-800 dark:bg-gray-700 dark:border-gray-700 dark:text-white";
        valField.addEventListener("input", (e) => {
          queryParams[i].value = e.target.value;
          updateURL();
        });
        valTd.appendChild(valField);

        tr.appendChild(del);
        tr.appendChild(keyTd);
        tr.appendChild(valTd);
        paramsTable.appendChild(tr);
      });
    };

    const updateURL = () => {
      if (!currentUrl) return;
      const search = new URLSearchParams();
      queryParams.forEach((p) => {
        if (p.key) search.append(p.key, p.value);
      });
      currentUrl.search = search.toString();
      renderPreview();
    };

    const analyzeURL = () => {
      const raw = input.value.trim();
      errorURL.classList.add("hidden");

      if (!/^https?:\/\//i.test(raw)) {
        errorURL.innerHTML = `<span class="text-red-400">${t(
          "url_prefix_error"
        )}</span>`;
        errorURL.classList.remove("hidden");
        meta.innerHTML = "";
        paramsTable.innerHTML = "";
        toggleUI(false);
        currentUrl = null;
        return;
      }

      try {
        currentUrl = new URL(raw);
        queryParams.length = 0;
        currentUrl.searchParams.forEach((value, key) => {
          queryParams.push({ key, value });
        });
        updateMeta();
        renderParams();
        renderPreview();
        toggleUI(true);
      } catch {
        preview.innerHTML = `<span class="text-red-400">${t(
          "url_invalid"
        )}</span>`;
        meta.innerHTML = "";
        paramsTable.innerHTML = "";
        toggleUI(false);
        currentUrl = null;
      }
    };

    const addParam = () => {
      const k = keyInput.value.trim();
      const v = valInput.value.trim();
      if (!k) return;
      queryParams.push({ key: k, value: v });
      keyInput.value = "";
      valInput.value = "";
      renderParams();
      updateURL();
    };

    analyzeBtn.addEventListener("click", analyzeURL);
    addBtn.addEventListener("click", addParam);
    clearBtn.addEventListener("click", () => {
      input.value = "";
      preview.innerHTML = "";
      meta.innerHTML = "";
      paramsTable.innerHTML = "";
      queryParams.length = 0;
      currentUrl = null;
      toggleUI(false);
    });

    copyBtn.addEventListener("click", () => {
      if (currentUrl) {
        navigator.clipboard.writeText(currentUrl.toString()).then(() => {
          copyBtn.textContent = tGlobal("copied");
          setTimeout(() => (copyBtn.textContent = tGlobal("copy")), 1500);
        });
      }
    });

    openBtn.addEventListener("click", () => {
      if (currentUrl) window.open(currentUrl.toString(), "_blank");
    });

    toggleUI(false);
  },
};

export default query_params_playground;
