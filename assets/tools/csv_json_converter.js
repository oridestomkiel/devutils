import { loadToolI18n } from "../../utils/i18n-loader.js";

const csv_json_converter = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  render() {
    const t = (key) => this.i18n?.labels?.[key] ?? key;

    return `
      <textarea
        id="csvJsonInput"
        class="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        rows="6"
        placeholder="${t("placeholderInput")}"
      ></textarea>

      <div class="flex gap-2">
        <button
          id="csvToJsonBtn"
          class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
        >
          ${t("csvToJson")}
        </button>
        <button
          id="jsonToCsvBtn"
          class="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
        >
          ${t("jsonToCsv")}
        </button>
      </div>

      <div class="mt-2 flex gap-2">
        <textarea
          id="csvJsonOutput"
          rows="6"
          readonly
          class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 text-sm"
          placeholder="${t("placeholderOutput")}"
        ></textarea>
        <button
          id="csvJsonCopyBtn"
          class="px-2 py-1 rounded self-start bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
        >
          ${t("copy")}
        </button>
      </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.labels?.[key] ?? key;

    const inputEl = document.getElementById("csvJsonInput");
    const outputEl = document.getElementById("csvJsonOutput");
    const copyBtn = document.getElementById("csvJsonCopyBtn");

    const csvToJsonBtn = document.getElementById("csvToJsonBtn");
    const jsonToCsvBtn = document.getElementById("jsonToCsvBtn");

    csvToJsonBtn.addEventListener("click", () => {
      try {
        const input = inputEl.value.trim();
        const [headerLine, ...lines] = input.split("\n");
        const headers = headerLine.split(",");
        const data = lines.map((line) => {
          const values = line.split(",");
          return headers.reduce((obj, key, i) => {
            obj[key.trim()] = values[i]?.trim() ?? "";
            return obj;
          }, {});
        });
        outputEl.value = JSON.stringify(data, null, 2);
      } catch (e) {
        outputEl.value = `${t("error")}: ${e.message}`;
      }
    });

    jsonToCsvBtn.addEventListener("click", () => {
      try {
        const json = JSON.parse(inputEl.value.trim());
        if (!Array.isArray(json)) {
          throw new Error("JSON deve ser um array de objetos.");
        }
        const headers = Object.keys(json[0]);
        const csv = [
          headers.join(","),
          ...json.map((obj) =>
            headers.map((h) => JSON.stringify(obj[h] ?? "")).join(",")
          ),
        ].join("\n");
        outputEl.value = csv;
      } catch (e) {
        outputEl.value = `${t("error")}: ${e.message}`;
      }
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(outputEl.value).then(() => {
        const original = copyBtn.innerText;
        copyBtn.innerText = t("copied");
        setTimeout(() => {
          copyBtn.innerText = t("copy");
        }, 1500);
      });
    });
  },
};

export default csv_json_converter;
