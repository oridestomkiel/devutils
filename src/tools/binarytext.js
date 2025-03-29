const binarytext = {
  title: "Conversor Texto ↔ Binário",
  description:
    "Converta texto para código binário e binário para texto de forma rápida e intuitiva. Ideal para estudos, codificação e decodificação de dados.",
  tags: [
    "texto binário",
    "conversor binário",
    "binário para texto",
    "texto para binário",
    "decodificador binário",
    "codificador binário",
    "binário online",
  ],
  category: "Codificadores / Decodificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <textarea
      id="binaryInput"
      class="w-full p-2 bg-gray-700 rounded mb-2"
      rows="4"
      placeholder="Digite o texto ou binário separado por espaço"
    ></textarea>

    <div class="flex gap-2">
      <button
        id="textToBinaryBtn"
        class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
      >
        Texto → Binário
      </button>
      <button
        id="binaryToTextBtn"
        class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
      >
        Binário → Texto
      </button>
    </div>

    <div class="mt-2 flex gap-2">
      <input
        id="binaryOutput"
        type="text"
        value=""
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full text-sm"
      />
      <button
        id="binaryCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const inputEl = document.getElementById("binaryInput");
    const outputEl = document.getElementById("binaryOutput");
    const textToBinBtn = document.getElementById("textToBinaryBtn");
    const binToTextBtn = document.getElementById("binaryToTextBtn");
    const copyBtn = document.getElementById("binaryCopyBtn");

    textToBinBtn.addEventListener("click", () => {
      const input = inputEl.value;
      const bin = [...input]
        .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
        .join(" ");
      outputEl.value = bin;
    });

    binToTextBtn.addEventListener("click", () => {
      try {
        const input = inputEl.value.trim();
        const chars = input
          .split(/\s+/)
          .map((b) => String.fromCharCode(parseInt(b, 2)));
        outputEl.value = chars.join("");
      } catch (e) {
        outputEl.value = "Erro ao converter binário.";
      }
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(outputEl.value).then(() => {
        const original = copyBtn.innerText;
        copyBtn.innerText = "Copiado!";
        setTimeout(() => (copyBtn.innerText = original), 1500);
      });
    });
  },
};

export default binarytext;
