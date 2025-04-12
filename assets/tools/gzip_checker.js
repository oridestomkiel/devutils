import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const gzip_checker = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: true,
  license: "MIT",
  version: "1.2.1",

  render() {
    const t = (k) => this.i18n?.[k] ?? k;

    return `
      <input
        id="gzipUrlInput"
        type="text"
        placeholder="${t("placeholder")}"
        class="w-full p-2 rounded bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-700 text-black dark:text-white mb-2"
      />
      <div class="flex gap-2 mb-4">
        <button id="checkGzipBtn" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white">
          ${t("check")}
        </button>
        <button id="clearGzipBtn" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white">
          ${tGlobal("clear")}
        </button>
      </div>
      <div
        id="gzipResult"
        class="hidden bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-900 p-3 mt-2 rounded text-sm text-green-700 dark:text-green-400 whitespace-pre-wrap min-h-[100px]"
      ></div>
    `;
  },

  init() {
    const input = document.getElementById("gzipUrlInput");
    const result = document.getElementById("gzipResult");
    const checkBtn = document.getElementById("checkGzipBtn");
    const clearBtn = document.getElementById("clearGzipBtn");

    const t = (k) => gzip_checker.i18n?.[k] ?? k;

    checkBtn.addEventListener("click", async () => {
      const url = input.value.trim();
      if (!url) {
        result.textContent = t("error.invalidUrl");
        result.classList.remove("hidden");
        return;
      }

      result.textContent = t("checking");
      result.classList.remove("hidden");

      try {
        const res = await fetch(
          `https://devutils.tools/api/gzip-check.json?url=${encodeURIComponent(
            url
          )}`
        );
        const data = await res.json();

        if (data.error) {
          result.textContent = `${t("error.prefix")}: ${data.error}`;
          return;
        }

        const statusMsg = data.gzip ? t("gzip.enabled") : t("gzip.disabled");

        result.textContent = `${statusMsg}\n\n${t(
          "httpHeaders"
        )}:\n${data.headers.join("\n")}`;
      } catch (err) {
        result.textContent = `${t("error.checkFailed")}: ${err.message}`;
      }
    });

    clearBtn.addEventListener("click", () => {
      result.textContent = "";
      result.classList.add("hidden");
      input.value = "";
    });
  },
};

export default gzip_checker;
