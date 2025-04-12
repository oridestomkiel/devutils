import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const json_to_csv_converter = {
  i18n: {},

  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
    <textarea
      id="jsonToCsvInput"
      class="w-full p-2 bg-white border border-gray-300 rounded mb-2 text-gray-800 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
      rows="6"
      placeholder='${t("placeholder")}'
    ></textarea>

    <div class="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-2">
      <label class="text-sm text-gray-800 dark:text-gray-300">
        ${t("delimiter")}:
        <input
          id="csvDelimiter"
          type="text"
          value=","
          maxlength="1"
          class="ml-1 px-2 py-1 bg-white border border-gray-300 text-center w-10 rounded text-gray-800 dark:bg-gray-700 dark:border-gray-700 dark:text-white"
        />
      </label>
      <label class="text-sm mt-2 sm:mt-0 text-gray-800 dark:text-gray-300">
        ${t("useQuotes")}:
        <input id="csvQuote" type="checkbox" checked class="ml-1" />
      </label>
    </div>

    <div class="flex gap-2 mb-2">
      <button
        id="jsonToCsvBtn"
        class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white dark:bg-green-500 dark:hover:bg-green-600"
      >
        ${t("convert")}
      </button>
      <button
        id="downloadCsvBtn"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-white hidden dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        ${tGlobal("download")} CSV
      </button>
    </div>

    <div class="relative">
      <pre
        id="jsonToCsvOutput"
        class="mt-2 bg-white border border-gray-300 text-green-600 whitespace-pre-wrap break-words pr-16 p-2 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-green-400 p-6"
      ></pre>

      <button
        id="copyJsonCsvBtn"
        class="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white dark:bg-gray-500 dark:hover:bg-gray-400"
      >
        ${tGlobal("copy")}
      </button>

      <span
        id="copiedJsonCsvMsg"
        class="absolute top-2 right-2 text-green-600 dark:text-green-400 px-2 py-1 hidden"
      >
        ${tGlobal("copied")}
      </span>
    </div>
    `;
  },

  init() {
    const t = (key) => json_to_csv_converter.i18n?.[key] ?? key;

    const output = document.getElementById("jsonToCsvOutput");
    const copyBtn = document.getElementById("copyJsonCsvBtn");
    const copiedMsg = document.getElementById("copiedJsonCsvMsg");
    const downloadBtn = document.getElementById("downloadCsvBtn");

    function flatten(obj, prefix = "", res = {}) {
      for (const key in obj) {
        const val = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof val === "object" && val !== null && !Array.isArray(val)) {
          flatten(val, newKey, res);
        } else {
          res[newKey] = val;
        }
      }
      return res;
    }

    let lastCsv = "";

    document.getElementById("jsonToCsvBtn").addEventListener("click", () => {
      const input = document.getElementById("jsonToCsvInput").value;
      const delimiter = document.getElementById("csvDelimiter").value || ",";
      const useQuotes = document.getElementById("csvQuote").checked;

      try {
        const raw = JSON.parse(input);
        if (!Array.isArray(raw)) {
          throw new Error(t("errorNotArray"));
        }

        const flatArray = raw.map((item) => flatten(item));
        const headers = Array.from(
          new Set(flatArray.flatMap((obj) => Object.keys(obj)))
        );

        const escapeValue = (value) => {
          const str = JSON.stringify(value ?? "");
          return useQuotes
            ? `"${str.replace(/^"|"$/g, "").replace(/"/g, '""')}"`
            : str.replace(/^"|"$/g, "");
        };

        const csv = [
          headers.map(escapeValue).join(delimiter),
          ...flatArray.map((obj) =>
            headers.map((h) => escapeValue(obj[h])).join(delimiter)
          ),
        ].join("\n");

        lastCsv = csv;
        output.innerText = csv;
        downloadBtn.classList.remove("hidden");
      } catch (e) {
        output.innerText = `${t("errorPrefix")} ${e.message}`;
        downloadBtn.classList.add("hidden");
        lastCsv = "";
      }
    });

    copyBtn.addEventListener("click", () => {
      const text = output.innerText;
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
      if (!lastCsv) return;
      const blob = new Blob([lastCsv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dados.csv";
      a.click();
      URL.revokeObjectURL(url);
    });
  },
};

export default json_to_csv_converter;
