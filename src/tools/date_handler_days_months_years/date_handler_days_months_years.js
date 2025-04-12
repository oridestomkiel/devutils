import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const date_handler_days_months_years = {
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
  <input
    id="dateBase"
    type="date"
    class="w-full p-2 rounded mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
  />

  <div class="grid grid-cols-2 gap-2 mb-2">
    <input
      id="dateDelta"
      type="number"
      class="p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
      placeholder="${t("value")}"
    />
    <select
      id="dateUnit"
      class="p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
    >
      <option value="days">${t("days")}</option>
      <option value="months">${t("months")}</option>
      <option value="years">${t("years")}</option>
    </select>

    <select
      id="dateDirection"
      class="p-2 rounded col-span-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
    >
      <option value="add">${t("add")}</option>
      <option value="sub">${t("subtract")}</option>
    </select>
  </div>

  <button
    id="dateDeltaBtn"
    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
  >
    ${t("calculate")}
  </button>

  <div class="mt-2 flex gap-2">
    <input
      id="dateDeltaOut"
      type="text"
      value=""
      readonly
      class="p-2 text-center w-full rounded bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 border border-gray-300 dark:border-gray-700"
      placeholder="${t("resultPlaceholder")}"
    />
    <button
      id="dateDeltaCopyBtn"
      class="px-2 py-1 rounded self-start bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
    >
      ${tGlobal("copy")}
    </button>
  </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const dateBaseEl = document.getElementById("dateBase");
    const dateDeltaEl = document.getElementById("dateDelta");
    const dateUnitEl = document.getElementById("dateUnit");
    const dateDirectionEl = document.getElementById("dateDirection");
    const dateDeltaBtn = document.getElementById("dateDeltaBtn");
    const dateDeltaOut = document.getElementById("dateDeltaOut");
    const dateDeltaCopyBtn = document.getElementById("dateDeltaCopyBtn");

    dateDeltaBtn.addEventListener("click", () => {
      const base = dateBaseEl.value;
      const valor = parseInt(dateDeltaEl.value, 10);
      const unidade = dateUnitEl.value;
      const direcao = dateDirectionEl.value;

      if (!base || isNaN(valor)) {
        dateDeltaOut.value = t("invalidInput");
        return;
      }

      const [yyyy, mm, dd] = base.split("-");
      const data = new Date(yyyy, mm - 1, dd);
      const delta = direcao === "add" ? valor : -valor;

      switch (unidade) {
        case "days":
          data.setDate(data.getDate() + delta);
          break;
        case "months":
          data.setMonth(data.getMonth() + delta);
          break;
        case "years":
          data.setFullYear(data.getFullYear() + delta);
          break;
      }

      const resultStr = data.toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      dateDeltaOut.value = resultStr;
    });

    dateDeltaCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(dateDeltaOut.value).then(() => {
        const originalText = dateDeltaCopyBtn.innerText;
        dateDeltaCopyBtn.innerText = tGlobal("copied");
        setTimeout(() => {
          dateDeltaCopyBtn.innerText = originalText;
        }, 1500);
      });
    });
  },
};

export default date_handler_days_months_years;
