import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const fake_person_data_generator = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "en");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.2.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
  <div class="mb-2">
    <label class="text-sm text-gray-700 dark:text-gray-300 mb-1 block">${t(
      "amountLabel"
    )}</label>
    <input id="fakeCount" type="number" min="1" max="100" value="5" class="w-full p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600" />
  </div>

  <div id="fakeFields" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-sm text-gray-900 dark:text-white mb-4"></div>

  <div class="flex gap-2 mb-4">
    <button id="generateFakeJsonBtn" class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white">
      ${t("generate")}
    </button>
    <button id="downloadFakeJsonBtn" class="bg-gray-300 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1 rounded text-gray-900 dark:text-white hidden">
      ${tGlobal("download")}
    </button>
    <button id="copyFakeJsonBtn" class="bg-gray-300 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1 rounded text-gray-900 dark:text-white hidden">
      ${tGlobal("copy")}
    </button>
  </div>

  <textarea id="fakeJsonOutput" class="w-full p-2 bg-white dark:bg-gray-700 text-green-700 dark:text-green-400 border border-gray-300 dark:border-gray-600 rounded" rows="10" readonly></textarea>
    `;
  },

  async init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const fakeFields = document.getElementById("fakeFields");
    const fakeCount = document.getElementById("fakeCount");
    const output = document.getElementById("fakeJsonOutput");
    const downloadBtn = document.getElementById("downloadFakeJsonBtn");
    const copyBtn = document.getElementById("copyFakeJsonBtn");

    let dictionary = {};

    try {
      const res = await fetch("/data/fakepessoa.json");
      dictionary = await res.json();
    } catch (err) {
      output.value = t("loadError");
      return;
    }

    const allFields = Object.keys(dictionary);

    allFields.forEach((key) => {
      const label = document.createElement("label");
      label.className = "flex items-center gap-2";
      label.innerHTML = `
        <input type="checkbox" value="${key}" checked class="form-checkbox text-green-500 bg-gray-700" />
        <span>${key.replace(/_/g, " ")}</span>
      `;
      fakeFields.appendChild(label);
    });

    document
      .getElementById("generateFakeJsonBtn")
      .addEventListener("click", () => {
        const selectedFields = Array.from(
          fakeFields.querySelectorAll("input:checked")
        ).map((el) => el.value);
        const count = parseInt(fakeCount.value, 10);
        const result = [];

        for (let i = 0; i < count; i++) {
          const item = {};
          selectedFields.forEach((field) => {
            const options = dictionary[field];
            item[field] = options[Math.floor(Math.random() * options.length)];
          });
          result.push(item);
        }

        output.value = JSON.stringify(result, null, 2);
        downloadBtn.classList.remove("hidden");
        copyBtn.classList.remove("hidden");
      });

    downloadBtn.addEventListener("click", () => {
      const blob = new Blob([output.value], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dados-ficticios.json";
      a.click();
      URL.revokeObjectURL(url);
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(output.value).then(() => {
        const original = copyBtn.textContent;
        copyBtn.textContent = tGlobal("copied");
        setTimeout(() => {
          copyBtn.textContent = tGlobal("copy");
        }, 1500);
      });
    });
  },
};

export default fake_person_data_generator;
