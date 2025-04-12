import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const jwt_viewer = {
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
    <div class="gap-2">
      <textarea
        id="jwtInput"
        class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
        rows="4"
        placeholder="${t("placeholder")}"
      ></textarea>

      <button
        id="jwtDecodeBtn"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white dark:bg-blue-500 dark:hover:bg-blue-600 m-4 ml-0"
      >
        ${t("decode")}
      </button>

      <div class="relative">
        <pre
          id="jwtOutput"
          class="p-3 bg-white border border-gray-300 text-green-600 rounded overflow-x-auto whitespace-pre-wrap break-words text-sm dark:bg-gray-700 dark:border-gray-700 dark:text-green-400 p-6"
        ></pre>

        <button
          id="jwtCopyBtn"
          class="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white dark:bg-gray-500 dark:hover:bg-gray-400"
        >
          ${tGlobal("copy")}
        </button>
      </div>
    </div>
    `;
  },

  init() {
    const t = (key) => jwt_viewer.i18n?.[key] ?? key;

    const inputEl = document.getElementById("jwtInput");
    const outputEl = document.getElementById("jwtOutput");
    const decodeBtn = document.getElementById("jwtDecodeBtn");
    const copyBtn = document.getElementById("jwtCopyBtn");

    decodeBtn.addEventListener("click", () => {
      const input = inputEl.value.trim();
      const partes = input.split(".");

      if (partes.length === 3) {
        try {
          const payload = JSON.parse(
            atob(partes[1].replace(/-/g, "+").replace(/_/g, "/"))
          );
          outputEl.textContent = JSON.stringify(payload, null, 2);
        } catch {
          outputEl.textContent = t("error.invalid");
        }
      } else {
        outputEl.textContent = t("error.structure");
      }
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(outputEl.textContent).then(() => {
        copyBtn.textContent = tGlobal("copied");
        setTimeout(() => (copyBtn.textContent = tGlobal("copy")), 1500);
      });
    });
  },
};

export default jwt_viewer;
