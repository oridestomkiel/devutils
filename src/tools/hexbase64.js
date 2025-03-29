const hexbase64 = {
  title: "Conversor Hex ↔ Base64",
  description:
    "Converta dados entre os formatos Hexadecimal e Base64 com facilidade. Ideal para codificação, segurança e manipulação de dados binários.",
  tags: [
    "hex para base64",
    "base64 para hex",
    "conversor de dados",
    "codificação base64",
    "codificação hexadecimal",
    "converter hex base64",
    "base64 converter",
  ],
  category: "Codificadores / Decodificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <textarea
      id="hexBase64Input"
      class="w-full p-2 bg-gray-700 rounded mb-2"
      rows="4"
      placeholder="Digite o valor Hex ou Base64"
    ></textarea>
    <div class="flex gap-2">
      <button
        id="hexToBase64Btn"
        class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
      >
        Hex → Base64
      </button>
      <button
        id="base64ToHexBtn"
        class="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded"
      >
        Base64 → Hex
      </button>
    </div>
    <div class="mt-2 flex gap-2">
      <textarea
        id="hexBase64Output"
        rows="4"
        readonly
        class="w-full p-2 bg-gray-700 text-green-400 rounded text-sm"
        placeholder="Resultado aparecerá aqui"
      ></textarea>
      <button
        id="hexBase64CopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded self-start"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const toBase64 = (hex) => {
      const bytes = hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16));
      const bin = String.fromCharCode(...bytes);
      return btoa(bin);
    };

    const fromBase64 = (b64) => {
      const bin = atob(b64);
      return [...bin]
        .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("");
    };

    const outputEl = document.getElementById("hexBase64Output");

    document.getElementById("hexToBase64Btn").addEventListener("click", () => {
      try {
        const hex = document
          .getElementById("hexBase64Input")
          .value.replace(/\s+/g, "")
          .toLowerCase();
        if (!/^[0-9a-f]+$/.test(hex)) throw new Error("Hex inválido");
        outputEl.value = toBase64(hex);
      } catch (e) {
        outputEl.value = "Erro: " + e.message;
      }
    });

    document.getElementById("base64ToHexBtn").addEventListener("click", () => {
      try {
        const b64 = document.getElementById("hexBase64Input").value.trim();
        outputEl.value = fromBase64(b64);
      } catch (e) {
        outputEl.value = "Erro: " + e.message;
      }
    });

    document
      .getElementById("hexBase64CopyBtn")
      .addEventListener("click", () => {
        const textToCopy = outputEl.value;
        navigator.clipboard.writeText(textToCopy).then(() => {
          const copyBtn = document.getElementById("hexBase64CopyBtn");
          const originalText = copyBtn.innerText;
          copyBtn.innerText = "Copiado!";
          setTimeout(() => {
            copyBtn.innerText = originalText;
          }, 1500);
        });
      });
  },
};

export default hexbase64;
