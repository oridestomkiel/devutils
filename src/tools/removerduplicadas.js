const removerduplicadas = {
  title: "Remover Linhas Duplicadas",
  description:
    "Cole seu texto e remova automaticamente linhas duplicadas. Ideal para limpar listas e organizar conteúdo de forma rápida.",
  tags: [
    "remover duplicadas",
    "limpar linhas",
    "duplicadas",
    "linhas repetidas",
  ],
  category: "Ferramentas de Texto",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <div class="p-4 rounded bg-gray-800 text-white text-sm space-y-4">
        <div>
          <label class="block mb-1">Texto com possíveis duplicadas:</label>
          <textarea id="inputDuplicadas" rows="6" class="w-full p-2 rounded bg-gray-700 text-white" placeholder="Cole aqui seu conteúdo..."></textarea>
        </div>
  
        <button id="btnRemover" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm">
          Remover duplicadas
        </button>
  
        <div>
          <label class="block mb-1 mt-4">Resultado sem duplicadas:</label>
          <textarea id="resultado" rows="6" readonly class="w-full p-2 rounded bg-gray-700 text-green-400"></textarea>
          <div class="flex gap-2 mt-2">
            <button id="btnCopiar" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm">Copiar</button>
            <button id="btnDownload" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm">Baixar TXT</button>
          </div>
        </div>
      </div>
    `,

  init: () => {
    const input = document.getElementById("inputDuplicadas");
    const resultado = document.getElementById("resultado");

    document.getElementById("btnRemover").addEventListener("click", () => {
      const linhas = input.value.split("\n").map((l) => l.trim());
      const unicas = [...new Set(linhas)].filter((l) => l);
      resultado.value = unicas.join("\n");
    });

    document.getElementById("btnCopiar").addEventListener("click", () => {
      navigator.clipboard.writeText(resultado.value).then(() => {
        const btn = document.getElementById("btnCopiar");
        btn.textContent = "Copiado!";
        setTimeout(() => (btn.textContent = "Copiar"), 1500);
      });
    });

    document.getElementById("btnDownload").addEventListener("click", () => {
      const blob = new Blob([resultado.value], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "sem-duplicadas.txt";
      link.click();
    });
  },
};

export default removerduplicadas;
