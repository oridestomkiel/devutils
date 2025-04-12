import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const json_minifier = {
  i18n: {},

  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
    <textarea
      id="jsonMinInput"
      class="w-full p-2 bg-white border border-gray-300 rounded mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
      rows="6"
      placeholder="${t("placeholder.input")}"
    ></textarea>

    <button
      id="jsonMinBtn"
      class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white dark:bg-blue-500 dark:hover:bg-blue-600"
    >
      ${t("minify")}
    </button>

    <textarea
      id="jsonMinOutput"
      class="w-full p-2 bg-white border border-gray-300 rounded mt-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
      rows="4"
      readonly
      placeholder="${t("placeholder.output")}"
    ></textarea>

    <button
      id="jsonMinCopy"
      class="mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white dark:bg-green-500 dark:hover:bg-green-600"
    >
      ${tGlobal("copy")}
    </button>
    `;
  },

  init() {
    const t = (key) => json_minifier.i18n?.[key] ?? key;

    document.getElementById("jsonMinBtn").addEventListener("click", () => {
      const input = document.getElementById("jsonMinInput").value;
      const output = document.getElementById("jsonMinOutput");

      try {
        const obj = JSON.parse(input);
        output.value = JSON.stringify(obj);
      } catch (e) {
        output.value = t("invalidJson");
      }
    });

    document.getElementById("jsonMinCopy").addEventListener("click", () => {
      const out = document.getElementById("jsonMinOutput");
      if (out.value && out.value !== json_minifier.i18n?.invalidJson) {
        navigator.clipboard.writeText(out.value).then(() => {
          const btn = document.getElementById("jsonMinCopy");
          const original = btn.textContent;
          btn.textContent = tGlobal("copied");
          setTimeout(() => (btn.textContent = tGlobal("copy")), 1500);
        });
      }
    });
  },
};

export default json_minifier;
