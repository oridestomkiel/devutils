const jwtviewer = {
  title: "Visualizador de JWT (Avançado)",
  description:
    "Visualize e valide tokens JWT: header, payload, assinatura e verificação opcional com segredo. Tudo em tempo real.",
  tags: ["jwt", "token", "validação", "decodificar", "autenticação"],
  category: "Codificadores / Decodificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "2.3.0",

  render: () => `
      <div id="jwtInputGroup" class="mb-4">
        <textarea
          id="jwtInput"
          class="w-full p-2 bg-gray-700 text-white rounded"
          rows="4"
          placeholder="Cole seu token JWT aqui..."
        ></textarea>
      </div>
  
      <button
        id="jwtClearBtn"
        class="mb-3 hidden bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
      >
        Limpar
      </button>
  
      <div id="jwtOutputGroup" class="hidden">
        <div id="jwtVisual" class="font-mono text-sm bg-gray-900 p-3 rounded mb-3 break-words whitespace-pre-wrap"></div>
        <div id="jwtStatus" class="text-base font-semibold font-mono mb-4 p-3 hidden"></div>
  
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="bg-gray-900 rounded p-3">
          <div>
            <div class="text-gray-400 mb-1">HEADER</div>
            <pre id="jwtHeader" class="text-sm p-3 min-h-[10rem] mb-2 whitespace-pre-wrap break-words"></pre>
            <button id="copyHeaderBtn" class="mt-1 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">Copiar Header</button>
          </div>
          </div>
          <div>
          <div class="bg-gray-900 rounded p-3">
            <div class="text-gray-400 mb-1">PAYLOAD</div>
            <pre id="jwtPayload" class="text-sm p-3 min-h-[10rem] mb-2 whitespace-pre-wrap break-words"></pre>
            <button id="copyPayloadBtn" class="mt-1 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">Copiar Payload</button>
          </div>
          </div>
        </div>
  
        <div class="mb-2 text-sm text-gray-400">JWT Signature Verification (Opcional)</div>
        <input
          id="jwtSecret"
          type="text"
          class="w-full p-2 bg-gray-700 text-white rounded mb-2"
          placeholder="Digite o segredo para verificar a assinatura (HS256)"
        />
  
        <div id="jwtSigStatus" class="text-red-400 text-sm mb-3 hidden"></div>
      </div>
    `,

  init: () => {
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
        s.src = "https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js";
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
        sigStatusEl.textContent = "✔ Assinatura válida";
      } else {
        sigStatusEl.classList.remove("text-green-400");
        sigStatusEl.classList.add("text-red-400");
        sigStatusEl.textContent = "✖ Assinatura inválida";
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
        statusEl.textContent =
          "JWT inválido (estrutura ou conteúdo malformado)";
        statusEl.className = "text-red-400 text-sm font-mono mb-2";
        headerEl.innerHTML = "";
        payloadEl.innerHTML = "";
        sigStatusEl.classList.add("hidden");
        return;
      }

      headerEl.innerHTML = syntaxHighlight(parsed.header);
      payloadEl.innerHTML = syntaxHighlight(parsed.payload);
      statusEl.textContent = "✔ JWT válido";
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

export default jwtviewer;
