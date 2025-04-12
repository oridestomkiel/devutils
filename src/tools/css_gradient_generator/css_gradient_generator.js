import { loadToolI18n } from "../../utils/i18n-loader.js";

const css_gradient_generator = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  render() {
    const t = (key) => this.i18n?.labels?.[key] ?? key;

    return `
    <div class="grid grid-cols-2 gap-2 mb-3">
      <div>
        <label class="block text-sm text-gray-800 dark:text-gray-300 mb-1">${t(
          "color1"
        )}</label>
        <input type="color" id="gradColor1" value="#ff6b6b" class="w-full h-10 rounded" />
      </div>
      <div>
        <label class="block text-sm text-gray-800 dark:text-gray-300 mb-1">${t(
          "color2"
        )}</label>
        <input type="color" id="gradColor2" value="#6b6bff" class="w-full h-10 rounded" />
      </div>
    </div>

    <label class="block text-sm text-gray-800 dark:text-gray-300 mb-1">${t(
      "direction"
    )}</label>
    <select id="gradDirection" class="w-full p-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded mb-3">
      <option value="to right">⬅️ → Direita</option>
      <option value="to left">➡️ ← Esquerda</option>
      <option value="to bottom">⬆️ ↓ Baixo</option>
      <option value="to top">⬇️ ↑ Cima</option>
      <option value="135deg">↘️ Diagonal (135°)</option>
      <option value="45deg">↗️ Diagonal (45°)</option>
    </select>

    <button id="gradGenBtn" class="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded text-white">${t(
      "generate"
    )}</button>
    <button id="gradCopyBtn" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded ml-2 text-white">${t(
      "copy"
    )}</button>

    <div id="gradPreview" class="mt-4 h-32 rounded shadow-inner border border-gray-300 dark:border-gray-600"></div>
    <pre id="gradCSS" class="mt-2 text-green-700 dark:text-green-400 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-900 p-3 rounded whitespace-pre-wrap break-words text-sm"></pre>
    `;
  },

  init() {
    const t = (key) => this.i18n?.labels?.[key] ?? key;
    const genBtn = document.getElementById("gradGenBtn");
    const copyBtn = document.getElementById("gradCopyBtn");

    genBtn.addEventListener("click", () => {
      const c1 = document.getElementById("gradColor1").value;
      const c2 = document.getElementById("gradColor2").value;
      const dir = document.getElementById("gradDirection").value;
      const css = `background: linear-gradient(${dir}, ${c1}, ${c2});`;

      document.getElementById("gradPreview").style.background = css;
      document.getElementById("gradCSS").innerText = css;
    });

    copyBtn.addEventListener("click", () => {
      const css = document.getElementById("gradCSS").innerText;
      if (!css) return;
      navigator.clipboard.writeText(css).then(() => {
        copyBtn.innerText = t("copied");
        setTimeout(() => (copyBtn.innerText = t("copy")), 1500);
      });
    });
  },
};

export default css_gradient_generator;
