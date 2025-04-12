import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const cpf = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "en");
  },

  render() {
    const t = (key) => this.i18n?.[key] ?? key;
    return `
      <div class="space-y-4 text-gray-900 dark:text-white">
        <div class="flex items-center gap-4 flex-wrap">
          <label class="text-sm flex items-center gap-2">
            <input type="checkbox" id="formatCheck" class="accent-blue-600" checked />
            <span>${tGlobal("mask")}</span>
          </label>
          <label class="text-sm flex items-center gap-2">
            <input type="checkbox" id="multiCheck" class="accent-blue-600" />
            <span>${tGlobal("multi")}</span>
          </label>
          <input
            type="number"
            id="cpfQtd"
            class="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 p-1 rounded w-20 text-sm"
            value="10" min="1" max="1000"
          />
        </div>
        <button
          id="cpfBtn"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          ${tGlobal("generate")}
        </button>
        <div class="mt-2">
          <textarea
            id="cpfOutput"
            readonly
            class="p-2 w-full h-40 resize-none font-mono rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-green-400 border border-gray-300 dark:border-gray-600"
            placeholder="${t("placeholder")}"
          ></textarea>
        </div>
        <button
          id="cpfCopyBtn"
          class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded"
        >
          ${tGlobal("copy")}
        </button>
      </div>
    `;
  },

  init() {
    const $ = (id) => document.getElementById(id);
    const output = $("cpfOutput");

    const calcDv = (base, peso) => {
      const soma = base
        .split("")
        .reduce((acc, val, idx) => acc + parseInt(val) * (peso - idx), 0);
      const dv = (soma * 10) % 11;
      return dv === 10 ? 0 : dv;
    };

    const generateCPFValido = () => {
      let digitos = "";
      for (let i = 0; i < 9; i++)
        digitos += Math.floor(Math.random() * 9).toString();
      const dv1 = calcDv(digitos, 10);
      const dv2 = calcDv(digitos + dv1, 11);
      return digitos + dv1 + dv2;
    };

    const formatCPF = (raw) =>
      raw.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");

    const gerarCPFs = () => {
      const formatar = $("formatCheck").checked;
      const multiplo = $("multiCheck").checked;
      const qtd = parseInt($("cpfQtd").value) || 1;
      const lista = [];

      for (let i = 0; i < (multiplo ? qtd : 1); i++) {
        const raw = generateCPFValido();
        lista.push(formatar ? formatCPF(raw) : raw);
      }

      output.value = lista.join("\n");
    };

    $("cpfBtn").addEventListener("click", gerarCPFs);
    $("multiCheck").addEventListener("change", gerarCPFs);
    $("formatCheck").addEventListener("change", gerarCPFs);
    $("cpfQtd").addEventListener("input", gerarCPFs);

    $("cpfCopyBtn").addEventListener("click", () => {
      navigator.clipboard.writeText(output.value).then(() => {
        const original = $("cpfCopyBtn").innerText;
        $("cpfCopyBtn").innerText = tGlobal("copied");
        setTimeout(() => ($("cpfCopyBtn").innerText = original), 1500);
      });
    });

    gerarCPFs();
  },
};

export default cpf;
