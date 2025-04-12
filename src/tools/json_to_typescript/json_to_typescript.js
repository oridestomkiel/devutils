import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const json_to_typescript = {
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
      id="tsInput" 
      rows="8"
      class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded mb-3 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
      placeholder='${t("placeholder")}'
    ></textarea>

    <div class="flex gap-2 mb-3">
      <button 
        id="tsConvertBtn"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-white dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        ${t("convert")}
      </button>

      <button 
        id="tsClearBtn"
        class="bg-gray-600 hover:bg-gray-500 px-4 py-1 rounded text-white dark:bg-gray-500 dark:hover:bg-gray-400"
      >
        ${tGlobal("clear")}
      </button>

      <button 
        id="tsCopyBtn"
        class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white dark:bg-green-500 dark:hover:bg-green-600"
      >
        ${tGlobal("copy")}
      </button>
    </div>

    <pre 
      id="tsOutput"
      class="bg-white border border-gray-300 text-green-600 text-sm p-3 rounded whitespace-pre-wrap break-words dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
    ></pre>
    `;
  },

  init() {
    const t = (key) => json_to_typescript.i18n?.[key] ?? key;

    const input = document.getElementById("tsInput");
    const output = document.getElementById("tsOutput");
    const convertBtn = document.getElementById("tsConvertBtn");
    const clearBtn = document.getElementById("tsClearBtn");
    const copyBtn = document.getElementById("tsCopyBtn");

    const detectType = (value) => {
      if (Array.isArray(value)) {
        if (value.length === 0) return "any[]";
        return detectType(value[0]) + "[]";
      }
      if (value === null) return "null";
      if (typeof value === "object") return "any";
      return typeof value;
    };

    const convertToTS = (obj) => {
      let lines = ["export interface Root {"];
      for (const key in obj) {
        const val = obj[key];
        const type = detectType(val);
        lines.push(`  ${key}: ${type};`);
      }
      lines.push("}");
      return lines.join("\n");
    };

    convertBtn.addEventListener("click", () => {
      try {
        const json = JSON.parse(input.value);
        const ts = convertToTS(json);
        output.innerText = ts;
      } catch {
        output.innerText = `❌ ${t("error")}`;
      }
    });

    clearBtn.addEventListener("click", () => {
      input.value = "";
      output.innerText = "";
    });

    copyBtn.addEventListener("click", () => {
      const text = output.innerText;
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.innerText = tGlobal("copied");
        setTimeout(() => (copyBtn.innerText = tGlobal("copy")), 1500);
      });
    });
  },
};

export default json_to_typescript;
