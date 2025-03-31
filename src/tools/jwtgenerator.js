const jwtgenerator = {
  title: "Gerador de JWT",
  description:
    "Crie tokens JWT personalizados com header, payload e segredo. Ideal para testes com HS256.",
  tags: ["jwt", "token", "gerar jwt", "testar jwt", "criptografia"],
  category: "Codificadores / Decodificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <div class="mb-3">
        <div class="text-xs text-gray-400 mb-1">Payload (JSON)</div>
        <textarea id="jwtGenPayload" rows="4" class="w-full p-2 bg-gray-700 text-white rounded font-mono text-sm" placeholder='{ "sub": "123", "name": "John Doe" }'></textarea>
      </div>
  
      <div class="mb-3">
        <div class="text-xs text-gray-400 mb-1">Header (opcional)</div>
        <textarea id="jwtGenHeader" rows="2" class="w-full p-2 bg-gray-700 text-white rounded font-mono text-sm" placeholder='{ "alg": "HS256", "typ": "JWT" }'></textarea>
      </div>
  
      <div class="mb-3">
        <div class="text-xs text-gray-400 mb-1">Segredo (HS256)</div>
        <input id="jwtGenSecret" type="text" class="w-full p-2 bg-gray-700 text-white rounded text-sm" placeholder="Digite o segredo..." />
      </div>
  
      <div class="flex gap-2 mb-4">
        <button id="jwtGenBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm">Gerar JWT</button>
        <button id="jwtGenClear" class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm">Limpar</button>
      </div>
  
      <div id="jwtGenOutputWrap" class="hidden">
        <div class="text-xs text-gray-400 mb-1">Token JWT</div>
        <div id="jwtGenToken" class="text-sm font-mono bg-gray-900 p-3 rounded break-words whitespace-pre-wrap mb-2"></div>
        <button id="jwtGenCopy" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm">Copiar</button>
      </div>
    `,

  init: () => {
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

    const signHS256 = (msg, secret) => {
      return CryptoJS.HmacSHA256(msg, secret).toString(CryptoJS.enc.Base64url);
    };

    const highlightToken = (token) => {
      const parts = token.split(".");
      return `<span class="text-red-400">${parts[0]}</span><span class="text-gray-400">.</span><span class="text-purple-400">${parts[1]}</span><span class="text-gray-400">.</span><span class="text-blue-400">${parts[2]}</span>`;
    };

    const generate = () => {
      let payload, header;

      try {
        payload = JSON.parse(payloadEl.value.trim());
      } catch {
        tokenEl.innerHTML = `<span class="text-red-400">Payload inválido</span>`;
        outputWrap.classList.remove("hidden");
        return;
      }

      try {
        header = headerEl.value.trim()
          ? JSON.parse(headerEl.value.trim())
          : { alg: "HS256", typ: "JWT" };
      } catch {
        tokenEl.innerHTML = `<span class="text-red-400">Header inválido</span>`;
        outputWrap.classList.remove("hidden");
        return;
      }

      const secret = secretEl.value.trim();
      if (!secret) {
        tokenEl.innerHTML = `<span class="text-red-400">Segredo obrigatório</span>`;
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
        copyBtn.textContent = "Copiado!";
        setTimeout(() => (copyBtn.textContent = "Copiar"), 1500);
      });
    };

    if (!window.CryptoJS) {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js";
      document.head.appendChild(s);
    }

    const autoResize = (el) => {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    };

    payloadEl.addEventListener("input", () => autoResize(payloadEl));

    headerEl.addEventListener("input", () => autoResize(headerEl));

    btn.addEventListener("click", generate);
    clearBtn.addEventListener("click", clear);
    copyBtn.addEventListener("click", copy);
  },
};

export default jwtgenerator;
