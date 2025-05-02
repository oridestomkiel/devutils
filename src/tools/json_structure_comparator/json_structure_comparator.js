import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const json_structure_comparator = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  license: "MIT",
  version: "1.0.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
<div class="space-y-4 text-sm text-gray-800 dark:text-white">
  <p>${t("intro")}</p>

  <div class="grid md:grid-cols-2 gap-4">
    <div>
      <label class="block font-medium mb-1">${t("label.inputA")}</label>
      <textarea id="jsonA" placeholder="${t(
        "placeholder.pasteJson"
      )}" rows="10" class="w-full p-2 font-mono rounded border dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-green-400 text-xs"></textarea>
    </div>
    <div>
      <label class="block font-medium mb-1">${t("label.inputB")}</label>
      <textarea id="jsonB" placeholder="${t(
        "placeholder.pasteJson"
      )}" rows="10" class="w-full p-2 font-mono rounded border dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-green-400 text-xs"></textarea>
    </div>
  </div>

  <div class="flex items-center gap-4">
    <label class="flex items-center gap-2 text-xs">
      <input type="checkbox" id="ignoreValues" class="form-checkbox" />
      ${t("label.ignoreValues")}
    </label>
    <label class="flex items-center gap-2 text-xs">
      <input type="checkbox" id="showSame" class="form-checkbox" />
      ${t("label.showSame")}
    </label>
    <button id="compareBtn" class="ml-auto bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1 rounded">${t(
      "btn.compare"
    )}</button>
  </div>

  <div>
    <label class="block font-medium mb-1">${t("label.result")}</label>
    <pre id="diffOutput" class="text-xs whitespace-pre-wrap font-mono p-2 rounded border bg-white dark:bg-gray-900 dark:border-gray-700 overflow-auto max-h-[50vh]"></pre>
  </div>

  <div class="grid md:grid-cols-2 gap-4 text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded border dark:border-gray-700">
    <div><strong>${t(
      "summary.total"
    )}:</strong> <span id="sumTotal">-</span></div>
    <div><strong>${t(
      "summary.missing"
    )}:</strong> <span id="sumMissing">-</span></div>
    <div><strong>${t(
      "summary.extra"
    )}:</strong> <span id="sumExtra">-</span></div>
    <div><strong>${t(
      "summary.diffType"
    )}:</strong> <span id="sumType">-</span></div>
    <div><strong>${t(
      "summary.equal"
    )}:</strong> <span id="sumEqual">-</span></div>
  </div>

  <div class="flex gap-2 mt-2">
    <button id="copyBtn" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-xs px-3 py-1 rounded">${t(
      "btn.copy"
    )}</button>
    <button id="exportBtn" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-xs px-3 py-1 rounded">${t(
      "btn.export"
    )}</button>
  </div>
</div>`;
  },

  init() {
    const $ = (id) => document.getElementById(id);
    const diffOutput = $("diffOutput");

    function parse(json) {
      try {
        return JSON.parse(json);
      } catch {
        return null;
      }
    }

    function compareJSON(
      a,
      b,
      path = "",
      opts = {},
      stats = { total: 0, missing: 0, extra: 0, type: 0, equal: 0 }
    ) {
      const diffs = [];

      const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
      for (const key of keys) {
        const fullPath = path ? `${path}.${key}` : key;
        stats.total++;

        if (!(key in a)) {
          stats.extra++;
          diffs.push({ type: "extra", key: fullPath });
        } else if (!(key in b)) {
          stats.missing++;
          diffs.push({ type: "missing", key: fullPath });
        } else {
          const valA = a[key];
          const valB = b[key];

          if (
            !opts.ignoreValues &&
            JSON.stringify(valA) !== JSON.stringify(valB)
          ) {
            if (typeof valA !== typeof valB) {
              stats.type++;
              diffs.push({ type: "type", key: fullPath });
            } else {
              stats.type++;
              diffs.push({ type: "type", key: fullPath });
            }
          } else if (opts.ignoreValues && typeof valA !== typeof valB) {
            stats.type++;
            diffs.push({ type: "type", key: fullPath });
          } else {
            stats.equal++;
            if (opts.showSame) diffs.push({ type: "equal", key: fullPath });
          }

          if (typeof valA === "object" && valA !== null && valB !== null) {
            diffs.push(...compareJSON(valA, valB, fullPath, opts, stats));
          }
        }
      }

      return diffs;
    }

    function updateStats(stats) {
      $("sumTotal").textContent = stats.total;
      $("sumMissing").textContent = stats.missing;
      $("sumExtra").textContent = stats.extra;
      $("sumType").textContent = stats.type;
      $("sumEqual").textContent = stats.equal;
    }

    $("compareBtn").addEventListener("click", () => {
      const jsonA = parse($("jsonA").value);
      const jsonB = parse($("jsonB").value);
      const ignoreValues = $("ignoreValues").checked;
      const showSame = $("showSame").checked;

      if (!jsonA || !jsonB) {
        diffOutput.textContent = tGlobal("error.invalidJson");
        return;
      }

      const stats = { total: 0, missing: 0, extra: 0, type: 0, equal: 0 };
      const diffs = compareJSON(
        jsonA,
        jsonB,
        "",
        { ignoreValues, showSame },
        stats
      );
      updateStats(stats);

      diffOutput.innerHTML =
        diffs
          .map((d) => {
            let cls = "";
            if (d.type === "missing") cls = "text-red-500";
            else if (d.type === "extra") cls = "text-yellow-500";
            else if (d.type === "type") cls = "text-orange-500";
            else cls = "text-green-500";
            return `<div class="${cls}">${d.key} <small>(${d.type})</small></div>`;
          })
          .join("") || "<span class='text-green-600'>✔️ Sem diferenças</span>";
    });

    $("copyBtn").addEventListener("click", () => {
      navigator.clipboard.writeText(diffOutput.innerText);
      $("copyBtn").textContent = tGlobal("copied");
      setTimeout(() => ($("copyBtn").textContent = tGlobal("btn.copy")), 1500);
    });

    $("exportBtn").addEventListener("click", () => {
      const blob = new Blob([diffOutput.innerText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "diff_result.txt";
      a.click();
      URL.revokeObjectURL(url);
    });
  },
};

export default json_structure_comparator;
