import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const scroll_snap_generator = {
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
    <div id="scrollSnapGen">
      <div class="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label class="text-sm text-gray-800 dark:text-gray-300">${t(
            "direction"
          )}</label>
          <select id="snapDirection" class="w-full p-1 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white">
            <option value="x">${t("horizontal")}</option>
            <option value="y">${t("vertical")}</option>
          </select>
        </div>
        <div>
          <label class="text-sm text-gray-800 dark:text-gray-300">${t(
            "behavior"
          )}</label>
          <select id="snapType" class="w-full p-1 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white">
            <option value="mandatory">mandatory</option>
            <option value="proximity">proximity</option>
          </select>
        </div>
        <div>
          <label class="text-sm text-gray-800 dark:text-gray-300">${t(
            "padding"
          )}</label>
          <input type="number" id="snapPadding" value="0" class="w-full p-1 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white" />
        </div>
        <div>
          <label class="text-sm text-gray-800 dark:text-gray-300">${t(
            "gap"
          )}</label>
          <input type="number" id="snapGap" value="8" class="w-full p-1 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white" />
        </div>
      </div>

      <button id="snapCopy" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white dark:bg-green-500 dark:hover:bg-green-600">
        ${tGlobal("copy")}
      </button>

      <div class="mt-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-black rounded overflow-auto max-h-72" id="snapPreviewWrapper">
        <div id="snapPreview" class="flex p-0 gap-0 scroll-snap-container">
          ${[1, 2, 3, 4, 5]
            .map(
              (i) => `
              <div class="snap-start shrink-0 w-48 h-32 bg-indigo-500 text-white rounded flex items-center justify-center font-bold text-xl">
                ${i}
              </div>`
            )
            .join("")}
        </div>
      </div>

      <pre id="snapCSS" class="mt-2 text-green-600 bg-white border border-gray-300 p-3 rounded whitespace-pre-wrap break-words text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-green-400"></pre>
    </div>
    `;
  },

  init() {
    const dir = document.getElementById("snapDirection");
    const type = document.getElementById("snapType");
    const padding = document.getElementById("snapPadding");
    const gap = document.getElementById("snapGap");
    const preview = document.getElementById("snapPreview");
    const output = document.getElementById("snapCSS");
    const copy = document.getElementById("snapCopy");

    const update = () => {
      const axis = dir.value;
      const snap = type.value;
      const pad = parseInt(padding.value, 10);
      const g = parseInt(gap.value, 10);

      preview.style.display = "flex";
      preview.style.flexDirection = axis === "x" ? "row" : "column";
      preview.style.overflowX = axis === "x" ? "auto" : "hidden";
      preview.style.overflowY = axis === "y" ? "auto" : "hidden";
      preview.style.scrollSnapType = `${axis} ${snap}`;
      preview.style.scrollPadding = `${pad}px`;
      preview.style.gap = `${g}px`;
      preview.style.padding = `${pad}px`;

      const css = `
  .container {
    display: flex;
    flex-direction: ${axis === "x" ? "row" : "column"};
    gap: ${g}px;
    overflow-${axis}: auto;
    scroll-snap-type: ${axis} ${snap};
    scroll-padding: ${pad}px;
    padding: ${pad}px;
  }

  .item {
    scroll-snap-align: start;
    flex-shrink: 0;
    width: 12rem;
    height: 8rem;
    background: #6366f1;
    color: white;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;
  }
      `.trim();

      const html = `
  <div class="container">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
    <div class="item">5</div>
  </div>
      `.trim();

      output.innerText = css + "\n\n" + html;
    };

    [dir, type, padding, gap].forEach((el) =>
      el.addEventListener("input", update)
    );

    copy.addEventListener("click", () => {
      const text = output.innerText;
      navigator.clipboard.writeText(text).then(() => {
        copy.innerText = tGlobal("copied");
        setTimeout(() => (copy.innerText = tGlobal("copy")), 1500);
      });
    });

    update();
  },
};

export default scroll_snap_generator;
