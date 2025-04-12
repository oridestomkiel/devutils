import { loadToolI18n } from "../../utils/i18n-loader.js";

const advanced_jwt_viewer = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "en");
  },
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "2.3.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
  <div id="jwtInputGroup" class="mb-4 text-gray-900 dark:text-white">
    <textarea
      id="jwtInput"
      class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      rows="4"
      placeholder="${t("placeholder.jwt")}"
    ></textarea>
  </div>

  <button
    id="jwtClearBtn"
    class="mb-3 hidden bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-3 py-1 rounded text-sm"
  >
    ${t("clear")}
  </button>

  <div id="jwtOutputGroup" class="hidden">
    <div
      id="jwtVisual"
      class="font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-green-400 p-3 rounded mb-3 break-words whitespace-pre-wrap border border-gray-300 dark:border-gray-600"
    ></div>

    <div
      id="jwtStatus"
      class="text-base font-semibold font-mono mb-4 p-3 hidden border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded"
    ></div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div class="bg-gray-100 dark:bg-gray-900 rounded p-3 border border-gray-300 dark:border-gray-600">
        <div class="text-gray-500 dark:text-gray-400 mb-1">${t("header")}</div>
        <pre id="jwtHeader" class="text-sm p-3 min-h-[10rem] mb-2 whitespace-pre-wrap break-words bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"></pre>
        <button id="copyHeaderBtn" class="mt-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-2 py-1 rounded">
          ${t("copy.header")}
        </button>
      </div>

      <div class="bg-gray-100 dark:bg-gray-900 rounded p-3 border border-gray-300 dark:border-gray-600">
        <div class="text-gray-500 dark:text-gray-400 mb-1">${t("payload")}</div>
        <pre id="jwtPayload" class="text-sm p-3 min-h-[10rem] mb-2 whitespace-pre-wrap break-words bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"></pre>
        <button id="copyPayloadBtn" class="mt-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-2 py-1 rounded">
          ${t("copy.payload")}
        </button>
      </div>
    </div>

    <div class="mb-2 text-sm text-gray-500 dark:text-gray-400">${t(
      "signature.title"
    )}</div>
    <input
      id="jwtSecret"
      type="text"
      class="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      placeholder="${t("signature.placeholder")}"
    />

    <div id="jwtSigStatus" class="text-red-600 dark:text-red-400 text-sm mb-3 hidden"></div>
  </div>
