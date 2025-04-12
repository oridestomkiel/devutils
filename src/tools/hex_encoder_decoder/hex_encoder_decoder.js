import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const hex_encoder_decoder = {
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
    <textarea
      id="hexInput"
      class="w-full p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded mb-2"
      rows="3"
      placeholder="${t("placeholder")}"
    ></textarea>

    <div class="flex gap-2">
      <button
        id="hexEncodeBtn"
        class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white"
      >
        ${t("encode")}
      </button>
      <button
        id="hexDecodeBtn"
        class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-white"
      >
        ${t("decode")}
      </button>
    </div>

    <div class="mt-2 flex gap-2">
      <textarea
        id="hexOutput"
        rows="3"
        readonly
        class="w-full p-2 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-700 text-gray-800 dark:text-green-400 rounded text-sm"
        placeholder="${t("resultPlaceholder")}"
      ></textarea>
      <button
        id="hexCopyBtn"
        class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-2 py-1 rounded self-start text-gray-900 dark:text-white"
      >
        ${tGlobal("copy")}
      </button>
    </div>
    `;
  },

  init() {
    const encodeHex = (str) =>
      [...str]
        .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(" ");

    const decodeHex = (hex) =>
      hex
        .trim()
        .split(/\s+/)
        .map((h) => String.fromCharCode(parseInt(h, 16)))
        .join("");

    document.getElementById("hexEncodeBtn").addEventListener("click", () => {
      const input = document.getElementById("hexInput").value;
      document.getElementById("hexOutput").value = encodeHex(input);
    });

    document.getElementById("hexDecodeBtn").addEventListener("click", () => {
      const input = document.getElementById("hexInput").value;
      try {
        document.getElementById("hexOutput").value = decodeHex(input);
      } catch (e) {
        document.getElementById("hexOutput").value = "❌ HEX inválido.";
      }
    });

    document.getElementById("hexCopyBtn").addEventListener("click", () => {
      const outputEl = document.getElementById("hexOutput");
      navigator.clipboard.writeText(outputEl.value).then(() => {
        const btn = document.getElementById("hexCopyBtn");
        const original = btn.innerText;
        btn.innerText = tGlobal("copied");
        setTimeout(() => {
          btn.innerText = original;
        }, 1500);
      });
    });
  },
};

export default hex_encoder_decoder;
