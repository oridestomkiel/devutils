import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const byte_size_converter = {
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
<div class="p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-800 dark:text-white space-y-4">
  <p>${t("intro")}</p>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label class="block text-sm mb-1">${t("label.value")}</label>
      <input id="byteInput" type="number" min="0" placeholder="1024" class="w-full p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
    </div>

    <div>
      <label class="block text-sm mb-1">${t("label.unit")}</label>
      <select id="byteUnit" class="w-full p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
        ${["B", "KB", "MB", "GB", "TB"]
          .map((u) => `<option value="${u}">${u}</option>`)
          .join("")}
      </select>
    </div>

    <div>
      <label class="block text-sm mb-1">${t("label.decimals")}</label>
      <input id="bytePrecision" type="number" min="0" max="6" value="2" class="w-full p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
    </div>
  </div>

  <div id="byteResults" class="space-y-1 text-xs bg-white dark:bg-gray-900 p-3 rounded border border-gray-300 dark:border-gray-700 font-mono"></div>

  <button id="copyByteResult" class="mt-2 px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm">
    ${tGlobal("copy")}
  </button>
</div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const inputEl = document.getElementById("byteInput");
    const unitEl = document.getElementById("byteUnit");
    const precisionEl = document.getElementById("bytePrecision");
    const resultEl = document.getElementById("byteResults");
    const copyBtn = document.getElementById("copyByteResult");

    const units = ["B", "KB", "MB", "GB", "TB"];
    const factor = 1000;

    function updateOutput() {
      const value = parseFloat(inputEl.value);
      const unit = unitEl.value;
      const decimals = parseInt(precisionEl.value) || 0;

      if (isNaN(value) || value < 0) {
        resultEl.innerHTML = `<p class="text-red-500">${t(
          "error.invalid"
        )}</p>`;
        return;
      }

      const bytes = value * Math.pow(factor, units.indexOf(unit));
      let resultText = "";

      units.forEach((u, i) => {
        const converted = bytes / Math.pow(factor, i);
        resultText += `${u.padEnd(4)} = ${converted.toFixed(decimals)}<br>`;
      });

      resultEl.innerHTML = resultText;
    }

    inputEl.addEventListener("input", updateOutput);
    unitEl.addEventListener("change", updateOutput);
    precisionEl.addEventListener("input", updateOutput);

    copyBtn.addEventListener("click", () => {
      const text = resultEl.innerText;
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = tGlobal("copied");
        setTimeout(() => (copyBtn.textContent = tGlobal("copy")), 1500);
      });
    });

    updateOutput();
  },
};

export default byte_size_converter;
