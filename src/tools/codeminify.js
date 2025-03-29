const codeminify = {
  title: "Minificador de Código (HTML, CSS, JS simples)",
  description:
    "Remova espaços, quebras de linha e comentários de arquivos HTML, CSS e JavaScript simples para otimizar a performance do seu site.",
  tags: [
    "minificar código",
    "minificador html",
    "minificador css",
    "minificador js",
    "otimizar código",
    "compressão de arquivos",
    "reduzir tamanho código",
    "minify html css js",
  ],
  category: "Formatadores / Minificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <textarea
      id="codeMinInput"
      class="w-full p-2 bg-gray-700 rounded mb-2 text-white"
      rows="6"
      placeholder="Cole seu HTML, CSS ou JS"
    ></textarea>

    <button
      id="minifyBtn"
      class="bg-teal-600 hover:bg-teal-700 px-4 py-1 rounded"
    >
      Minificar
    </button>

    <div class="mt-2 flex gap-2">
      <textarea
        id="minifyOutput"
        rows="6"
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full"
        placeholder="Resultado da minificação"
      ></textarea>
      <button
        id="minifyCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const inputEl = document.getElementById("codeMinInput");
    const outputEl = document.getElementById("minifyOutput");
    const minifyBtn = document.getElementById("minifyBtn");
    const copyBtn = document.getElementById("minifyCopyBtn");

    minifyBtn.addEventListener("click", () => {
      const input = inputEl.value;
      const minified = input
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "")
        .replace(/\s{2,}/g, " ")
        .replace(/\n/g, "")
        .replace(/\s*([{};:,])\s*/g, "$1")
        .trim();

      outputEl.value = minified || "Nada pra minificar.";
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

export default codeminify;
