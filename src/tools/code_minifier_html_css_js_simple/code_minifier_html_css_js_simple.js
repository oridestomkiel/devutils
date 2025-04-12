import { loadToolI18n } from "../../utils/i18n-loader.js";

const code_minifier_html_css_js_simple = {
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
  <textarea
    id="codeMinInput"
    class="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
    rows="6"
    placeholder="${t("placeholder.input")}"
  ></textarea>

  <button
    id="minifyBtn"
    class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 rounded"
  >
    ${t("minify")}
  </button>

  <div class="mt-2 flex gap-2">
    <textarea
      id="minifyOutput"
      rows="6"
      readonly
      class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-green-700 dark:text-green-400"
      placeholder="${t("placeholder.output")}"
    ></textarea>
    <button
      id="minifyCopyBtn"
      class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
    >
      ${t("copy")}
    </button>
  </div>
    `;
  },

  init() {
    const inputEl = document.getElementById("codeMinInput");
    const outputEl = document.getElementById("minifyOutput");
    const minifyBtn = document.getElementById("minifyBtn");
    const copyBtn = document.getElementById("minifyCopyBtn");

    minifyBtn.addEventListener("click", () => {
      const input = inputEl.value;
      const minified = input
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "")
        .replace(/\s{2,}/g, " ")
        .replace(/\n/g, "")
        .replace(/\s*([{};:,])\s*/g, "$1")
        .trim();

      outputEl.value =
        minified || (this.i18n?.["empty"] ?? "Nada pra minificar.");
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(outputEl.value).then(() => {
        const original = copyBtn.innerText;
        copyBtn.innerText = this.i18n?.["copied"] ?? "Copiado!";
        setTimeout(
          () => (copyBtn.innerText = this.i18n?.["copy"] ?? "Copiar"),
          1500
        );
      });
    });
  },
};

export default code_minifier_html_css_js_simple;
