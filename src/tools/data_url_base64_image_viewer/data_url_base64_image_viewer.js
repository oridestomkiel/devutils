import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const data_url_base64_image_viewer = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "en");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
  <textarea
    id="dataUrlInput"
    class="w-full p-2 mb-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-green-400 border border-gray-300 dark:border-gray-600"
    rows="6"
    placeholder="${t("placeholder")}"
  ></textarea>

  <div class="flex flex-wrap gap-2 mb-4">
    <button id="viewImageBtn" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white">
      ${t("view")}
    </button>
    <button id="copyDataUrlBtn" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded text-gray-900 dark:text-white hidden">
      ${tGlobal("copy")}
    </button>
    <button id="downloadDataUrlBtn" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded text-gray-900 dark:text-white hidden">
      ${t("download")}
    </button>
    <button id="clearDataUrlBtn" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded text-gray-900 dark:text-white">
      ${t("clear")}
    </button>
  </div>

  <div id="dataUrlInfo" class="text-sm text-gray-600 dark:text-gray-400 mb-2 hidden"></div>

  <div
    id="dataUrlPreview"
    class="hidden flex justify-center items-center min-h-[200px] rounded overflow-hidden border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900"
  ></div>
`;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const input = document.getElementById("dataUrlInput");
    const preview = document.getElementById("dataUrlPreview");
    const info = document.getElementById("dataUrlInfo");
    const viewBtn = document.getElementById("viewImageBtn");
    const copyBtn = document.getElementById("copyDataUrlBtn");
    const downloadBtn = document.getElementById("downloadDataUrlBtn");
    const clearBtn = document.getElementById("clearDataUrlBtn");

    viewBtn.addEventListener("click", () => {
      const val = input.value.trim();

      if (!val.startsWith("data:image/") || !val.includes("base64,")) {
        preview.classList.remove("hidden");
        preview.innerHTML = `<span class="text-sm text-red-400">${t(
          "invalidFormat"
        )}</span>`;
        info.classList.add("hidden");
        copyBtn.classList.add("hidden");
        downloadBtn.classList.add("hidden");
        return;
      }

      const mime =
        val.match(/^data:(image\/[a-zA-Z]+);base64,/i)?.[1] || "unknown";
      const base64 = val.split("base64,")[1] || "";
      const byteSize = Math.round((base64.length * 3) / 4);
      const sizeKB = (byteSize / 1024).toFixed(1);

      const img = new Image();
      img.src = val;
      img.alt = "Preview";
      img.className = "max-w-full max-h-[300px]";

      img.onload = () => {
        preview.innerHTML = "";
        preview.appendChild(img);
        preview.classList.remove("hidden");

        info.innerHTML = `
          <div class="mb-1 text-green-400">✔️ ${t("imageDetected")}</div>
          • ${t("type")}: <code>${mime}</code><br />
          • ${t("size")}: ${sizeKB} KB<br />
          • ${t("dimensions")}: ${img.naturalWidth} x ${img.naturalHeight} px
        `;
        info.classList.remove("hidden");
        copyBtn.classList.remove("hidden");
        downloadBtn.classList.remove("hidden");
      };
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(input.value).then(() => {
        const original = copyBtn.textContent;
        copyBtn.textContent = tGlobal("copied");
        setTimeout(() => (copyBtn.textContent = original), 1500);
      });
    });

    downloadBtn.addEventListener("click", () => {
      const mime =
        input.value.match(/^data:(image\/[a-zA-Z]+);base64,/i)?.[1] ||
        "image/png";
      const ext = mime.split("/")[1];
      const a = document.createElement("a");
      a.href = input.value;
      a.download = `imagem.${ext}`;
      a.click();
    });

    clearBtn.addEventListener("click", () => {
      input.value = "";
      preview.innerHTML = "";
      preview.classList.add("hidden");
      info.innerHTML = "";
      info.classList.add("hidden");
      copyBtn.classList.add("hidden");
      downloadBtn.classList.add("hidden");
    });
  },
};

export default data_url_base64_image_viewer;
