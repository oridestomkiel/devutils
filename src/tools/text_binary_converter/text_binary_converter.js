import { loadToolI18n } from "../../utils/i18n-loader.js";

const text_binary_converter = {
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
      id="binaryInput"
      class="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      rows="4"
      placeholder="${t("placeholder_input")}"
    ></textarea>

    <div class="flex gap-2">
      <button
        id="textToBinaryBtn"
        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
      >
        ${t("btn_text_to_bin")}
      </button>
      <button
        id="binaryToTextBtn"
        class="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
      >
        ${t("btn_bin_to_text")}
      </button>
    </div>

    <div class="mt-2 flex gap-2">
      <input
        id="binaryOutput"
        type="text"
        value=""
        readonly
        class="p-2 rounded w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-green-700 dark:text-green-400"
      />
      <button
        id="binaryCopyBtn"
        class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
      >
        ${t("copy")}
      </button>
    </div>
    `;
  },

  init() {
    const inputEl = document.getElementById("binaryInput");
    const outputEl = document.getElementById("binaryOutput");
    const textToBinBtn = document.getElementById("textToBinaryBtn");
    const binToTextBtn = document.getElementById("binaryToTextBtn");
    const copyBtn = document.getElementById("binaryCopyBtn");

    textToBinBtn.addEventListener("click", () => {
      const input = inputEl.value;
      const bin = [...input]
        .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
        .join(" ");
      outputEl.value = bin;
    });

    binToTextBtn.addEventListener("click", () => {
      try {
        const input = inputEl.value.trim();
        const chars = input
          .split(/\s+/)
          .map((b) => String.fromCharCode(parseInt(b, 2)));
        outputEl.value = chars.join("");
      } catch (e) {
        outputEl.value =
          this.i18n?.error_conversion ?? "Erro ao converter binário.";
      }
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(outputEl.value).then(() => {
        const original = copyBtn.innerText;
        copyBtn.innerText = this.i18n?.copied ?? "Copiado!";
        setTimeout(
          () => (copyBtn.innerText = this.i18n?.copy ?? "Copiar"),
          1500
        );
      });
    });
  },
};

export default text_binary_converter;
