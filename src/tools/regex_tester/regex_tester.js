import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const regex_tester = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
    <textarea
      id="regexInput"
      class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
      rows="2"
      placeholder="${t("regex_placeholder")}"
    ></textarea>

    <textarea
      id="regexTest"
      class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
      rows="3"
      placeholder="${t("text_placeholder")}"
    ></textarea>

    <button
      id="regexTestBtn"
      class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-white dark:bg-blue-500 dark:hover:bg-blue-600"
    >
      ${t("test")}
    </button>

    <p
      id="regexOutput"
      class="mt-2 text-green-600 break-words dark:text-green-400 p-4 bg-white border border-gray-300 dark:border-gray-700"
    ></p>
    `;
  },

  init() {
    const output = document.getElementById("regexOutput");

    document.getElementById("regexTestBtn").addEventListener("click", () => {
      const pattern = document.getElementById("regexInput").value.trim();
      const text = document.getElementById("regexTest").value.trim();

      try {
        const re = new RegExp(pattern, "g");
        const matches = [...text.matchAll(re)].map((m) => m[0]);
        output.innerText = matches.length
          ? `🔍 ${matches.length} ${
              matches.length > 1
                ? this.i18n?.matches_plural
                : this.i18n?.matches_singular
            }: ` + matches.join(", ")
          : this.i18n?.no_match || "Nenhuma ocorrência encontrada.";
      } catch (e) {
        output.innerText =
          (this.i18n?.error_prefix || "Erro no regex: ") + e.message;
      }
    });
  },
};

export default regex_tester;
