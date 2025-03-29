const hextext = {
  title: "Conversor Hex ↔ Texto",
  description:
    "Converta valores hexadecimais para texto e texto para hexadecimal com precisão. Útil para codificação, debugging e manipulação de strings.",
  tags: [
    "hex para texto",
    "texto para hex",
    "conversor hexadecimal",
    "string para hex",
    "decodificar hex",
    "codificar texto",
    "converter hex",
  ],
  category: "Codificadores / Decodificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.1",
  render: () => `
    <textarea id="hexTextInput" class="w-full p-2 bg-gray-700 rounded mb-2" rows="4" placeholder="Digite texto ou valor hexadecimal"></textarea>
    <div class="flex gap-2 mb-2">
      <button id="textToHexBtn" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">Texto → Hex</button>
      <button id="hexToTextBtn" class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded">Hex → Texto</button>
    </div>
    <div class="relative">
      <pre id="hexTextOutput" class="mt-2 text-green-400 whitespace-pre-wrap break-words pr-12"> </pre>
      <button id="copyHexText" class="absolute top-0 right-0 text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">Copiar</button>
      <span id="copiedHexText" class="absolute top-0 right-0 text-xs text-green-400 px-2 py-1 hidden">Copiado!</span>
    </div>
  `,
  init: () => {
    const outputEl = document.getElementById("hexTextOutput");
    const copyBtn = document.getElementById("copyHexText");
    const copiedMsg = document.getElementById("copiedHexText");

    document.getElementById("textToHexBtn").addEventListener("click", () => {
      const input = document.getElementById("hexTextInput").value;
      const hex = [...input]
        .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(" ");
      outputEl.innerText = hex;
    });

    document.getElementById("hexToTextBtn").addEventListener("click", () => {
      const input = document
        .getElementById("hexTextInput")
        .value.replace(/\s+/g, "");
      try {
        const text = input
          .match(/.{1,2}/g)
          .map((h) => String.fromCharCode(parseInt(h, 16)))
          .join("");
        outputEl.innerText = text;
      } catch (e) {
        outputEl.innerText = "Erro: " + e.message;
      }
    });

    copyBtn.addEventListener("click", () => {
      const text = outputEl.innerText;
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

export default hextext;
