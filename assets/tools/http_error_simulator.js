import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const http_error_simulator = {
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
        class="mt-4 text-sm text-center break-words text-gray-800 dark:text-gray-200 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-900 p-6"
      ></div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    document.getElementById("httpSimBtn").addEventListener("click", () => {
      const code = document.getElementById("httpCode").value.trim();
      const output = document.getElementById("httpSimOutput");

      if (!code || isNaN(code)) {
        output.innerHTML = `❌ ${t("invalidCode")}`;
        return;
      }

      output.innerHTML = `${tGlobal("loading")}...`;

      fetch(`https://httpstat.us/${code}`)
        .then((res) => {
          output.innerHTML = `
            🧾 <strong>${t("status")}:</strong> ${res.status} ${
            res.statusText
          }<br/>
            🔗 <a href="https://httpstat.us/${code}" target="_blank" class="underline text-blue-400">${t(
            "viewFull"
          )}</a>
          `;
        })
        .catch((err) => {
          output.innerHTML = `❌ ${t("error")} ${err.message}`;
        });
    });
  },
};

export default http_error_simulator;
