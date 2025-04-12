import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const random_password_generator = {
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
      <div class="flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
        <label for="pwLength" class="text-sm">${t("length")}</label>
        <input
          id="pwLength"
          type="number"
          min="4"
          max="64"
          value="16"
          class="p-2 rounded w-24 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div class="grid grid-cols-2 gap-4 mb-4 text-gray-900 dark:text-white">
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" id="pwSymbols" class="accent-blue-600" checked />
          <span>${t("include_symbols")}</span>
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" id="pwNumbers" class="accent-blue-600" checked />
          <span>${t("include_numbers")}</span>
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" id="pwUppercase" class="accent-blue-600" checked />
          <span>${t("include_uppercase")}</span>
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" id="pwLowercase" class="accent-blue-600" checked />
          <span>${t("include_lowercase")}</span>
        </label>
      </div>

      <button
        id="pwGenBtn"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        ${t("generate")}
      </button>

      <div class="mt-4 flex gap-2">
        <input
          id="pwOutput"
          type="text"
          value="${t("click_to_generate")}"
          readonly
          class="p-2 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-green-400 font-mono"
        />
        <button
          id="pwCopyBtn"
          class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-3 py-1 rounded"
        >
          ${tGlobal("copy")}
        </button>
      </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const charset = {
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      numbers: "0123456789",
      symbols: "!@#$%&*-=+_?<>",
    };

    const generatePassword = (length, useSymbols, useNumbers, useUpper) => {
      let base = charset.lowercase;
      if (useUpper) base += charset.uppercase;
      if (useNumbers) base += charset.numbers;
      if (useSymbols) base += charset.symbols;

      if (!base) return `❌ ${t("select_one_type")}`;

      return Array.from(
        { length },
        () => base[Math.floor(Math.random() * base.length)]
      ).join("");
    };

    document.getElementById("pwGenBtn").addEventListener("click", () => {
      const length = parseInt(document.getElementById("pwLength").value);
      const useSymbols = document.getElementById("pwSymbols").checked;
      const useNumbers = document.getElementById("pwNumbers").checked;
      const useUpper = document.getElementById("pwUppercase").checked;

      const senha = generatePassword(length, useSymbols, useNumbers, useUpper);
      document.getElementById("pwOutput").value = senha;
    });

    document.getElementById("pwCopyBtn").addEventListener("click", () => {
      const senha = document.getElementById("pwOutput").value;
      navigator.clipboard.writeText(senha).then(() => {
        const btn = document.getElementById("pwCopyBtn");
        const original = btn.innerText;
        btn.innerText = tGlobal("copied");
        setTimeout(() => (btn.innerText = tGlobal("copy")), 1500);
      });
    });
  },
};

export default random_password_generator;
