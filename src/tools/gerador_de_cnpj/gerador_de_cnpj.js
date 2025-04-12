import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const gerador_de_cnpj = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "2.0.0",

  render() {
    const t = (k) => this.i18n?.[k] ?? k;
    return `
    <div class="space-y-4 text-gray-900 dark:text-white">
      <div class="flex items-center gap-4 flex-wrap">
        <label class="text-sm flex items-center gap-2">
          <input type="checkbox" id="cnpjFormatCheck" class="accent-blue-600" checked />
          <span>${t("format")}</span>
        </label>

        <label class="text-sm flex items-center gap-2">
          <input type="checkbox" id="cnpjMultiCheck" class="accent-blue-600" />
          <span>${t("generateMultiple")}</span>
        </label>

        <label class="text-sm flex items-center gap-2">
          <input type="checkbox" id="cnpjFilialCheck" class="accent-blue-600" />
          <span>${t("simulateBranch")}</span>
        </label>

        <input
          type="number"
          id="cnpjQtd"
          class="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 p-1 rounded w-20 text-sm"
          value="10"
          min="1"
          max="1000"
        />
      </div>

      <button
        id="cnpjBtn"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        ${t("generate")}
      </button>

      <div class="mt-2">
        <textarea
          id="cnpjOutput"
          readonly
          class="p-2 w-full h-40 resize-none font-mono rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-green-400 border border-gray-300 dark:border-gray-600"
          placeholder="${t("placeholder")}"
        ></textarea>
      </div>

      <button
        id="cnpjCopyBtn"
        class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded"
      >
        ${tGlobal("copy")}
      </button>
    </div>
    `;
  },

  init() {
    const t = (k) => this.i18n?.[k] ?? k;
    const $ = (id) => document.getElementById(id);
    const output = $("cnpjOutput");

    const formatCNPJ = (raw) =>
      raw.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");

    const calcDV = (base) => {
      const calc = (nums, pesos) =>
        nums
          .split("")
          .reduce((sum, digit, i) => sum + parseInt(digit) * pesos[i], 0);

      const d1Raw = calc(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
      const d1 = d1Raw % 11 < 2 ? 0 : 11 - (d1Raw % 11);

      const d2Raw = calc(base + d1, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
      const d2 = d2Raw % 11 < 2 ? 0 : 11 - (d2Raw % 11);

      return base + d1 + d2;
    };

    const gerarRaiz = () =>
      Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join("");

    const gerarCNPJs = () => {
      const formatar = $("cnpjFormatCheck").checked;
      const multiplo = $("cnpjMultiCheck").checked;
      const filial = $("cnpjFilialCheck").checked;
      const qtd = parseInt($("cnpjQtd").value) || 1;

      let lista = [];

      if (multiplo) {
        if (filial) {
          const raiz = gerarRaiz();
          for (let i = 1; i <= qtd; i++) {
            const sufixo = i.toString().padStart(4, "0");
            const raw = calcDV(raiz + sufixo);
            lista.push(formatar ? formatCNPJ(raw) : raw);
          }
        } else {
          for (let i = 0; i < qtd; i++) {
            const raw = calcDV(gerarRaiz() + "0001");
            lista.push(formatar ? formatCNPJ(raw) : raw);
          }
        }
      } else {
        const raw = calcDV(gerarRaiz() + "0001");
        lista.push(formatar ? formatCNPJ(raw) : raw);
      }

      output.value = lista.join("\n");
    };

    $("cnpjBtn").addEventListener("click", gerarCNPJs);
    $("cnpjMultiCheck").addEventListener("change", gerarCNPJs);
    $("cnpjFilialCheck").addEventListener("change", gerarCNPJs);
    $("cnpjFormatCheck").addEventListener("change", gerarCNPJs);
    $("cnpjQtd").addEventListener("input", gerarCNPJs);

    $("cnpjCopyBtn").addEventListener("click", () => {
      navigator.clipboard.writeText(output.value).then(() => {
        const original = $("cnpjCopyBtn").innerText;
        $("cnpjCopyBtn").innerText = tGlobal("copied");
        setTimeout(() => ($("cnpjCopyBtn").innerText = tGlobal("copy")), 1500);
      });
    });

    gerarCNPJs();
  },
};

export default gerador_de_cnpj;
