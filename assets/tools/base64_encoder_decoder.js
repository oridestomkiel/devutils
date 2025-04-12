import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const base64_encoder_decoder = {
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
    id="base64Input"
    class="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
    rows="3"
    placeholder="${t("placeholder")}"
  ></textarea>

  <div class="flex gap-2">
    <button
      id="base64EncodeBtn"
      class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
    >
      ${t("encode")}
    </button>
    <button
      id="base64DecodeBtn"
      class="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
    >
      ${t("decode")}
    </button>
  </div>

  <div class="mt-2 flex gap-2">
    <input
      id="base64Output"
      type="text"
      value=""
      readonly
      class="p-2 rounded w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-green-700 dark:text-green-400"
    />
    <button
      id="base64CopyBtn"
      class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
    >
      ${tGlobal("copy")}
    </button>
  </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const inputEl = document.getElementById("base64Input");
    const outputEl = document.getElementById("base64Output");
    const encodeBtn = document.getElementById("base64EncodeBtn");
    const decodeBtn = document.getElementById("base64DecodeBtn");
    const copyBtn = document.getElementById("base64CopyBtn");

    encodeBtn.addEventListener("click", () => {
      const input = inputEl.value;
      outputEl.value = btoa(input);
    });

    decodeBtn.addEventListener("click", () => {
      try {
        const input = inputEl.value;
        outputEl.value = atob(input);
      } catch {
        outputEl.value = t("error.decode");
      }
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(outputEl.value).then(() => {
        const original = copyBtn.innerText;
        copyBtn.innerText = tGlobal("copied");
        setTimeout(() => (copyBtn.innerText = tGlobal("copy")), 1500);
      });
    });
  },
};

export default base64_encoder_decoder;
