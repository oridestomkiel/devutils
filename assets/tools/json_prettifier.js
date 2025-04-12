import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const json_prettifier = {
  i18n: {},

  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.1",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
    <textarea
      id="jsonPrettyInput"
      class="w-full p-2 bg-white border border-gray-300 rounded mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
      rows="6"
      placeholder="${t("placeholder.input")}"
    ></textarea>

    <button
      id="jsonPrettyBtn"
      class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded mb-2 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
    >
      ${t("format")}
    </button>

    <div class="relative">
      <pre
        id="jsonPrettyOutput"
        class="mt-2 bg-white border border-gray-300 text-green-600 whitespace-pre-wrap break-words pr-12 rounded p-2 dark:bg-gray-700 dark:border-gray-700 dark:text-green-400 p-6"
      ></pre>

      <button
        id="copyJsonPretty"
        class="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white dark:bg-gray-500 dark:hover:bg-gray-400"
      >
        ${tGlobal("copy")}
      </button>

      <span
        id="copiedJsonPretty"
        class="absolute top-2 right-2 text-green-600 dark:text-green-400 px-2 py-1 hidden"
      >
        ${tGlobal("copied")}
      </span>
    </div>
    `;
  },

  init() {
    const t = (key) => json_prettifier.i18n?.[key] ?? key;

    const outputEl = document.getElementById("jsonPrettyOutput");
    const copyBtn = document.getElementById("copyJsonPretty");
    const copiedMsg = document.getElementById("copiedJsonPretty");

    document.getElementById("jsonPrettyBtn").addEventListener("click", () => {
      try {
        const input = document.getElementById("jsonPrettyInput").value;
        const parsed = JSON.parse(input);
        outputEl.innerText = JSON.stringify(parsed, null, 2);
      } catch (e) {
        outputEl.innerText = `${t("error")}: ${e.message}`;
      }
    });

    copyBtn.addEventListener("click", () => {
      const text = outputEl.innerText;
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        copiedMsg.classList.remove("hidden");
        copyBtn.classList.add("hidden");

        setTimeout(() => {
          copiedMsg.classList.add("hidden");
          copyBtn.classList.remove("hidden");
        }, 2000);
      });
    });
  },
};

export default json_prettifier;
