import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const validador_de_cpf = {
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
        id="cpfValInput"
        type="text"
        class="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder="${t("placeholder_input")}"
      />

      <button
        id="cpfValBtn"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        ${t("validate")}
      </button>

      <div class="mt-2 flex gap-2">
        <input
          id="cpfValOutput"
          type="text"
          value=""
          readonly
          class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-green-700 dark:text-green-400"
          placeholder="${t("placeholder_output")}"
        />
        <button
          id="cpfValCopyBtn"
          class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
        >
          ${tGlobal("copy")}
        </button>
      </div>
    `;
  },

  init() {
    const cpfValInput = document.getElementById("cpfValInput");
    const cpfValBtn = document.getElementById("cpfValBtn");
    const cpfValOutput = document.getElementById("cpfValOutput");
    const cpfValCopyBtn = document.getElementById("cpfValCopyBtn");
    const t = (key) => this.i18n?.[key] ?? key;

    const limpar = (str) => str.replace(/\D/g, "");

    const validarCPF = (cpf) => {
      cpf = limpar(cpf);

      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

      const calcDv = (base, peso) => {
        const soma = base
          .split("")
          .reduce((acc, val, idx) => acc + parseInt(val) * (peso - idx), 0);
        const resto = (soma * 10) % 11;
        return resto === 10 ? 0 : resto;
      };

      const digitos = cpf.slice(0, 9);
      const dv1 = calcDv(digitos, 10);
      const dv2 = calcDv(digitos + dv1, 11);

      return cpf === digitos + dv1 + dv2;
    };

    cpfValBtn.addEventListener("click", () => {
      const inputValue = cpfValInput.value;

      cpfValOutput.classList.remove("text-green-400", "text-red-400");

      if (validarCPF(inputValue)) {
        cpfValOutput.value = t("valid");
        cpfValOutput.classList.add("text-green-400");
      } else {
        cpfValOutput.value = t("invalid");
        cpfValOutput.classList.add("text-red-400");
      }
    });

    cpfValCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(cpfValOutput.value).then(() => {
        const originalText = cpfValCopyBtn.innerText;
        cpfValCopyBtn.innerText = t("copied");
        setTimeout(() => {
          cpfValCopyBtn.innerText = tGlobal("copy");
        }, 1500);
      });
    });
  },
};

export default validador_de_cpf;
