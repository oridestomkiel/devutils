import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const hash_generator_md5_sha1_sha224_sha256_sha512 = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",

  render() {
    const t = (k) => this.i18n?.[k] ?? k;

    return `
    <textarea
      id="hashInput"
      class="w-full p-2 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-700 text-black dark:text-white rounded mb-3"
      rows="4"
      placeholder="${t("placeholder")}"
    ></textarea>

    <label class="flex items-center text-sm text-gray-700 dark:text-gray-300 mb-3 gap-2 select-none">
      <input type="checkbox" id="hashUppercase" class="accent-blue-500" />
      ${t("uppercase")}
    </label>

    <div id="hashOutputs" class="space-y-2"></div>

    <button id="hashClearBtn" class="mt-4 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 px-3 py-1 rounded hidden">
      ${tGlobal("clear")}
    </button>
    `;
  },

  init() {
    const loadCryptoLib = (callback) => {
      if (window.CryptoJS) return callback();
      const script = document.createElement("script");
      script.src = "./vendor/crypto-js.min.js";
      script.onload = callback;
      document.head.appendChild(script);
    };

    loadCryptoLib(() => {
      const input = document.getElementById("hashInput");
      const outputs = document.getElementById("hashOutputs");
      const clearBtn = document.getElementById("hashClearBtn");
      const uppercaseToggle = document.getElementById("hashUppercase");
      const t = (k) =>
        hash_generator_md5_sha1_sha224_sha256_sha512.i18n?.[k] ?? k;

      const algorithms = [
        { name: "MD5", fn: (txt) => CryptoJS.MD5(txt).toString() },
        { name: "SHA1", fn: (txt) => CryptoJS.SHA1(txt).toString() },
        { name: "SHA224", fn: (txt) => CryptoJS.SHA224(txt).toString() },
        { name: "SHA256", fn: (txt) => CryptoJS.SHA256(txt).toString() },
        { name: "SHA512", fn: (txt) => CryptoJS.SHA512(txt).toString() },
      ];

      const renderHashes = () => {
        const text = input.value.trim();
        const isUpper = uppercaseToggle.checked;

        outputs.innerHTML = "";
        if (!text) {
          clearBtn.classList.add("hidden");
          return;
        }

        algorithms.forEach((algo) => {
          let hash = algo.fn(text);
          hash = isUpper ? hash.toUpperCase() : hash.toLowerCase();

          const row = document.createElement("div");
          row.className = "flex items-center gap-2";

          const hashInput = document.createElement("input");
          hashInput.value = hash;
          hashInput.readOnly = true;
          hashInput.className =
            "w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 text-sm px-2 py-1 rounded border border-gray-300 dark:border-gray-700";

          const btn = document.createElement("button");
          btn.textContent = algo.name;
          btn.className =
            "bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 px-3 py-1 rounded text-sm w-[90px] text-white";
          btn.addEventListener("click", () => {
            navigator.clipboard.writeText(hash).then(() => {
              const original = btn.textContent;
              btn.textContent = tGlobal("copied");
              setTimeout(() => (btn.textContent = original), 1500);
            });
          });

          row.appendChild(hashInput);
          row.appendChild(btn);
          outputs.appendChild(row);
        });

        clearBtn.classList.remove("hidden");
      };

      input.addEventListener("input", renderHashes);
      uppercaseToggle.addEventListener("change", renderHashes);

      clearBtn.addEventListener("click", () => {
        input.value = "";
        outputs.innerHTML = "";
        clearBtn.classList.add("hidden");
      });
    });
  },
};

export default hash_generator_md5_sha1_sha224_sha256_sha512;
