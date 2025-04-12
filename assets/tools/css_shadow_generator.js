import { loadToolI18n } from "../../utils/i18n-loader.js";

const css_shadow_generator = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  render() {
    const t = (key) => this.i18n?.labels?.[key] ?? key;

    return `
    <div class="grid grid-cols-2 gap-2 mb-3">
      <div>
        <label class="text-sm text-gray-800 dark:text-gray-300">${t(
          "horizontal"
        )}</label>
        <input type="number" id="shadowX" class="w-full p-1 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white" value="4" />
      </div>
      <div>
        <label class="text-sm text-gray-800 dark:text-gray-300">${t(
          "vertical"
        )}</label>
        <input type="number" id="shadowY" class="w-full p-1 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white" value="4" />
      </div>
      <div>
        <label class="text-sm text-gray-800 dark:text-gray-300">${t(
          "blur"
        )}</label>
        <input type="number" id="shadowBlur" class="w-full p-1 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white" value="10" />
      </div>
      <div>
        <label class="text-sm text-gray-800 dark:text-gray-300">${t(
          "spread"
        )}</label>
        <input type="number" id="shadowSpread" class="w-full p-1 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white" value="0" />
      </div>
      <div class="col-span-2">
        <label class="text-sm text-gray-800 dark:text-gray-300">${t(
          "color"
        )}</label>
        <input type="color" id="shadowColor" class="w-full h-10 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700" value="#000000" />
      </div>
    </div>

    <button id="shadowGenBtn" class="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded text-white dark:bg-purple-500 dark:hover:bg-purple-600">${t(
      "generate"
    )}</button>
    <button id="shadowCopyBtn" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded ml-2 text-white dark:bg-green-500 dark:hover:bg-green-600">${t(
      "copy"
    )}</button>

    <div id="shadowPreview" class="mt-4 bg-white border border-gray-300 dark:bg-black dark:border-gray-700 p-10 flex items-center justify-center rounded">
      <div id="shadowBox" class="w-32 h-20 bg-gray-200 text-black font-bold flex items-center justify-center rounded">
        Preview
      </div>
    </div>

    <pre id="shadowCSS" class="mt-2 text-green-600 bg-white border border-gray-300 p-3 rounded whitespace-pre-wrap break-words text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-green-400"></pre>
    `;
  },

  init() {
    const t = (key) => this.i18n?.labels?.[key] ?? key;
    const genBtn = document.getElementById("shadowGenBtn");
    const copyBtn = document.getElementById("shadowCopyBtn");

    genBtn.addEventListener("click", () => {
      const x = document.getElementById("shadowX").value;
      const y = document.getElementById("shadowY").value;
      const blur = document.getElementById("shadowBlur").value;
      const spread = document.getElementById("shadowSpread").value;
      const color = document.getElementById("shadowColor").value;

      const css = `box-shadow: ${x}px ${y}px ${blur}px ${spread}px ${color};`;

      document.getElementById("shadowBox").style.boxShadow = css;
      document.getElementById("shadowCSS").innerText = css;
    });

    copyBtn.addEventListener("click", () => {
      const css = document.getElementById("shadowCSS").innerText;
      if (!css) return;
      navigator.clipboard.writeText(css).then(() => {
        copyBtn.innerText = t("copied");
        setTimeout(() => (copyBtn.innerText = t("copy")), 1500);
      });
    });
  },
};

export default css_shadow_generator;
