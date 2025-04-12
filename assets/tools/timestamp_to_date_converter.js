import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const timestamp_to_date_converter = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.4.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
      <input id="timestampInput" type="text" placeholder="${t(
        "input_placeholder"
      )}"
        class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white" />

      <select id="timestampFormat"
        class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white">
        <option value="br">${t("format_br")}</option>
        <option value="iso">${t("format_iso")}</option>
        <option value="utc">${t("format_utc")}</option>
      </select>

      <button id="timestampBtn"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-2 text-white">${t(
          "convert"
        )}</button>

      <div class="relative">
        <input id="timestampOutput" type="text" readonly
          class="w-full p-2 bg-white border border-gray-300 text-green-600 rounded pr-20 dark:bg-gray-800 dark:border-gray-700 dark:text-green-400"
          placeholder="${t("output_placeholder")}" />
        <button id="copyTimestampBtn"
          class="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-sm text-white">
          ${tGlobal("copy")}
        </button>
        <span id="copiedTimestampMsg"
          class="absolute top-2 right-2 text-green-400 px-2 py-1 hidden">${tGlobal(
            "copied"
          )}</span>
      </div>

      <small class="text-gray-600 dark:text-gray-400 block mt-2">
        ${t("instructions")}
      </small>
    `;
  },

  init() {
    const input = document.getElementById("timestampInput");
    const format = document.getElementById("timestampFormat");
    const output = document.getElementById("timestampOutput");
    const copyBtn = document.getElementById("copyTimestampBtn");
    const copiedMsg = document.getElementById("copiedTimestampMsg");

    document.getElementById("timestampBtn").addEventListener("click", () => {
      const raw = input.value.trim();
      const selected = format.value;

      let date;

      if (/^\d+$/.test(raw)) {
        const ts = parseInt(raw, 10);
        date = new Date(ts * 1000);
      } else {
        date = new Date(raw);
      }

      if (isNaN(date.getTime())) {
        output.value = "Entrada inválida";
        return;
      }

      let result = "";
      switch (selected) {
        case "br":
          result = date.toLocaleString("pt-BR", {
            dateStyle: "full",
            timeStyle: "medium",
          });
          break;
        case "iso":
          result = date.toISOString();
          break;
        case "utc":
          result = date.toUTCString();
          break;
      }

      output.value = result;
    });

    copyBtn.addEventListener("click", () => {
      const value = output.value;
      if (!value || value === "Entrada inválida") return;

      navigator.clipboard.writeText(value).then(() => {
        copyBtn.classList.add("hidden");
        copiedMsg.classList.remove("hidden");
        setTimeout(() => {
          copiedMsg.classList.add("hidden");
          copyBtn.classList.remove("hidden");
        }, 2000);
      });
    });
  },
};

export default timestamp_to_date_converter;
