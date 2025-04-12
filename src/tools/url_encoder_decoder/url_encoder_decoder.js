import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const url_encoder_decoder = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.4.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
      <textarea 
        id="urlInput" 
        class="w-full p-2 bg-white border border-gray-300 text-black rounded mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white" 
        rows="3" 
        placeholder="${t("placeholder_input")}"
      ></textarea>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
        <select 
          id="urlEncodeMode" 
          class="w-full p-2 bg-white border border-gray-300 text-black rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white"
        >
          <option value="component">encodeURIComponent</option>
          <option value="uri">encodeURI</option>
        </select>
        <div class="flex gap-2">
          <button id="urlEncodeBtn" class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white">${t(
            "encode"
          )}</button>
          <button id="urlDecodeBtn" class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-white">${t(
            "decode"
          )}</button>
        </div>
      </div>

      <div class="relative mb-2">
        <textarea 
          id="urlOutput" 
          class="w-full p-2 bg-white border border-gray-300 text-green-600 rounded pr-24 dark:bg-gray-700 dark:border-gray-700 dark:text-green-400" 
          rows="3" 
          readonly 
          placeholder="${t("placeholder_output")}"
        ></textarea>
        <button 
          id="copyUrlBtn" 
          class="absolute top-2 right-20 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-sm text-white"
        >${tGlobal("copy")}</button>
        <button 
          id="downloadUrlBtn" 
          class="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm text-white"
        >${tGlobal("download")}</button>
        <span 
          id="copiedUrlMsg" 
          class="absolute top-2 right-20 text-green-400 px-2 py-1 hidden"
        >${tGlobal("copied")}</span>
      </div>

      <div 
        id="urlPreview" 
        class="mt-1 text-sm text-blue-600 underline hidden dark:text-blue-400"
      >
        <a 
          id="urlPreviewLink" 
          href="#" 
          target="_blank" 
          rel="noopener noreferrer"
        ></a>
      </div>
    `;
  },

  init() {
    const input = document.getElementById("urlInput");
    const output = document.getElementById("urlOutput");
    const mode = document.getElementById("urlEncodeMode");
    const copyBtn = document.getElementById("copyUrlBtn");
    const copiedMsg = document.getElementById("copiedUrlMsg");
    const downloadBtn = document.getElementById("downloadUrlBtn");
    const preview = document.getElementById("urlPreview");
    const previewLink = document.getElementById("urlPreviewLink");
    const t = (key) => this.i18n?.[key] ?? key;

    const isValidUrl = (str) => {
      try {
        const url = new URL(str);
        return url.protocol.startsWith("http");
      } catch {
        return false;
      }
    };

    const updatePreview = (val) => {
      if (isValidUrl(val)) {
        preview.classList.remove("hidden");
        previewLink.href = val;
        previewLink.textContent =
          val.length > 60 ? val.slice(0, 60) + "..." : val;
      } else {
        preview.classList.add("hidden");
        previewLink.href = "";
        previewLink.textContent = "";
      }
    };

    document.getElementById("urlEncodeBtn").addEventListener("click", () => {
      const val = input.value.trim();
      const encoded =
        mode.value === "uri" ? encodeURI(val) : encodeURIComponent(val);
      output.value = encoded;
      updatePreview(encoded);
    });

    document.getElementById("urlDecodeBtn").addEventListener("click", () => {
      try {
        const decoded = decodeURIComponent(input.value.trim());
        output.value = decoded;
        updatePreview(decoded);
      } catch {
        output.value = t("invalid_url");
        preview.classList.add("hidden");
      }
    });

    copyBtn.addEventListener("click", () => {
      const text = output.value;
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        copyBtn.classList.add("hidden");
        copiedMsg.classList.remove("hidden");
        setTimeout(() => {
          copiedMsg.classList.add("hidden");
          copyBtn.classList.remove("hidden");
        }, 2000);
      });
    });

    downloadBtn.addEventListener("click", () => {
      const blob = new Blob([output.value], {
        type: "text/plain;charset=utf-8",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = t("download_filename");
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  },
};

export default url_encoder_decoder;
