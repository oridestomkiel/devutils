import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const shannon_entropy = {
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
      id="entropyInput"
      class="w-full p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded mb-2"
      rows="5"
      placeholder="${t("placeholder")}"
    ></textarea>

    <div class="flex gap-2 mb-2">
      <button id="entropyBtn" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white">${t(
        "calculate"
      )}</button>
      <button id="entropyClear" class="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 px-3 py-1 rounded text-gray-900 dark:text-white hidden">${tGlobal(
        "clear"
      )}</button>
      <button id="entropyCopy" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white hidden">${tGlobal(
        "copy"
      )}</button>
    </div>

    <pre id="entropyOutput" class="text-green-700 dark:text-green-400 bg-white dark:bg-gray-900 whitespace-pre-wrap break-words p-2 my-4 border border-gray-300 dark:border-gray-700 rounded hidden"></pre>

    <p class="text-sm text-gray-700 dark:text-gray-400">
      ${t("max")}: <strong>8.0</strong><br>
      ${t("english")}: <strong>3.5 - 5.0</strong><br>
      ${t("compressed")}: <strong>7.5+</strong><br>
      ${t("source")}:
      <a href="https://wikipedia.org/wiki/Entropy_(information_theory)" target="_blank" class="underline text-blue-600 dark:text-blue-400">
        Wikipedia
      </a>
    </p>
    `;
  },

  init() {
    const input = document.getElementById("entropyInput");
    const output = document.getElementById("entropyOutput");
    const copyBtn = document.getElementById("entropyCopy");
    const clearBtn = document.getElementById("entropyClear");
    const calcBtn = document.getElementById("entropyBtn");

    calcBtn.addEventListener("click", () => {
      const text = input.value;
      if (!text) return;

      const freq = {};
      for (const char of text) {
        freq[char] = (freq[char] || 0) + 1;
      }

      const len = text.length;
      let entropy = 0;
      for (const char in freq) {
        const p = freq[char] / len;
        entropy -= p * Math.log2(p);
      }

      output.innerText = `Entropia: ${entropy.toFixed(4)} bits por caractere`;
      output.classList.remove("hidden");
      copyBtn.classList.remove("hidden");
      clearBtn.classList.remove("hidden");
    });

    clearBtn.addEventListener("click", () => {
      input.value = "";
      output.innerText = "";
      output.classList.add("hidden");
      copyBtn.classList.add("hidden");
      clearBtn.classList.add("hidden");
    });

    copyBtn.addEventListener("click", () => {
      const text = output.innerText;
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        const original = copyBtn.innerText;
        copyBtn.innerText = tGlobal("copied");
        setTimeout(() => (copyBtn.innerText = tGlobal("copy")), 1500);
      });
    });
  },
};

export default shannon_entropy;
