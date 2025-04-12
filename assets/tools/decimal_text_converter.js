import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const decimal_text_converter = {
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
    id="decimalTextInput"
    class="w-full p-2 rounded mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
    rows="4"
    placeholder="${t("placeholder")}"
  ></textarea>

  <div class="flex gap-2">
    <button
      id="textToDecimalBtn"
      class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
    >
      ${t("textToDecimal")}
    </button>
    <button
      id="decimalToTextBtn"
      class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-white"
    >
      ${t("decimalToText")}
    </button>
  </div>

  <div class="mt-2 flex gap-2">
    <textarea
      id="decimalTextOutput"
      rows="3"
      readonly
      class="p-2 rounded w-full text-sm bg-gray-100 dark:bg-gray-900 text-green-700 dark:text-green-400 border border-gray-300 dark:border-gray-700"
      placeholder="${t("outputPlaceholder")}"
    ></textarea>
    <button
      id="decimalCopyBtn"
      class="px-2 py-1 rounded self-start bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
    >
      ${tGlobal("copy")}
    </button>
  </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const inputEl = document.getElementById("decimalTextInput");
    const outputEl = document.getElementById("decimalTextOutput");
    const copyBtn = document.getElementById("decimalCopyBtn");

    document
      .getElementById("textToDecimalBtn")
      .addEventListener("click", () => {
        const input = inputEl.value;
        const decimals = [...input].map((c) => c.charCodeAt(0)).join(" ");
        outputEl.value = decimals;
      });

    document
      .getElementById("decimalToTextBtn")
      .addEventListener("click", () => {
        const input = inputEl.value.trim();
        try {
          const text = input
            .split(/\s+/)
            .map((n) => String.fromCharCode(parseInt(n, 10)))
            .join("");
          outputEl.value = text;
        } catch (e) {
          outputEl.value = t("decodeError");
        }
      });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(outputEl.value).then(() => {
        const original = copyBtn.innerText;
        copyBtn.innerText = tGlobal("copied");
        setTimeout(() => {
          copyBtn.innerText = original;
        }, 1500);
      });
    });
  },
};

export default decimal_text_converter;
