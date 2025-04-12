import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const neon_effect_generator = {
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
          "color_label"
        )}</label>
        <input
          type="color"
          id="neonColor"
          class="w-full h-10 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700"
          value="#00ffff"
        />
      </div>
      <div>
        <label class="text-sm text-gray-800 dark:text-gray-300">${t(
          "intensity_label"
        )}</label>
        <input
          type="range"
          id="neonIntensity"
          min="1"
          max="10"
          step="1"
          value="5"
          class="w-full"
        />
        <span id="neonIntensityValue" class="text-sm text-gray-600 dark:text-gray-400 block text-center">5</span>
      </div>
    </div>

    <button
      id="neonCopyBtn"
      class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white dark:bg-green-500 dark:hover:bg-green-600"
    >
      ${tGlobal("copy")}
    </button>

    <div class="mt-4 bg-white border border-gray-300 p-10 rounded text-center dark:bg-black dark:border-gray-700">
      <h2 id="neonPreview" class="text-2xl font-bold text-gray-800 dark:text-white">
        ${t("preview_text")}
      </h2>
    </div>

    <pre
      id="neonCSS"
      class="mt-2 bg-white border border-gray-300 text-green-600 p-3 rounded whitespace-pre-wrap break-words text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-green-400"
    ></pre>
    `;
  },

  init() {
    const color = document.getElementById("neonColor");
    const intensity = document.getElementById("neonIntensity");
    const intensityVal = document.getElementById("neonIntensityValue");
    const preview = document.getElementById("neonPreview");
    const output = document.getElementById("neonCSS");
    const copyBtn = document.getElementById("neonCopyBtn");

    const update = () => {
      const col = color.value;
      const strength = parseInt(intensity.value, 10);
      intensityVal.innerText = strength;

      const shadows = Array.from({ length: strength }, (_, i) => {
        const blur = 2 + i * 2;
        return `0 0 ${blur}px ${col}`;
      }).join(", ");

      preview.style.textShadow = shadows;
      output.innerText = `text-shadow: ${shadows};`;
    };

    [color, intensity].forEach((el) => el.addEventListener("input", update));

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

export default neon_effect_generator;
