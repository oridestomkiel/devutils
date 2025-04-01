const jsonToBigQuerySchema = {
  title: "JSON → BigQuery Schema",
  description:
    "Converta um JSON simples em uma estrutura de schema para BigQuery, incluindo nome, tipo e modo (REQUIRED).",
  tags: ["json", "bigquery", "schema", "gcp", "google cloud", "dados"],
  category: "Conversores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <textarea id="bqInput" rows="8" class="w-full p-2 bg-gray-700 text-white rounded mb-3" placeholder='Cole seu JSON aqui...'></textarea>
  
      <div class="flex gap-2 mb-3">
        <button id="bqConvertBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded">Converter</button>
        <button id="bqClearBtn" class="bg-gray-600 hover:bg-gray-500 px-4 py-1 rounded">Limpar</button>
        <button id="bqCopyBtn" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded">Copiar Resultado</button>
      </div>
  
      <pre id="bqSchemaOutput" class="bg-gray-900 text-green-400 text-sm p-3 rounded whitespace-pre-wrap break-words"></pre>
    `,

  init: () => {
    const input = document.getElementById("bqInput");
    const output = document.getElementById("bqSchemaOutput");
    const convertBtn = document.getElementById("bqConvertBtn");
    const clearBtn = document.getElementById("bqClearBtn");
    const copyBtn = document.getElementById("bqCopyBtn");

    const detectBQType = (value) => {
      if (typeof value === "number")
        return Number.isInteger(value) ? "INTEGER" : "FLOAT";
      if (typeof value === "boolean") return "BOOLEAN";
      if (typeof value === "string") return "STRING";
      if (Array.isArray(value)) return "RECORD"; // Simplificação
      if (typeof value === "object" && value !== null) return "RECORD";
      return "STRING";
    };

    const convertToBQSchema = (json) => {
      return Object.entries(json).map(([key, val]) => ({
        name: key,
        type: detectBQType(val),
        mode: "REQUIRED",
      }));
    };

    convertBtn.addEventListener("click", () => {
      try {
        const json = JSON.parse(input.value);
        const schema = convertToBQSchema(json);
        output.innerText = JSON.stringify(schema, null, 2);
      } catch {
        output.innerText = "❌ JSON inválido!";
      }
    });

    clearBtn.addEventListener("click", () => {
      input.value = "";
      output.innerText = "";
    });

    copyBtn.addEventListener("click", () => {
      const text = output.innerText;
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.innerText = "Copiado!";
        setTimeout(() => (copyBtn.innerText = "Copiar Resultado"), 1500);
      });
    });
  },
};

export default jsonToBigQuerySchema;
