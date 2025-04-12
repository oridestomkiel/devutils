import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const hash_generator_md5_sha256 = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render() {
    const t = (k) => this.i18n?.[k] ?? k;

    return `
    <textarea
      id="hashInput"
      class="w-full p-2 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-700 text-black dark:text-white rounded mb-2"
      rows="2"
      placeholder="${t("placeholder")}"
    ></textarea>

    <div class="flex gap-2">
      <button
        id="md5Btn"
        class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
      >
        MD5
      </button>
      <button
        id="sha256Btn"
        class="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-white"
      >
        SHA256
      </button>
    </div>

    <div class="mt-2 flex gap-2">
      <textarea
        id="hashOutput"
        rows="2"
        readonly
        class="w-full p-2 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-700 text-green-700 dark:text-green-400 rounded text-sm"
        placeholder="${t("resultPlaceholder")}"
      ></textarea>
      <button
        id="hashCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded self-start text-white"
      >
        ${tGlobal("copy")}
      </button>
    </div>
    `;
  },

  init() {
    const $ = (id) => document.getElementById(id);

    function loadScript(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    $("md5Btn").addEventListener("click", async () => {
      const input = $("hashInput").value;
      if (typeof window.md5 !== "function") {
        try {
          await loadScript("./vendor/md5.min.js");
        } catch (e) {
          $("hashOutput").value = "Erro ao carregar biblioteca MD5.";
          return;
        }
      }
      $("hashOutput").value = window.md5(input);
    });

    $("sha256Btn").addEventListener("click", async () => {
      const input = new TextEncoder().encode($("hashInput").value);
      const hashBuffer = await crypto.subtle.digest("SHA-256", input);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      $("hashOutput").value = hashHex;
    });

    $("hashCopyBtn").addEventListener("click", () => {
      const outputEl = $("hashOutput");
      navigator.clipboard.writeText(outputEl.value).then(() => {
        const original = $("hashCopyBtn").innerText;
        $("hashCopyBtn").innerText = tGlobal("copied");
        setTimeout(() => {
          $("hashCopyBtn").innerText = original;
        }, 1500);
      });
    });
  },
};

export default hash_generator_md5_sha256;
