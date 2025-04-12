import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const json_to_yaml_converter = {
  i18n: {},

  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.1",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
      <textarea 
        id="jsonToYamlInput" 
        class="w-full p-2 bg-white border border-gray-300 rounded mb-2 text-gray-800 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
        rows="6" 
        placeholder="${t("placeholder")}"
      ></textarea>

      <button 
        id="jsonToYamlBtn" 
        class="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded mb-2 text-white dark:bg-purple-500 dark:hover:bg-purple-600"
      >
        ${t("convert")}
      </button>

      <div class="relative">
        <pre 
          id="jsonToYamlOutput" 
          class="mt-2 bg-white border border-gray-300 text-green-600 whitespace-pre-wrap break-words pr-16 p-2 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-green-400 p-6"
        ></pre>

        <button 
          id="copyJsonYamlBtn" 
          class="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white dark:bg-gray-500 dark:hover:bg-gray-400"
        >
          ${tGlobal("copy")}
        </button>

        <span 
          id="copiedJsonYamlMsg" 
          class="absolute top-2 right-2 text-green-600 dark:text-green-400 px-2 py-1 hidden"
        >
          ${tGlobal("copied")}
        </span>
      </div>
    `;
  },

  init() {
    const t = (key) => json_to_yaml_converter.i18n?.[key] ?? key;

    const outputEl = document.getElementById("jsonToYamlOutput");
    const copyBtn = document.getElementById("copyJsonYamlBtn");
    const copiedMsg = document.getElementById("copiedJsonYamlMsg");

    const convert = () => {
      try {
        const input = document.getElementById("jsonToYamlInput").value;
        const obj = JSON.parse(input);
        const yaml = jsyaml.dump(obj);
        outputEl.innerText = yaml;
      } catch (e) {
        outputEl.innerText = `${t("error")}: ${e.message}`;
      }
    };

    const bindEvents = () => {
      document
        .getElementById("jsonToYamlBtn")
        .addEventListener("click", convert);

      copyBtn.addEventListener("click", () => {
        const text = outputEl.innerText;
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
    };

    if (!window.jsyaml) {
      const script = document.createElement("script");
      script.src = "./vendor/js-yaml.min.js";
      script.onload = bindEvents;
      document.head.appendChild(script);
    } else {
      bindEvents();
    }
  },
};

export default json_to_yaml_converter;
