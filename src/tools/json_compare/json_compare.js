import { loadToolI18n } from "../../utils/i18n-loader.js";

const json_structure_diff = {
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

  <div class="grid md:grid-cols-2 gap-4">
    <div>
      <label class="block font-medium mb-1">${t("label.jsonA")}</label>
      <textarea id="jsonA" rows="12" placeholder='{"name":"Ana","age":30}' class="w-full p-2 font-mono rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-green-400 text-xs"></textarea>
    </div>
    <div>
      <label class="block font-medium mb-1">${t("label.jsonB")}</label>
      <textarea id="jsonB" rows="12" placeholder='{"name":"Ana","age":"30"}' class="w-full p-2 font-mono rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-green-400 text-xs"></textarea>
    </div>
  </div>

  <div class="flex flex-wrap gap-4 items-center">
    <div>
      <label class="block font-medium">${t("label.compareMode")}</label>
      <select id="compareMode" class="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
        <option value="structure">${t("option.structure")}</option>
        <option value="type">${t("option.type")}</option>
        <option value="value">${t("option.value")}</option>
      </select>
    </div>
    <label class="flex items-center gap-2">
      <input type="checkbox" id="ignoreValues" />
      ${t("option.ignoreValues")}
    </label>
    <label class="flex items-center gap-2">
      <input type="checkbox" id="normalizeTypes" />
      ${t("option.normalizeTypes")}
    </label>
    <button id="compareBtn" class="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
      ${t("btn.compare")}
    </button>
  </div>

  <div>
    <label class="block font-medium mb-1">${t("label.result")}</label>
    <div id="result" class="text-xs bg-white dark:bg-gray-900 p-4 rounded border border-gray-300 dark:border-gray-600 whitespace-pre-wrap font-mono overflow-auto max-h-[60vh] text-gray-800 dark:text-gray-100"></div>
  </div>
</div>`;
  },

  init() {
    const $ = (id) => document.getElementById(id);
    const jsonA = $("jsonA");
    const jsonB = $("jsonB");
    const result = $("result");
    const compareBtn = $("compareBtn");
    const compareMode = $("compareMode");
    const ignoreValues = $("ignoreValues");
    const normalizeTypes = $("normalizeTypes");

    const t = (key) => this.i18n?.[key] ?? key;

    const parseJSON = (text) => {
      try {
        return JSON.parse(text);
      } catch (e) {
        return null;
      }
    };

    const compareJSON = (a, b, opts) => {
      let total = 0,
        diff = 0,
        missing = 0,
        extra = 0,
        typeMismatch = 0;
      let summary = [];

      const isObject = (val) =>
        val && typeof val === "object" && !Array.isArray(val);
      const normalizeVal = (v) =>
        opts.normalizeTypes && typeof v === "string" && !isNaN(v)
          ? Number(v)
          : v;

      const walk = (a, b, path = "") => {
        const aKeys = a ? Object.keys(a) : [];
        const bKeys = b ? Object.keys(b) : [];
        const keys = new Set([...aKeys, ...bKeys]);

        for (let key of keys) {
          const fullPath = path ? `${path}.${key}` : key;
          const valA = a?.[key];
          const valB = b?.[key];

          const existsA = key in (a || {});
          const existsB = key in (b || {});
          total++;

          if (!existsA) {
            extra++;
            summary.push(`🟥 + ${fullPath}`);
            continue;
          }

          if (!existsB) {
            missing++;
            summary.push(`🟥 - ${fullPath}`);
            continue;
          }

          const normA = normalizeVal(valA);
          const normB = normalizeVal(valB);

          if (opts.mode === "type" || opts.mode === "value") {
            const typeA = Array.isArray(normA) ? "array" : typeof normA;
            const typeB = Array.isArray(normB) ? "array" : typeof normB;

            if (typeA !== typeB) {
              typeMismatch++;
              summary.push(`🟨 ~ ${fullPath} (${typeA} ≠ ${typeB})`);
              continue;
            }
          }

          if (opts.mode === "value" && !opts.ignoreValues) {
            if (JSON.stringify(normA) !== JSON.stringify(normB)) {
              diff++;
              summary.push(`🟥 ≠ ${fullPath}`);
              continue;
            }
          }

          if (isObject(normA) && isObject(normB)) {
            walk(normA, normB, fullPath);
          } else if (Array.isArray(normA) && Array.isArray(normB)) {
            const max = Math.max(normA.length, normB.length);
            for (let i = 0; i < max; i++) {
              walk(normA[i], normB[i], `${fullPath}[${i}]`);
            }
          }
        }
      };

      walk(a, b);

      const stats = [
        `🔢 ${t("stats.total")}: ${total}`,
        `🟥 ${t("stats.differentValues")}: ${diff}`,
        `🟨 ${t("stats.typeMismatch")}: ${typeMismatch}`,
        `➕ ${t("stats.extra")}: ${extra}`,
        `➖ ${t("stats.missing")}: ${missing}`,
      ];

      return {
        summary: `<div class="mb-2 font-semibold">📊 ${t(
          "label.summary"
        )}:</div>
<pre class="text-xs mb-2">${stats.join("\n")}</pre>
<div class="font-semibold">🔎 ${t("label.details")}:</div>
<pre class="text-xs text-yellow-700 dark:text-yellow-400">${
          summary.join("\n") || "✅ " + t("label.noDiffs")
        }</pre>`,
      };
    };

    const update = () => {
      const a = parseJSON(jsonA.value);
      const b = parseJSON(jsonB.value);

      if (!a || !b) {
        result.innerHTML = `<div class="text-red-500">${t("error")}</div>`;
        return;
      }

      const res = compareJSON(a, b, {
        mode: compareMode.value,
        ignoreValues: ignoreValues.checked,
        normalizeTypes: normalizeTypes.checked,
      });

      result.innerHTML = res.summary;
    };

    compareBtn.addEventListener("click", update);
  },
};

export default json_structure_diff;
