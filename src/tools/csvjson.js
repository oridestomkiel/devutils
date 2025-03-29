const csvjson = {
  title: "Conversor CSV ↔ JSON",
  description:
    "Converta arquivos CSV para JSON e vice-versa com facilidade. Útil para integração de dados, APIs e manipulação de arquivos.",
  tags: [
    "conversor csv json",
    "csv para json",
    "json para csv",
    "conversão de dados",
    "transformar csv em json",
    "converter arquivos",
    "dados estruturados",
  ],
  category: "Conversores de Dados",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <textarea
      id="csvJsonInput"
      class="w-full p-2 bg-gray-700 rounded mb-2"
      rows="6"
      placeholder="Cole CSV ou JSON aqui..."
    ></textarea>

    <div class="flex gap-2">
      <button
        id="csvToJsonBtn"
        class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
      >
        CSV → JSON
      </button>
      <button
        id="jsonToCsvBtn"
        class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
      >
        JSON → CSV
      </button>
    </div>
    <div class="mt-2 flex gap-2">
      <textarea
        id="csvJsonOutput"
        rows="6"
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full text-sm"
        placeholder="Resultado será exibido aqui"
      ></textarea>
      <button
        id="csvJsonCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded self-start"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const inputEl = document.getElementById("csvJsonInput");
    const outputEl = document.getElementById("csvJsonOutput");
    const copyBtn = document.getElementById("csvJsonCopyBtn");

    const csvToJsonBtn = document.getElementById("csvToJsonBtn");
    const jsonToCsvBtn = document.getElementById("jsonToCsvBtn");

    csvToJsonBtn.addEventListener("click", () => {
      try {
        const input = inputEl.value.trim();
        const [headerLine, ...lines] = input.split("\n");
        const headers = headerLine.split(",");
        const data = lines.map((line) => {
          const values = line.split(",");
          return headers.reduce((obj, key, i) => {
            obj[key.trim()] = values[i]?.trim() ?? "";
            return obj;
          }, {});
        });
        outputEl.value = JSON.stringify(data, null, 2);
      } catch (e) {
        outputEl.value = "Erro: " + e.message;
      }
    });

    jsonToCsvBtn.addEventListener("click", () => {
      try {
        const json = JSON.parse(inputEl.value.trim());
        if (!Array.isArray(json)) {
          throw new Error("JSON deve ser um array de objetos.");
        }
        const headers = Object.keys(json[0]);
        const csv = [
          headers.join(","),
          ...json.map((obj) =>
            headers.map((h) => JSON.stringify(obj[h] ?? "")).join(",")
          ),
        ].join("\n");
        outputEl.value = csv;
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

export default csvjson;
