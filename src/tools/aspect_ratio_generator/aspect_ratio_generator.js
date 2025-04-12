import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const aspect_ratio_generator = {
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
  <div class="grid grid-cols-2 gap-2 mb-3 text-gray-900 dark:text-white">
    <div>
      <label class="text-sm text-gray-700 dark:text-gray-300">${t(
        "label.ratio"
      )}</label>
      <select id="ratioSelect" class="w-full p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
        <option value="16/9">${t("option.ratio.16_9")}</option>
        <option value="4/3">${t("option.ratio.4_3")}</option>
        <option value="1/1">${t("option.ratio.1_1")}</option>
        <option value="21/9">${t("option.ratio.21_9")}</option>
        <option value="custom">${t("option.ratio.custom")}</option>
      </select>
    </div>

    <div id="customRatioWrapper" class="hidden">
      <label class="text-sm text-gray-700 dark:text-gray-300">${t(
        "label.ratio.custom"
      )}</label>
      <input
        type="text"
        id="customRatio"
        placeholder="ex: 3/2"
        class="w-full p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
    </div>

    <div class="col-span-2">
      <label class="text-sm text-gray-700 dark:text-gray-300">${t(
        "label.ratio.mode"
      )}</label>
      <select id="ratioMode" class="w-full p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
        <option value="modern">${t("option.mode.modern")}</option>
        <option value="fallback">${t("option.mode.fallback")}</option>
      </select>
    </div>
  </div>

  <button id="ratioCopy" class="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded">
    ${tGlobal("copy")}
  </button>

  <div class="mt-4 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-4 rounded">
    <div id="ratioPreview"
      class="bg-blue-300 w-full max-w-sm mx-auto rounded overflow-hidden relative aspect-video">
      <div class="absolute inset-0 flex items-center justify-center font-bold text-black dark:text-white text-xl">
        ${t("preview.label")}
      </div>
    </div>
  </div>

  <pre id="ratioCSS"
    class="mt-2 text-green-700 dark:text-green-400 bg-white dark:bg-gray-900 p-3 rounded whitespace-pre-wrap break-words text-sm border border-gray-300 dark:border-gray-700"></pre>
    `;
  },

  init() {
    const select = document.getElementById("ratioSelect");
    const customInput = document.getElementById("customRatio");
    const customWrapper = document.getElementById("customRatioWrapper");
    const mode = document.getElementById("ratioMode");
    const preview = document.getElementById("ratioPreview");
    const output = document.getElementById("ratioCSS");
    const copyBtn = document.getElementById("ratioCopy");

    const parseRatio = (value) => {
      const parts = value.split("/");
      return parts.length === 2 ? +parts[0] / +parts[1] : 1;
    };

    const update = () => {
      const value =
        select.value === "custom" ? customInput.value : select.value;
      const ratio = parseRatio(value || "1/1");
      const useModern = mode.value === "modern";

      let css = "";
      if (useModern) {
        css = `
  .aspect-box {
    aspect-ratio: ${value};
    width: 100%;
  }`.trim();
        preview.style.aspectRatio = value;
        preview.style.paddingTop = "";
      } else {
        const padding = (1 / ratio) * 100;
        css = `
  .aspect-box {
    position: relative;
    width: 100%;
    padding-top: ${padding.toFixed(2)}%;
  }
  .aspect-box > * {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
  }`.trim();
        preview.style.aspectRatio = "";
        preview.style.paddingTop = `${padding.toFixed(2)}%`;
      }

      output.innerText = css;
    };

    select.addEventListener("change", () => {
      customWrapper.classList.toggle("hidden", select.value !== "custom");
      update();
    });

    [customInput, mode].forEach((el) => el.addEventListener("input", update));

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

export default aspect_ratio_generator;
