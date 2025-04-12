import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const validador_de_cnpj = {
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
      <input
        id="cnpjInput"
        type="text"
        placeholder="${t("placeholder_input")}"
        class="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />

      <button
        id="validateCnpjBtn"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
      >
        ${t("validate")}
      </button>

      <div class="mt-2 flex gap-2">
        <input
          id="cnpjOutput"
          type="text"
          value=""
          readonly
          class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-green-700 dark:text-green-400"
        />
        <button
          id="cnpjCopyBtn"
          class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
        >
          ${tGlobal("copy")}
        </button>
      </div>
    `;
  },

  init() {
    const cnpjInput = document.getElementById("cnpjInput");
    const cnpjOutput = document.getElementById("cnpjOutput");
    const validateBtn = document.getElementById("validateCnpjBtn");
    const copyBtn = document.getElementById("cnpjCopyBtn");
    const t = (key) => this.i18n?.[key] ?? key;

    const validateCNPJ = (cnpj) => {
      cnpj = cnpj.replace(/[^\d]+/g, "");
      if (cnpj.length !== 14) return false;

      let tamanho = cnpj.length - 2;
      let numeros = cnpj.substring(0, tamanho);
      const digitos = cnpj.substring(tamanho);

      let soma = 0;
      let pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
      }

      let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      if (resultado !== parseInt(digitos.charAt(0), 10)) return false;

      tamanho += 1;
      numeros = cnpj.substring(0, tamanho);
      soma = 0;
      pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
      }

      resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      if (resultado !== parseInt(digitos.charAt(1), 10)) return false;

      return true;
    };

    validateBtn.addEventListener("click", () => {
      const cnpjValue = cnpjInput.value;
      const isValid = validateCNPJ(cnpjValue);

      cnpjOutput.classList.remove("text-green-400", "text-red-400");

      if (isValid) {
        cnpjOutput.value = t("valid_cnpj");
        cnpjOutput.classList.add("text-green-400");
      } else {
        cnpjOutput.value = t("invalid_cnpj");
        cnpjOutput.classList.add("text-red-400");
      }
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(cnpjOutput.value).then(() => {
        const originalText = copyBtn.innerText;
        copyBtn.innerText = t("copied");
        setTimeout(() => {
          copyBtn.innerText = tGlobal("copy");
        }, 1500);
      });
    });
  },
};

export default validador_de_cnpj;
