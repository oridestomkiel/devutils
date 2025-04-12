import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const rgba_color_generator = {
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
    <div class="mb-3 grid grid-cols-2 gap-2">
      <div>
        <label class="text-sm text-gray-800 dark:text-gray-300">${t(
          "color_label"
        )}</label>
        <input
          type="color"
          id="rgbaColor"
          class="w-full h-10 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700"
          value="#3399ff"
        />
      </div>
      <div>
        <label class="text-sm text-gray-800 dark:text-gray-300">${t(
          "opacity_label"
        )}</label>
        <input
          type="range"
          id="rgbaAlpha"
          min="0"
          max="1"
          step="0.01"
          value="1"
          class="w-full"
        />
        <span id="alphaValue" class="text-sm text-gray-600 dark:text-gray-400 block mt-1 text-center">1.00</span>
      </div>
    </div>

    <button
      id="rgbaGenBtn"
      class="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded text-white dark:bg-purple-500 dark:hover:bg-purple-600"
    >
      ${t("generate")}
    </button>
    <button
      id="rgbaCopyBtn"
      class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded ml-2 text-white dark:bg-green-500 dark:hover:bg-green-600"
    >
      ${tGlobal("copy")}
    </button>

    <div class="mt-4 bg-white border border-gray-300 p-10 flex items-center justify-center rounded dark:bg-black dark:border-gray-700">
      <div id="rgbaPreview" class="w-32 h-16 rounded flex items-center justify-center text-black font-bold">
        Preview
      </div>
    </div>

    <pre
      id="rgbaOutput"
      class="mt-2 text-green-600 bg-white border border-gray-300 p-3 rounded whitespace-pre-wrap break-words text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-green-400"
    ></pre>
    `;
  },

  init() {
    const colorInput = document.getElementById("rgbaColor");
    const alphaInput = document.getElementById("rgbaAlpha");
    const alphaValue = document.getElementById("alphaValue");
    const genBtn = document.getElementById("rgbaGenBtn");
    const copyBtn = document.getElementById("rgbaCopyBtn");

    const hexToRgb = (hex) => {
      const raw = hex.replace("#", "");
      const bigint = parseInt(raw, 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
      };
    };

    const toHexAlpha = (a) =>
      Math.round(a * 255)
        .toString(16)
        .padStart(2, "0");

    alphaInput.addEventListener("input", () => {
      alphaValue.innerText = parseFloat(alphaInput.value).toFixed(2);
    });

    genBtn.addEventListener("click", () => {
      const hex = colorInput.value;
      const alpha = parseFloat(alphaInput.value);
      const rgb = hexToRgb(hex);

      const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
      const hexAlpha = `#${hex.slice(1)}${toHexAlpha(alpha)}`;

      const preview = document.getElementById("rgbaPreview");
      const output = document.getElementById("rgbaOutput");

      preview.style.backgroundColor = rgba;
      output.innerText = `/* RGBA */\n${rgba}\n\n/* Hex com alpha */\n${hexAlpha}`;
    });

    copyBtn.addEventListener("click", () => {
      const text = document.getElementById("rgbaOutput").innerText;
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        const original = copyBtn.innerText;
        copyBtn.innerText = tGlobal("copied");
        setTimeout(() => (copyBtn.innerText = original), 1500);
      });
    });
  },
};

export default rgba_color_generator;
