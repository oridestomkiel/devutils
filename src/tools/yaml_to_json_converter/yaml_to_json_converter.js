import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const yaml_to_json_converter = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.2.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
      <textarea 
        id="yamlInput" 
        class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white" 
        rows="6" 
        placeholder="${t("placeholder_input")}">
      </textarea>

      <button 
        id="yamlToJsonBtn" 
        class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-2 text-white">
        ${t("convert")}
      </button>

      <div class="relative">
        <textarea 
          id="yamlOutput" 
          class="w-full p-2 bg-gray-100 bg-white text-green-600 border border-gray-300 rounded pr-24 dark:bg-gray-700 dark:text-green-400 dark:border-gray-700" 
          rows="6" 
          readonly 
          placeholder="${t("placeholder_output")}">
        </textarea>
        
        <button 
          id="copyYamlJsonBtn" 
          class="absolute top-2 right-20 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">
          ${tGlobal("copy")}
        </button>

        <button 
          id="downloadYamlJsonBtn" 
          class="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white">
          ${tGlobal("download")}
        </button>

        <span 
          id="copiedYamlJsonMsg" 
          class="absolute top-2 right-20 text-green-600 dark:text-green-400 px-2 py-1 hidden">
          ${t("copied")}
        </span>
      </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const ensureYamlReady = (callback) => {
      if (window.jsyaml) return callback();
      const script = document.createElement("script");
      script.src = "./vendor/js-yaml.min.js";
      script.onload = callback;
      document.head.appendChild(script);
    };

    ensureYamlReady(() => {
      const input = document.getElementById("yamlInput");
      const output = document.getElementById("yamlOutput");
      const convertBtn = document.getElementById("yamlToJsonBtn");
      const copyBtn = document.getElementById("copyYamlJsonBtn");
      const copiedMsg = document.getElementById("copiedYamlJsonMsg");
      const downloadBtn = document.getElementById("downloadYamlJsonBtn");

      convertBtn.addEventListener("click", () => {
        try {
          const parsed = jsyaml.load(input.value.trim());
          output.value = JSON.stringify(parsed, null, 2);
        } catch (e) {
          output.value = "Erro: " + e.message;
        }
      });

      copyBtn.addEventListener("click", () => {
        const text = output.value;
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

      downloadBtn.addEventListener("click", () => {
        const text = output.value.trim();
        if (!text) return;

        const blob = new Blob([text], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = t("download_filename");
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
    });
  },
};

export default yaml_to_json_converter;
