import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const remove_duplicate_lines = {
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
    <div class="p-4 rounded bg-white text-gray-800 text-sm space-y-4 dark:bg-gray-800 dark:text-white">
      <div>
        <label class="block mb-1">${t("input_label")}</label>
        <textarea
          id="inputDuplicadas"
          rows="6"
          class="w-full p-2 rounded bg-white border border-gray-300 text-gray-800 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
          placeholder="${t("input_placeholder")}"
        ></textarea>
      </div>

      <button
        id="btnRemover"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm text-white dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        ${t("remove_button")}
      </button>

      <div>
        <label class="block mb-1 mt-4">${t("output_label")}</label>
        <textarea
          id="resultado"
          rows="6"
          readonly
          class="w-full p-2 rounded bg-white border border-gray-300 text-green-600 dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
        ></textarea>

        <div class="flex gap-2 mt-2">
          <button
            id="btnCopiar"
            class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm text-white dark:bg-gray-600 dark:hover:bg-gray-500"
          >
            ${tGlobal("copy")}
          </button>
          <button
            id="btnDownload"
            class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm text-white dark:bg-gray-600 dark:hover:bg-gray-500"
          >
            ${t("download")}
          </button>
        </div>
      </div>
    </div>
    `;
  },

  init() {
    const input = document.getElementById("inputDuplicadas");
    const resultado = document.getElementById("resultado");

    document.getElementById("btnRemover").addEventListener("click", () => {
      const linhas = input.value.split("\n").map((l) => l.trim());
      const unicas = [...new Set(linhas)].filter((l) => l);
      resultado.value = unicas.join("\n");
    });

    document.getElementById("btnCopiar").addEventListener("click", () => {
      navigator.clipboard.writeText(resultado.value).then(() => {
        const btn = document.getElementById("btnCopiar");
        const original = btn.textContent;
        btn.textContent = tGlobal("copied");
        setTimeout(() => (btn.textContent = original), 1500);
      });
    });

    document.getElementById("btnDownload").addEventListener("click", () => {
      const blob = new Blob([resultado.value], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "sem-duplicadas.txt";
      link.click();
    });
  },
};

export default remove_duplicate_lines;
