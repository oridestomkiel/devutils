import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const multi_line_editor = {
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
<div class="space-y-4 text-sm text-gray-800 dark:text-white">
  <p>${t("intro")}</p>

  <div class="grid gap-2">
    <label class="font-medium">${t("label.lines")}</label>
    <input id="lineCount" type="number" min="1" value="5"
      class="w-24 p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white" />
  </div>

  <div class="grid gap-2">
    <label class="font-medium">${t("label.input")}</label>
    <input id="lineInput" type="text" placeholder="${t("placeholder.input")}"
      class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white" />
  </div>

  <div class="grid gap-2">
    <label class="font-medium">${t("label.template")}</label>
    <textarea id="lineTemplate" rows="6" placeholder="${t(
      "placeholder.template"
    )}"
      class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white font-mono text-xs"></textarea>
    <p class="text-xs text-gray-500">${t("hint.separator")}</p>
  </div>

  <div class="grid gap-2">
    <label class="font-medium">${t("label.output")}</label>
    <pre id="multiLineOutput"
      class="p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded text-xs font-mono whitespace-pre-wrap overflow-auto"></pre>
  </div>

  <div class="flex gap-2">
    <button id="copyBtn" class="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 px-3 py-1 rounded text-xs">
      ${tGlobal("copy")}
    </button>
    <button id="exportBtn" class="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 px-3 py-1 rounded text-xs">
      💾 ${t("btn.export")}
    </button>
  </div>

  <details class="mt-4">
    <summary class="cursor-pointer font-medium text-blue-600 dark:text-blue-400">❓ ${t(
      "label.help"
    )}</summary>
    <div class="mt-2 space-y-1 text-xs leading-relaxed">
      <p>${t("help.intro")}</p>
      <ul class="list-disc list-inside">
        <li><code>{{input}}</code> → ${t("help.input")}</li>
        <li><code>{{n}}</code> → ${t("help.n")}</li>
        <li><code>{{i}}</code> / <code>{{i:X}}</code> → ${t("help.i")}</li>
      </ul>
      <p class="mt-2">${t("help.separator")}</p>
    </div>
  </details>
</div>`;
  },

  init() {
    const $ = (id) => document.getElementById(id);
    const input = $("lineInput");
    const template = $("lineTemplate");
    const count = $("lineCount");
    const output = $("multiLineOutput");
    const copyBtn = $("copyBtn");
    const exportBtn = $("exportBtn");

    const renderOutput = () => {
      const inputVal = input.value;
      const templateRaw = template.value;
      const templates = templateRaw.split("---");
      const total = parseInt(count.value) || 0;

      const rendered = templates
        .map((templateValue) => {
          const lines = Array.from({ length: total }, (_, idx) => {
            const n = idx + 1;
            let line = templateValue;

            line = line.replace(/{{input}}/g, inputVal);
            line = line.replace(/{{n}}/g, n);
            line = line.replace(/{{i(?::(\d+))?}}/g, (_, pad) =>
              String(n).padStart(pad ? parseInt(pad) : 1, "0")
            );

            return line.trim();
          });

          return lines.join("\n");
        })
        .join("\n\n");

      output.textContent = rendered;
    };

    input.addEventListener("input", renderOutput);
    template.addEventListener("input", renderOutput);
    count.addEventListener("input", renderOutput);

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(output.textContent).then(() => {
        copyBtn.textContent = tGlobal("copied");
        setTimeout(() => (copyBtn.textContent = tGlobal("copy")), 1500);
      });
    });

    exportBtn.addEventListener("click", () => {
      const blob = new Blob([output.textContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "multi-line.txt";
      a.click();
      URL.revokeObjectURL(url);
    });

    renderOutput();
  },
};

export default multi_line_editor;
