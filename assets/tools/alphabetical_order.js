import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const alphabetical_order = {
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
  <div class="p-4 rounded text-gray-800 text-sm space-y-4 dark:bg-gray-800 dark:text-white">
    <div>
      <label class="block mb-1">${t("label.original")}</label>
      <textarea
        id="inputTexto"
        rows="5"
        maxlength="10000"
        class="w-full p-2 rounded bg-white border border-gray-300 text-gray-800 dark:bg-gray-700 dark:border-gray-700 dark:text-white"
        placeholder="${t("placeholder.list")}"
      ></textarea>
      <div class="text-xs text-gray-600 mt-1 dark:text-gray-400">
        <span id="charCount">0</span>/10.000 caracteres
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block mb-1">${t("label.sortType")}</label>
        <select id="tipoOrdem" class="w-full p-2 rounded bg-white border border-gray-300 text-gray-800 dark:bg-gray-700 dark:border-gray-700 dark:text-white">
          <option value="asc">${t("option.asc")}</option>
          <option value="desc">${t("option.desc")}</option>
        </select>
      </div>
      <div>
        <label class="block mb-1">${t("label.separator")}</label>
        <select id="separador" class="w-full p-2 rounded bg-white border border-gray-300 text-gray-800 dark:bg-gray-700 dark:border-gray-700 dark:text-white">
          <option value="\\n">${t("option.linebreak")}</option>
          <option value=" ">${t("option.space")}</option>
          <option value=",">${t("option.comma")}</option>
          <option value=";">${t("option.semicolon")}</option>
        </select>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <input type="checkbox" id="removerDuplicados" class="accent-indigo-600" />
      <label for="removerDuplicados">${t("label.removeDuplicates")}</label>
    </div>

    <button
      id="btnOrdenar"
      class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm text-white dark:bg-indigo-500 dark:hover:bg-indigo-600"
    >
      ${t("button.sort")}
    </button>

    <div>
      <label class="block mb-1 mt-4">${t("label.sorted")}</label>
      <textarea
        id="resultado"
        rows="5"
        readonly
        class="w-full p-2 rounded bg-white border border-gray-300 text-green-600 dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
      ></textarea>
      <div class="flex gap-2 mt-2">
        <button
          id="btnCopiar"
          class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm text-white dark:bg-gray-600 dark:hover:bg-gray-500"
        >
          ${tGlobal("copy")}
        </button>
        <button
          id="btnDownload"
          class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm text-white dark:bg-gray-600 dark:hover:bg-gray-500"
        >
          ${t("button.download")}
        </button>
      </div>
    </div>
  </div>
    `;
  },

  init() {
    const input = document.getElementById("inputTexto");
    const resultado = document.getElementById("resultado");

    input.addEventListener("input", () => {
      document.getElementById("charCount").textContent = input.value.length;
    });

    document.getElementById("btnOrdenar").addEventListener("click", () => {
      const tipo = document.getElementById("tipoOrdem").value;
      const sep = document.getElementById("separador").value;
      const remover = document.getElementById("removerDuplicados").checked;

      let valores = input.value.split(new RegExp(sep));
      valores = valores.map((v) => v.trim()).filter((v) => v.length > 0);
      if (remover) valores = [...new Set(valores)];
      valores.sort((a, b) =>
        tipo === "asc" ? a.localeCompare(b) : b.localeCompare(a)
      );

      const saida = sep === "\\n" ? valores.join("\n") : valores.join(sep);
      resultado.value = saida;
    });

    document.getElementById("btnCopiar").addEventListener("click", () => {
      const btn = document.getElementById("btnCopiar");
      navigator.clipboard.writeText(resultado.value).then(() => {
        btn.textContent = tGlobal("copied");
        setTimeout(() => (btn.textContent = tGlobal("copy")), 1500);
      });
    });

    document.getElementById("btnDownload").addEventListener("click", () => {
      const blob = new Blob([resultado.value], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "ordenado.txt";
      link.click();
    });
  },
};

export default alphabetical_order;
