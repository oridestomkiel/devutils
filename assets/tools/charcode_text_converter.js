import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const charcode_text_converter = {
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
  <select id="charcodeMode"
    class="mb-2 p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
    <option value="to">${t("mode.to")}</option>
    <option value="from">${t("mode.from")}</option>
  </select>

  <textarea
    id="charcodeInput"
    class="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
    rows="5"
    placeholder="${t("placeholder")}"
  ></textarea>

  <div class="flex gap-2 mb-2">
    <button
      id="charcodeBtn"
      class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
    >${t("convert")}</button>
    <button
      id="charcodeClear"
      class="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white px-3 py-1 rounded hidden"
    >${t("clear")}</button>
    <button
      id="charcodeCopy"
      class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-3 py-1 rounded hidden"
    >${tGlobal("copy")}</button>
  </div>

  <pre
    id="charcodeOutput"
    class="text-green-700 dark:text-green-400 bg-white dark:bg-gray-900 whitespace-pre-wrap break-words p-2 rounded border border-gray-300 dark:border-gray-700 hidden"
  ></pre>

  <p class="text-sm text-gray-600 dark:text-gray-400">
    ${t("reference")}:
    <a href="https://wikipedia.org/wiki/Plane_(Unicode)" target="_blank" class="underline text-blue-600 dark:text-blue-400">
      ${t("link")}
    </a>
  </p>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const input = document.getElementById("charcodeInput");
    const output = document.getElementById("charcodeOutput");
    const mode = document.getElementById("charcodeMode");
    const btn = document.getElementById("charcodeBtn");
    const clear = document.getElementById("charcodeClear");
    const copy = document.getElementById("charcodeCopy");

    const showOutput = (text) => {
      output.innerText = text;
      output.classList.remove("hidden");
      clear.classList.remove("hidden");
      copy.classList.remove("hidden");
    };

    btn.addEventListener("click", () => {
      const val = input.value.trim();
      if (!val) return;

      if (mode.value === "to") {
        const result = Array.from(val)
          .map((c) => c.codePointAt(0).toString(16).padStart(4, "0"))
          .join(" ");
        showOutput(result);
      } else {
        try {
          const chars = val
            .split(/\s+/)
            .map((code) => String.fromCodePoint(parseInt(code, 16)));
          showOutput(chars.join(""));
        } catch {
          showOutput(t("error"));
        }
      }
    });

    clear.addEventListener("click", () => {
      input.value = "";
      output.innerText = "";
      output.classList.add("hidden");
      clear.classList.add("hidden");
      copy.classList.add("hidden");
    });

    copy.addEventListener("click", () => {
      const text = output.innerText;
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        const original = copy.innerText;
        copy.innerText = tGlobal("copied");
        setTimeout(() => (copy.innerText = tGlobal("copy")), 1500);
      });
    });
  },
};

export default charcode_text_converter;
