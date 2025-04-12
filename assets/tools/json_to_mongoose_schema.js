import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const json_to_mongoose_schema = {
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
      id="mongooseInput" 
      rows="8"
      class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded mb-3 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
      placeholder='${t("placeholder")}'
    ></textarea>

    <div class="flex gap-2 mb-3">
      <button 
        id="mongooseConvertBtn"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-white dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        ${t("convert")}
      </button>

      <button 
        id="mongooseClearBtn"
        class="bg-gray-600 hover:bg-gray-500 px-4 py-1 rounded text-white dark:bg-gray-500 dark:hover:bg-gray-400"
      >
        ${tGlobal("clear")}
      </button>

      <button 
        id="mongooseCopyBtn"
        class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white dark:bg-green-500 dark:hover:bg-green-600"
      >
        ${tGlobal("copy")}
      </button>
    </div>

    <pre 
      id="mongooseOutput"
      class="bg-white border border-gray-300 text-green-600 text-sm p-3 rounded whitespace-pre-wrap break-words dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
    ></pre>
    `;
  },

  init() {
    const t = (key) => json_to_mongoose_schema.i18n?.[key] ?? key;

    const input = document.getElementById("mongooseInput");
    const output = document.getElementById("mongooseOutput");
    const convertBtn = document.getElementById("mongooseConvertBtn");
    const clearBtn = document.getElementById("mongooseClearBtn");
    const copyBtn = document.getElementById("mongooseCopyBtn");

    const detectType = (value) => {
      if (Array.isArray(value)) {
        if (value.length === 0) return "[]";
        return `[${detectType(value[0])}]`;
      }
      if (typeof value === "number") return "Number";
      if (typeof value === "boolean") return "Boolean";
      if (typeof value === "string") return "String";
      if (value === null) return "String";
      return "Mixed";
    };

    const convertToMongoose = (obj) => {
      const lines = [
        "const mongoose = require('mongoose');",
        "",
        "const Schema = new mongoose.Schema({",
      ];
      for (const key in obj) {
        const type = detectType(obj[key]);
        lines.push(`  ${key}: { type: ${type} },`);
      }
      lines.push(
        "});",
        "",
        "module.exports = mongoose.model('ModelName', Schema);"
      );
      return lines.join("\n");
    };

    convertBtn.addEventListener("click", () => {
      try {
        const json = JSON.parse(input.value);
        const schema = convertToMongoose(json);
        output.innerText = schema;
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

export default json_to_mongoose_schema;
