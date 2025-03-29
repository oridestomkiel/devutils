const hash = {
  title: "Gerador de Hash (MD5/SHA256)",
  description:
    "Gere hashes MD5 ou SHA256 rapidamente a partir de qualquer texto. Ideal para segurança, verificação de integridade e desenvolvimento.",
  tags: [
    "gerador de hash",
    "md5",
    "sha256",
    "criptografia",
    "hash de texto",
    "segurança de dados",
    "verificação de integridade",
    "gerar md5",
    "gerar sha256",
  ],
  category: "Codificadores / Decodificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <textarea
      id="hashInput"
      class="w-full p-2 bg-gray-700 rounded mb-2"
      rows="2"
      placeholder="Texto para gerar hash"
    ></textarea>
    <div class="flex gap-2">
      <button
        id="md5Btn"
        class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
      >
        MD5
      </button>
      <button
        id="sha256Btn"
        class="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded"
      >
        SHA256
      </button>
    </div>
    <div class="mt-2 flex gap-2">
      <textarea
        id="hashOutput"
        rows="2"
        readonly
        class="w-full p-2 bg-gray-700 text-green-400 rounded text-sm"
        placeholder="Resultado aparecerá aqui"
      ></textarea>
      <button
        id="hashCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded self-start"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
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

    document.getElementById("md5Btn").addEventListener("click", async () => {
      const input = document.getElementById("hashInput").value;
      if (typeof window.md5 !== "function") {
        try {
          await loadScript(
            "https://cdn.jsdelivr.net/npm/blueimp-md5/js/md5.min.js"
          );
        } catch (e) {
          document.getElementById("hashOutput").value =
            "Erro ao carregar biblioteca MD5.";
          return;
        }
      }
      document.getElementById("hashOutput").value = window.md5(input);
    });

    document.getElementById("sha256Btn").addEventListener("click", async () => {
      const input = new TextEncoder().encode(
        document.getElementById("hashInput").value
      );
      const hashBuffer = await crypto.subtle.digest("SHA-256", input);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      document.getElementById("hashOutput").value = hashHex;
    });

    document.getElementById("hashCopyBtn").addEventListener("click", () => {
      const outputEl = document.getElementById("hashOutput");
      navigator.clipboard.writeText(outputEl.value).then(() => {
        const copyBtn = document.getElementById("hashCopyBtn");
        const originalText = copyBtn.innerText;
        copyBtn.innerText = "Copiado!";
        setTimeout(() => {
          copyBtn.innerText = originalText;
        }, 1500);
      });
    });
  },
};

export default hash;
