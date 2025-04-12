import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const date_difference_calculator = {
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
  <label class="block text-sm text-gray-800 dark:text-gray-300 mb-1">${t(
    "startDate"
  )}:</label>
  <input
    id="startDate"
    type="datetime-local"
    class="w-full p-2 rounded mb-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
  />

  <label class="block text-sm text-gray-800 dark:text-gray-300 mb-1">${t(
    "endDate"
  )}:</label>
  <input
    id="endDate"
    type="datetime-local"
    class="w-full p-2 rounded mb-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
  />

  <button
    id="diffBtn"
    class="bg-pink-600 hover:bg-pink-700 px-4 py-1 rounded text-white"
  >
    ${t("calculate")}
  </button>

  <div class="mt-4 flex gap-2">
    <textarea
      id="diffResult"
      rows="4"
      readonly
      class="p-2 rounded w-full whitespace-pre-wrap text-sm bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 border border-gray-300 dark:border-gray-700"
      placeholder="${t("resultPlaceholder")}"
    ></textarea>

    <button
      id="diffCopyBtn"
      class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-2 py-1 rounded self-start text-gray-800 dark:text-white"
    >
      ${tGlobal("copy")}
    </button>
  </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const startDateEl = document.getElementById("startDate");
    const endDateEl = document.getElementById("endDate");
    const diffBtn = document.getElementById("diffBtn");
    const diffResult = document.getElementById("diffResult");
    const diffCopyBtn = document.getElementById("diffCopyBtn");

    diffBtn.addEventListener("click", () => {
      const start = new Date(startDateEl.value);
      const end = new Date(endDateEl.value);

      if (isNaN(start) || isNaN(end)) {
        diffResult.value = t("invalidDates");
        return;
      }

      const diffMs = Math.abs(end - start);
      const mins = Math.floor(diffMs / (1000 * 60));
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      diffResult.value = `${t("difference")}:
- ${days} ${t("days")}
- ${hours} ${t("hours")}
- ${mins} ${t("minutes")}`;
    });

    diffCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(diffResult.value).then(() => {
        const originalText = diffCopyBtn.innerText;
        diffCopyBtn.innerText = tGlobal("copied");
        setTimeout(() => {
          diffCopyBtn.innerText = originalText;
        }, 1500);
      });
    });
  },
};

export default date_difference_calculator;
