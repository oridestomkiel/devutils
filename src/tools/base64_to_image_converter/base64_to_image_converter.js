import { loadToolI18n } from "../../utils/i18n-loader.js";

const base64_to_image_converter = {
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
    id="base64ImgInput"
    class="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-green-700 dark:text-green-400"
    rows="6"
    placeholder="${t("placeholder")}"
  ></textarea>

  <div
    id="base64ImgPreview"
    class="flex justify-center items-center min-h-[200px] bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded mb-2"
  >
    <span class="text-sm text-gray-600 dark:text-gray-400">${t(
      "preview.label"
    )}</span>
  </div>

  <div class="flex justify-end">
    <button
      id="base64DownloadBtn"
      class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded hidden"
    >
      ${t("download")}
    </button>
  </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const input = document.getElementById("base64ImgInput");
    const preview = document.getElementById("base64ImgPreview");
    const downloadBtn = document.getElementById("base64DownloadBtn");

    input.addEventListener("input", () => {
      const val = input.value.trim();

      if (!val.startsWith("data:image")) {
        preview.innerHTML = `<span class="text-sm text-red-400">${t(
          "error.invalid"
        )}</span>`;
        downloadBtn.classList.add("hidden");
        return;
      }

      const img = document.createElement("img");
      img.src = val;
      img.alt = "Imagem Base64";
      img.className = "max-w-full max-h-96 rounded";

      preview.innerHTML = "";
      preview.appendChild(img);

      downloadBtn.classList.remove("hidden");
      downloadBtn.onclick = () => {
        const a = document.createElement("a");
        a.href = val;
        a.download = "imagem-base64.png";
        a.click();
      };
    });
  },
};

export default base64_to_image_converter;
