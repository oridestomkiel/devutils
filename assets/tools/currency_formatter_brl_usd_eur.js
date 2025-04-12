import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const currency_formatter_brl_usd_eur = {
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
      id="cfInput"
      type="text"
      placeholder="${t("placeholder.input")}"
      class="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
    />

    <select
      id="cfCurrency"
      class="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
    >
      <option value="BRL">${t("option.brl")}</option>
      <option value="USD">${t("option.usd")}</option>
      <option value="EUR">${t("option.eur")}</option>
    </select>

    <button
      id="cfFormatBtn"
      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      ${t("button.format")}
    </button>

    <div class="mt-2 flex gap-2">
      <input
        id="cfOutput"
        type="text"
        value=""
        readonly
        class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-green-700 dark:text-green-400"
        placeholder="${t("placeholder.output")}"
      />
      <button
        id="cfCopyBtn"
        class="px-2 py-1 rounded self-start bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
      >
        ${tGlobal("copy")}
      </button>
    </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const cfInput = document.getElementById("cfInput");
    const cfCurrency = document.getElementById("cfCurrency");
    const cfFormatBtn = document.getElementById("cfFormatBtn");
    const cfOutput = document.getElementById("cfOutput");
    const cfCopyBtn = document.getElementById("cfCopyBtn");

    cfFormatBtn.addEventListener("click", () => {
      const valor = parseFloat(cfInput.value.replace(",", "."));
      if (isNaN(valor)) {
        cfOutput.value = `❌ ${t("error.invalidValue")}`;
        return;
      }

      const moeda = cfCurrency.value;
      const localeMap = {
        BRL: "pt-BR",
        USD: "en-US",
        EUR: "de-DE",
      };

      const formatado = valor.toLocaleString(localeMap[moeda], {
        style: "currency",
        currency: moeda,
      });

      cfOutput.value = `${formatado}`;
    });

    cfCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(cfOutput.value).then(() => {
        const originalText = cfCopyBtn.innerText;
        cfCopyBtn.innerText = tGlobal("copied");
        setTimeout(() => {
          cfCopyBtn.innerText = originalText;
        }, 1500);
      });
    });
  },
};

export default currency_formatter_brl_usd_eur;
