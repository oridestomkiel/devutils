import { loadToolI18n } from "../../utils/i18n-loader.js";

const image_to_data_url_base64 = {
  i18n: {},

  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.2.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
    <input
      type="file"
      accept="image/*"
      id="imgToDataUrlInput"
      class="w-full p-2 mb-3 bg-white border border-gray-300 rounded text-gray-800 dark:bg-gray-700 dark:border-gray-700 dark:text-white"
    />

    <div
      id="imgToDataUrlPreview"
      class="hidden flex justify-center items-center bg-white border border-gray-300 rounded mb-2 min-h-[200px] overflow-hidden dark:bg-gray-700 dark:border-gray-700"
    ></div>

    <textarea
      id="imgToDataUrlOutput"
      class="w-full p-2 bg-white border border-gray-300 text-green-600 rounded mb-2 hidden dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
      rows="6"
      readonly
    ></textarea>

    <div id="imgToDataUrlActions" class="flex flex-wrap gap-2 hidden">
      <button id="copyImgToDataUrlBtn"
        class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white dark:bg-gray-600 dark:hover:bg-gray-500">
        ${t("copy")}
      </button>
      <button id="downloadImgToDataUrlBtn"
        class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white dark:bg-gray-600 dark:hover:bg-gray-500">
        ${t("download")}
      </button>
      <button id="clearImgToDataUrlBtn"
        class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white dark:bg-gray-600 dark:hover:bg-gray-500">
        ${t("clear")}
      </button>
    </div>
    `;
  },

  init() {
    const fileInput = document.getElementById("imgToDataUrlInput");
    const preview = document.getElementById("imgToDataUrlPreview");
    const output = document.getElementById("imgToDataUrlOutput");
    const copyBtn = document.getElementById("copyImgToDataUrlBtn");
    const downloadBtn = document.getElementById("downloadImgToDataUrlBtn");
    const clearBtn = document.getElementById("clearImgToDataUrlBtn");
    const actions = document.getElementById("imgToDataUrlActions");

    let currentDataUrl = "";
    let currentMime = "image/png";

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file || !file.type.startsWith("image/")) {
        output.classList.add("hidden");
        preview.classList.add("hidden");
        actions.classList.add("hidden");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        currentDataUrl = reader.result;
        currentMime = file.type || "image/png";

        output.value = currentDataUrl;
        output.classList.remove("hidden");

        const img = new Image();
        img.src = currentDataUrl;
        img.className = "max-w-full max-h-[300px]";
        preview.innerHTML = "";
        preview.appendChild(img);
        preview.classList.remove("hidden");

        actions.classList.remove("hidden");
      };
      reader.readAsDataURL(file);
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(output.value).then(() => {
        const original = copyBtn.textContent;
        copyBtn.textContent = this.i18n?.copied ?? "Copiado!";
        setTimeout(
          () => (copyBtn.textContent = this.i18n?.copy ?? "Copiar"),
          1500
        );
      });
    });

    downloadBtn.addEventListener("click", () => {
      if (!currentDataUrl) return;
      const ext = currentMime.split("/")[1] || "png";
      const a = document.createElement("a");
      a.href = currentDataUrl;
      a.download = `imagem.${ext}`;
      a.click();
    });

    clearBtn.addEventListener("click", () => {
      fileInput.value = "";
      currentDataUrl = "";
      preview.innerHTML = "";
      output.value = "";
      preview.classList.add("hidden");
      output.classList.add("hidden");
      actions.classList.add("hidden");
    });
  },
};

export default image_to_data_url_base64;
