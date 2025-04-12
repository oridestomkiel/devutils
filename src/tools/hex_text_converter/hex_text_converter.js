import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const hex_text_converter = {
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
      id="hexTextInput" 
      class="w-full p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded border border-gray-300 dark:border-gray-600 mb-2" 
      rows="4" 
      placeholder="${t("placeholder")}"
    ></textarea>

    <div class="flex gap-2 mb-2">
      <button id="textToHexBtn" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white">
        ${t("textToHex")}
      </button>
      <button id="hexToTextBtn" class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-white">
        ${t("hexToText")}
      </button>
    </div>

    <div class="relative">
      <pre 
        id="hexTextOutput" 
        class="mt-2 text-green-600 dark:text-green-400 bg-white dark:bg-gray-900 whitespace-pre-wrap break-words p-2 rounded border border-gray-300 dark:border-gray-700 pr-12 p-6"
      ></pre>
      <button 
        id="copyHexText" 
        class="absolute top-2 right-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 px-2 py-1 rounded text-gray-800 dark:text-white"
      >
        ${tGlobal("copy")}
      </button>
      <span 
        id="copiedHexText" 
        class="absolute top-2 right-2 text-green-600 dark:text-green-400 px-2 py-1 hidden"
      >
        ${tGlobal("copied")}
      </span>
    </div>
    `;
  },

  init() {
    const outputEl = document.getElementById("hexTextOutput");
    const copyBtn = document.getElementById("copyHexText");
    const copiedMsg = document.getElementById("copiedHexText");

    document.getElementById("textToHexBtn").addEventListener("click", () => {
      const input = document.getElementById("hexTextInput").value;
      const hex = [...input]
        .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(" ");
      outputEl.innerText = hex;
    });

    document.getElementById("hexToTextBtn").addEventListener("click", () => {
      const input = document
        .getElementById("hexTextInput")
        .value.replace(/\s+/g, "");
      try {
        const text = input
          .match(/.{1,2}/g)
          .map((h) => String.fromCharCode(parseInt(h, 16)))
          .join("");
        outputEl.innerText = text;
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

export default hex_text_converter;
