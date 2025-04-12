import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const boleto_bank_slip_validator = {
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
  <textarea
    id="boletoInput"
    class="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
    rows="2"
    placeholder="${t("placeholder")}"
  ></textarea>

  <button
    id="boletoValidateBtn"
    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
  >
    ${t("validate")}
  </button>

  <div class="mt-2 flex gap-2">
    <input
      id="boletoOutput"
      type="text"
      value=""
      readonly
      class="p-2 rounded w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-green-700 dark:text-green-400"
    />
    <button
      id="boletoCopyBtn"
      class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
    >
      ${tGlobal("copy")}
    </button>
  </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const boletoInput = document.getElementById("boletoInput");
    const boletoOutput = document.getElementById("boletoOutput");
    const validateBtn = document.getElementById("boletoValidateBtn");
    const copyBtn = document.getElementById("boletoCopyBtn");

    const modulo10 = (num) => {
      let soma = 0,
        peso = 2;
      for (let i = num.length - 1; i >= 0; i--) {
        let calc = num[i] * peso;
        if (calc > 9) calc = Math.floor(calc / 10) + (calc % 10);
        soma += calc;
        peso = peso === 2 ? 1 : 2;
      }
      const resto = soma % 10;
      return resto === 0 ? 0 : 10 - resto;
    };

    const isBoletoValido = (num) => {
      if (num.length === 47) {
        const campos = [
          { campo: num.slice(0, 9), dv: num[9] },
          { campo: num.slice(10, 20), dv: num[20] },
          { campo: num.slice(21, 31), dv: num[31] },
        ];
        return campos.every((c) => modulo10(c.campo) === parseInt(c.dv, 10));
      } else if (num.length === 48) {
        const campos = [
          { campo: num.slice(0, 11), dv: num[11] },
          { campo: num.slice(12, 23), dv: num[23] },
          { campo: num.slice(24, 35), dv: num[35] },
          { campo: num.slice(36, 47), dv: num[47] },
        ];
        return campos.every((c) => modulo10(c.campo) === parseInt(c.dv, 10));
      }
      return false;
    };

    const formatValor = (str) => {
      const val = parseInt(str, 10) / 100;
      return val.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    };

    validateBtn.addEventListener("click", () => {
      const input = boletoInput.value.replace(/\D/g, "");
      boletoOutput.value = "";

      if (input.length !== 47 && input.length !== 48) {
        boletoOutput.value = t("error.length");
        return;
      }

      if (!isBoletoValido(input)) {
        boletoOutput.value = t("error.dv");
        return;
      }

      let valor = "";
      if (input.length === 47) {
        valor = input.slice(37, 47);
      } else {
        valor = input.slice(4, 15);
      }

      boletoOutput.value = t("success").replace("{valor}", formatValor(valor));
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(boletoOutput.value).then(() => {
        const originalText = copyBtn.innerText;
        copyBtn.innerText = tGlobal("copied");
        setTimeout(() => {
          copyBtn.innerText = tGlobal("copy");
        }, 1500);
      });
    });
  },
};

export default boleto_bank_slip_validator;
