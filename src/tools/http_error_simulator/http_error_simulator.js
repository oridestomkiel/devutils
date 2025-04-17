import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const http_error_simulator = {
  i18n: {},
  descriptions: {},

  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  async loadDescriptions() {
    const res = await fetch("./data/http-codes.json");
    this.descriptions = await res.json();
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
      <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">${t(
        "label"
      )}</label>
      
      <input 
        id="httpCode" 
        type="number" min="100" max="599" placeholder="${t("placeholder")}"
        class="w-full p-2 bg-white border border-gray-300 rounded mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
      />
      
      <button 
        id="httpSimBtn"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white dark:bg-blue-500 dark:hover:bg-indigo-600"
      >
        ${t("simulate")}
      </button>
      
      <div 
        id="httpSimOutput"
        class="mt-4 text-sm text-left text-gray-800 dark:text-gray-200 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-900 p-6 space-y-4"
      ></div>
    `;
  },

  async init() {
    const t = (key) => this.i18n?.[key] ?? key;
    this.loadDescriptions().then(() => {
      document.getElementById("httpSimBtn").addEventListener("click", () => {
        const code = document.getElementById("httpCode").value.trim();
        const output = document.getElementById("httpSimOutput");

        if (!code || isNaN(code)) {
          output.innerHTML = `❌ ${t("invalidCode")}`;
          return;
        }

        const desc =
          this.descriptions[code] || this.descriptions[code[0] + "xx"];
        const short = desc?.short ?? t("unknownStatus");
        const large = desc?.large ?? t("noDescription");

        output.innerHTML = `
        <p><strong>🔢 ${t("status")}:</strong> ${code} - ${short}</p>
        <p class="text-sm text-gray-700 dark:text-gray-300">${large}</p>
        <img src="https://http.cat/${code}" alt="HTTP cat for ${code}" class="mx-auto rounded max-w-xs mt-4 border dark:border-gray-700" />
        <p class="mt-4 text-center">
          🔗 <a href="https://httpstat.us/${code}" target="_blank" class="underline text-blue-400">${t(
          "viewFull"
        )}</a>
        </p>
      `;
      });
    });
  },
};

export default http_error_simulator;
