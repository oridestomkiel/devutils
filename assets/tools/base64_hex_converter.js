import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const base64_hex_converter = {
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
  <textarea
    id="b64HexInput"
    class="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
    rows="4"
    placeholder="${t("placeholder")}"
  ></textarea>

  <div class="flex gap-2">
    <button
      id="b64ToHexBtn"
      class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
    >
      ${t("b64.to.hex")}
    </button>
    <button
      id="hexToB64Btn"
      class="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
    >
      ${t("hex.to.b64")}
    </button>
  </div>

  <div class="mt-2 flex gap-2">
    <input
      id="b64HexOutput"
      type="text"
      value=""
      readonly
      class="p-2 rounded w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-green-700 dark:text-green-400"
    />
    <button
      id="b64HexCopyBtn"
      class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
    >
      ${tGlobal("copy")}
    </button>
  </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const b64HexInput = document.getElementById("b64HexInput");
    const b64HexOutput = document.getElementById("b64HexOutput");
    const b64ToHexBtn = document.getElementById("b64ToHexBtn");
    const hexToB64Btn = document.getElementById("hexToB64Btn");
    const b64HexCopyBtn = document.getElementById("b64HexCopyBtn");

    const hexToBytes = (hex) =>
      hex.match(/.{1,2}/g).map((b) => parseInt(b, 16));
    const bytesToHex = (bytes) =>
      bytes.map((b) => b.toString(16).padStart(2, "0")).join("");

    b64ToHexBtn.addEventListener("click", () => {
      try {
        const b64 = b64HexInput.value.trim();
        const binary = atob(b64);
        const bytes = [...binary].map((c) => c.charCodeAt(0));
        b64HexOutput.value = bytesToHex(bytes);
      } catch (e) {
        b64HexOutput.value = `${t("error.prefix")}: ${e.message}`;
      }
    });

    hexToB64Btn.addEventListener("click", () => {
      try {
        const hex = b64HexInput.value.replace(/\s+/g, "");
        const bytes = hexToBytes(hex);
        const binary = String.fromCharCode(...bytes);
        b64HexOutput.value = btoa(binary);
      } catch (e) {
        b64HexOutput.value = `${t("error.prefix")}: ${e.message}`;
      }
    });

    b64HexCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(b64HexOutput.value).then(() => {
        const original = b64HexCopyBtn.innerText;
        b64HexCopyBtn.innerText = tGlobal("copied");
        setTimeout(() => (b64HexCopyBtn.innerText = tGlobal("copy")), 1500);
      });
    });
  },
};

export default base64_hex_converter;
