import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const json_schema_to_openapi = {
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
      id="schemaInput"
      class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
      rows="8"
      placeholder="${t("placeholder")}"
    ></textarea>

    <div class="flex gap-2 mb-3">
      <button
        id="schemaConvert"
        class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        ${t("convert")}
      </button>

      <button
        id="schemaClear"
        class="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-white dark:bg-gray-500 dark:hover:bg-gray-400"
      >
        ${tGlobal("clear")}
      </button>

      <button
        id="schemaCopy"
        class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white dark:bg-green-500 dark:hover:bg-green-600"
      >
        ${tGlobal("copy")}
      </button>
    </div>

    <pre
      id="schemaOutput"
      class="bg-white border border-gray-300 text-green-600 whitespace-pre-wrap break-words p-3 rounded text-sm hidden dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
    ></pre>
    `;
  },

  init() {
    const t = (key) => json_schema_to_openapi.i18n?.[key] ?? key;

    const input = document.getElementById("schemaInput");
    const output = document.getElementById("schemaOutput");
    const convertBtn = document.getElementById("schemaConvert");
    const clearBtn = document.getElementById("schemaClear");
    const copyBtn = document.getElementById("schemaCopy");

    const convertToOpenAPI = (jsonSchema) => {
      const schema = { ...jsonSchema };
      delete schema.$schema;

      const process = (obj) => {
        if (obj?.type?.includes?.("null")) {
          obj.nullable = true;
          obj.type = obj.type.filter((t) => t !== "null")[0] || "string";
        }

        if (obj.properties) {
          for (const key in obj.properties) {
            process(obj.properties[key]);
          }
        }

        if (obj.items) {
          if (Array.isArray(obj.items)) {
            obj.items.forEach(process);
          } else {
            process(obj.items);
          }
        }

        return obj;
      };

      const converted = process(schema);
      const safeName = (schema.title || "ConvertedSchema").replace(/\s+/g, "");

      return {
        openapi: "3.0.0",
        info: {
          title: schema.title || "Converted Schema",
          version: "1.0.0",
        },
        paths: {},
        components: {
          schemas: {
            [safeName]: converted,
          },
        },
      };
    };

    convertBtn.addEventListener("click", () => {
      try {
        const parsed = JSON.parse(input.value);
        const converted = convertToOpenAPI(parsed);
        output.textContent = JSON.stringify(converted, null, 2);
        output.classList.remove("hidden");
      } catch (e) {
        output.textContent = `${t("error")}: ${t("invalidJson")}`;
        output.classList.remove("hidden");
      }
    });

    clearBtn.addEventListener("click", () => {
      input.value = "";
      output.textContent = "";
      output.classList.add("hidden");
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(output.textContent).then(() => {
        copyBtn.innerText = tGlobal("copied");
        setTimeout(() => {
          copyBtn.innerText = tGlobal("copy");
        }, 1500);
      });
    });
  },
};

export default json_schema_to_openapi;
