import { loadToolI18n } from "../../utils/i18n-loader.js";

const css_clamp_generator = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  render() {
    const t = (key) => this.i18n?.labels?.[key] ?? key;

    return `
    <div class="grid grid-cols-3 gap-2 mb-3">
      <div>
        <label class="text-sm">${t("min")}</label>
        <input type="text" id="clampMin" class="input" value="1rem" />
      </div>
      <div>
        <label class="text-sm">${t("ideal")}</label>
        <input type="text" id="clampIdeal" class="input" value="2vw" />
      </div>
      <div>
        <label class="text-sm">${t("max")}</label>
        <input type="text" id="clampMax" class="input" value="2.5rem" />
      </div>
    </div>

    <label class="text-sm mb-1">${t("property")}</label>
    <select id="clampProperty" class="input mb-3">
      <option value="font-size">font-size</option>
      <option value="padding">padding</option>
      <option value="margin">margin</option>
      <option value="gap">gap</option>
      <option value="height">height</option>
      <option value="width">width</option>
    </select>

    <button id="clampGenBtn" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded">${t(
      "generate"
    )}</button>
    <button id="clampCopyBtn" class="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded ml-2">${t(
      "copy"
    )}</button>

    <div id="clampPreview" class="mt-4 border p-10 flex items-center justify-center rounded text-center">
      <div id="clampBox" class="text-black dark:text-white font-bold">${t(
        "preview"
      )}</div>
    </div>

    <pre id="clampCSS" class="mt-2 text-green-700 dark:text-green-400 bg-white border dark:bg-gray-900 p-3 rounded whitespace-pre-wrap text-sm"></pre>
    `;
  },

  init() {
    const get = (id) => document.getElementById(id);
    const genBtn = get("clampGenBtn");
    const copyBtn = get("clampCopyBtn");

    genBtn.addEventListener("click", () => {
      const min = get("clampMin").value.trim();
      const ideal = get("clampIdeal").value.trim();
      const max = get("clampMax").value.trim();
      const prop = get("clampProperty").value;

      const css = `${prop}: clamp(${min}, ${ideal}, ${max});`;
      const box = get("clampBox");
      const output = get("clampCSS");

      ["fontSize", "padding", "margin", "gap", "height", "width"].forEach(
        (p) => {
          box.style[p] = "";
        }
      );

      const cssProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      box.style[cssProp] = `clamp(${min}, ${ideal}, ${max})`;
      output.innerText = css;
    });

    copyBtn.addEventListener("click", () => {
      const css = get("clampCSS").innerText;
      if (!css) return;

      navigator.clipboard.writeText(css).then(() => {
        const original = copyBtn.innerText;
        copyBtn.innerText = this.i18n?.labels?.copied ?? "Copiado!";
        setTimeout(() => (copyBtn.innerText = original), 1500);
      });
    });
  },
};

export default css_clamp_generator;
