import { loadToolI18n } from "../../utils/i18n-loader.js";

const css_button_generator = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  render() {
    const t = (key) => this.i18n?.labels?.[key] ?? key;

    return `
    <div id="btnContainer">
      <div class="grid grid-cols-2 gap-2 mb-3">
        <div><label>${t(
          "bg"
        )}</label><input type="color" id="btnBg" class="w-full h-10 rounded" value="#4f46e5" /></div>
        <div><label>${t(
          "text"
        )}</label><input type="color" id="btnText" class="w-full h-10 rounded" value="#ffffff" /></div>
        <div><label>${t(
          "paddingY"
        )}</label><input type="number" id="btnPy" value="10" class="input" /></div>
        <div><label>${t(
          "paddingX"
        )}</label><input type="number" id="btnPx" value="20" class="input" /></div>
        <div><label>${t(
          "radius"
        )}</label><input type="number" id="btnRadius" value="8" class="input" /></div>
        <div><label>${t(
          "shadowColor"
        )}</label><input type="color" id="btnShadowColor" value="#000000" class="w-full h-10 rounded" /></div>
        <div><label>${t(
          "shadowOpacity"
        )}</label><input type="range" id="btnShadowAlpha" min="0" max="1" step="0.01" value="0.2" class="w-full" /><span id="btnShadowAlphaValue" class="text-center block">0.20</span></div>
        <div><label>${t(
          "offsetX"
        )}</label><input type="number" id="btnShadowX" value="0" class="input" /></div>
        <div><label>${t(
          "offsetY"
        )}</label><input type="number" id="btnShadowY" value="2" class="input" /></div>
        <div><label>${t(
          "blur"
        )}</label><input type="number" id="btnShadowBlur" value="6" class="input" /></div>
        <div><label>${t(
          "spread"
        )}</label><input type="number" id="btnShadowSpread" value="0" class="input" /></div>
        <div class="col-span-2"><label>${t(
          "hover"
        )}</label><input type="color" id="btnHover" class="w-full h-10 rounded" value="#4338ca" /></div>
      </div>

      <button id="btnCopy" class="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded">${t(
        "copy"
      )}</button>

      <div class="mt-4 bg-gray-100 dark:bg-gray-800 border p-6 rounded text-center">
        <button id="btnPreview" class="btn-preview font-bold">${t(
          "preview"
        )}</button>
      </div>

      <pre id="btnCSS" class="mt-2 text-green-700 dark:text-green-400 bg-white border dark:bg-gray-900 p-3 rounded whitespace-pre-wrap text-sm"></pre>
    </div>
    `;
  },

  init() {
    const get = (id) => document.getElementById(id);
    const inputIds = [
      "btnBg",
      "btnText",
      "btnPy",
      "btnPx",
      "btnRadius",
      "btnShadowColor",
      "btnShadowAlpha",
      "btnShadowX",
      "btnShadowY",
      "btnShadowBlur",
      "btnShadowSpread",
      "btnHover",
    ];

    const preview = get("btnPreview");
    const output = get("btnCSS");
    const copyBtn = get("btnCopy");
    const shadowAlphaValue = get("btnShadowAlphaValue");

    const hexToRGB = (hex) => {
      const raw = hex.replace("#", "");
      const bigint = parseInt(raw, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `${r}, ${g}, ${b}`;
    };

    const update = () => {
      const bg = get("btnBg").value;
      const text = get("btnText").value;
      const py = get("btnPy").value;
      const px = get("btnPx").value;
      const radius = get("btnRadius").value;
      const hover = get("btnHover").value;
      const shadowColor = get("btnShadowColor").value;
      const shadowAlpha = parseFloat(get("btnShadowAlpha").value);
      const shadowX = get("btnShadowX").value;
      const shadowY = get("btnShadowY").value;
      const shadowBlur = get("btnShadowBlur").value;
      const shadowSpread = get("btnShadowSpread").value;

      const rgba = `rgba(${hexToRGB(shadowColor)}, ${shadowAlpha})`;
      const shadow = `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${rgba}`;
      shadowAlphaValue.innerText = shadowAlpha.toFixed(2);

      const css = `
#btnContainer .btn-preview {
  background: ${bg};
  color: ${text};
  padding: ${py}px ${px}px;
  border: none;
  border-radius: ${radius}px;
  box-shadow: ${shadow};
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
}
#btnContainer .btn-preview:hover {
  background: ${hover};
}`.trim();

      Object.assign(preview.style, {
        background: bg,
        color: text,
        padding: `${py}px ${px}px`,
        borderRadius: `${radius}px`,
        boxShadow: shadow,
      });

      preview.onmouseover = () => (preview.style.background = hover);
      preview.onmouseout = () => (preview.style.background = bg);

      output.innerText = css;
    };

    inputIds.forEach((id) => get(id).addEventListener("input", update));

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(output.innerText).then(() => {
        const original = copyBtn.innerText;
        copyBtn.innerText = this.i18n?.labels?.["copied"] ?? "Copiado!";
        setTimeout(() => (copyBtn.innerText = original), 1500);
      });
    });

    update();
  },
};

export default css_button_generator;
