import { loadToolI18n } from "../../utils/i18n-loader.js";

const json_validator = {
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
      <textarea 
        id="jsonValidatorInput" 
        class="w-full p-2 bg-white border border-gray-300 rounded mb-2 text-gray-800 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400" 
        rows="6" 
        placeholder='${t("placeholder")}'
      ></textarea>

      <button 
        id="jsonValidatorBtn" 
        class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white dark:bg-green-500 dark:hover:bg-green-600"
      >
        ${t("validate")}
      </button>

      <p 
        id="jsonValidatorOutput" 
        class="mt-2 text-green-600 break-words dark:text-green-400 bg-white p-2 border border-gray-300 dark:border-gray-700"
      ></p>
    `;
  },

  init() {
    const t = (key) => json_validator.i18n?.[key] ?? key;

    document
      .getElementById("jsonValidatorBtn")
      .addEventListener("click", () => {
        const input = document.getElementById("jsonValidatorInput").value;
        const output = document.getElementById("jsonValidatorOutput");

        try {
          JSON.parse(input);
          output.innerText = t("valid");
        } catch (e) {
          output.innerText = `${t("invalid")}: ${e.message}`;
        }
      });
  },
};

export default json_validator;
