const placaMercosul = {
  title: "Gerador de Placas Mercosul",
  description:
    "Gere placas no padrão Mercosul (AAA1A23) ou converta placas antigas para o novo modelo. Ideal para testes e simulações.",
  tags: [
    "placa mercosul",
    "gerador de placas",
    "novo modelo",
    "placa brasil",
    "simulador placa",
    "converter placa",
    "exportar placa",
  ],
  category: "Geradores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",
  render: () => `
      <div class="flex flex-col gap-2">
        <div class="flex gap-2 items-center">
          <label class="text-sm">Quantidade:</label>
          <input type="number" id="mercosulQtd" min="1" value="1" class="w-20 bg-gray-700 rounded p-1" />
        </div>
  
        <button id="gerarMercosulBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
          Gerar Placas Mercosul
        </button>
  
        <div>
          <label class="text-sm">Converter placa antiga (ABC1234):</label>
          <input type="text" id="inputConversao" placeholder="Ex: BRA1234" class="bg-gray-700 rounded p-1 w-full text-green-400" />
          <button id="converterPlacaBtn" class="mt-1 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">Converter</button>
        </div>
  
        <textarea id="mercosulResultado" rows="6" readonly class="bg-gray-700 text-green-400 p-2 rounded w-full"></textarea>
  
        <div class="flex gap-2">
          <button id="copiarMercosulBtn" class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">Copiar</button>
          <button id="exportarMercosulBtn" class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">Exportar CSV</button>
        </div>
      </div>
    `,
  init: () => {
    const gerarBtn = document.getElementById("gerarMercosulBtn");
    const copiarBtn = document.getElementById("copiarMercosulBtn");
    const exportarBtn = document.getElementById("exportarMercosulBtn");
    const converterBtn = document.getElementById("converterPlacaBtn");
    const resultado = document.getElementById("mercosulResultado");
    const inputConversao = document.getElementById("inputConversao");

    const letras = () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const digito = () => Math.floor(Math.random() * 10).toString();

    const gerarPlacaMercosul = () => {
      return [
        letras(),
        letras(),
        letras(),
        digito(),
        letras(),
        digito(),
        digito(),
      ].join("");
    };

    const converterAntigaParaMercosul = (placaAntiga) => {
      const match = placaAntiga.toUpperCase().match(/^([A-Z]{3})(\d{4})$/);
      if (!match) return "Formato inválido";

      const [_, letras, numeros] = match;
      const novaPlaca =
        letras.slice(0, 3) + numeros[0] + letras[2] + numeros.slice(1);

      return novaPlaca;
    };

    const exportarCSV = (placas) => {
      const csv = placas.map((p) => `"${p}"`).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "placas-mercosul.csv";
      a.click();
      URL.revokeObjectURL(url);
    };

    gerarBtn.addEventListener("click", () => {
      const qtd = parseInt(document.getElementById("mercosulQtd").value);
      const placas = Array.from({ length: qtd }, gerarPlacaMercosul);
      resultado.value = placas.join("\n");
    });

    copiarBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(resultado.value).then(() => {
        copiarBtn.textContent = "Copiado!";
        setTimeout(() => (copiarBtn.textContent = "Copiar"), 1500);
      });
    });

    exportarBtn.addEventListener("click", () => {
      const linhas = resultado.value
        .trim()
        .split("\n")
        .filter((l) => l);
      if (linhas.length) exportarCSV(linhas);
    });

    converterBtn.addEventListener("click", () => {
      const convertido = converterAntigaParaMercosul(
        inputConversao.value.trim()
      );
      resultado.value = convertido;
    });
  },
};

export default placaMercosul;
