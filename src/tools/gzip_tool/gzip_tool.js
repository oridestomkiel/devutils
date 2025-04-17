import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const gzip_tool = {
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
<div class="p-4 rounded bg-gray-100 dark:bg-gray-800 text-sm space-y-4 text-gray-800 dark:text-white">
  <p>${t("intro")}</p>

  <div>
    <label class="block mb-1">${t("mode")}</label>
    <select id="gzipMode" class="w-full p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
      <option value="compress">${t("compress")}</option>
      <option value="decompress">${t("decompress")}</option>
    </select>
  </div>

  <div>
    <label class="block mb-1 mt-4">${t("input")}</label>
    <textarea id="gzipInput" class="w-full p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white" rows="4"></textarea>
  </div>

  <button id="gzipBtn" class="mt-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white">${t(
    "run"
  )}</button>

  <div class="mt-4">
    <label class="block mb-1">${t("output")}</label>
    <textarea id="gzipOutput" readonly class="w-full p-2 rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-green-700 dark:text-green-400" rows="4"></textarea>
    <button id="gzipCopyBtn" class="mt-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-1 rounded">${tGlobal(
      "copy"
    )}</button>
  </div>
</div>
    `;
  },

  init() {
    const $ = (id) => document.getElementById(id);
    const t = (key) => this.i18n?.[key] ?? key;

    const loadMagicLibs = async (callback) => {
      const loadScript = (src) =>
        new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = resolve;
          document.head.appendChild(script);
        });

      await loadScript("./vendor/pako.min.js");

      if (callback) callback();
    };

    loadMagicLibs(() => {
      $("gzipBtn").addEventListener("click", () => {
        const mode = $("gzipMode").value;
        const input = $("gzipInput").value;
        const outputEl = $("gzipOutput");

        try {
          if (mode === "compress") {
            const binary = new TextEncoder().encode(input);
            const compressed = window.pako.gzip(binary);
            outputEl.value = btoa(String.fromCharCode(...compressed));
          } else {
            const decoded = atob(input);
            const byteArray = Uint8Array.from(decoded, (c) => c.charCodeAt(0));
            const decompressed = window.pako.ungzip(byteArray, {
              to: "string",
            });
            outputEl.value = decompressed;
          }
        } catch (e) {
          outputEl.value = `❌ ${t("error")}`;
        }
      });

      $("gzipCopyBtn").addEventListener("click", () => {
        navigator.clipboard.writeText($("gzipOutput").value).then(() => {
          $("gzipCopyBtn").textContent = tGlobal("copied");
          setTimeout(() => {
            $("gzipCopyBtn").textContent = tGlobal("copy");
          }, 1500);
        });
      });
    });
  },
};

export default gzip_tool;
