import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const hexdump_text_converter = {
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
    <select 
      id="hexdumpMode" 
      class="mb-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white p-1 rounded border border-gray-300 dark:border-gray-600"
    >
      <option value="to">${t("toHexdump")}</option>
      <option value="from">${t("fromHexdump")}</option>
    </select>

    <textarea
      id="hexdumpInput"
      class="w-full p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded border border-gray-300 dark:border-gray-600 mb-2"
      rows="6"
      placeholder="${t("placeholder")}"
    ></textarea>

    <div class="flex gap-2 mb-2">
      <button id="hexdumpBtn" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white">${t(
        "convert"
      )}</button>
    </div>

    <pre 
      id="hexdumpOutput" 
      class="text-green-600 dark:text-green-400 bg-white dark:bg-gray-900 whitespace-pre-wrap break-words p-2 rounded border border-gray-300 dark:border-gray-600 my-4 hidden"
    ></pre>

    <div id="hexdumpActions" class="flex gap-2 mb-2 hidden">
      <button id="hexdumpClear" class="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 px-3 py-1 rounded text-gray-800 dark:text-white">
        ${tGlobal("clear")}
      </button>
      <button id="hexdumpCopy" class="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 px-3 py-1 rounded text-gray-800 dark:text-white">
        ${tGlobal("copy")}
      </button>
    </div>
    `;
  },

  init() {
    const input = document.getElementById("hexdumpInput");
    const output = document.getElementById("hexdumpOutput");
    const mode = document.getElementById("hexdumpMode");
    const actions = document.getElementById("hexdumpActions");
    const copyBtn = document.getElementById("hexdumpCopy");
    const clearBtn = document.getElementById("hexdumpClear");

    document.getElementById("hexdumpBtn").addEventListener("click", () => {
      const value = input.value;
      let result = "";

      if (mode.value === "to") {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(value);

        for (let i = 0; i < bytes.length; i += 16) {
          const chunk = bytes.slice(i, i + 16);
          const hex = Array.from(chunk)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join(" ")
            .padEnd(48, " ");
          const ascii = Array.from(chunk)
            .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : "."))
            .join("");
          result += `${i.toString(16).padStart(8, "0")}  ${hex} ${ascii}\n`;
        }
      } else {
        try {
          const lines = value.trim().split("\n");
          const bytes = [];

          for (const line of lines) {
            const hexPart = line.slice(10, 58).trim();
            hexPart.split(" ").forEach((hex) => {
              if (hex.length === 2 && /^[0-9a-f]{2}$/i.test(hex)) {
                bytes.push(parseInt(hex, 16));
              }
            });
          }

          const decoder = new TextDecoder();
          result = decoder.decode(new Uint8Array(bytes));
        } catch {
          result = "Erro ao converter hexdump para texto.";
        }
      }

      output.innerText = result.trim();
      if (result.trim()) {
        actions.classList.remove("hidden");
        output.classList.remove("hidden");
      }
    });

    clearBtn.addEventListener("click", () => {
      input.value = "";
      output.innerText = "";
      output.classList.add("hidden");
      actions.classList.add("hidden");
    });

    copyBtn.addEventListener("click", () => {
      const text = output.innerText;
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        const original = copyBtn.innerText;
        copyBtn.innerText = tGlobal("copied");
        setTimeout(() => (copyBtn.innerText = tGlobal("copy")), 1500);
      });
    });
  },
};

export default hexdump_text_converter;
