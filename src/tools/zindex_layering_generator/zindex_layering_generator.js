import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const zindex_layering_generator = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
      <div id="zIndexContainer">
        <div class="grid grid-cols-3 gap-2 mb-3">
          ${["A", "B", "C"]
            .map(
              (id) => `
            <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">
              <h3 class="text-gray-800 dark:text-white font-bold mb-1">${t(
                "layer_label"
              )} ${id}</h3>
              <label class="text-xs text-gray-600 dark:text-gray-400 block mb-1">${t(
                "position_label"
              )}</label>
              <select id="pos${id}" class="w-full mb-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white p-1 rounded border border-gray-300 dark:border-gray-600">
                <option>relative</option>
                <option>absolute</option>
                <option>fixed</option>
              </select>
              <label class="text-xs text-gray-600 dark:text-gray-400 block mb-1">${t(
                "zindex_label"
              )}</label>
              <input type="number" id="z${id}" value="${
                id === "A" ? 1 : id === "B" ? 2 : 3
              }" class="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white p-1 rounded border border-gray-300 dark:border-gray-600" />
              <label class="text-xs text-gray-600 dark:text-gray-400 block mt-2 mb-1">${t(
                "color_label"
              )}</label>
              <input type="color" id="bg${id}" value="${
                id === "A" ? "#f87171" : id === "B" ? "#60a5fa" : "#34d399"
              }" class="w-full h-10 rounded" />
            </div>`
            )
            .join("")}
        </div>

        <button id="zCopy" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white">${tGlobal(
          "copy"
        )}</button>

        <div class="relative h-64 border border-gray-300 dark:border-gray-600 mt-4 rounded overflow-hidden bg-white dark:bg-gray-900">
          <div id="zPreview" class="relative w-full h-full" style="transform: translateZ(0);">
            ${["A", "B", "C"]
              .map(
                (id) => `
                <div id="layer${id}" class="absolute inset-6 flex items-center justify-center font-bold text-white rounded shadow">
                  ${t("layer_label")} ${id}
                </div>`
              )
              .join("")}
          </div>
        </div>

        <pre id="zCSS" class="mt-2 bg-white text-green-600 dark:text-green-400 bg-gray-100 dark:bg-gray-900 p-3 rounded whitespace-pre-wrap break-words text-sm border border-gray-300 dark:border-gray-700"></pre>
      </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;
    const layers = ["A", "B", "C"];

    const update = () => {
      const css = layers
        .map((id) => {
          const pos = document.getElementById(`pos${id}`).value;
          const z = document.getElementById(`z${id}`).value;
          const bg = document.getElementById(`bg${id}`).value;
          const el = document.getElementById(`layer${id}`);

          el.style.position = pos;
          el.style.zIndex = z;
          el.style.backgroundColor = bg;

          return `#zIndexContainer #layer${id} {
    position: ${pos};
    z-index: ${z};
    background: ${bg};
  }`;
        })
        .join("\n\n");

      document.getElementById("zCSS").innerText = css;
    };

    document.getElementById("zCopy").addEventListener("click", () => {
      const css = document.getElementById("zCSS").innerText;
      if (!css) return;
      navigator.clipboard.writeText(css).then(() => {
        const btn = document.getElementById("zCopy");
        btn.innerText = t("copied");
        setTimeout(() => (btn.innerText = tGlobal("copy")), 1500);
      });
    });

    ["pos", "z", "bg"].forEach((prefix) =>
      layers.forEach((id) => {
        const el = document.getElementById(`${prefix}${id}`);
        if (el) el.addEventListener("input", update);
      })
    );

    update();
  },
};

export default zindex_layering_generator;
