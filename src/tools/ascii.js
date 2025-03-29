const ascii = {
  title: "Codificador/decodificador ASCII",
  description:
    "Converta texto para códigos ASCII e vice-versa de forma simples e rápida. Ideal para análises, testes e manipulação de strings.",
  tags: [
    "ascii",
    "conversor ascii",
    "decodificar ascii",
    "codificar ascii",
    "tabela ascii",
    "texto para ascii",
    "ascii para texto",
  ],
  category: "Codificadores / Decodificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <textarea
      id="asciiInput"
      class="w-full p-2 bg-gray-700 rounded mb-2"
      rows="3"
      placeholder="Digite o texto ou os códigos ASCII separados por espaço"
    ></textarea>

    <div class="flex gap-2">
      <button
        id="asciiEncodeBtn"
        class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
      >
        Texto → ASCII
      </button>
      <button
        id="asciiDecodeBtn"
        class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
      >
        ASCII → Texto
      </button>
    </div>

    <div class="mt-2 flex gap-2">
      <input
        id="asciiOutput"
        type="text"
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full"
        value=""
      />
      <button
        id="asciiCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const asciiOutput = document.getElementById("asciiOutput");

    document.getElementById("asciiEncodeBtn").addEventListener("click", () => {
      const input = document.getElementById("asciiInput").value;
      const asciiCodes = [...input].map((c) => c.charCodeAt(0)).join(" ");
      asciiOutput.value = asciiCodes;
    });

    document.getElementById("asciiDecodeBtn").addEventListener("click", () => {
      const input = document.getElementById("asciiInput").value;
      try {
        const chars = input
          .trim()
          .split(/\s+/)
          .map((n) => String.fromCharCode(Number(n)));
        asciiOutput.value = chars.join("");
      } catch (e) {
        asciiOutput.value = "Erro ao decodificar. Verifique os números.";
      }
    });

    document.getElementById("asciiCopyBtn").addEventListener("click", () => {
      navigator.clipboard.writeText(asciiOutput.value).then(() => {
        const btn = document.getElementById("asciiCopyBtn");
        const original = btn.innerText;
        btn.innerText = "Copiado!";
        setTimeout(() => (btn.innerText = original), 1500);
      });
    });
  },
};

export default ascii;
