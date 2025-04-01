const quebraLinhaParaEscape = {
  title: "Converter Quebras de Linha para \\n",
  description:
    "Converte quebras de linha reais para o formato escape \\n. Ideal para programadores que precisam copiar textos com quebras para código.",
  tags: [
    "quebra de linha",
    "escape",
    "programação",
    "conversão",
    "texto",
    "código",
  ],
  category: "Ferramentas de Texto",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <div class="p-4 rounded bg-gray-800 text-white text-sm space-y-4">
        <div>
          <label class="block mb-1">Texto com quebras de linha:</label>
          <textarea id="inputTexto" rows="6" class="w-full p-2 rounded bg-gray-700 text-white" placeholder="Digite ou cole seu texto aqui..."></textarea>
        </div>
  
        <button id="btnConverter" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm">
          Converter para \\n
        </button>
  
        <div>
          <label class="block mb-1 mt-4">Resultado com \\n:</label>
          <textarea id="resultado" rows="6" readonly class="w-full p-2 rounded bg-gray-700 text-green-400 font-mono"></textarea>
          <div class="flex gap-2 mt-2">
            <button id="btnCopiar" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm">Copiar</button>
            <button id="btnLimpar" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm">Limpar</button>
          </div>
        </div>
      </div>
    `,

  init: () => {
    const inputTexto = document.getElementById("inputTexto");
    const resultado = document.getElementById("resultado");

    document.getElementById("btnConverter").addEventListener("click", () => {
      const textoConvertido = inputTexto.value.replace(/\n/g, "\\n");
      resultado.value = textoConvertido;
    });

    document.getElementById("btnCopiar").addEventListener("click", () => {
      navigator.clipboard.writeText(resultado.value).then(() => {
        const btn = document.getElementById("btnCopiar");
        btn.textContent = "Copiado!";
        setTimeout(() => (btn.textContent = "Copiar"), 1500);
      });
    });

    document.getElementById("btnLimpar").addEventListener("click", () => {
      inputTexto.value = "";
      resultado.value = "";
    });
  },
};

export default quebraLinhaParaEscape;
