import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const camelcase_snake_case_kebab_case_converter = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "en");
  },
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
  <input
    id="caseInput"
    type="text"
    class="w-full p-2 mb-4 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
    placeholder="${t("placeholder.input")}"
  />

  <div class="flex gap-2 items-center mb-2">
    <label class="w-[120px] text-gray-700 dark:text-gray-300"><strong>${t(
      "label.camel"
    )}</strong></label>
    <input
      id="camelOutput"
      type="text"
      readonly
      class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-green-700 dark:text-green-400"
    />
    <button
      id="camelCopyBtn"
      class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
    >
      ${tGlobal("copy")}
    </button>
  </div>

  <div class="flex gap-2 items-center mb-2">
    <label class="w-[120px] text-gray-700 dark:text-gray-300"><strong>${t(
      "label.snake"
    )}</strong></label>
    <input
      id="snakeOutput"
      type="text"
      readonly
      class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-green-700 dark:text-green-400"
    />
    <button
      id="snakeCopyBtn"
      class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
    >
      ${tGlobal("copy")}
    </button>
  </div>

  <div class="flex gap-2 items-center">
    <label class="w-[120px] text-gray-700 dark:text-gray-300"><strong>${t(
      "label.kebab"
    )}</strong></label>
    <input
      id="kebabOutput"
      type="text"
      readonly
      class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-green-700 dark:text-green-400"
    />
    <button
      id="kebabCopyBtn"
      class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
    >
      ${tGlobal("copy")}
    </button>
  </div>
    `;
  },

  init() {
    const inputEl = document.getElementById("caseInput");
    const camelEl = document.getElementById("camelOutput");
    const snakeEl = document.getElementById("snakeOutput");
    const kebabEl = document.getElementById("kebabOutput");

    const camelCopyBtn = document.getElementById("camelCopyBtn");
    const snakeCopyBtn = document.getElementById("snakeCopyBtn");
    const kebabCopyBtn = document.getElementById("kebabCopyBtn");

    const normalize = (str) =>
      str
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[-_]/g, " ")
        .toLowerCase()
        .trim();

    const toCamel = (str) =>
      str
        .split(" ")
        .map((word, i) =>
          i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join("");

    const toSnake = (str) => str.split(" ").join("_");
    const toKebab = (str) => str.split(" ").join("-");

    inputEl.addEventListener("input", () => {
      const norm = normalize(inputEl.value);
      camelEl.value = toCamel(norm);
      snakeEl.value = toSnake(norm);
      kebabEl.value = toKebab(norm);
    });

    const setupCopy = (btn, target) => {
      btn.addEventListener("click", () => {
        navigator.clipboard.writeText(target.value).then(() => {
          const original = btn.innerText;
          btn.innerText = tGlobal("copied");
          setTimeout(() => (btn.innerText = tGlobal("copy")), 1500);
        });
      });
    };

    setupCopy(camelCopyBtn, camelEl);
    setupCopy(snakeCopyBtn, snakeEl);
    setupCopy(kebabCopyBtn, kebabEl);
  },
};

export default camelcase_snake_case_kebab_case_converter;
