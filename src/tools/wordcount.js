const wordcount = {
  title: "Contador de palavras, caracteres, linhas e frases",
  description:
    "Conte o número de palavras, caracteres, linhas e frases em um texto. Ideal para verificação de limites em formulários, artigos e redes sociais.",
  tags: [
    "contador de palavras",
    "contador de caracteres",
    "contar linhas",
    "contar frases",
    "limite de texto",
    "análise de texto",
  ],
  category: "Ferramentas de Texto",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",
  render: () => `
    <textarea id="wcInput" class="w-full p-2 bg-gray-700 rounded mb-2" rows="6" placeholder="Digite ou cole seu texto aqui..."></textarea>
    <div class="grid grid-cols-2 gap-2 text-sm text-gray-300 mt-2">
      <div>📝 Palavras: <span id="wcWords" class="text-green-400">0</span></div>
      <div>🔡 Caracteres (com espaços): <span id="wcChars" class="text-green-400">0</span></div>
      <div>🔡 Caracteres (sem espaços): <span id="wcCharsNoSpace" class="text-green-400">0</span></div>
      <div>📏 Linhas: <span id="wcLines" class="text-green-400">0</span></div>
      <div>🧩 Frases: <span id="wcSentences" class="text-green-400">0</span></div>
    </div>
  `,
  init: () => {
    const input = document.getElementById("wcInput");
    const words = document.getElementById("wcWords");
    const chars = document.getElementById("wcChars");
    const charsNoSpace = document.getElementById("wcCharsNoSpace");
    const lines = document.getElementById("wcLines");
    const sentences = document.getElementById("wcSentences");

    const updateCount = () => {
      const text = input.value;

      words.innerText = text
        .trim()
        .split(/\s+/)
        .filter((w) => w).length;
      chars.innerText = text.length;
      charsNoSpace.innerText = text.replace(/\s/g, "").length;
      lines.innerText = text.split(/\n/).length;
      sentences.innerText = (text.match(/[\.\?!](\s|$)/g) || []).length;
    };

    input.addEventListener("input", updateCount);
  },
};
export default wordcount;
