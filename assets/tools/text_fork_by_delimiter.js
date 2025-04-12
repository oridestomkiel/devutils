import { loadToolI18n } from "../../utils/i18n-loader.js";

const text_fork_by_delimiter = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.2.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
    <div class="mb-4">
      <textarea id="forkInput" class="w-full p-2 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-700 text-black dark:text-white rounded text-sm font-mono" rows="6" placeholder="${t(
        "placeholder"
      )}"></textarea>
    </div>

    <div class="mb-2">
      <label class="text-xs text-gray-600 dark:text-gray-400">${t(
        "delimiter"
      )}</label>
      <input id="forkDelimiter" type="text" class="w-full p-2 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-700 text-black dark:text-white rounded text-sm" value="\\n" />
    </div>

    <div class="mb-4">
      <label class="text-xs text-gray-600 dark:text-gray-400">${t(
        "operation"
      )}</label>
      <select id="forkOperation" class="w-full p-2 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-700 text-black dark:text-white rounded text-sm">
        ${[
          ["fromBase64", t("fromBase64")],
          ["toBase64", t("toBase64")],
          ["fromHex", t("fromHex")],
          ["toHex", t("toHex")],
          ["toUrl", t("toUrl")],
          ["fromUrl", t("fromUrl")],
          ["toUpper", t("toUpper")],
          ["toLower", t("toLower")],
          ["reverse", t("reverse")],
          ["removeSpaces", t("removeSpaces")],
          ["removeBreaks", t("removeBreaks")],
          ["toBinary", t("toBinary")],
          ["fromBinary", t("fromBinary")],
        ]
          .map(([value, label]) => `<option value="${value}">${label}</option>`)
          .join("")}
      </select>
    </div>

    <div class="flex gap-2 mb-4">
      <button id="forkProcessBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm text-white">${t(
        "process"
      )}</button>
      <button id="forkClearBtn" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded text-sm text-black dark:text-white">${t(
        "clear"
      )}</button>
    </div>

    <pre id="forkOutput" class="bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-900 text-green-600 dark:text-green-400 p-4 rounded text-sm whitespace-pre-wrap break-words hidden"></pre>
    `;
  },

  init() {
    const inputEl = document.getElementById("forkInput");
    const delimiterEl = document.getElementById("forkDelimiter");
    const operationEl = document.getElementById("forkOperation");
    const outputEl = document.getElementById("forkOutput");
    const btn = document.getElementById("forkProcessBtn");
    const clearBtn = document.getElementById("forkClearBtn");

    const parseDelimiter = (str) => {
      if (str === "\\n") return "\n";
      if (str === "\\t") return "\t";
      if (str === "\\r") return "\r";
      return str;
    };

    const t = (key) => this.i18n?.[key] ?? key;

    const operations = {
      fromBase64: (text) => {
        try {
          return atob(text);
        } catch {
          return t("error_base64");
        }
      },
      toBase64: (text) => btoa(text),
      fromHex: (text) => {
        try {
          return decodeURIComponent(
            text.replace(/\s+/g, "").replace(/(..)/g, "%$1")
          );
        } catch {
          return t("error_hex");
        }
      },
      toHex: (text) =>
        Array.from(text)
          .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join(" "),
      toUrl: (text) => encodeURIComponent(text),
      fromUrl: (text) => {
        try {
          return decodeURIComponent(text);
        } catch {
          return t("error_url");
        }
      },
      toUpper: (text) => text.toUpperCase(),
      toLower: (text) => text.toLowerCase(),
      reverse: (text) => text.split("").reverse().join(""),
      removeSpaces: (text) => text.replace(/\s+/g, ""),
      removeBreaks: (text) => text.replace(/[\n\r]/g, ""),
      toBinary: (text) =>
        text
          .split("")
          .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
          .join(" "),
      fromBinary: (text) =>
        text
          .split(/\s+/)
          .map((b) => String.fromCharCode(parseInt(b, 2)))
          .join(""),
    };

    btn.addEventListener("click", () => {
      const raw = inputEl.value.trim();
      const delim = parseDelimiter(delimiterEl.value.trim());
      const op = operationEl.value;
      if (!raw || !operations[op]) return;

      const parts = raw.split(delim);
      const result = parts.map(operations[op]).join("\n");

      outputEl.textContent = result;
      outputEl.classList.remove("hidden");
    });

    clearBtn.addEventListener("click", () => {
      inputEl.value = "";
      outputEl.textContent = "";
      outputEl.classList.add("hidden");
    });
  },
};

export default text_fork_by_delimiter;
