import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const overlay_generator = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: true,
  license: "MIT",
  version: "1.2.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
    <div class="grid grid-cols-2 gap-2 mb-3">
      <div>
        <label class="text-sm text-gray-800 dark:text-gray-300">${t(
          "overlay_color"
        )}</label>
        <input
          type="color"
          id="overlayColor"
          value="#000000"
          class="w-full h-10 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700"
        />
      </div>
      <div>
        <label class="text-sm text-gray-800 dark:text-gray-300">${t(
          "opacity"
        )}</label>
        <input
          type="range"
          id="overlayAlpha"
          min="0"
          max="1"
          step="0.01"
          value="0.4"
          class="w-full"
        />
        <span id="overlayAlphaValue" class="text-sm text-gray-600 dark:text-gray-400 block text-center">0.40</span>
      </div>
      <div class="col-span-2">
        <label class="text-sm text-gray-800 dark:text-gray-300">${t(
          "blend_mode"
        )}</label>
        <select
          id="overlayBlend"
          class="w-full p-1 rounded bg-white border border-gray-300 text-gray-800 dark:bg-gray-700 dark:border-gray-700 dark:text-white"
        >
          <option value="normal">normal</option>
          <option value="multiply">multiply</option>
          <option value="overlay">overlay</option>
          <option value="screen">screen</option>
          <option value="soft-light">soft-light</option>
          <option value="hard-light">hard-light</option>
          <option value="color-dodge">color-dodge</option>
          <option value="darken">darken</option>
          <option value="lighten">lighten</option>
        </select>
      </div>
    </div>

    <div class="flex gap-2 mb-3">
      <button
        id="overlayCopy"
        class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white dark:bg-green-500 dark:hover:bg-green-600"
      >
        ${tGlobal("copy")}
      </button>
      <button
        id="overlayRefresh"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-white dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        🔄 ${t("new_image")}
      </button>
      <label class="text-sm text-gray-800 dark:text-gray-300 flex items-center gap-2">
        <input type="file" id="overlayUpload" accept="image/*" class="hidden" />
        <span class="bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 px-3 py-1 rounded cursor-pointer dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:hover:bg-gray-600">
          📁 ${t("upload_local")}
        </span>
      </label>
    </div>

    <div class="mt-4 relative h-56 border border-gray-300 rounded overflow-hidden dark:border-gray-700" id="overlayPreviewWrapper">
      <img id="overlayImage" src="" class="w-full h-full object-cover" />
      <div id="overlayPreview" class="absolute inset-0"></div>
    </div>

    <pre
      id="overlayCSS"
      class="mt-2 bg-white border border-gray-300 text-green-600 p-3 rounded whitespace-pre-wrap break-words text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-green-400"
    ></pre>
    `;
  },

  init() {
    const ACCESS_KEY = "qqX-zCJJ74tXG59lFDJOO9vk_FPejIPyfSD0R33_CXc";

    const colorInput = document.getElementById("overlayColor");
    const alphaInput = document.getElementById("overlayAlpha");
    const alphaValue = document.getElementById("overlayAlphaValue");
    const blendInput = document.getElementById("overlayBlend");

    const preview = document.getElementById("overlayPreview");
    const image = document.getElementById("overlayImage");
    const output = document.getElementById("overlayCSS");
    const copyBtn = document.getElementById("overlayCopy");
    const refreshBtn = document.getElementById("overlayRefresh");
    const uploadInput = document.getElementById("overlayUpload");

    const hexToRGBA = (hex, alpha = 1) => {
      const raw = hex.replace("#", "");
      const bigint = parseInt(raw, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const update = () => {
      const hex = colorInput.value;
      const alpha = parseFloat(alphaInput.value);
      const blend = blendInput.value;
      const rgba = hexToRGBA(hex, alpha);

      alphaValue.innerText = alpha.toFixed(2);
      preview.style.background = rgba;
      preview.style.mixBlendMode = blend;

      const css = `
  .overlay {
    background: ${rgba};
    mix-blend-mode: ${blend};
  }
      `.trim();

      output.innerText = css;
    };

    const fetchNewImage = () => {
      fetch(
        "https://api.unsplash.com/photos/random?query=landscape&orientation=landscape",
        {
          headers: {
            Authorization: `Client-ID ${ACCESS_KEY}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.urls?.regular) {
            image.src = data.urls.regular;
          }
        });
    };

    const handleUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        image.src = event.target.result;
      };
      reader.readAsDataURL(file);
    };

    [colorInput, alphaInput, blendInput].forEach((el) =>
      el.addEventListener("input", update)
    );

    uploadInput.addEventListener("change", handleUpload);
    refreshBtn.addEventListener("click", fetchNewImage);

    copyBtn.addEventListener("click", () => {
      const css = output.innerText;
      navigator.clipboard.writeText(css).then(() => {
        copyBtn.innerText = tGlobal("copied");
        setTimeout(() => (copyBtn.innerText = tGlobal("copy")), 1500);
      });
    });

    update();
    fetchNewImage();
  },
};

export default overlay_generator;
