const ordenador = {
  title: "Colocar em Ordem Alfabética",
  description:
    "Ferramenta online para colocar uma lista em ordem alfabética. Copie e cole a lista com os nomes que quer organizar alfabeticamente e depois clique em “Ordenar”.",
  tags: ["ordem", "alfabética", "ordenar", "lista", "texto", "duplicados"],
  category: "Texto",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <div class="p-4 rounded bg-gray-800 text-white text-sm space-y-4">
        <div>
          <label class="block mb-1">Texto original:</label>
          <textarea id="inputTexto" rows="5" maxlength="10000" class="w-full p-2 rounded bg-gray-700 text-white" placeholder="Cole sua lista aqui..."></textarea>
          <div class="text-xs text-gray-400 mt-1"><span id="charCount">0</span>/10.000 caracteres</div>
        </div>
  
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1">Tipo de ordenação:</label>
            <select id="tipoOrdem" class="w-full p-2 rounded bg-gray-700 text-white">
              <option value="asc">Ascendente (A-Z)</option>
              <option value="desc">Descendente (Z-A)</option>
            </select>
          </div>
          <div>
            <label class="block mb-1">Ordenar por:</label>
            <select id="separador" class="w-full p-2 rounded bg-gray-700 text-white">
              <option value="\\n">Quebra de Linha</option>
              <option value=" ">Espaço</option>
              <option value=",">Vírgula ( , )</option>
              <option value=";">Ponto e Vírgula ( ; )</option>
            </select>
          </div>
        </div>
  
        <div class="flex items-center gap-2">
          <input type="checkbox" id="removerDuplicados" class="accent-indigo-600" />
          <label for="removerDuplicados">Remover Duplicados?</label>
        </div>
  
        <button id="btnOrdenar" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm">
          Ordenar
        </button>
  
        <div>
          <label class="block mb-1 mt-4">Texto ordenado:</label>
          <textarea id="resultado" rows="5" readonly class="w-full p-2 rounded bg-gray-700 text-green-400"></textarea>
          <div class="flex gap-2 mt-2">
            <button id="btnCopiar" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm">Copiar</button>
            <button id="btnDownload" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm">Baixar TXT</button>
          </div>
        </div>
      </div>
    `,

  init: () => {
    const input = document.getElementById("inputTexto");
    const resultado = document.getElementById("resultado");

    input.addEventListener("input", () => {
      document.getElementById("charCount").textContent = input.value.length;
    });

    document.getElementById("btnOrdenar").addEventListener("click", () => {
      const tipo = document.getElementById("tipoOrdem").value;
      const sep = document.getElementById("separador").value;
      const remover = document.getElementById("removerDuplicados").checked;

      let valores = input.value.split(new RegExp(sep));
      valores = valores.map((v) => v.trim()).filter((v) => v.length > 0);
      if (remover) valores = [...new Set(valores)];
      valores.sort((a, b) =>
        tipo === "asc" ? a.localeCompare(b) : b.localeCompare(a)
      );

      const saida = sep === "\\n" ? valores.join("\n") : valores.join(sep);
      resultado.value = saida;
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
      link.download = "ordenado.txt";
      link.click();
    });
  },
};

export default ordenador;
