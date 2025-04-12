import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const magic_analyzer = {
  i18n: {},

  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "2.0.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
    <textarea 
      id="magicInput" 
      class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400" 
      rows="6"
      placeholder="${t("placeholder")}"
    ></textarea>

    <div class="flex gap-2 mb-2">
      <button 
        id="magicAnalyzeBtn" 
        class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        ${tGlobal("generate")}
      </button>
      <button 
        id="magicClearBtn" 
        class="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-white hidden dark:bg-gray-500 dark:hover:bg-gray-400"
      >
        ${tGlobal("clear")}
      </button>
    </div>

    <div>
      <label for="magicCrib" class="text-gray-800 dark:text-white">${t(
        "crib"
      )}:</label>
      <input 
        type="text" 
        id="magicCrib" 
        class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400" 
        placeholder="${t("cribPlaceholder")}"
      >
    </div>

    <div>
      <label for="magicDepth" class="text-gray-800 dark:text-white">${t(
        "depth"
      )}:</label>
      <input 
        type="number" 
        id="magicDepth" 
        class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white"
        value="1" min="1" max="5"
      >
    </div>

    <div>
      <label for="magicIntensive" class="text-gray-800 dark:text-white flex items-center gap-2">
        <input type="checkbox" id="magicIntensive">
        ${t("intensive")}
      </label>
    </div>

    <div 
      id="magicResults" 
      class="bg-white border border-gray-300 text-green-600 text-sm whitespace-pre-wrap break-words p-3 rounded hidden my-4 dark:bg-gray-800 dark:border-gray-700 dark:text-green-400"
    ></div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const loadMagicLibs = async (callback) => {
      const loadScript = (src) =>
        new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = resolve;
          document.head.appendChild(script);
        });

      await loadScript("./vendor/pako.min.js");

      if (callback) callback();
    };

    loadMagicLibs(() => {
      const input = document.getElementById("magicInput");
      const results = document.getElementById("magicResults");
      const analyzeBtn = document.getElementById("magicAnalyzeBtn");
      const clearBtn = document.getElementById("magicClearBtn");
      const cribInput = document.getElementById("magicCrib");
      const depthInput = document.getElementById("magicDepth");
      const intensiveInput = document.getElementById("magicIntensive");

      const isBase64 = (str) => {
        try {
          return (
            btoa(atob(str.replace(/\s+/g, ""))) === str.replace(/\s+/g, "")
          );
        } catch {
          return false;
        }
      };

      const isHex = (str) => /^[\da-f\s]+$/i.test(str.replace(/\s+/g, ""));

      const tryJSON = (str) => {
        try {
          const json = JSON.parse(str);
          return typeof json === "object";
        } catch {
          return false;
        }
      };

      const getEntropy = (str) => {
        const freq = {};
        for (const c of str) freq[c] = (freq[c] || 0) + 1;
        const len = str.length;
        let entropy = 0;
        for (const c in freq) {
          const p = freq[c] / len;
          entropy -= p * Math.log2(p);
        }
        return entropy;
      };

      const decodeJWT = (token) => {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        try {
          const payload = JSON.parse(atob(parts[1]));
          return JSON.stringify(payload, null, 2);
        } catch {
          return null;
        }
      };

      const decompressGZIP = (data) => {
        try {
          const binaryData = Uint8Array.from(atob(data), (c) =>
            c.charCodeAt(0)
          );
          return window.pako.inflate(binaryData, { to: "string" });
        } catch {
          return null;
        }
      };

      const applyROT13 = (str) =>
        str.replace(/[a-zA-Z]/g, (c) =>
          String.fromCharCode(
            (c <= "Z" ? 65 : 97) +
              ((c.charCodeAt(0) - (c <= "Z" ? 65 : 97) + 13) % 26)
          )
        );

      const applyXOR = (str, key) =>
        str
          .split("")
          .map((c) => String.fromCharCode(c.charCodeAt(0) ^ key))
          .join("");

      const detect = (data, depth, intensive, cribRegex) => {
        const output = [];
        const raw = data.trim();

        const entropy = getEntropy(raw).toFixed(4);
        output.push(`📊 ${t("entropy")}: ${entropy} bits/caractere`);

        if (/^[\x00-\x7F]+$/.test(raw)) output.push(`🧠 ${t("ascii")}`);
        if (/^[ -~]+$/.test(raw)) output.push(`🧩 ${t("printable")}`);
        if (isBase64(raw)) output.push(`🔐 ${t("maybeBase64")}`);
        if (isHex(raw)) output.push(`🔎 ${t("maybeHex")}`);
        if (tryJSON(raw)) output.push(`📦 ${t("validJson")}`);

        const jwtPayload = decodeJWT(raw);
        if (jwtPayload) {
          output.push(`🔓 ${t("jwtDecoded")}:`);
          output.push(jwtPayload);
        }

        const gzipDecoded = decompressGZIP(raw);
        if (gzipDecoded) {
          output.push(`📦 ${t("gzipDecoded")}:`);
          output.push(gzipDecoded);
        }

        if (cribRegex) {
          const regex = new RegExp(cribRegex, "i");
          if (regex.test(raw)) {
            output.push(`🔍 ${t("cribFound")}: ${cribRegex}`);
          } else {
            output.push(`❌ ${t("cribNotFound")}: ${cribRegex}`);
          }
        }

        if (intensive) {
          const rot13 = applyROT13(raw);
          if (tryJSON(rot13)) output.push(`🔁 ${t("rot13Json")}`);

          for (let k = 1; k < 10; k++) {
            const xor = applyXOR(raw, k);
            if (tryJSON(xor)) {
              output.push(`🔁 ${t("xorJson")} ${k}`);
              break;
            }
          }
        }

        return output.join("\n");
      };

      analyzeBtn.addEventListener("click", () => {
        const raw = input.value.trim();
        if (!raw) return;

        const crib = cribInput.value;
        const depth = parseInt(depthInput.value);
        const intensive = intensiveInput.checked;

        const report = detect(raw, depth, intensive, crib);
        results.textContent = report;
        results.classList.remove("hidden");
        clearBtn.classList.remove("hidden");
      });

      clearBtn.addEventListener("click", () => {
        input.value = "";
        results.classList.add("hidden");
        results.textContent = "";
        clearBtn.classList.add("hidden");
      });
    });
  },
};

export default magic_analyzer;
