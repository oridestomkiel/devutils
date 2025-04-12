import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const text_to_binary_converter = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.3.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
    <textarea
      id="textBinaryInput"
      class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white"
      rows="4"
      placeholder="${t("input_placeholder")}"
    ></textarea>

    <div class="flex gap-2 mb-2">
      <button id="textToBinaryBtn" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white">
        ${t("text_to_binary")}
      </button>
      <button id="binaryToTextBtn" class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-white">
        ${t("binary_to_text")}
      </button>
    </div>

    <div class="relative">
      <textarea
        id="textBinaryOutput"
        class="w-full p-2 bg-white border border-gray-300 text-green-600 rounded pr-20 dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
        rows="4"
        readonly
        placeholder="${t("output_placeholder")}"
      ></textarea>
      <button
        id="copyTextBinaryBtn"
        class="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white text-xs"
      >
        ${tGlobal("copy")}
      </button>
      <span
        id="copiedTextBinaryMsg"
        class="absolute top-2 right-2 text-green-600 dark:text-green-400 px-2 py-1 hidden text-xs"
      >
        ${tGlobal("copied")}
      </span>
    </div>
    `;
  },

  init() {
    const input = document.getElementById("textBinaryInput");
    const output = document.getElementById("textBinaryOutput");
    const copyBtn = document.getElementById("copyTextBinaryBtn");
    const copiedMsg = document.getElementById("copiedTextBinaryMsg");

    document.getElementById("textToBinaryBtn").addEventListener("click", () => {
      const value = input.value.trim();
      if (!value) return (output.value = "");

      const binary = [...value]
        .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
        .join(" ");
      output.value = binary;
    });

    document.getElementById("binaryToTextBtn").addEventListener("click", () => {
      const value = input.value.trim();
      if (!value) return (output.value = "");

      try {
        const text = value
          .split(/\s+/)
          .map((b) => String.fromCharCode(parseInt(b, 2)))
          .join("");
        output.value = text;
      } catch (e) {
        output.value = "Erro: " + e.message;
      }
    });

    copyBtn.addEventListener("click", () => {
      const text = output.value;
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        copyBtn.classList.add("hidden");
        copiedMsg.classList.remove("hidden");

        setTimeout(() => {
          copiedMsg.classList.add("hidden");
          copyBtn.classList.remove("hidden");
        }, 2000);
      });
    });
  },
};

export default text_to_binary_converter;
