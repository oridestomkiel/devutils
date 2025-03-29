const csvtojson = {
  title: "Conversor CSV → JSON",
  description:
    "Converta dados de arquivos CSV para o formato JSON de forma rápida e prática. Ideal para APIs, testes e manipulação de dados estruturados.",
  tags: [
    "csv para json",
    "conversor csv",
    "converter csv em json",
    "dados estruturados",
    "transformar csv",
    "conversão de arquivos",
    "csv json",
  ],
  category: "Conversores de Dados",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <textarea
      id="csvToJsonInput"
      class="w-full p-2 bg-gray-700 rounded mb-2"
      rows="6"
      placeholder="Cole os dados CSV aqui (primeira linha = cabeçalhos)"
    ></textarea>

    <button
      id="csvToJsonBtn"
      class="bg-yellow-600 hover:bg-yellow-700 px-4 py-1 rounded"
    >
      Converter
    </button>
    <div class="mt-2 flex gap-2">
      <textarea
        id="csvToJsonOutput"
        rows="6"
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full text-sm"
        placeholder="Resultado JSON aparecerá aqui"
      ></textarea>
      <button
        id="csvToJsonCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded self-start"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const inputEl = document.getElementById("csvToJsonInput");
    const outputEl = document.getElementById("csvToJsonOutput");
    const convertBtn = document.getElementById("csvToJsonBtn");
    const copyBtn = document.getElementById("csvToJsonCopyBtn");

    convertBtn.addEventListener("click", () => {
      const input = inputEl.value.trim();

      try {
        const [headerLine, ...lines] = input.split("\n");
        if (!headerLine) {
          throw new Error("CSV sem cabeçalho.");
        }

        const headers = headerLine.split(",").map((h) => h.trim());

        const data = lines.map((line) => {
          const values = line.split(",").map((v) => v.trim());
          return Object.fromEntries(
            headers.map((h, i) => [h, values[i] ?? ""])
          );
        });

        outputEl.value = JSON.stringify(data, null, 2);
      } catch (e) {
        outputEl.value = "Erro: " + e.message;
      }
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(outputEl.value).then(() => {
        const originalText = copyBtn.innerText;
        copyBtn.innerText = "Copiado!";
        setTimeout(() => {
          copyBtn.innerText = originalText;
        }, 1500);
      });
    });
  },
};

export default csvtojson;
