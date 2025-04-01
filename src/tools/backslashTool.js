const barraInvertidaTexto = {
  title: "Escapar/Desescapar Barras Invertidas",
  description:
    "Converta caracteres especiais como quebras de linha (\\n), tabulações (\\t), aspas e outros, para strings escapadas ou vice-versa.",
  tags: ["escape", "desescape", "barra invertida", "texto", "string"],
  category: "Ferramentas de Texto",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <div class="p-4 rounded bg-gray-800 text-white text-sm space-y-4">
        <div class="flex items-center gap-4">
          <label><input type="radio" name="modoBarra" value="escape" checked> Escapar</label>
          <label><input type="radio" name="modoBarra" value="unescape"> Desescapar</label>
        </div>
  
        <div>
          <label class="block mb-1">Entrada:</label>
          <textarea id="entradaBarra" class="w-full p-2 rounded bg-gray-700 text-white h-32 font-mono"></textarea>
        </div>
  
        <button id="btnConverterBarra" class="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded">Converter</button>
  
        <div>
          <label class="block mb-1">Resultado:</label>
          <textarea id="saidaBarra" readonly class="w-full p-2 rounded bg-gray-900 text-green-400 h-32 font-mono"></textarea>
          <button id="btnCopiarBarra" class="mt-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded">Copiar</button>
        </div>
      </div>
    `,

  init: () => {
    const entrada = document.getElementById("entradaBarra");
    const saida = document.getElementById("saidaBarra");
    const botao = document.getElementById("btnConverterBarra");
    const botaoCopiar = document.getElementById("btnCopiarBarra");

    const escaparTexto = (str) =>
      str
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
        .replace(/"/g, '\\"')
        .replace(/'/g, "\\'");

    const desescaparTexto = (str) =>
      str
        .replace(/\\\\/g, "\\")
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'");

    botao.onclick = () => {
      const modo = document.querySelector(
        'input[name="modoBarra"]:checked'
      ).value;
      saida.value =
        modo === "escape"
          ? escaparTexto(entrada.value)
          : desescaparTexto(entrada.value);
    };

    botaoCopiar.onclick = () => {
      navigator.clipboard.writeText(saida.value);
      botaoCopiar.textContent = "Copiado!";
      setTimeout(() => (botaoCopiar.textContent = "Copiar"), 1500);
    };
  },
};

export default barraInvertidaTexto;
