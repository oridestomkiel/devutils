import { loadToolI18n } from "../../utils/i18n-loader.js";

const csv_to_json_converter = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
      <textarea
        id="csvToJsonInput"
        class="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        rows="6"
        placeholder="${t("placeholderInput")}"
      ></textarea>

      <button
        id="csvToJsonBtn"
        class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1 rounded"
      >
        ${t("convertBtn")}
      </button>

      <div class="mt-2 flex gap-2">
        <textarea
          id="csvToJsonOutput"
          rows="6"
          readonly
          class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 text-sm"
          placeholder="${t("placeholderOutput")}"
        ></textarea>
        <button
          id="csvToJsonCopyBtn"
          class="px-2 py-1 rounded self-start bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
        >
          ${t("copyBtn")}
        </button>
      </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const inputEl = document.getElementById("csvToJsonInput");
    const outputEl = document.getElementById("csvToJsonOutput");
    const convertBtn = document.getElementById("csvToJsonBtn");
    const copyBtn = document.getElementById("csvToJsonCopyBtn");

    convertBtn.addEventListener("click", () => {
      const input = inputEl.value.trim();

      try {
        const [headerLine, ...lines] = input.split("\n");
        if (!headerLine) {
          throw new Error("CSV sem cabeçalho.");
        }

        const headers = headerLine.split(",").map((h) => h.trim());

        const data = lines.map((line) => {
          const values = line.split(",").map((v) => v.trim());
          return Object.fromEntries(
            headers.map((h, i) => [h, values[i] ?? ""])
          );
        });

        outputEl.value = JSON.stringify(data, null, 2);
      } catch (e) {
        outputEl.value = `${t("errorPrefix")}: ${e.message}`;
      }
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(outputEl.value).then(() => {
        const originalText = copyBtn.innerText;
        copyBtn.innerText = t("copiedMsg");
        setTimeout(() => {
          copyBtn.innerText = t("copyBtn");
        }, 1500);
      });
    });
  },
};

export default csv_to_json_converter;
