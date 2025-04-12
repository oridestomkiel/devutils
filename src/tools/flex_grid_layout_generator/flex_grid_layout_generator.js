import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const flex_grid_layout_generator = {
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
          "layoutType"
        )}</label>
        <select
          id="layoutMode"
          class="w-full p-1 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white"
        >
          <option value="flex">Flexbox</option>
          <option value="grid">Grid</option>
        </select>
      </div>
      <div>
        <label class="text-sm text-gray-700 dark:text-gray-300">${t(
          "gap"
        )}</label>
        <input
          type="number"
          id="layoutGap"
          value="10"
          class="w-full p-1 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label class="text-sm text-gray-700 dark:text-gray-300">${t(
          "justify"
        )}</label>
        <select
          id="layoutJustify"
          class="w-full p-1 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white"
        >
          <option>start</option>
          <option>center</option>
          <option>end</option>
          <option>space-between</option>
          <option>space-around</option>
          <option>space-evenly</option>
        </select>
      </div>
      <div>
        <label class="text-sm text-gray-700 dark:text-gray-300">${t(
          "align"
        )}</label>
        <select
          id="layoutAlign"
          class="w-full p-1 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white"
        >
          <option>start</option>
          <option>center</option>
          <option>end</option>
          <option>stretch</option>
        </select>
      </div>
    </div>

    <button
      id="layoutCopyBtn"
      class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white dark:bg-green-500 dark:hover:bg-green-600"
    >
      ${tGlobal("copy")}
    </button>

    <div
      class="mt-4 bg-white border border-gray-300 p-6 rounded dark:bg-gray-800 dark:border-gray-700"
      id="layoutPreview"
    >
      <div class="layout-box bg-blue-500 text-white p-2 rounded">1</div>
      <div class="layout-box bg-purple-500 text-white p-2 rounded">2</div>
      <div class="layout-box bg-green-500 text-white p-2 rounded">3</div>
    </div>

    <pre
      id="layoutCSS"
      class="mt-2 bg-white border border-gray-300 text-green-600 p-3 rounded whitespace-pre-wrap break-words text-sm dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
    ></pre>
    `;
  },

  init() {
    const mode = document.getElementById("layoutMode");
    const gap = document.getElementById("layoutGap");
    const justify = document.getElementById("layoutJustify");
    const align = document.getElementById("layoutAlign");
    const preview = document.getElementById("layoutPreview");
    const output = document.getElementById("layoutCSS");
    const copyBtn = document.getElementById("layoutCopyBtn");

    const updateLayout = () => {
      const type = mode.value;
      const g = gap.value + "px";
      const jc = justify.value;
      const ai = align.value;

      preview.style.display = type;
      preview.style.gap = g;

      if (type === "flex") {
        preview.style.flexDirection = "row";
        preview.style.justifyContent = jc;
        preview.style.alignItems = ai;
        preview.style.gridTemplateColumns = "";
      } else {
        preview.style.justifyContent = "";
        preview.style.alignItems = "";
        preview.style.gridTemplateColumns = "repeat(3, 1fr)";
      }

      const css =
        type === "flex"
          ? `display: flex;\ngap: ${g};\njustify-content: ${jc};\nalign-items: ${ai};`
          : `display: grid;\ngap: ${g};\ngrid-template-columns: repeat(3, 1fr);`;

      output.innerText = css;
    };

    [mode, gap, justify, align].forEach((el) =>
      el.addEventListener("input", updateLayout)
    );

    copyBtn.addEventListener("click", () => {
      const css = output.innerText;
      if (!css) return;
      navigator.clipboard.writeText(css).then(() => {
        copyBtn.innerText = tGlobal("copied");
        setTimeout(() => (copyBtn.innerText = tGlobal("copy")), 1500);
      });
    });

    updateLayout();
  },
};

export default flex_grid_layout_generator;
