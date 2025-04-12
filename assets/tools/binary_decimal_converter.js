import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const binary_decimal_converter = {
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
      id="binDecInput"
      class="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      rows="3"
      placeholder="${t("placeholder")}"
    ></textarea>

    <div class="flex gap-2">
      <button
        id="binToDecBtn"
        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
      >
        ${t("bin.to.dec")}
      </button>
      <button
        id="decToBinBtn"
        class="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
      >
        ${t("dec.to.bin")}
      </button>
    </div>

    <div class="mt-2 flex gap-2">
      <input
        id="binDecOutput"
        type="text"
        value=""
        readonly
        class="p-2 rounded w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-green-700 dark:text-green-400"
      />
      <button
        id="binDecCopyBtn"
        class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
      >
        ${tGlobal("copy")}
      </button>
    </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const inputEl = document.getElementById("binDecInput");
    const outputEl = document.getElementById("binDecOutput");
    const binToDecBtn = document.getElementById("binToDecBtn");
    const decToBinBtn = document.getElementById("decToBinBtn");
    const copyBtn = document.getElementById("binDecCopyBtn");

    binToDecBtn.addEventListener("click", () => {
      try {
        const input = inputEl.value.trim();
        const output = input
          .split(/\s+/)
          .map((bin) => parseInt(bin, 2))
          .join(" ");
        outputEl.value = output;
      } catch (e) {
        outputEl.value = `${t("error.prefix")}: ${e.message}`;
      }
    });

    decToBinBtn.addEventListener("click", () => {
      try {
        const input = inputEl.value.trim();
        const output = input
          .split(/\s+/)
          .map((dec) => parseInt(dec, 10).toString(2))
          .join(" ");
        outputEl.value = output;
      } catch (e) {
        outputEl.value = `${t("error.prefix")}: ${e.message}`;
      }
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(outputEl.value).then(() => {
        const originalText = copyBtn.innerText;
        copyBtn.innerText = tGlobal("copied");
        setTimeout(() => {
          copyBtn.innerText = tGlobal("copy");
        }, 1500);
      });
    });
  },
};

export default binary_decimal_converter;
