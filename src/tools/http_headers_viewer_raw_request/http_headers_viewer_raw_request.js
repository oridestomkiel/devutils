import { loadToolI18n } from "../../utils/i18n-loader.js";

const http_headers_viewer_raw_request = {
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
        id="httpRawInput" 
        class="w-full p-2 rounded mb-2 text-gray-800 bg-white placeholder-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700" 
        rows="6" 
        placeholder="${t("placeholder")}"
      ></textarea>

      <button 
        id="httpParseBtn" 
        class="px-4 py-1 rounded text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-indigo-600"
      >
        ${t("analyze")}
      </button>

      <pre 
        id="httpHeadersOutput" 
        class="mt-2 whitespace-pre-wrap break-words text-green-600 dark:text-green-400 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-900 p-6"
      ></pre>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    document.getElementById("httpParseBtn").addEventListener("click", () => {
      const input = document.getElementById("httpRawInput").value.trim();
      const output = document.getElementById("httpHeadersOutput");

      if (!input) {
        output.innerText = t("nothingToAnalyze");
        return;
      }

      const lines = input.split(/\r?\n/);
      let parsed = `🔹 ${t("methodAndPath")}:\n${lines[0]}\n\n🔹 ${t(
        "headers"
      )}:\n`;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) break;
        const [key, ...rest] = line.split(":");
        const value = rest.join(":").trim();
        parsed += `• ${key.trim()}: ${value}\n`;
      }

      output.innerText = parsed;
    });
  },
};

export default http_headers_viewer_raw_request;
