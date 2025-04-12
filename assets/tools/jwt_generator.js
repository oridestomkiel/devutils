import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const jwt_generator = {
  i18n: {},

  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
    <div class="mb-3">
      <div class="text-xs text-gray-700 dark:text-gray-400 mb-1">${t(
        "payload"
      )}</div>
      <textarea id="jwtGenPayload" rows="4" class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded font-mono text-sm dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400" placeholder='{"sub": "123", "name": "John Doe"}'></textarea>
    </div>

    <div class="mb-3">
      <div class="text-xs text-gray-700 dark:text-gray-400 mb-1">${t(
        "header"
      )}</div>
      <textarea id="jwtGenHeader" rows="2" class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded font-mono text-sm dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400" placeholder='{"alg": "HS256", "typ": "JWT"}'></textarea>
    </div>

    <div class="mb-3">
      <div class="text-xs text-gray-700 dark:text-gray-400 mb-1">${t(
        "secret"
      )}</div>
      <input id="jwtGenSecret" type="text" class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded text-sm dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400" placeholder="${t(
        "secretPlaceholder"
      )}" />
    </div>

    <div class="flex gap-2 mb-4">
      <button id="jwtGenBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm text-white dark:bg-blue-500 dark:hover:bg-blue-600">${tGlobal(
        "generate"
      )}</button>
      <button id="jwtGenClear" class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm text-white dark:bg-gray-600 dark:hover:bg-gray-500">${tGlobal(
        "clear"
      )}</button>
    </div>

    <div id="jwtGenOutputWrap" class="hidden">
      <div class="text-xs text-gray-700 dark:text-gray-400 mb-1">${t(
        "outputLabel"
      )}</div>
      <div id="jwtGenToken" class="text-sm font-mono bg-white border border-gray-300 text-green-600 p-3 rounded break-words whitespace-pre-wrap mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"></div>
      <button id="jwtGenCopy" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm text-white dark:bg-gray-600 dark:hover:bg-gray-500">${tGlobal(
        "copy"
      )}</button>
    </div>
    `;
  },

  init() {
    const t = (key) => jwt_generator.i18n?.[key] ?? key;

    const payloadEl = document.getElementById("jwtGenPayload");
    const headerEl = document.getElementById("jwtGenHeader");
    const secretEl = document.getElementById("jwtGenSecret");
    const btn = document.getElementById("jwtGenBtn");
    const clearBtn = document.getElementById("jwtGenClear");
    const outputWrap = document.getElementById("jwtGenOutputWrap");
    const tokenEl = document.getElementById("jwtGenToken");
    const copyBtn = document.getElementById("jwtGenCopy");

    const base64Url = (str) =>
      btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

    const signHS256 = (msg, secret) =>
      CryptoJS.HmacSHA256(msg, secret).toString(CryptoJS.enc.Base64url);

    const highlightToken = (token) => {
      const parts = token.split(".");
      return `<span class="text-red-400">${parts[0]}</span><span class="text-gray-400">.</span><span class="text-purple-400">${parts[1]}</span><span class="text-gray-400">.</span><span class="text-blue-400">${parts[2]}</span>`;
    };

    const generate = () => {
      let payload, header;
      try {
        payload = JSON.parse(payloadEl.value.trim());
      } catch {
        tokenEl.innerHTML = `<span class="text-red-400">${t(
          "invalidPayload"
        )}</span>`;
        outputWrap.classList.remove("hidden");
        return;
      }

      try {
        header = headerEl.value.trim()
          ? JSON.parse(headerEl.value.trim())
          : { alg: "HS256", typ: "JWT" };
      } catch {
        tokenEl.innerHTML = `<span class="text-red-400">${t(
          "invalidHeader"
        )}</span>`;
        outputWrap.classList.remove("hidden");
        return;
      }

      const secret = secretEl.value.trim();
      if (!secret) {
        tokenEl.innerHTML = `<span class="text-red-400">${t(
          "secretRequired"
        )}</span>`;
        outputWrap.classList.remove("hidden");
        return;
      }

      const encodedHeader = base64Url(JSON.stringify(header));
      const encodedPayload = base64Url(JSON.stringify(payload));
      const signature = signHS256(`${encodedHeader}.${encodedPayload}`, secret);

      const token = `${encodedHeader}.${encodedPayload}.${signature}`;
      tokenEl.innerHTML = highlightToken(token);
      outputWrap.classList.remove("hidden");
    };

    const clear = () => {
      payloadEl.value = "";
      headerEl.value = "";
      secretEl.value = "";
      tokenEl.innerHTML = "";
      outputWrap.classList.add("hidden");
    };

    const copy = () => {
      const raw = tokenEl.textContent.trim();
      navigator.clipboard.writeText(raw).then(() => {
        copyBtn.textContent = tGlobal("copied");
        setTimeout(() => (copyBtn.textContent = tGlobal("copy")), 1500);
      });
    };

    if (!window.CryptoJS) {
      const s = document.createElement("script");
      s.src = "./vendor/crypto-js.min.js";
      document.head.appendChild(s);
    }

    payloadEl.addEventListener("input", () => {
      payloadEl.style.height = "auto";
      payloadEl.style.height = payloadEl.scrollHeight + "px";
    });

    headerEl.addEventListener("input", () => {
      headerEl.style.height = "auto";
      headerEl.style.height = headerEl.scrollHeight + "px";
    });

    btn.addEventListener("click", generate);
    clearBtn.addEventListener("click", clear);
    copyBtn.addEventListener("click", copy);
  },
};

export default jwt_generator;
