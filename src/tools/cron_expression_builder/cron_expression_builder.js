import { loadToolI18n } from "../../utils/i18n-loader.js";

const cron_expression_builder = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "en");
  },
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render() {
    const t = (k) => this.i18n?.[k] ?? k;

    return `
    <input
      id="cronInput"
      type="text"
      placeholder="${t("placeholder.input")}"
      class="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
    />

    <button
      id="cronExplainBtn"
      class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1 rounded"
    >
      ${t("button.explain")}
    </button>

    <div class="mt-2 flex gap-2">
      <textarea
        id="cronOutput"
        rows="5"
        readonly
        class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-green-700 dark:text-green-400"
        placeholder="${t("placeholder.output")}"
      ></textarea>
      <button
        id="cronCopyBtn"
        class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
      >
        Copiar
      </button>
    </div>

    <small class="block mt-4 text-gray-500 dark:text-gray-400">
      ${t("format.hint")}
    </small>
    `;
  },

  init() {
    const input = document.getElementById("cronInput");
    const output = document.getElementById("cronOutput");
    const explainBtn = document.getElementById("cronExplainBtn");
    const copyBtn = document.getElementById("cronCopyBtn");

    const labels = this.i18n?.["labels"] || [];

    explainBtn.addEventListener("click", () => {
      const expr = input.value.trim();
      const parts = expr.split(" ");

      if (parts.length !== 5) {
        output.value =
          this.i18n?.["invalid"] ?? "Expressão inválida. Deve ter 5 campos.";
        return;
      }

      output.value = parts
        .map((val, i) => `${labels[i] ?? `Campo ${i + 1}`}: ${val}`)
        .join("\n");
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(output.value).then(() => {
        const original = copyBtn.innerText;
        copyBtn.innerText = this.i18n?.["copied"] ?? "Copiado!";
        setTimeout(() => (copyBtn.innerText = original), 1500);
      });
    });
  },
};

export default cron_expression_builder;
