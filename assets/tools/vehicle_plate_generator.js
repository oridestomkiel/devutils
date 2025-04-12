import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const vehicle_plate_generator = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: true,
  license: "MIT",
  version: "1.2.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
      <div class="gap-2">
        <div class="flex gap-2 items-center m-4 ml-0">
          <label class="text-sm text-gray-800 dark:text-gray-300">${t(
            "label_quantity"
          )}</label>
          <input
            type="number"
            id="placaQuantidade"
            min="1"
            value="1"
            class="w-20 bg-white border border-gray-300 text-gray-800 rounded p-1 dark:bg-gray-700 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div class="flex gap-2 items-center m-4 ml-0">
          <label class="text-sm text-gray-800 dark:text-gray-300">${t(
            "label_state"
          )}</label>
          <select
            id="placaEstado"
            class="bg-white border border-gray-300 text-gray-800 p-1 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white"
          >
            <option value="">${t("any_state")}</option>
          </select>
        </div>

        <label class="text-sm flex gap-1 items-center text-gray-800 dark:text-gray-300 m-4 ml-0">
          <input type="checkbox" id="placaMascara" checked />
          ${t("label_mask")}
        </label>

        <button
          id="gerarPlacaBtn"
          class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white dark:bg-blue-500 dark:hover:bg-blue-600 m-4 ml-0 mt-0"
        >
          ${t("generate")}
        </button>

        <textarea
          id="placaResultado"
          rows="6"
          readonly
          class="bg-white border border-gray-300 text-green-600 p-2 rounded w-full dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
        ></textarea>

        <button
          id="placaCopiarBtn"
          class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white dark:bg-gray-600 dark:hover:bg-gray-500 mt-2"
        >
          ${tGlobal("copy")}
        </button>
      </div>
    `;
  },

  init: async function () {
    const t = (key) => this.i18n?.[key] ?? key;

    const gerarBtn = document.getElementById("gerarPlacaBtn");
    const copiarBtn = document.getElementById("placaCopiarBtn");
    const resultado = document.getElementById("placaResultado");
    const estadoSelect = document.getElementById("placaEstado");

    let placaData = [];

    try {
      const res = await fetch("/data/placas.json");
      placaData = await res.json();

      const estadosUnicos = [...new Set(placaData.map((p) => p.Estado))].sort();
      estadosUnicos.forEach((estado) => {
        const opt = document.createElement("option");
        opt.value = estado;
        opt.textContent = estado;
        estadoSelect.appendChild(opt);
      });
    } catch (err) {
      alert(t("error_loading"));
      return;
    }

    const gerarNumeros = () =>
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");

    const gerarPlaca = (estado, comMascara) => {
      const faixas = placaData.filter((p) => !estado || p.Estado === estado);
      if (faixas.length === 0) return t("no_data");

      const faixa = faixas[0];

      const gerarPrefixoDentroDaFaixa = (inicio, final) => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        const toIndex = (str) =>
          str.split("").reduce((acc, c, i) => acc * 26 + chars.indexOf(c), 0);

        const toStr = (num) => {
          let result = "";
          for (let i = 0; i < 3; i++) {
            result = chars[num % 26] + result;
            num = Math.floor(num / 26);
          }
          return result;
        };

        const startIndex = toIndex(inicio);
        const endIndex = toIndex(final);
        const randIndex =
          Math.floor(Math.random() * (endIndex - startIndex + 1)) + startIndex;

        return toStr(randIndex);
      };

      const letras = gerarPrefixoDentroDaFaixa(faixa.Inicio, faixa.Final);
      const numeros = gerarNumeros();

      return comMascara ? `${letras}-${numeros}` : `${letras}${numeros}`;
    };

    gerarBtn.addEventListener("click", () => {
      const qtd = parseInt(document.getElementById("placaQuantidade").value);
      const estado = estadoSelect.value;
      const comMascara = document.getElementById("placaMascara").checked;

      const placas = Array.from({ length: qtd }, () =>
        gerarPlaca(estado, comMascara)
      );
      resultado.value = placas.join("\n");
    });

    copiarBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(resultado.value).then(() => {
        const original = copiarBtn.innerText;
        copiarBtn.innerText = t("copied");
        setTimeout(() => {
          copiarBtn.innerText = tGlobal("copy");
        }, 1500);
      });
    });
  },
};

export default vehicle_plate_generator;
