import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const json_formatter = {
  i18n: {},

  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.1",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
    <div class="text-gray-900 dark:text-white">
      <textarea
        id="jsonInput"
        class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        rows="6"
        placeholder='{"exemplo":true}'
      ></textarea>

      <button
        id="formatJsonBtn"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded m-4 ml-0"
      >
        ${t("format")}
      </button>

      <div class="relative">
        <pre
          id="jsonOutput"
          class="rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-green-400 overflow-x-auto whitespace-pre-wrap text-sm p-6"
        ></pre>

        <button
          id="copyJsonBtn"
          class="absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-2 py-1 rounded"
        >
          ${tGlobal("copy")}
        </button>

        <span
          id="copiedJsonMsg"
          class="absolute top-2 right-2 text-green-600 dark:text-green-400 px-2 py-1 hidden"
        >
          ${tGlobal("copied")}
        </span>
      </div>
    </div>
    `;
  },

  init() {
    const input = document.getElementById("jsonInput");
    const output = document.getElementById("jsonOutput");
    const formatBtn = document.getElementById("formatJsonBtn");
    const copyBtn = document.getElementById("copyJsonBtn");
    const copiedMsg = document.getElementById("copiedJsonMsg");

    formatBtn.addEventListener("click", () => {
      try {
        const parsed = JSON.parse(input.value);
        output.textContent = JSON.stringify(parsed, null, 2);
      } catch {
        output.textContent = "JSON inválido";
      }
    });

    copyBtn.addEventListener("click", () => {
      const text = output.textContent;
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        copyBtn.classList.add("hidden");
        copiedMsg.classList.remove("hidden");

        setTimeout(() => {
          copiedMsg.classList.add("hidden");
          copyBtn.classList.remove("hidden");
        }, 2000);
      });
    });
  },
};

export default json_formatter;
