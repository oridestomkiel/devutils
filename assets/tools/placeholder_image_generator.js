import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const placeholder_image_generator = {
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
    <div class="p-4 rounded text-gray-800 text-sm space-y-4 dark:bg-gray-800 dark:text-white">
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label class="block mb-1">${t("width")}</label>
          <input type="number" id="imgWidth" value="320"
            class="w-full p-2 rounded bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:text-white"/>
        </div>
        <div>
          <label class="block mb-1">${t("height")}</label>
          <input type="number" id="imgHeight" value="240"
            class="w-full p-2 rounded bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:text-white"/>
        </div>
        <div>
          <label class="block mb-1">${t("font_size")}</label>
          <input type="number" id="fontSize" value="20"
            class="w-full p-2 rounded bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:text-white"/>
        </div>
        <div>
          <label class="block mb-1">${t("background_color")}</label>
          <input type="color" id="bgColor" value="#10fef4"
            class="w-full h-10 p-1 rounded bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:text-white"/>
        </div>
        <div>
          <label class="block mb-1">${t("text_color")}</label>
          <input type="color" id="textColor" value="#000000"
            class="w-full h-10 p-1 rounded bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:text-white"/>
        </div>
        <div>
          <label class="block mb-1">${t("format")}</label>
          <select id="imgFormat"
            class="w-full p-2 rounded bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:text-white">
            <option value="png">.png</option>
            <option value="jpg">.jpg</option>
            <option value="gif">.gif</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block mb-1 mt-2">${t("text")}</label>
        <input type="text" id="imgText" value="${t("placeholder_text_default")}"
          class="w-full p-2 rounded bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:text-white"/>
      </div>

      <button id="btnGerar"
        class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm text-white dark:bg-indigo-500 dark:hover:bg-indigo-600">
        ${t("generate")}
      </button>

      <div id="previewContainer" class="mt-4 hidden space-y-2">
        <canvas id="previewCanvas"
          class="max-w-full border border-gray-300 bg-white rounded dark:border-gray-700 dark:bg-gray-700"></canvas>
        <a id="btnDownload" download="placeholder.png"
          class="inline-block bg-gray-700 hover:bg-gray-600 px-4 py-1 rounded text-sm text-white text-center cursor-pointer dark:bg-gray-600 dark:hover:bg-gray-500">
          ${t("download_image")}
        </a>
      </div>
    </div>
    `;
  },

  init() {
    const canvas = document.getElementById("previewCanvas");
    const ctx = canvas.getContext("2d");

    const drawImage = () => {
      const width = parseInt(document.getElementById("imgWidth").value);
      const height = parseInt(document.getElementById("imgHeight").value);
      const bgColor = document.getElementById("bgColor").value;
      const textColor = document.getElementById("textColor").value;
      const fontSize = parseInt(document.getElementById("fontSize").value);
      const text = document.getElementById("imgText").value;
      const format = document.getElementById("imgFormat").value;

      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = textColor;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, width / 2, height / 2);

      const mime =
        format === "jpg"
          ? "image/jpeg"
          : format === "gif"
          ? "image/gif"
          : "image/png";
      const dataURL = canvas.toDataURL(mime);
      const link = document.getElementById("btnDownload");
      link.href = dataURL;
      link.download = `placeholder.${format}`;
    };

    document.getElementById("btnGerar").addEventListener("click", () => {
      drawImage();
      document.getElementById("previewContainer").classList.remove("hidden");
    });
  },
};

export default placeholder_image_generator;
