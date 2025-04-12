import { loadToolI18n } from "../../utils/i18n-loader.js";

const color_palette_generator = {
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
    <input
      id="paletteInput"
      type="color"
      class="w-full h-10 rounded mb-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
    />

    <button
      id="paletteGenBtn"
      class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
    >
      ${t("button.generate")}
    </button>

    <div id="paletteOutput" class="grid grid-cols-5 gap-2 mt-4"></div>

    <div class="mt-4 flex gap-2">
      <textarea
        id="paletteColors"
        rows="3"
        readonly
        class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-green-700 dark:text-green-400 text-sm"
        placeholder="${t("placeholder.output")}"
      ></textarea>
      <button
        id="paletteCopyBtn"
        class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
      >
        ${t("button.copy")}
      </button>
    </div>
    `;
  },

  init() {
    const paletteInput = document.getElementById("paletteInput");
    const paletteOutput = document.getElementById("paletteOutput");
    const paletteGenBtn = document.getElementById("paletteGenBtn");
    const paletteColorsEl = document.getElementById("paletteColors");
    const paletteCopyBtn = document.getElementById("paletteCopyBtn");

    const lightenDarkenColor = (col, amt) => {
      let usePound = false;
      if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
      }

      let num = parseInt(col, 16);
      let r = Math.min(255, Math.max(0, (num >> 16) + amt));
      let g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
      let b = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));

      return (
        (usePound ? "#" : "") +
        ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")
      );
    };

    paletteGenBtn.addEventListener("click", () => {
      const base = paletteInput.value;
      paletteOutput.innerHTML = "";

      const steps = [-60, -30, 0, 30, 60];
      const generatedColors = [];

      steps.forEach((step) => {
        const color = lightenDarkenColor(base, step);
        generatedColors.push(color);

        const box = document.createElement("div");
        box.className = "h-16 rounded flex items-center justify-center";
        box.style.backgroundColor = color;
        box.title = color;
        box.innerHTML = `<span class="text-xs text-white drop-shadow">${color}</span>`;
        paletteOutput.appendChild(box);
      });

      paletteColorsEl.value = generatedColors.join("\n");
    });

    paletteCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(paletteColorsEl.value).then(() => {
        const originalText = paletteCopyBtn.innerText;
        paletteCopyBtn.innerText = "Copiado!";
        setTimeout(() => {
          paletteCopyBtn.innerText = originalText;
        }, 1500);
      });
    });
  },
};

export default color_palette_generator;
