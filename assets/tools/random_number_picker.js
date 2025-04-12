import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const random_number_picker = {
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
      <div class="p-4 rounded text-gray-800 text-sm space-y-4 dark:bg-gray-800 dark:text-white">
        <p>${t("instruction")}</p>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm mb-1">${t("min_label")}</label>
            <input
              id="numMin"
              type="number"
              value="0"
              class="p-2 bg-white border border-gray-300 text-green-600 rounded w-full dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
            />
          </div>
          <div>
            <label class="block text-sm mb-1">${t("max_label")}</label>
            <input
              id="numMax"
              type="number"
              value="10"
              class="p-2 bg-white border border-gray-300 text-green-600 rounded w-full dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
            />
          </div>
        </div>

        <button
          id="btnSortear"
          class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm text-white dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          ${t("draw_button")}
        </button>

        <div>
          <label class="block text-sm mb-1 mt-4">${t("result_label")}</label>
          <div class="flex gap-2">
            <input
              id="resultado"
              type="text"
              readonly
              value=""
              class="p-2 bg-white border border-gray-300 text-green-600 rounded w-full dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
            />
            <button
              id="copyResultBtn"
              class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              ${tGlobal("copy")}
            </button>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;
    const resultadoEl = document.getElementById("resultado");
    const copiarBtn = document.getElementById("copyResultBtn");

    document.getElementById("btnSortear").addEventListener("click", () => {
      const min = parseInt(document.getElementById("numMin").value, 10);
      const max = parseInt(document.getElementById("numMax").value, 10);

      if (isNaN(min) || isNaN(max) || min > max) {
        resultadoEl.value = `⚠️ ${t("invalid_range")}`;
        resultadoEl.classList.replace("text-green-400", "text-yellow-400");
        return;
      }

      const sorteado = Math.floor(Math.random() * (max - min + 1)) + min;
      resultadoEl.value = sorteado;
      resultadoEl.classList.replace("text-yellow-400", "text-green-400");
    });

    copiarBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(resultadoEl.value).then(() => {
        copiarBtn.textContent = tGlobal("copied");
        setTimeout(() => (copiarBtn.textContent = tGlobal("copy")), 1500);
      });
    });
  },
};

export default random_number_picker;
