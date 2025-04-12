import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const html_entity_encode_decode = {
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
    <div class="p-4 rounded bg-gray-100 dark:bg-gray-800 text-sm space-y-4 text-gray-800 dark:text-white">
      <div class="flex items-center gap-4">
        <label><input type="radio" name="htmlMode" value="encode" checked> ${t(
          "encode"
        )}</label>
        <label><input type="radio" name="htmlMode" value="decode"> ${t(
          "decode"
        )}</label>
      </div>

      <div>
        <label class="block mb-1">${t("input")}:</label>
        <textarea id="htmlInput" class="w-full p-2 rounded bg-white dark:bg-gray-700 dark:text-white text-black h-32 font-mono border border-gray-300 dark:border-gray-700"></textarea>
      </div>

      <button id="htmlEntityBtn" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">${t(
        "convert"
      )}</button>

      <div>
        <label class="block mb-1">${t("output")}:</label>
        <textarea id="htmlOutput" readonly class="w-full p-2 rounded bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 h-32 font-mono border border-gray-300 dark:border-gray-700"></textarea>
        <button id="copyHtmlEntity" class="mt-2 px-3 py-1 bg-gray-600 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-white">${tGlobal(
          "copy"
        )}</button>
        <span id="copiedHtmlEntityMsg" class="text-green-500 dark:text-green-400 ml-2 hidden">${tGlobal(
          "copied"
        )}</span>
      </div>
    </div>
    `;
  },

  init() {
    const input = document.getElementById("htmlInput");
    const output = document.getElementById("htmlOutput");
    const button = document.getElementById("htmlEntityBtn");
    const copyBtn = document.getElementById("copyHtmlEntity");
    const copiedMsg = document.getElementById("copiedHtmlEntityMsg");

    const encode = (str) => {
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    };

    const decode = (str) => {
      const div = document.createElement("div");
      div.innerHTML = str;
      return div.textContent;
    };

    button.onclick = () => {
      const mode = document.querySelector(
        'input[name="htmlMode"]:checked'
      ).value;
      output.value =
        mode === "encode" ? encode(input.value) : decode(input.value);
    };

    copyBtn.onclick = () => {
      navigator.clipboard.writeText(output.value).then(() => {
        copyBtn.classList.add("hidden");
        copiedMsg.classList.remove("hidden");
        setTimeout(() => {
          copiedMsg.classList.add("hidden");
          copyBtn.classList.remove("hidden");
        }, 1500);
      });
    };
  },
};

export default html_entity_encode_decode;
