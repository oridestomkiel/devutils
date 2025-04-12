import { loadToolI18n } from "../../utils/i18n-loader.js";

const credit_card_validator = {
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
    <div class="p-4 rounded text-sm space-y-4 text-gray-800 dark:bg-gray-800 dark:text-white">
      <div>
        <label class="block mb-1">${t("label.input")}</label>
        <input
          type="text"
          id="cardNumber"
          placeholder="${t("placeholder.input")}"
          class="w-full p-2 rounded bg-white border border-gray-300 text-gray-800 dark:bg-gray-700 dark:border-gray-700 dark:text-white"
        />
      </div>

      <button id="btnValidar" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm text-white">
        ${t("button.validate")}
      </button>

      <div id="resultado" class="text-sm font-semibold mt-2 text-green-600 dark:text-green-400"></div>
    </div>
    `;
  },

  init() {
    const cardInput = document.getElementById("cardNumber");
    const resultado = document.getElementById("resultado");

    const validarLuhn = (numero) => {
      const limpo = numero.replace(/\D/g, "");
      let soma = 0;
      let par = false;
      for (let i = limpo.length - 1; i >= 0; i--) {
        let digito = parseInt(limpo[i]);
        if (par) {
          digito *= 2;
          if (digito > 9) digito -= 9;
        }
        soma += digito;
        par = !par;
      }
      return soma % 10 === 0;
    };

    const detectarBandeira = (num) => {
      const re = {
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$/,
        amex: /^3[47][0-9]{13}$/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
        jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
      };
      for (const [bandeira, regex] of Object.entries(re)) {
        if (regex.test(num)) return bandeira.toUpperCase();
      }
      return this.i18n?.["brand.unknown"] ?? "Desconhecida";
    };

    document.getElementById("btnValidar").addEventListener("click", () => {
      const numero = cardInput.value.replace(/\s+/g, "");
      if (!numero.match(/^\d{12,19}$/)) {
        resultado.textContent =
          this.i18n?.["result.error"] ?? "Número inválido ou incompleto.";
        resultado.className = "text-sm font-semibold text-yellow-400 mt-2";
        return;
      }

      const bandeira = detectarBandeira.call(this, numero);

      if (validarLuhn(numero)) {
        resultado.textContent = `${
          this.i18n?.["result.valid"] ?? "Válido"
        } (${bandeira})`;
        resultado.className = "text-sm font-semibold text-green-400 mt-2";
      } else {
        resultado.textContent = `${
          this.i18n?.["result.invalid"] ?? "Inválido"
        } (${bandeira})`;
        resultado.className = "text-sm font-semibold text-red-400 mt-2";
      }
    });
  },
};

export default credit_card_validator;
