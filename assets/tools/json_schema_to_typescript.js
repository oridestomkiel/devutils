import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const json_schema_to_typescript = {
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
      id="schemaInput" 
      rows="8"
      class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded mb-3 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
      placeholder="${t("placeholder")}"
    ></textarea>

    <div class="flex gap-2 mb-3">
      <button 
        id="schemaConvertBtn"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-white dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        ${t("convert")}
      </button>

      <button 
        id="schemaClearBtn"
        class="bg-gray-600 hover:bg-gray-500 px-4 py-1 rounded text-white dark:bg-gray-500 dark:hover:bg-gray-400"
      >
        ${tGlobal("clear")}
      </button>

      <button 
        id="schemaCopyBtn"
        class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white dark:bg-green-500 dark:hover:bg-green-600"
      >
        ${tGlobal("copy")}
      </button>
    </div>

    <pre 
      id="schemaOutput"
      class="bg-white border border-gray-300 text-green-600 text-sm p-3 rounded whitespace-pre-wrap break-words dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
    ></pre>
    `;
  },

  init() {
    const t = (key) => json_schema_to_typescript.i18n?.[key] ?? key;

    const input = document.getElementById("schemaInput");
    const output = document.getElementById("schemaOutput");
    const convertBtn = document.getElementById("schemaConvertBtn");
    const clearBtn = document.getElementById("schemaClearBtn");
    const copyBtn = document.getElementById("schemaCopyBtn");

    const toUnionType = (types) => {
      return types.map((t) => mapType({ type: t })).join(" | ");
    };

    const mapType = (prop) => {
      if (Array.isArray(prop.type)) {
        return toUnionType(prop.type);
      }
      if (prop.enum) return prop.enum.map((v) => JSON.stringify(v)).join(" | ");
      if (prop.type === "array") {
        const itemType = prop.items?.type ? mapType(prop.items) : "any";
        if (
          prop.minItems !== undefined &&
          prop.maxItems !== undefined &&
          prop.maxItems <= 3
        ) {
          const tuples = [];
          for (let i = prop.minItems; i <= prop.maxItems; i++) {
            tuples.push("[" + Array(i).fill(itemType).join(", ") + "]");
          }
          return tuples.join(" | ");
        }
        return itemType + "[]";
      }
      if (prop.type === "integer" || prop.type === "number") return "number";
      if (prop.type === "string") return "string";
      if (prop.type === "boolean") return "boolean";
      if (prop.type === "object") return "Record<string, any>";
      if (prop.oneOf || prop.anyOf || prop.allOf) {
        const variants = prop.oneOf || prop.anyOf || prop.allOf;
        return variants.map(mapType).join(" | ");
      }
      return "any";
    };

    const convertToTS = (schema) => {
      if (!schema || !schema.properties) return `❌ ${t("invalid")}`;

      const required = schema.required || [];
      const lines = [`export interface ${schema.title || "Root"} {`];

      for (const key in schema.properties) {
        const prop = schema.properties[key];
        const optional = required.includes(key) ? "" : "?";
        const type = mapType(prop);
        const commentLines = [];

        if (prop.description) commentLines.push(`  /** ${prop.description} */`);
        if (prop.default !== undefined)
          commentLines.push(
            `  /** default: ${JSON.stringify(prop.default)} */`
          );

        if (commentLines.length) lines.push(...commentLines);
        lines.push(`  ${key}${optional}: ${type};`);
      }

      lines.push("  [k: string]: unknown;");
      lines.push("}");
      return lines.join("\n");
    };

    convertBtn.addEventListener("click", () => {
      try {
        const schema = JSON.parse(input.value);
        const ts = convertToTS(schema);
        output.innerText = ts;
      } catch {
        output.innerText = `❌ ${t("invalidJson")}`;
      }
    });

    clearBtn.addEventListener("click", () => {
      input.value = "";
      output.innerText = "";
    });

    copyBtn.addEventListener("click", () => {
      const code = output.innerText;
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.innerText = tGlobal("copied");
        setTimeout(() => (copyBtn.innerText = tGlobal("copy")), 1500);
      });
    });
  },
};

export default json_schema_to_typescript;
