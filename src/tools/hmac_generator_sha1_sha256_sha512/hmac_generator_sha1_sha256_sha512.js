import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const hmac_generator_sha1_sha256_sha512 = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.1",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
    <textarea 
      id="hmacMessage" 
      class="w-full p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded border border-gray-300 dark:border-gray-600 mb-2" 
      rows="3" 
      placeholder="${t("message")}"
    ></textarea>

    <input 
      id="hmacKey" 
      type="text" 
      class="w-full p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded border border-gray-300 dark:border-gray-600 mb-2" 
      placeholder="${t("secretKey")}"
    />

    <select 
      id="hmacAlgo" 
      class="w-full p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded border border-gray-300 dark:border-gray-600 mb-2"
    >
      <option value="SHA-1">SHA-1</option>
      <option value="SHA-256" selected>SHA-256</option>
      <option value="SHA-512">SHA-512</option>
    </select>

    <button 
      id="hmacGenBtn" 
      class="bg-indigo-600 hover:bg-indigo-700 px-4 py-1 rounded text-white mb-2"
    >
      ${t("generate")}
    </button>

    <div class="relative">
      <pre 
        id="hmacOutput" 
        class="mt-2 text-green-600 dark:text-green-400 bg-white p-6 dark:bg-gray-900 whitespace-pre-wrap break-words p-2 rounded border border-gray-300 dark:border-gray-700 pr-12"
      ></pre>

      <button 
        id="copyHmac" 
        class="absolute top-2 right-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 px-2 py-1 rounded text-gray-800 dark:text-white"
      >
        ${tGlobal("copy")}
      </button>

      <span 
        id="copiedHmac" 
        class="absolute top-2 right-2 text-green-600 dark:text-green-400 px-2 py-1 hidden"
      >
        ${tGlobal("copied")}
      </span>
    </div>
    `;
  },

  init() {
    const output = document.getElementById("hmacOutput");
    const copyBtn = document.getElementById("copyHmac");
    const copiedMsg = document.getElementById("copiedHmac");

    document
      .getElementById("hmacGenBtn")
      .addEventListener("click", async () => {
        const msg = document.getElementById("hmacMessage").value;
        const key = document.getElementById("hmacKey").value;
        const algo = document.getElementById("hmacAlgo").value;

        if (!msg || !key) {
          output.innerText = "Mensagem e chave são obrigatórias.";
          return;
        }

        try {
          const enc = new TextEncoder();
          const keyData = enc.encode(key);
          const msgData = enc.encode(msg);

          const cryptoKey = await crypto.subtle.importKey(
            "raw",
            keyData,
            { name: "HMAC", hash: { name: algo } },
            false,
            ["sign"]
          );

          const signature = await crypto.subtle.sign(
            "HMAC",
            cryptoKey,
            msgData
          );
          const hex = Array.from(new Uint8Array(signature))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

          output.innerText = hex;
        } catch (err) {
          output.innerText = "Erro ao gerar HMAC: " + err.message;
        }
      });

    copyBtn.addEventListener("click", () => {
      const text = output.innerText;
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        copiedMsg.classList.remove("hidden");
        copyBtn.classList.add("hidden");

        setTimeout(() => {
          copiedMsg.classList.add("hidden");
          copyBtn.classList.remove("hidden");
        }, 2000);
      });
    });
  },
};

export default hmac_generator_sha1_sha256_sha512;
