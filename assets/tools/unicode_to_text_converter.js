import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const unicode_to_text_converter = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "2.1.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
      <textarea id="unicodeInput" class="w-full p-2 bg-white border border-gray-300 text-black rounded mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white" rows="4" placeholder="${t(
        "input_placeholder"
      )}"></textarea>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
        <select id="unicodeMode" class="w-full p-2 bg-white border border-gray-300 text-black rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white">
          <option value="unicode">${t("option_unicode")}</option>
          <option value="utf8">${t("option_utf8")}</option>
          <option value="hex">${t("option_hex")}</option>
        </select>
        <select id="unicodeFilter" class="w-full p-2 bg-white border border-gray-300 text-black rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white">
          <option value="all">${t("filter_all")}</option>
          <option value="accents">${t("filter_accents")}</option>
          <option value="specials">${t("filter_specials")}</option>
          <option value="cedilla">${t("filter_cedilla")}</option>
        </select>
      </div>

      <div class="flex gap-2 mb-2">
        <button id="textToUnicodeBtn" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white">${t(
          "convert_unicode"
        )}</button>
        <button id="unicodeToTextBtn" class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-white">${t(
          "convert_text"
        )}</button>
      </div>

      <div class="relative">
        <textarea id="unicodeOutput" class="w-full p-2 bg-white border border-gray-300 text-green-600 rounded pr-20 dark:bg-gray-700 dark:border-gray-700 dark:text-green-400" rows="4" readonly placeholder="${t(
          "output_placeholder"
        )}"></textarea>
        <button id="copyUnicodeBtn" class="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-sm text-white">${tGlobal(
          "copy"
        )}</button>
        <span id="copiedUnicodeMsg" class="absolute top-2 right-2 text-green-400 px-2 py-1 hidden">${tGlobal(
          "copied"
        )}</span>
      </div>
    `;
  },

  init() {
    const input = document.getElementById("unicodeInput");
    const output = document.getElementById("unicodeOutput");
    const mode = document.getElementById("unicodeMode");
    const filter = document.getElementById("unicodeFilter");
    const copyBtn = document.getElementById("copyUnicodeBtn");
    const copiedMsg = document.getElementById("copiedUnicodeMsg");

    const encodeChar = (char, type) => {
      const code = char.charCodeAt(0);
      if (type === "unicode") return "\\u" + code.toString(16).padStart(4, "0");
      if (type === "utf8") return "\\x" + code.toString(16).padStart(2, "0");
      return code.toString(16);
    };

    const shouldConvert = (char, rule) => {
      const isAccent = /[\u0300-\u036f\u00C0-\u00FF]/.test(
        char.normalize("NFD")
      );
      const isSpecial = /[^\w\s]/.test(char);
      const isCedilla = /[çÇ]/.test(char);

      switch (rule) {
        case "all":
          return true;
        case "accents":
          return isAccent;
        case "specials":
          return isSpecial;
        case "cedilla":
          return isCedilla;
      }
    };

    const convertTextToUnicode = () => {
      const val = input.value.trim();
      const selectedMode = mode.value;
      const selectedFilter = filter.value;

      const result = [...val]
        .map((c) =>
          shouldConvert(c, selectedFilter) ? encodeChar(c, selectedMode) : c
        )
        .join("");

      output.value = result;
    };

    const convertUnicodeToText = () => {
      const val = input.value.trim();
      try {
        const decoded = val
          .replace(/\\u([\dA-Fa-f]{4})/g, (_, hex) =>
            String.fromCharCode(parseInt(hex, 16))
          )
          .replace(/\\x([\dA-Fa-f]{2})/g, (_, hex) =>
            String.fromCharCode(parseInt(hex, 16))
          );
        output.value = decoded;
      } catch (e) {
        output.value = "Erro: " + e.message;
      }
    };

    document
      .getElementById("textToUnicodeBtn")
      .addEventListener("click", convertTextToUnicode);
    document
      .getElementById("unicodeToTextBtn")
      .addEventListener("click", convertUnicodeToText);

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

export default unicode_to_text_converter;
