import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const gerador_de_rg = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.2.0",

  render() {
    const t = (k) => this.i18n?.[k] ?? k;

    return `
      <button
        id="rgGenBtn"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-2 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        ${t("generate")}
      </button>

      <div class="relative">
        <input
          id="rgOutput"
          type="text"
          readonly
          class="w-full p-3 bg-white border border-gray-300 text-green-600 rounded pr-20 dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
        />
        <button
          id="copyRgBtn"
          class="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white dark:bg-gray-500 dark:hover:bg-gray-400"
        >
          ${tGlobal("copy")}
        </button>
        <span
          id="copiedRgMsg"
          class="absolute top-2 right-2 text-green-600 dark:text-green-400 px-2 py-1 hidden"
        >
          ${tGlobal("copied")}
        </span>
      </div>
    `;
  },

  init() {
    const $ = (id) => document.getElementById(id);
    const output = $("rgOutput");
    const copyBtn = $("copyRgBtn");
    const copiedMsg = $("copiedRgMsg");

    const gerarRG = () => {
      const getRand = () => Math.floor(Math.random() * 10);
      const numeros = Array.from({ length: 8 }, getRand);

      let soma = 0;
      for (let i = 0; i < 8; i++) {
        soma += numeros[i] * (9 - i);
      }

      const resto = soma % 11;
      const dv = resto === 10 ? "X" : resto;

      const rg = `${numeros.join("")}${dv}`;
      return rg.replace(/(\d{2})(\d{3})(\d{3})([0-9X])/, "$1.$2.$3-$4");
    };

    $("rgGenBtn").addEventListener("click", () => {
      output.value = gerarRG();
    });

    copyBtn.addEventListener("click", () => {
      if (!output.value) return;

      navigator.clipboard.writeText(output.value).then(() => {
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

export default gerador_de_rg;
