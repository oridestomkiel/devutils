const textbinary = {
  title: "Conversor Texto ↔ Binário",
  description:
    "Converta texto para binário e binário para texto de maneira simples. Ideal para depuração, testes e manipulação de dados.",
  tags: [
    "binário",
    "texto para binário",
    "binário para texto",
    "conversor binário",
    "codificar binário",
    "decodificar binário",
    "texto binário",
  ],
  category: "Codificadores / Decodificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.3.0",
  render: () => `
    <textarea id="textBinaryInput" class="w-full p-2 bg-gray-700 rounded mb-2 text-white" rows="4" placeholder="Digite texto ou binário separado por espaço"></textarea>
    <div class="flex gap-2 mb-2">
      <button id="textToBinaryBtn" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">Texto → Binário</button>
      <button id="binaryToTextBtn" class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded">Binário → Texto</button>
    </div>
    <div class="relative">
      <textarea id="textBinaryOutput" class="w-full p-2 bg-gray-700 text-green-400 rounded pr-20" rows="4" readonly placeholder="Resultado binário ou texto aparecerá aqui..."></textarea>
      <button id="copyTextBinaryBtn" class="absolute top-2 right-2text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">Copiar</button>
      <span id="copiedTextBinaryMsg" class="absolute top-2 right-2 text-green-400 px-2 py-1 hidden">Copiado!</span>
    </div>
  `,
  init: () => {
    const input = document.getElementById("textBinaryInput");
    const output = document.getElementById("textBinaryOutput");
    const copyBtn = document.getElementById("copyTextBinaryBtn");
    const copiedMsg = document.getElementById("copiedTextBinaryMsg");

    document.getElementById("textToBinaryBtn").addEventListener("click", () => {
      const value = input.value.trim();
      if (!value) return (output.value = "");

      const binary = [...value]
        .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
        .join(" ");
      output.value = binary;
    });

    document.getElementById("binaryToTextBtn").addEventListener("click", () => {
      const value = input.value.trim();
      if (!value) return (output.value = "");

      try {
        const text = value
          .split(/\s+/)
          .map((b) => String.fromCharCode(parseInt(b, 2)))
          .join("");
        output.value = text;
      } catch (e) {
        output.value = "Erro: " + e.message;
      }
    });

    copyBtn.addEventListener("click", () => {
      const text = output.value;
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        copyBtn.classList.add("hidden");
        copiedMsg.classList.remove("hidden");

        setTimeout(() => {
          copiedMsg.classList.add("hidden");
          copyBtn.classList.remove("hidden");
        }, 2000);
      });
    });
  },
};

export default textbinary;
