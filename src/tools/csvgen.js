const csvgen = {
  title: "Gerador de matriz/dados em CSV",
  description:
    "Gere dados fictícios em formato de matriz para arquivos CSV. Perfeito para testes, protótipos, planilhas e importações de dados.",
  tags: [
    "gerador de csv",
    "dados fictícios",
    "csv generator",
    "matriz de dados",
    "dados para teste",
    "gerar tabela csv",
    "dados simulados",
  ],
  category: "Geradores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <div class="grid grid-cols-2 gap-2 mb-2">
      <input
        id="csvRows"
        type="number"
        min="1"
        value="10"
        class="p-2 bg-gray-700 rounded"
        placeholder="Linhas"
      />
      <input
        id="csvCols"
        type="number"
        min="1"
        value="5"
        class="p-2 bg-gray-700 rounded"
        placeholder="Colunas"
      />
    </div>

    <button
      id="csvGenBtn"
      class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
    >
      Gerar CSV
    </button>
    <div class="mt-2 flex gap-2">
      <textarea
        id="csvOutput"
        class="w-full p-2 bg-gray-700 rounded"
        rows="6"
        readonly
        placeholder="CSV gerado aparecerá aqui"
      ></textarea>
      <button
        id="csvCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded self-start"
      >
        Copiar
      </button>
    </div>

    <button
      id="csvDownloadBtn"
      class="mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
    >
      Baixar CSV
    </button>
  `,
  init: () => {
    const csvRowsEl = document.getElementById("csvRows");
    const csvColsEl = document.getElementById("csvCols");
    const csvOutputEl = document.getElementById("csvOutput");
    const csvGenBtn = document.getElementById("csvGenBtn");
    const csvCopyBtn = document.getElementById("csvCopyBtn");
    const csvDownloadBtn = document.getElementById("csvDownloadBtn");

    const genWord = () => Math.random().toString(36).substring(2, 8);

    csvGenBtn.addEventListener("click", () => {
      const rows = parseInt(csvRowsEl.value, 10);
      const cols = parseInt(csvColsEl.value, 10);
      const csv = [];

      csv.push(
        Array.from({ length: cols }, (_, i) => `col_${i + 1}`).join(",")
      );

      for (let i = 0; i < rows; i++) {
        const row = Array.from({ length: cols }, () => genWord());
        csv.push(row.join(","));
      }

      csvOutputEl.value = csv.join("\n");
    });

    csvCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(csvOutputEl.value).then(() => {
        const original = csvCopyBtn.innerText;
        csvCopyBtn.innerText = "Copiado!";
        setTimeout(() => {
          csvCopyBtn.innerText = original;
        }, 1500);
      });
    });

    csvDownloadBtn.addEventListener("click", () => {
      const blob = new Blob([csvOutputEl.value], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dados.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  },
};

export default csvgen;
