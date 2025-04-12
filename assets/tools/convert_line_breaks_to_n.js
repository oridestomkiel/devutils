import { loadToolI18n } from "../../utils/i18n-loader.js";

const convert_line_breaks_to_n = {
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
    <div class="p-4 rounded bg-white text-gray-800 text-sm space-y-4 dark:bg-gray-800 dark:text-white">
      <div>
        <label class="block mb-1">${t("label.input")}</label>
        <textarea
          id="inputTexto"
          rows="6"
          class="w-full p-2 rounded bg-white border border-gray-300 text-gray-800 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
          placeholder="${t("placeholder.input")}"
        ></textarea>
      </div>

      <button
        id="btnConverter"
        class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm text-white dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        ${t("button.convert")}
      </button>

      <div>
        <label class="block mb-1 mt-4">${t("label.output")}</label>
        <textarea
          id="resultado"
          rows="6"
          readonly
          class="w-full p-2 rounded bg-white border border-gray-300 text-green-600 font-mono dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
        ></textarea>

        <div class="flex gap-2 mt-2">
          <button
            id="btnCopiar"
            class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm text-white dark:bg-gray-600 dark:hover:bg-gray-500"
          >
            ${t("button.copy")}
          </button>
          <button
            id="btnLimpar"
            class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm text-white dark:bg-gray-600 dark:hover:bg-gray-500"
          >
            ${t("button.clear")}
          </button>
        </div>
      </div>
    </div>
    `;
  },

  init() {
    const inputTexto = document.getElementById("inputTexto");
    const resultado = document.getElementById("resultado");

    document.getElementById("btnConverter").addEventListener("click", () => {
      const textoConvertido = inputTexto.value.replace(/\n/g, "\\n");
      resultado.value = textoConvertido;
    });

    document.getElementById("btnCopiar").addEventListener("click", () => {
      navigator.clipboard.writeText(resultado.value).then(() => {
        const btn = document.getElementById("btnCopiar");
        btn.textContent = "Copiado!";
        setTimeout(() => (btn.textContent = "Copiar"), 1500);
      });
    });

    document.getElementById("btnLimpar").addEventListener("click", () => {
      inputTexto.value = "";
      resultado.value = "";
    });
  },
};

export default convert_line_breaks_to_n;
