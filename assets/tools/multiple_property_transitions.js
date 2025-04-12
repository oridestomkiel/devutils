import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const multiple_property_transitions = {
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
    const props = [
      "background-color",
      "color",
      "transform",
      "opacity",
      "border-radius",
    ];

    return `
    <div class="space-y-3 mb-4">
      ${props
        .map(
          (prop) => `
        <div class="bg-white border border-gray-300 p-3 rounded dark:bg-gray-800 dark:border-gray-700">
          <label class="text-sm text-gray-800 font-bold block mb-1 dark:text-white">${t(
            prop
          )}</label>
          <div class="grid grid-cols-3 gap-2">
            <input
              type="number"
              id="${prop}-dur"
              value="0.3"
              step="0.1"
              min="0"
              class="p-1 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white"
              placeholder="${t("duration")}"
            />
            <input
              type="number"
              id="${prop}-delay"
              value="0"
              step="0.1"
              min="0"
              class="p-1 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white"
              placeholder="${t("delay")}"
            />
            <select
              id="${prop}-ease"
              class="p-1 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white"
            >
              <option value="ease">${t("ease")}</option>
              <option value="linear">${t("linear")}</option>
              <option value="ease-in">${t("ease-in")}</option>
              <option value="ease-out">${t("ease-out")}</option>
              <option value="ease-in-out">${t("ease-in-out")}</option>
            </select>
          </div>
        </div>
      `
        )
        .join("")}
    </div>

    <button
      id="multiTransCopy"
      class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded mb-4 text-white dark:bg-green-500 dark:hover:bg-green-600"
    >
      ${tGlobal("copy")}
    </button>

    <div class="bg-white border border-gray-300 p-10 rounded text-center dark:bg-gray-800 dark:border-gray-700">
      <div
        id="multiTransPreview"
        class="transition-all duration-300 ease-in-out w-40 h-20 bg-blue-500 text-white flex items-center justify-center rounded hover:bg-red-500 hover:text-black hover:opacity-75 hover:scale-110"
      >
        ${t("preview")}
      </div>
    </div>

    <pre
      id="multiTransCSS"
      class="mt-4 bg-white border border-gray-300 text-green-600 p-3 rounded whitespace-pre-wrap break-words text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-green-400"
    ></pre>
    `;
  },

  init() {
    const properties = [
      "background-color",
      "color",
      "transform",
      "opacity",
      "border-radius",
    ];
    const preview = document.getElementById("multiTransPreview");
    const cssOut = document.getElementById("multiTransCSS");
    const copyBtn = document.getElementById("multiTransCopy");

    const update = () => {
      const parts = properties.map((prop) => {
        const dur = document.getElementById(`${prop}-dur`).value;
        const delay = document.getElementById(`${prop}-delay`).value;
        const ease = document.getElementById(`${prop}-ease`).value;
        return `${prop} ${dur}s ${ease} ${delay}s`;
      });

      const css = `transition: ${parts.join(", ")};`;

      preview.style.transition = parts.join(", ");
      cssOut.innerText = css;
    };

    properties.forEach((prop) => {
      ["dur", "delay", "ease"].forEach((type) => {
        document
          .getElementById(`${prop}-${type}`)
          .addEventListener("input", update);
      });
    });

    copyBtn.addEventListener("click", () => {
      const css = cssOut.innerText;
      navigator.clipboard.writeText(css).then(() => {
        copyBtn.innerText = tGlobal("copied");
        setTimeout(() => (copyBtn.innerText = tGlobal("copy")), 1500);
      });
    });

    update();
  },
};

export default multiple_property_transitions;
