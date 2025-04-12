import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const json_to_bigquery_schema = {
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
      id="bqInput" 
      rows="8"
      class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded mb-3 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
      placeholder="${t("placeholder")}"
    ></textarea>

    <div class="flex gap-2 mb-3">
      <button 
        id="bqConvertBtn"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-white dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        ${t("convert")}
      </button>

      <button 
        id="bqClearBtn"
        class="bg-gray-600 hover:bg-gray-500 px-4 py-1 rounded text-white dark:bg-gray-500 dark:hover:bg-gray-400"
      >
        ${tGlobal("clear")}
      </button>

      <button 
        id="bqCopyBtn"
        class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white dark:bg-green-500 dark:hover:bg-green-600"
      >
        ${tGlobal("copy")}
      </button>
    </div>

    <pre 
      id="bqSchemaOutput"
      class="bg-white border border-gray-300 text-green-600 text-sm p-3 rounded whitespace-pre-wrap break-words dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
    ></pre>
    `;
  },

  init() {
    const t = (key) => json_to_bigquery_schema.i18n?.[key] ?? key;

    const input = document.getElementById("bqInput");
    const output = document.getElementById("bqSchemaOutput");
    const convertBtn = document.getElementById("bqConvertBtn");
    const clearBtn = document.getElementById("bqClearBtn");
    const copyBtn = document.getElementById("bqCopyBtn");

    const detectBQType = (value) => {
      if (typeof value === "number")
        return Number.isInteger(value) ? "INTEGER" : "FLOAT";
      if (typeof value === "boolean") return "BOOLEAN";
      if (typeof value === "string") return "STRING";
      if (Array.isArray(value)) return "RECORD";
      if (typeof value === "object" && value !== null) return "RECORD";
      return "STRING";
    };

    const convertToBQSchema = (json) => {
      return Object.entries(json).map(([key, val]) => ({
        name: key,
        type: detectBQType(val),
        mode: "REQUIRED",
      }));
    };

    convertBtn.addEventListener("click", () => {
      try {
        const json = JSON.parse(input.value);
        const schema = convertToBQSchema(json);
        output.innerText = JSON.stringify(schema, null, 2);
      } catch {
        output.innerText = `❌ ${t("invalidJson")}`;
      }
    });

    clearBtn.addEventListener("click", () => {
      input.value = "";
      output.innerText = "";
    });

    copyBtn.addEventListener("click", () => {
      const text = output.innerText;
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.innerText = tGlobal("copied");
        setTimeout(() => (copyBtn.innerText = tGlobal("copy")), 1500);
      });
    });
  },
};

export default json_to_bigquery_schema;