`;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const inputEl = document.getElementById("jwtInput");
    const inputGroup = document.getElementById("jwtInputGroup");
    const outputGroup = document.getElementById("jwtOutputGroup");
    const clearBtn = document.getElementById("jwtClearBtn");
    const visualEl = document.getElementById("jwtVisual");
    const headerEl = document.getElementById("jwtHeader");
    const payloadEl = document.getElementById("jwtPayload");
    const statusEl = document.getElementById("jwtStatus");
    const sigStatusEl = document.getElementById("jwtSigStatus");
    const secretEl = document.getElementById("jwtSecret");

    const copy = (text) => navigator.clipboard.writeText(text);

    const decodeBase64 = (str) => {
      try {
        const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
        const binary = atob(padded);
        const bytes = Uint8Array.from([...binary].map((c) => c.charCodeAt(0)));
        const decoder = new TextDecoder("utf-8");
        return decoder.decode(bytes);
      } catch (e) {
        return null;
      }
    };

    const parseJWT = (jwt) => {
      const parts = jwt.split(".");
      if (parts.length !== 3) return null;

      const [headerStr, payloadStr] = parts;
      const decodedHeader = decodeBase64(headerStr);
      const decodedPayload = decodeBase64(payloadStr);

      if (!decodedHeader || !decodedPayload) return null;

      try {
        return {
          header: JSON.parse(decodedHeader),
          payload: JSON.parse(decodedPayload),
          signature: parts[2],
        };
      } catch {
        return null;
      }
    };

    const highlightJWT = (token) => {
      const parts = token.split(".");
      if (parts.length !== 3) return "";
      return `<span class="text-red-400">${parts[0]}</span><span class="text-gray-500">.</span><span class="text-purple-400">${parts[1]}</span><span class="text-gray-500">.</span><span class="text-blue-400">${parts[2]}</span>`;
    };

    const syntaxHighlight = (json) => {
      if (typeof json !== "string") {
        json = JSON.stringify(json, null, 2);
      }
      json = json
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\\s*:)?|\b(true|false|null)\b|\b\d+\b)/g,
        (match) => {
          let cls = "text-green-400";
          if (/^"/.test(match)) {
            cls = /:$/.test(match) ? "text-purple-400" : "text-yellow-300";
          } else if (/true|false/.test(match)) {
            cls = "text-blue-400";
          } else if (/null/.test(match)) {
            cls = "text-gray-400";
          }
          return `<span class="${cls}">${match}</span>`;
        }
      );
    };

    const verifySignature = async (jwt, secret) => {
      if (!window.CryptoJS) {
        const s = document.createElement("script");
        s.src = "./vendor/crypto-js.min.js";
        s.onload = () => verifySignature(jwt, secret);
        document.head.appendChild(s);
        return;
      }

      const parts = jwt.split(".");
      if (parts.length !== 3) return;

      const signatureToVerify = CryptoJS.HmacSHA256(
        parts[0] + "." + parts[1],
        secret
      ).toString(CryptoJS.enc.Base64url);

      if (signatureToVerify === parts[2]) {
        sigStatusEl.classList.remove("text-red-400");
        sigStatusEl.classList.add("text-green-400");
        sigStatusEl.textContent = t("signature.valid");
      } else {
        sigStatusEl.classList.remove("text-green-400");
        sigStatusEl.classList.add("text-red-400");
        sigStatusEl.textContent = t("signature.invalid");
      }

      sigStatusEl.classList.remove("hidden");
    };

    const update = () => {
      const raw = inputEl.value.trim();
      const parsed = parseJWT(raw);

      if (!raw) {
        inputGroup.classList.remove("hidden");
        outputGroup.classList.add("hidden");
        clearBtn.classList.add("hidden");
        visualEl.innerHTML = "";
        headerEl.innerHTML = "";
        payloadEl.innerHTML = "";
        statusEl.classList.add("hidden");
        sigStatusEl.classList.add("hidden");
        return;
      }

      inputGroup.classList.add("hidden");
      outputGroup.classList.remove("hidden");
      clearBtn.classList.remove("hidden");

      visualEl.innerHTML = highlightJWT(raw);

      if (!parsed) {
        statusEl.textContent = t("jwt.invalid");
        statusEl.className = "text-red-400 text-sm font-mono mb-2";
        headerEl.innerHTML = "";
        payloadEl.innerHTML = "";
        sigStatusEl.classList.add("hidden");
        return;
      }

      headerEl.innerHTML = syntaxHighlight(parsed.header);
      payloadEl.innerHTML = syntaxHighlight(parsed.payload);
      statusEl.textContent = t("jwt.valid");
      statusEl.className = "text-green-400 text-sm font-mono mb-2";

      if (secretEl.value.trim()) {
        verifySignature(raw, secretEl.value.trim());
      } else {
        sigStatusEl.classList.add("hidden");
      }
    };

    inputEl.addEventListener("input", update);
    secretEl.addEventListener("input", update);

    clearBtn.addEventListener("click", () => {
      inputEl.value = "";
      secretEl.value = "";
      update();
    });

    document.getElementById("copyHeaderBtn").addEventListener("click", () => {
      copy(headerEl.textContent);
    });

    document.getElementById("copyPayloadBtn").addEventListener("click", () => {
      copy(payloadEl.textContent);
    });
  },
};

export default advanced_jwt_viewer;
