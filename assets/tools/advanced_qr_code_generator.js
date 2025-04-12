import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const advanced_qr_code_generator = {
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
    id="qrInput"
    class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
    rows="3"
    placeholder="${t("placeholder.input")}"
  ></textarea>

  <div class="grid grid-cols-2 gap-2 mb-2">
    <div>
      <label class="block text-sm text-gray-800 dark:text-gray-300 mb-1">${t(
        "label.size"
      )}</label>
      <input
        type="number"
        id="qrSize"
        value="256"
        class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white"
      />
    </div>
    <div>
      <label class="block text-sm text-gray-800 dark:text-gray-300 mb-1">${t(
        "label.margin"
      )}</label>
      <input
        type="number"
        id="qrMargin"
        value="2"
        class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white"
      />
    </div>
  </div>

  <div class="grid grid-cols-2 gap-2 mb-2">
    <div>
      <label class="block text-sm text-gray-800 dark:text-gray-300 mb-1">${t(
        "label.color.dark"
      )}</label>
      <input
        type="color"
        id="qrDark"
        value="#000000"
        class="w-full h-10 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700"
      />
    </div>
    <div>
      <label class="block text-sm text-gray-800 dark:text-gray-300 mb-1">${t(
        "label.color.light"
      )}</label>
      <input
        type="color"
        id="qrLight"
        value="#ffffff"
        class="w-full h-10 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700"
      />
    </div>
  </div>

  <label class="block text-sm text-gray-800 dark:text-gray-300 mb-1">${t(
    "label.logo"
  )}</label>
  <input
    id="qrLogoUrl"
    class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded mb-3 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
    placeholder="${t("placeholder.logo")}"
  />

  <div class="flex flex-wrap gap-2 mb-4">
    <button id="qrGenerateBtn" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-1 rounded text-white dark:bg-indigo-500 dark:hover:bg-indigo-600">
      ${tGlobal("generate")}
    </button>
    <button id="qrDownloadPng" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white dark:bg-green-500 dark:hover:bg-green-600">
      ${tGlobal("download")} PNG
    </button>
    <button id="qrDownloadSvg" class="bg-yellow-600 hover:bg-yellow-700 px-4 py-1 rounded text-white dark:bg-yellow-500 dark:hover:bg-yellow-600">
      ${t("export.svg")}
    </button>
  </div>

  <div class="relative w-fit" id="qrContainer"></div>
    `;
  },

  init() {
    const loadScriptJs = (src, callback) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = callback;
      document.head.appendChild(script);
    };

    loadScriptJs("./vendor/qrcode.min.js", () => {
      loadScriptJs("./vendor/qr-code-styling.js", setup);
    });

    function setup() {
      let qr = null;

      const generate = () => {
        const text = document.getElementById("qrInput").value;
        const size = parseInt(document.getElementById("qrSize").value);
        const margin = parseInt(document.getElementById("qrMargin").value);
        const colorDark = document.getElementById("qrDark").value;
        const colorLight = document.getElementById("qrLight").value;
        const logoUrl = document.getElementById("qrLogoUrl").value;
        const container = document.getElementById("qrContainer");

        container.innerHTML = "";

        qr = new QRCodeStyling({
          width: size,
          height: size,
          data: text,
          image: logoUrl || undefined,
          margin: margin,
          dotsOptions: {
            color: colorDark,
            type: "square",
          },
          backgroundOptions: {
            color: colorLight,
          },
          imageOptions: {
            crossOrigin: "anonymous",
            margin: 4,
          },
        });

        qr.append(container);
      };

      document
        .getElementById("qrGenerateBtn")
        .addEventListener("click", generate);
      document.getElementById("qrDownloadPng").addEventListener("click", () => {
        if (qr) qr.download({ extension: "png" });
      });
      document.getElementById("qrDownloadSvg").addEventListener("click", () => {
        if (qr) qr.download({ extension: "svg" });
      });
    }
  },
};

export default advanced_qr_code_generator;
