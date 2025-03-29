const hex = {
  title: "Codificador/decodificador HEX",
  description:
    "Converta texto para hexadecimal e hexadecimal para texto de forma simples. Ideal para debugging, codificação e manipulação de dados.",
  tags: [
    "hexadecimal",
    "texto para hex",
    "hex para texto",
    "codificar hex",
    "decodificar hex",
    "conversor hex",
    "ferramenta hex",
    "string hexadecimal",
  ],
  category: "Codificadores / Decodificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <textarea
      id="hexInput"
      class="w-full p-2 bg-gray-700 rounded mb-2"
      rows="3"
      placeholder="Digite o texto ou código HEX"
    ></textarea>
    <div class="flex gap-2">
      <button
        id="hexEncodeBtn"
        class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
      >
        Texto → HEX
      </button>
      <button
        id="hexDecodeBtn"
        class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
      >
        HEX → Texto
      </button>
    </div>
    <div class="mt-2 flex gap-2">
      <textarea
        id="hexOutput"
        rows="3"
        readonly
        class="w-full p-2 bg-gray-700 text-green-400 rounded text-sm"
        placeholder="Resultado aparecerá aqui"
      ></textarea>
      <button
        id="hexCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded self-start"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const encodeHex = (str) =>
      [...str]
        .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(" ");

    const decodeHex = (hex) =>
      hex
        .trim()
        .split(/\s+/)
        .map((h) => String.fromCharCode(parseInt(h, 16)))
        .join("");

    document.getElementById("hexEncodeBtn").addEventListener("click", () => {
      const input = document.getElementById("hexInput").value;
      document.getElementById("hexOutput").value = encodeHex(input);
    });

    document.getElementById("hexDecodeBtn").addEventListener("click", () => {
      const input = document.getElementById("hexInput").value;
      try {
        document.getElementById("hexOutput").value = decodeHex(input);
      } catch (e) {
        document.getElementById("hexOutput").value = "❌ HEX inválido.";
      }
    });

    document.getElementById("hexCopyBtn").addEventListener("click", () => {
      const outputEl = document.getElementById("hexOutput");
      navigator.clipboard.writeText(outputEl.value).then(() => {
        const copyBtn = document.getElementById("hexCopyBtn");
        const originalText = copyBtn.innerText;
        copyBtn.innerText = "Copiado!";
        setTimeout(() => {
          copyBtn.innerText = originalText;
        }, 1500);
      });
    });
  },
};

export default hex;
