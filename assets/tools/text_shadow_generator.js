import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const text_shadow_generator = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
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
        <label class="text-sm text-gray-800 dark:text-gray-300">${t(
          "shadow_color"
        )}</label>
        <input type="color" id="textShadowColor" class="w-full h-10 rounded" value="#000000" />
      </div>
      <div>
        <label class="text-sm text-gray-800 dark:text-gray-300">${t(
          "blur"
        )}</label>
        <input type="number" id="textShadowBlur" class="w-full p-1 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white" value="4" />
      </div>
      <div>
        <label class="text-sm text-gray-800 dark:text-gray-300">${t(
          "offset_x"
        )}</label>
        <input type="number" id="textShadowX" class="w-full p-1 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white" value="2" />
      </div>
      <div>
        <label class="text-sm text-gray-800 dark:text-gray-300">${t(
          "offset_y"
        )}</label>
        <input type="number" id="textShadowY" class="w-full p-1 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white" value="2" />
      </div>
    </div>

    <button id="textShadowCopyBtn" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white">
      ${tGlobal("copy")}
    </button>

    <div class="mt-4 bg-white border border-gray-600 p-10 rounded text-center dark:bg-gray-900 dark:border-gray-700">
      <h2 id="textShadowPreview" class="text-2xl font-bold text-black dark:text-white">${t(
        "preview_text"
      )}</h2>
    </div>

    <pre id="textShadowCSS" class="mt-2 text-green-600 bg-white border border-gray-300 p-3 rounded whitespace-pre-wrap break-words text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-green-400"></pre>
    `;
  },

  init() {
    const color = document.getElementById("textShadowColor");
    const blur = document.getElementById("textShadowBlur");
    const offsetX = document.getElementById("textShadowX");
    const offsetY = document.getElementById("textShadowY");
    const preview = document.getElementById("textShadowPreview");
    const output = document.getElementById("textShadowCSS");
    const copyBtn = document.getElementById("textShadowCopyBtn");

    const update = () => {
      const css = `text-shadow: ${offsetX.value}px ${offsetY.value}px ${blur.value}px ${color.value};`;
      preview.style.textShadow = css;
      output.innerText = css;
    };

    [color, blur, offsetX, offsetY].forEach((el) =>
      el.addEventListener("input", update)
    );

    copyBtn.addEventListener("click", () => {
      const css = output.innerText;
      if (!css) return;
      navigator.clipboard.writeText(css).then(() => {
        copyBtn.innerText = tGlobal("copied");
        setTimeout(() => (copyBtn.innerText = tGlobal("copy")), 1500);
      });
    });

    update();
  },
};

export default text_shadow_generator;
