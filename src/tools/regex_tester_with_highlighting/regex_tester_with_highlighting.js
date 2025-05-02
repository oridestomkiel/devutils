import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const regex_tester_with_highlighting = {
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
      <input
        id="regexPattern"
        class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
        placeholder="${t("regex_placeholder")}"
      />

      <textarea
        id="regexText"
        class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
        rows="4"
        placeholder="${t("text_placeholder")}"
      ></textarea>

      <button
        id="regexTestBtn"
        class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white dark:bg-green-500 dark:hover:bg-green-600"
      >
        ${t("test")}
      </button>

      <div class="relative mt-4">
        <div
          id="regexResult"
          class="p-6 bg-white border border-gray-300 text-gray-800 rounded whitespace-pre-wrap break-words pr-16 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        ></div>

        <button
          id="copyRegexResultBtn"
          class="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white dark:bg-gray-500 dark:hover:bg-gray-400"
        >
          ${tGlobal("copy")}
        </button>

        <span
          id="copiedRegexMsg"
          class="absolute top-2 right-2 text-green-600 dark:text-green-400 px-2 py-1 hidden"
        >
          ${tGlobal("copied")}
        </span>
      </div>

      <small class="text-gray-600 dark:text-gray-400 block mt-2">
        ${t("hint")}
      </small>
    `;
  },

  init() {
    const input = document.getElementById("regexPattern");
    const textArea = document.getElementById("regexText");
    const result = document.getElementById("regexResult");
    const copyBtn = document.getElementById("copyRegexResultBtn");
    const copiedMsg = document.getElementById("copiedRegexMsg");

    document.getElementById("regexTestBtn").addEventListener("click", () => {
      const patternInput = input.value.trim();
      const text = textArea.value.trim();

      if (!patternInput || !text) {
        result.innerHTML = `<span class="text-gray-500">${
          this.i18n?.fill_both || "Preencha ambos os campos."
        }</span>`;
        return;
      }

      let pattern = patternInput;
      let flags = "";

      const match = patternInput.match(/^\/(.+)\/([gimsuy]*)$/);
      if (match) {
        pattern = match[1];
        flags = match[2];
      }

      let regex;
      try {
        regex = new RegExp(pattern, flags || "g");
      } catch (e) {
        result.innerHTML = `<span class="text-red-400">${
          this.i18n?.invalid || "Regex inválida:"
        } ${e.message}</span>`;
        return;
      }

      const highlighted = text.replace(
        regex,
        (m) => `<span class="bg-yellow-500 text-black px-1 rounded">${m}</span>`
      );

      result.innerHTML =
        highlighted ||
        `<span class="text-gray-500">${
          this.i18n?.no_match || "Nenhuma correspondência encontrada."
        }</span>`;
    });

    copyBtn.addEventListener("click", () => {
      const html = result.innerHTML;
      if (!html) return;

      navigator.clipboard.writeText(html).then(() => {
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

export default regex_tester_with_highlighting;
