import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const hexadecimal_decimal_converter = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.1",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
    <textarea 
      id="hexDecInput" 
      class="w-full p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded mb-2" 
      rows="3" 
      placeholder="${t("placeholder")}"
    ></textarea>

    <div class="flex gap-2 mb-2">
      <button id="hexToDecBtn" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white">${t(
        "hexToDec"
      )}</button>
      <button id="decToHexBtn" class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-white">${t(
        "decToHex"
      )}</button>
    </div>

    <div class="relative">
      <pre 
        id="hexDecOutput" 
        class="mt-2 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-900 text-green-600 dark:text-green-400 p-2 rounded whitespace-pre-wrap break-words pr-12 p-6"
      ></pre>
      
      <button 
        id="copyHexDec" 
        class="absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-2 py-1 rounded text-sm text-gray-800 dark:text-white"
      >
        ${tGlobal("copy")}
      </button>
      
      <span 
        id="copiedHexDec" 
        class="absolute top-2 right-2 text-green-500 dark:text-green-400 px-2 py-1 text-sm hidden"
      >
        ${tGlobal("copied")}
      </span>
    </div>
    `;
  },

  init() {
    const outputEl = document.getElementById("hexDecOutput");
    const copyBtn = document.getElementById("copyHexDec");
    const copiedMsg = document.getElementById("copiedHexDec");

    document.getElementById("hexToDecBtn").addEventListener("click", () => {
      try {
        const input = document.getElementById("hexDecInput").value.trim();
        const output = input
          .split(/\s+/)
          .map((h) => parseInt(h, 16))
          .join(" ");
        outputEl.innerText = output;
      } catch (e) {
        outputEl.innerText = "Erro: " + e.message;
      }
    });

    document.getElementById("decToHexBtn").addEventListener("click", () => {
      try {
        const input = document.getElementById("hexDecInput").value.trim();
        const output = input
          .split(/\s+/)
          .map((d) => parseInt(d, 10).toString(16))
          .join(" ");
        outputEl.innerText = output;
      } catch (e) {
        outputEl.innerText = "Erro: " + e.message;
      }
    });

    copyBtn.addEventListener("click", () => {
      const text = outputEl.innerText;
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        copiedMsg.classList.remove("hidden");
        copyBtn.classList.add("hidden");

        setTimeout(() => {
          copiedMsg.classList.add("hidden");
          copyBtn.classList.remove("hidden");
        }, 2000);
      });
    });
  },
};

export default hexadecimal_decimal_converter;
