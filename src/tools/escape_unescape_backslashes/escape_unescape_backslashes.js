import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const escape_unescape_backslashes = {
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
  <div class="p-4 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm space-y-4">
    <div class="flex items-center gap-4">
      <label><input type="radio" name="modoBarra" value="escape" checked> ${t(
        "escape"
      )}</label>
      <label><input type="radio" name="modoBarra" value="unescape"> ${t(
        "unescape"
      )}</label>
    </div>

    <div>
      <label class="block mb-1 text-gray-700 dark:text-gray-300">${t(
        "inputLabel"
      )}</label>
      <textarea
        id="entradaBarra"
        class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-32 font-mono"
      ></textarea>
    </div>

    <button
      id="btnConverterBarra"
      class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded"
    >
      ${t("convert")}
    </button>

    <div>
      <label class="block mb-1 text-gray-700 dark:text-gray-300">${t(
        "outputLabel"
      )}</label>
      <textarea
        id="saidaBarra"
        readonly
        class="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 h-32 font-mono"
      ></textarea>
      <button
        id="btnCopiarBarra"
        class="mt-2 px-3 py-1 text-white bg-gray-700 hover:bg-gray-600 rounded"
      >
        ${tGlobal("copy")}
      </button>
    </div>
  </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const entrada = document.getElementById("entradaBarra");
    const saida = document.getElementById("saidaBarra");
    const botao = document.getElementById("btnConverterBarra");
    const botaoCopiar = document.getElementById("btnCopiarBarra");

    const escaparTexto = (str) =>
      str
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
        .replace(/"/g, '\\"')
        .replace(/'/g, "\\'");

    const desescaparTexto = (str) =>
      str
        .replace(/\\\\/g, "\\")
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'");

    botao.onclick = () => {
      const modo = document.querySelector(
        'input[name="modoBarra"]:checked'
      ).value;
      saida.value =
        modo === "escape"
          ? escaparTexto(entrada.value)
          : desescaparTexto(entrada.value);
    };

    botaoCopiar.onclick = () => {
      navigator.clipboard.writeText(saida.value).then(() => {
        const original = botaoCopiar.textContent;
        botaoCopiar.textContent = tGlobal("copied");
        setTimeout(() => (botaoCopiar.textContent = original), 1500);
      });
    };
  },
};

export default escape_unescape_backslashes;
