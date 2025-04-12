import { loadToolI18n } from "../../utils/i18n-loader.js";

const csv_data_matrix_generator = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  render() {
    const t = (key) => this.i18n?.labels?.[key] ?? key;

    return `
  <div class="grid grid-cols-2 gap-2 mb-2">
    <input
      id="csvRows"
      type="number"
      min="1"
      value="10"
      class="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      placeholder="Linhas"
    />
    <input
      id="csvCols"
      type="number"
      min="1"
      value="5"
      class="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      placeholder="Colunas"
    />
  </div>

  <button
    id="csvGenBtn"
    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
  >
    ${t("generate")}
  </button>

  <div class="mt-2 flex gap-2">
    <textarea
      id="csvOutput"
      class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-green-400"
      rows="6"
      readonly
      placeholder="${t("placeholder")}"
    ></textarea>
    <button
      id="csvCopyBtn"
      class="px-2 py-1 rounded self-start bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
    >
      ${t("copy")}
    </button>
  </div>

  <button
    id="csvDownloadBtn"
    class="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
  >
    ${t("download")}
  </button>
  `;
  },

  init() {
    const t = (key) => this.i18n?.labels?.[key] ?? key;

    const csvRowsEl = document.getElementById("csvRows");
    const csvColsEl = document.getElementById("csvCols");
    const csvOutputEl = document.getElementById("csvOutput");
    const csvGenBtn = document.getElementById("csvGenBtn");
    const csvCopyBtn = document.getElementById("csvCopyBtn");
    const csvDownloadBtn = document.getElementById("csvDownloadBtn");

    const genWord = () => Math.random().toString(36).substring(2, 8);

    csvGenBtn.addEventListener("click", () => {
      const rows = parseInt(csvRowsEl.value, 10);
      const cols = parseInt(csvColsEl.value, 10);
      const csv = [];

      csv.push(
        Array.from({ length: cols }, (_, i) => `col_${i + 1}`).join(",")
      );

      for (let i = 0; i < rows; i++) {
        const row = Array.from({ length: cols }, () => genWord());
        csv.push(row.join(","));
      }

      csvOutputEl.value = csv.join("\n");
    });

    csvCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(csvOutputEl.value).then(() => {
        const original = csvCopyBtn.innerText;
        csvCopyBtn.innerText = t("copied");
        setTimeout(() => {
          csvCopyBtn.innerText = t("copy");
        }, 1500);
      });
    });

    csvDownloadBtn.addEventListener("click", () => {
      const blob = new Blob([csvOutputEl.value], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dados.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  },
};

export default csv_data_matrix_generator;
