import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const mercosul_plate_generator = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
    <div class="gap-2">
      <div class="flex gap-2 items-center">
        <label class="text-sm text-gray-800 dark:text-gray-300">${t(
          "quantity"
        )}</label>
        <input
          type="number"
          id="mercosulQtd"
          min="1"
          value="1"
          class="w-20 bg-white border border-gray-300 text-gray-800 rounded p-1 dark:bg-gray-700 dark:border-gray-700 dark:text-white"
        />
      </div>

      <button
        id="gerarMercosulBtn"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white dark:bg-blue-500 dark:hover:bg-blue-600 m-5 ml-0"
      >
        ${tGlobal("generate")}
      </button>

      <div>
        <label class="text-sm text-gray-800 dark:text-gray-300">${t(
          "convert_label"
        )}</label>
        <input
          type="text"
          id="inputConversao"
          placeholder="${t("convert_placeholder")}"
          class="bg-white border border-gray-300 text-green-600 rounded p-1 w-full dark:bg-gray-700 dark:border-gray-700 dark:text-green-400 dark:placeholder-gray-400"
        />
        <button
          id="converterPlacaBtn"
          class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white dark:bg-gray-600 dark:hover:bg-gray-500 m-5 ml-0"
        >
          ${t("convert_button")}
        </button>
      </div>

      <textarea
        id="mercosulResultado"
        rows="6"
        readonly
        class="bg-white border border-gray-300 text-green-600 p-2 rounded w-full dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
      ></textarea>

      <div class="flex gap-2 mt-2">
        <button
          id="copiarMercosulBtn"
          class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white dark:bg-gray-600 dark:hover:bg-gray-500"
        >
          ${tGlobal("copy")}
        </button>
        <button
          id="exportarMercosulBtn"
          class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white dark:bg-gray-600 dark:hover:bg-gray-500"
        >
          ${t("export_csv")}
        </button>
      </div>
    </div>
    `;
  },

  init() {
    const gerarBtn = document.getElementById("gerarMercosulBtn");
    const copiarBtn = document.getElementById("copiarMercosulBtn");
    const exportarBtn = document.getElementById("exportarMercosulBtn");
    const converterBtn = document.getElementById("converterPlacaBtn");
    const resultado = document.getElementById("mercosulResultado");
    const inputConversao = document.getElementById("inputConversao");

    const letras = () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const digito = () => Math.floor(Math.random() * 10).toString();

    const gerarPlacaMercosul = () => {
      return [
        letras(),
        letras(),
        letras(),
        digito(),
        letras(),
        digito(),
        digito(),
      ].join("");
    };

    const converterAntigaParaMercosul = (placaAntiga) => {
      const match = placaAntiga.toUpperCase().match(/^([A-Z]{3})(\d{4})$/);
      if (!match) return "Formato inválido";
      const [_, letras, numeros] = match;

      const mapaConversao = {
        0: "A",
        1: "B",
        2: "C",
        3: "D",
        4: "E",
        5: "F",
        6: "G",
        7: "H",
        8: "I",
        9: "J",
      };

      const quartaLetra = mapaConversao[numeros[1]];
      if (!quartaLetra) return "Número inválido na placa";

      return letras + numeros[0] + quartaLetra + numeros.slice(2);
    };

    const exportarCSV = (placas) => {
      const csv = placas.map((p) => `"${p}"`).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "placas-mercosul.csv";
      a.click();
      URL.revokeObjectURL(url);
    };

    gerarBtn.addEventListener("click", () => {
      const qtd = parseInt(document.getElementById("mercosulQtd").value);
      const placas = Array.from({ length: qtd }, gerarPlacaMercosul);
      resultado.value = placas.join("\n");
    });

    copiarBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(resultado.value).then(() => {
        copiarBtn.textContent = tGlobal("copied");
        setTimeout(() => (copiarBtn.textContent = tGlobal("copy")), 1500);
      });
    });

    exportarBtn.addEventListener("click", () => {
      const linhas = resultado.value
        .trim()
        .split("\n")
        .filter((l) => l);
      if (linhas.length) exportarCSV(linhas);
    });

    converterBtn.addEventListener("click", () => {
      const convertido = converterAntigaParaMercosul(
        inputConversao.value.trim()
      );
      resultado.value = convertido;
    });
  },
};

export default mercosul_plate_generator;
