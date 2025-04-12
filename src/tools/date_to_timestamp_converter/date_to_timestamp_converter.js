import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const date_to_timestamp_converter = {
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
  <label class="block text-sm text-gray-900 dark:text-gray-300 mb-1">
    ${t("label")}
  </label>

  <input
    id="dtInput"
    type="datetime-local"
    class="w-full p-2 mb-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
  />

  <button
    id="dtToTsBtn"
    class="w-full px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
  >
    ${t("convert")}
  </button>

  <div class="mt-2 flex gap-2">
    <input
      id="tsOutput"
      type="text"
      readonly
      class="p-2 text-sm w-full rounded bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 border border-gray-300 dark:border-gray-700"
      placeholder="${t("placeholder")}"
    />
    <button
      id="tsCopyBtn"
      class="px-2 py-1 rounded self-start bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
    >
      ${tGlobal("copy")}
    </button>
  </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const dtInput = document.getElementById("dtInput");
    const dtToTsBtn = document.getElementById("dtToTsBtn");
    const tsOutput = document.getElementById("tsOutput");
    const tsCopyBtn = document.getElementById("tsCopyBtn");

    dtToTsBtn.addEventListener("click", () => {
      const dtValue = dtInput.value;
      if (!dtValue) {
        tsOutput.value = t("error");
        return;
      }

      const ts = Math.floor(new Date(dtValue).getTime() / 1000);
      tsOutput.value = `${ts}`;
    });

    tsCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(tsOutput.value).then(() => {
        const originalText = tsCopyBtn.innerText;
        tsCopyBtn.innerText = tGlobal("copied");
        setTimeout(() => {
          tsCopyBtn.innerText = originalText;
        }, 1500);
      });
    });
  },
};

export default date_to_timestamp_converter;
