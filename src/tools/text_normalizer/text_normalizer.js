import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const text_normalizer = {
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
      id="normInput"
      class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white"
      rows="4"
      placeholder="${t("input_placeholder")}"
    ></textarea>

    <button
      id="normBtn"
      class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-2 text-white"
    >
      ${t("normalize")}
    </button>

    <div class="relative">
      <textarea
        id="normOutput"
        class="w-full p-2 bg-white border border-gray-300 text-green-600 rounded pr-20 dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
        rows="4"
        readonly
        placeholder="${t("output_placeholder")}"
      ></textarea>
      <button
        id="copyNormBtn"
        class="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white"
      >
        ${tGlobal("copy")}
      </button>
      <span
        id="copiedNormMsg"
        class="absolute top-2 right-2 text-green-600 dark:text-green-400 px-2 py-1 hidden"
      >
        ${tGlobal("copied")}
      </span>
    </div>
    `;
  },

  init() {
    const input = document.getElementById("normInput");
    const output = document.getElementById("normOutput");
    const copyBtn = document.getElementById("copyNormBtn");
    const copiedMsg = document.getElementById("copiedNormMsg");

    document.getElementById("normBtn").addEventListener("click", () => {
      const raw = input.value.trim();
      if (!raw) return (output.value = "");

      const normalized = raw
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/gi, "")
        .toLowerCase();

      output.value = normalized;
    });

    copyBtn.addEventListener("click", () => {
      const text = output.value;
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

export default text_normalizer;
