import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const border_radius_generator = {
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
  <div class="grid grid-cols-2 gap-2 mb-3">
    <div>
      <label class="text-sm text-gray-700 dark:text-gray-300">${t(
        "label.topLeft"
      )}</label>
      <input type="number" id="radiusTL" class="w-full p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value="8" />
    </div>
    <div>
      <label class="text-sm text-gray-700 dark:text-gray-300">${t(
        "label.topRight"
      )}</label>
      <input type="number" id="radiusTR" class="w-full p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value="8" />
    </div>
    <div>
      <label class="text-sm text-gray-700 dark:text-gray-300">${t(
        "label.bottomRight"
      )}</label>
      <input type="number" id="radiusBR" class="w-full p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value="8" />
    </div>
    <div>
      <label class="text-sm text-gray-700 dark:text-gray-300">${t(
        "label.bottomLeft"
      )}</label>
      <input type="number" id="radiusBL" class="w-full p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value="8" />
    </div>
  </div>

  <button id="radiusGenBtn" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded">
    ${t("generate")}
  </button>
  <button id="radiusCopyBtn" class="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded ml-2">
    ${tGlobal("copy")}
  </button>

  <div id="radiusPreview" class="mt-4 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 p-10 flex items-center justify-center rounded">
    <div id="radiusBox" class="w-32 h-20 bg-gray-200 dark:bg-gray-600 text-black dark:text-white font-bold flex items-center justify-center">
      ${t("preview")}
    </div>
  </div>

  <pre id="radiusCSS" class="mt-2 text-green-700 dark:text-green-400 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-900 p-3 rounded whitespace-pre-wrap break-words text-sm"></pre>
    `;
  },

  init() {
    const genBtn = document.getElementById("radiusGenBtn");
    const copyBtn = document.getElementById("radiusCopyBtn");

    genBtn.addEventListener("click", () => {
      const tl = document.getElementById("radiusTL").value;
      const tr = document.getElementById("radiusTR").value;
      const br = document.getElementById("radiusBR").value;
      const bl = document.getElementById("radiusBL").value;

      const css = `border-radius: ${tl}px ${tr}px ${br}px ${bl}px;`;

      const box = document.getElementById("radiusBox");
      const output = document.getElementById("radiusCSS");

      box.style.borderRadius = `${tl}px ${tr}px ${br}px ${bl}px`;
      output.innerText = css;
    });

    copyBtn.addEventListener("click", () => {
      const css = document.getElementById("radiusCSS").innerText;
      if (!css) return;
      navigator.clipboard.writeText(css).then(() => {
        copyBtn.innerText = tGlobal("copied");
        setTimeout(() => (copyBtn.innerText = tGlobal("copy")), 1500);
      });
    });
  },
};

export default border_radius_generator;
