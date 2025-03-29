const hexdecimal = {
  title: "Conversor Hexadecimal ↔ Decimal",
  description:
    "Converta valores entre hexadecimal e decimal de forma prática e rápida. Ideal para programação, eletrônica e análise de dados.",
  tags: [
    "hexadecimal para decimal",
    "decimal para hexadecimal",
    "conversor hex",
    "converter número",
    "base numérica",
    "hex dec",
    "calculadora hexadecimal",
  ],
  category: "Conversores Numéricos",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.1",
  render: () => `
    <textarea id="hexDecInput" class="w-full p-2 bg-gray-700 rounded mb-2" rows="3" placeholder="Digite hexadecimais ou decimais separados por espaço"></textarea>
    <div class="flex gap-2 mb-2">
      <button id="hexToDecBtn" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">Hex → Decimal</button>
      <button id="decToHexBtn" class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded">Decimal → Hex</button>
    </div>
    <div class="relative">
      <pre id="hexDecOutput" class="mt-2 text-green-400 whitespace-pre-wrap break-words pr-12"> </pre>
      <button id="copyHexDec" class="absolute top-0 right-0 text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">Copiar</button>
      <span id="copiedHexDec" class="absolute top-0 right-0 text-xs text-green-400 px-2 py-1 hidden">Copiado!</span>
    </div>
  `,
  init: () => {
    const outputEl = document.getElementById("hexDecOutput");
    const copyBtn = document.getElementById("copyHexDec");
    const copiedMsg = document.getElementById("copiedHexDec");

    document.getElementById("hexToDecBtn").addEventListener("click", () => {
      try {
        const input = document.getElementById("hexDecInput").value.trim();
        const output = input
          .split(/\s+/)
          .map((h) => parseInt(h, 16))
          .join(" ");
        outputEl.innerText = output;
      } catch (e) {
        outputEl.innerText = "Erro: " + e.message;
      }
    });

    document.getElementById("decToHexBtn").addEventListener("click", () => {
      try {
        const input = document.getElementById("hexDecInput").value.trim();
        const output = input
          .split(/\s+/)
          .map((d) => parseInt(d, 10).toString(16))
          .join(" ");
        outputEl.innerText = output;
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

export default hexdecimal;
