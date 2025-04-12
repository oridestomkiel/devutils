import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const unit_converter = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "2.0.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
      <div class="gap-3 mb-4">
        <input 
          id="unitInput" 
          type="number" 
          class="w-full p-2 bg-white border border-gray-300 text-black rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white" 
          placeholder="${t("input_placeholder")}" 
        />
        <select 
          id="unitSelect" 
          class="w-full p-2 bg-white border border-gray-300 text-black rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white m-4 ml-0"
        ></select>
        <button id="unitConvertBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">${t(
          "convert"
        )}</button>
      </div>

      <div class="relative">
        <textarea 
          id="unitResult" 
          class="w-full p-2 bg-white border border-gray-300 text-green-600 rounded pr-20 dark:bg-gray-700 dark:border-gray-700 dark:text-green-400" 
          rows="3" 
          readonly 
          placeholder="${t("output_placeholder")}"
        ></textarea>
        <button 
          id="copyUnitBtn" 
          class="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-sm text-white"
        >
          ${tGlobal("copy")}
        </button>
        <span 
          id="copiedUnitMsg" 
          class="absolute top-2 right-2 text-green-400 px-2 py-1 hidden"
        >
          ${tGlobal("copied")}
        </span>
      </div>
    `;
  },

  init() {
    const input = document.getElementById("unitInput");
    const select = document.getElementById("unitSelect");
    const result = document.getElementById("unitResult");
    const copyBtn = document.getElementById("copyUnitBtn");
    const copiedMsg = document.getElementById("copiedUnitMsg");
    const t = (key) => this.i18n?.[key] ?? key;
    const conversions = {
      [t("conversions.Pixels ↔ Rem (base 16)")]: (val) =>
        `${val}px = ${(val / 16).toFixed(4)}rem\n${val}rem = ${(
          val * 16
        ).toFixed(2)}px`,

      [t("conversions.Celsius ↔ Fahrenheit")]: (val) =>
        `${val}°C = ${((val * 9) / 5 + 32).toFixed(1)}°F\n${val}°F = ${(
          ((val - 32) * 5) /
          9
        ).toFixed(1)}°C`,

      [t("conversions.Km ↔ Milhas")]: (val) =>
        `${val}km = ${(val * 0.621371).toFixed(3)}mi\n${val}mi = ${(
          val / 0.621371
        ).toFixed(3)}km`,

      [t("conversions.Metros ↔ Pés")]: (val) =>
        `${val}m = ${(val * 3.28084).toFixed(2)}ft\n${val}ft = ${(
          val / 3.28084
        ).toFixed(2)}m`,

      [t("conversions.Kg ↔ Libras")]: (val) =>
        `${val}kg = ${(val * 2.20462).toFixed(2)}lb\n${val}lb = ${(
          val / 2.20462
        ).toFixed(2)}kg`,

      [t("conversions.Horas ↔ Minutos ↔ Segundos")]: (val) =>
        `${val}h = ${val * 60}min = ${val * 3600}s`,

      [t("conversions.Centímetros ↔ Polegadas")]: (val) =>
        `${val}cm = ${(val / 2.54).toFixed(2)}in\n${val}in = ${(
          val * 2.54
        ).toFixed(2)}cm`,

      [t("conversions.Minutos ↔ Segundos")]: (val) =>
        `${val}min = ${val * 60}s\n${val}s = ${(val / 60).toFixed(2)}min`,

      [t("conversions.Dias ↔ Horas")]: (val) =>
        `${val}d = ${val * 24}h\n${val}h = ${(val / 24).toFixed(2)}d`,

      [t("conversions.Litros ↔ Galões (US)")]: (val) =>
        `${val}L = ${(val * 0.264172).toFixed(3)}gal (US)\n${val}gal = ${(
          val / 0.264172
        ).toFixed(3)}L`,

      [t("conversions.Litros ↔ Mililitros")]: (val) =>
        `${val}L = ${val * 1000}mL\n${val}mL = ${(val / 1000).toFixed(3)}L`,

      [t("conversions.Joules ↔ Calorias")]: (val) =>
        `${val}J = ${(val / 4.184).toFixed(2)}cal\n${val}cal = ${(
          val * 4.184
        ).toFixed(2)}J`,

      [t("conversions.Watts ↔ Cavalos de potência")]: (val) =>
        `${val}W = ${(val / 745.7).toFixed(3)}HP\n${val}HP = ${(
          val * 745.7
        ).toFixed(2)}W`,

      [t("conversions.Bytes ↔ KB ↔ MB")]: (val) =>
        `${val}B = ${(val / 1024).toFixed(2)}KB = ${(val / 1048576).toFixed(
          2
        )}MB`,

      [t("conversions.MB ↔ GB")]: (val) =>
        `${val}MB = ${(val / 1024).toFixed(2)}GB\n${val}GB = ${(
          val * 1024
        ).toFixed(2)}MB`,

      [t("conversions.Hectares ↔ Metros²")]: (val) =>
        `${val}ha = ${val * 10000}m²\n${val}m² = ${(val / 10000).toFixed(2)}ha`,

      [t("conversions.m² ↔ pés²")]: (val) =>
        `${val}m² = ${(val * 10.7639).toFixed(2)}ft²\n${val}ft² = ${(
          val / 10.7639
        ).toFixed(2)}m²`,

      [t("conversions.Bar ↔ Pascal")]: (val) =>
        `${val}bar = ${(val * 100000).toFixed(0)}Pa\n${val}Pa = ${(
          val / 100000
        ).toFixed(5)}bar`,
    };

    Object.keys(conversions).forEach((label) => {
      const opt = document.createElement("option");
      opt.value = label;
      opt.textContent = label;
      select.appendChild(opt);
    });

    document.getElementById("unitConvertBtn").addEventListener("click", () => {
      const val = parseFloat(input.value.trim());
      const type = select.value;

      if (isNaN(val)) return (result.value = t("invalid_input"));
      result.value = conversions[type](val);
    });

    copyBtn.addEventListener("click", () => {
      const text = result.value;
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
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

export default unit_converter;
