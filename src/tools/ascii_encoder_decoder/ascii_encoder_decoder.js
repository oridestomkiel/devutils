import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const ascii_encoder_decoder = {
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
    id="asciiInput"
    class="w-full p-2 rounded mb-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
    rows="3"
    placeholder="${t("placeholder")}"
  ></textarea>

  <div class="flex gap-2">
    <button
      id="asciiEncodeBtn"
      class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
    >
      ${t("encode")}
    </button>
    <button
      id="asciiDecodeBtn"
      class="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
    >
      ${t("decode")}
    </button>
  </div>

  <div class="mt-2 flex gap-2">
    <input
      id="asciiOutput"
      type="text"
      readonly
      class="p-2 rounded w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-green-700 dark:text-green-400"
      value=""
    />
    <button
      id="asciiCopyBtn"
      class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-2 py-1 rounded"
    >
      ${tGlobal("copy")}
    </button>
  </div>
`;
  },
  init() {
    const asciiOutput = document.getElementById("asciiOutput");

    document.getElementById("asciiEncodeBtn").addEventListener("click", () => {
      const input = document.getElementById("asciiInput").value;
      const asciiCodes = [...input].map((c) => c.charCodeAt(0)).join(" ");
      asciiOutput.value = asciiCodes;
    });

    document.getElementById("asciiDecodeBtn").addEventListener("click", () => {
      const input = document.getElementById("asciiInput").value;
      try {
        const chars = input
          .trim()
          .split(/\s+/)
          .map((n) => String.fromCharCode(Number(n)));
        asciiOutput.value = chars.join("");
      } catch (e) {
        asciiOutput.value =
          this.i18n["ascii.decodeError"] ?? "Erro ao decodificar.";
      }
    });

    document.getElementById("asciiCopyBtn").addEventListener("click", () => {
      navigator.clipboard.writeText(asciiOutput.value).then(() => {
        const btn = document.getElementById("asciiCopyBtn");
        const original = btn.innerText;
        btn.innerText = tGlobal("copied");
        setTimeout(() => (btn.innerText = original), 1500);
      });
    });
  },
};

export default ascii_encoder_decoder;
