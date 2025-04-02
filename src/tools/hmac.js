const hmac = {
  title: "Gerador de HMAC (SHA-1, SHA-256, SHA-512)",
  description:
    "Gere códigos HMAC com os algoritmos SHA-1, SHA-256 ou SHA-512 usando uma chave secreta. Ideal para autenticação, APIs e segurança de dados.",
  tags: [
    "gerador de hmac",
    "hmac sha1",
    "hmac sha256",
    "hmac sha512",
    "segurança de api",
    "criptografia hmac",
    "assinatura digital",
    "hash com chave",
  ],
  category: "Codificadores / Decodificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.1",
  render: () => `
    <textarea id="hmacMessage" class="w-full p-2 bg-gray-700 rounded mb-2 text-white" rows="3" placeholder="Mensagem"></textarea>
    <input id="hmacKey" class="w-full p-2 bg-gray-700 rounded mb-2 text-white" type="text" placeholder="Chave secreta" />
    <select id="hmacAlgo" class="w-full p-2 bg-gray-700 rounded mb-2 text-white">
      <option value="SHA-1">SHA-1</option>
      <option value="SHA-256" selected>SHA-256</option>
      <option value="SHA-512">SHA-512</option>
    </select>
    <button id="hmacGenBtn" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-1 rounded mb-2">Gerar HMAC</button>
    <div class="relative">
      <pre id="hmacOutput" class="mt-2 text-green-400 whitespace-pre-wrap break-words pr-12"> </pre>
      <button id="copyHmac" class="absolute top-0 right-0 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">Copiar</button>
      <span id="copiedHmac" class="absolute top-0 right-0 text-green-400 px-2 py-1 hidden">Copiado!</span>
    </div>
  `,
  init: () => {
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

export default hmac;
