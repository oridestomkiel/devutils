import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const extract_emails_from_text = {
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
  <div class="p-4 rounded bg-gray-100 dark:bg-gray-800 text-sm space-y-4">
    <div>
      <label class="block mb-1 text-gray-700 dark:text-gray-300">${t(
        "inputLabel"
      )}</label>
      <textarea id="inputEmailTexto" rows="6" class="w-full p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600" placeholder="${t(
        "placeholder"
      )}"></textarea>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block mb-1 text-gray-700 dark:text-gray-300">${t(
          "sortLabel"
        )}</label>
        <select id="ordenarPor" class="w-full p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
          <option value="alfabeto">${t("sortAlphabetical")}</option>
          <option value="dominio">${t("sortDomain")}</option>
        </select>
      </div>
    </div>

    <button id="btnExtrair" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm text-white">
      ${t("extract")}
    </button>

    <div>
      <label class="block mb-1 mt-4 text-gray-700 dark:text-gray-300">${t(
        "outputLabel"
      )}</label>
      <textarea id="resultadoEmails" rows="6" readonly class="w-full p-2 rounded bg-white dark:bg-gray-700 text-green-700 dark:text-green-400 border border-gray-300 dark:border-gray-600"></textarea>
      <div class="flex gap-2 mt-2">
        <button id="btnCopiarEmails" class="bg-gray-300 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1 rounded text-sm text-gray-900 dark:text-white">${tGlobal(
          "copy"
        )}</button>
        <button id="btnDownloadEmails" class="bg-gray-300 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1 rounded text-sm text-gray-900 dark:text-white">${t(
          "download"
        )}</button>
      </div>
    </div>
  </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const input = document.getElementById("inputEmailTexto");
    const resultado = document.getElementById("resultadoEmails");

    document.getElementById("btnExtrair").addEventListener("click", () => {
      const texto = input.value;
      const ordenarPor = document.getElementById("ordenarPor").value;

      const encontrados = [
        ...texto.matchAll(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi),
      ].map((m) => m[0]);
      const unicos = [...new Set(encontrados)];

      let ordenados = [...unicos];

      if (ordenarPor === "alfabeto") {
        ordenados.sort((a, b) => a.localeCompare(b));
      } else if (ordenarPor === "dominio") {
        ordenados.sort((a, b) => {
          const domA = a.split("@")[1];
          const domB = b.split("@")[1];
          return domA.localeCompare(domB) || a.localeCompare(b);
        });
      }

      resultado.value = ordenados.join("\n");
    });

    document.getElementById("btnCopiarEmails").addEventListener("click", () => {
      navigator.clipboard.writeText(resultado.value).then(() => {
        const btn = document.getElementById("btnCopiarEmails");
        const original = btn.textContent;
        btn.textContent = tGlobal("copied");
        setTimeout(() => (btn.textContent = original), 1500);
      });
    });

    document
      .getElementById("btnDownloadEmails")
      .addEventListener("click", () => {
        const blob = new Blob([resultado.value], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "emails-extraidos.txt";
        link.click();
      });
  },
};

export default extract_emails_from_text;
