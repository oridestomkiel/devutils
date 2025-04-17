import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const curl_builder = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "en");
  },
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
<div class="p-4 rounded bg-gray-100 dark:bg-gray-800 text-sm space-y-4 text-gray-800 dark:text-white">
  <p>${t("intro")}</p>

  <div class="space-y-2">
    <label class="block text-sm mb-1">${t("label.method")}</label>
    <select id="curlMethod" class="p-2 rounded w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
      ${["GET", "POST", "PUT", "PATCH", "DELETE"]
        .map((m) => `<option value="${m}">${m}</option>`)
        .join("")}
    </select>
  </div>

  <div class="space-y-2">
    <label class="block text-sm mb-1">${t("label.url")}</label>
    <input id="curlUrl" type="text" placeholder="https://api.exemplo.com/recurso" class="p-2 rounded w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white" />
  </div>

  <div class="space-y-2">
    <label class="block text-sm mb-1 flex items-center justify-between">
      ${t("label.headers")}
      <button id="addHeader" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm text-white">${t(
        "add"
      )}</button>
    </label>
    <div id="curlHeaders" class="space-y-2"></div>
  </div>

  <div class="space-y-2">
    <label class="block text-sm mb-1">${t("label.body")}</label>
    <textarea id="curlBody" rows="5" class="p-2 w-full rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white" placeholder='{"exemplo":"valor"}'></textarea>
  </div>

  <button id="buildCurl" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm text-white">
    ${t("generate")}
  </button>

  <div id="curlOutputWrapper" class="mt-4 hidden">
    <label class="block text-sm mb-1">${t("label.result")}</label>
    <pre id="curlOutput" class="p-3 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-900 text-green-700 dark:text-green-400 rounded text-xs overflow-auto whitespace-pre-wrap"></pre>
    <button id="copyCurl" class="mt-2 px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded">${tGlobal(
      "copy"
    )}</button>
  </div>
</div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const headersContainer = document.getElementById("curlHeaders");
    const addHeaderBtn = document.getElementById("addHeader");
    const buildBtn = document.getElementById("buildCurl");
    const outputWrapper = document.getElementById("curlOutputWrapper");
    const outputEl = document.getElementById("curlOutput");
    const copyBtn = document.getElementById("copyCurl");

    const createHeaderInput = () => {
      const wrapper = document.createElement("div");
      wrapper.className = "flex gap-2";

      const keyInput = document.createElement("input");
      keyInput.placeholder = "Header";
      keyInput.className =
        "flex-1 p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white";

      const valueInput = document.createElement("input");
      valueInput.placeholder = "Valor";
      valueInput.className =
        "flex-1 p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white";

      wrapper.appendChild(keyInput);
      wrapper.appendChild(valueInput);
      headersContainer.appendChild(wrapper);
    };

    addHeaderBtn.addEventListener("click", () => {
      createHeaderInput();
    });

    buildBtn.addEventListener("click", () => {
      const method = document.getElementById("curlMethod").value;
      const url = document.getElementById("curlUrl").value.trim();
      const body = document.getElementById("curlBody").value.trim();
      const headers = [...headersContainer.querySelectorAll("div")]
        .map((row) => {
          const inputs = row.querySelectorAll("input");
          return [inputs[0]?.value.trim(), inputs[1]?.value.trim()];
        })
        .filter(([key, val]) => key && val);

      let curl = `curl -X ${method} "${url}"`;

      headers.forEach(([key, val]) => {
        curl += ` \\\n  -H "${key}: ${val}"`;
      });

      if (body && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
        curl += ` \\\n  -d '${body}'`;
      }

      outputWrapper.classList.remove("hidden");
      outputEl.textContent = curl;
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(outputEl.textContent).then(() => {
        copyBtn.textContent = tGlobal("copied");
        setTimeout(() => (copyBtn.textContent = tGlobal("copy")), 1500);
      });
    });

    createHeaderInput();
  },
};

export default curl_builder;
