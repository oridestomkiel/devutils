import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const hex_base64_converter = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render() {
    const t = (k) => this.i18n?.[k] ?? k;

    return `
    <textarea
      id="hexBase64Input"
      class="w-full p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded mb-2"
      rows="4"
      placeholder="${t("placeholder")}"
    ></textarea>

    <div class="flex gap-2">
      <button
        id="hexToBase64Btn"
        class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white" 
      >
        ${t("hexToBase64")}
      </button>
      <button
        id="base64ToHexBtn"
        class="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-white"
      >
        ${t("base64ToHex")}
      </button>
    </div>

    <div class="mt-2 flex gap-2">
      <textarea
        id="hexBase64Output"
        rows="4"
        readonly
        class="w-full p-2 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-700 text-gray-800 dark:text-green-400 rounded text-sm"
        placeholder="${t("outputPlaceholder")}"
      ></textarea>
      <button
        id="hexBase64CopyBtn"
        class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-2 py-1 rounded self-start text-gray-900 dark:text-white"
      >
        ${tGlobal("copy")}
      </button>
    </div>
    `;
  },

  init() {
    const toBase64 = (hex) => {
      const bytes = hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16));
      const bin = String.fromCharCode(...bytes);
      return btoa(bin);
    };

    const fromBase64 = (b64) => {
      const bin = atob(b64);
      return [...bin]
        .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("");
    };

    const outputEl = document.getElementById("hexBase64Output");

    document.getElementById("hexToBase64Btn").addEventListener("click", () => {
      try {
        const hex = document
          .getElementById("hexBase64Input")
          .value.replace(/\s+/g, "")
          .toLowerCase();
        if (!/^[0-9a-f]+$/.test(hex)) throw new Error("Hex inválido");
        outputEl.value = toBase64(hex);
      } catch (e) {
        outputEl.value = "Erro: " + e.message;
      }
    });

    document.getElementById("base64ToHexBtn").addEventListener("click", () => {
      try {
        const b64 = document.getElementById("hexBase64Input").value.trim();
        outputEl.value = fromBase64(b64);
      } catch (e) {
        outputEl.value = "Erro: " + e.message;
      }
    });

    document
      .getElementById("hexBase64CopyBtn")
      .addEventListener("click", () => {
        navigator.clipboard.writeText(outputEl.value).then(() => {
          const btn = document.getElementById("hexBase64CopyBtn");
          const original = btn.innerText;
          btn.innerText = tGlobal("copied");
          setTimeout(() => {
            btn.innerText = original;
          }, 1500);
        });
      });
  },
};

export default hex_base64_converter;
