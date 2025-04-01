const jsonToMySQL = {
  title: "JSON → MySQL",
  description:
    "Gere declarações SQL para criar tabelas MySQL com base em um JSON. Ideal para protótipos e modelagem rápida.",
  tags: ["json", "mysql", "sql", "banco de dados", "converter", "ddl"],
  category: "Conversores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <textarea id="sqlInput" rows="8" class="w-full p-2 bg-gray-700 text-white rounded mb-3" placeholder='Cole seu JSON aqui...'></textarea>
  
      <div class="flex gap-2 mb-3">
        <button id="sqlConvertBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded">Converter</button>
        <button id="sqlClearBtn" class="bg-gray-600 hover:bg-gray-500 px-4 py-1 rounded">Limpar</button>
        <button id="sqlCopyBtn" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded">Copiar</button>
      </div>
  
      <pre id="sqlOutput" class="bg-gray-900 text-green-400 text-sm p-3 rounded whitespace-pre-wrap break-words"></pre>
    `,

  init: () => {
    const input = document.getElementById("sqlInput");
    const output = document.getElementById("sqlOutput");
    const convertBtn = document.getElementById("sqlConvertBtn");
    const clearBtn = document.getElementById("sqlClearBtn");
    const copyBtn = document.getElementById("sqlCopyBtn");

    const detectType = (value) => {
      if (typeof value === "number")
        return Number.isInteger(value) ? "INT" : "FLOAT";
      if (typeof value === "boolean") return "BOOLEAN";
      if (typeof value === "string")
        return value.length > 255 ? "TEXT" : "VARCHAR(255)";
      return "TEXT";
    };

    const convertToSQL = (obj) => {
      let lines = ["CREATE TABLE tabela ("];

      const keys = Object.keys(obj);
      keys.forEach((key, i) => {
        const type = detectType(obj[key]);
        const comma = i < keys.length - 1 ? "," : "";
        lines.push(`${key} ${type}${comma}`);
      });

      lines.push(");");
      return lines.join("\n");
    };

    convertBtn.addEventListener("click", () => {
      try {
        const json = JSON.parse(input.value);
        const sql = convertToSQL(json);
        output.innerText = sql;
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
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.innerText = "Copiado!";
        setTimeout(() => (copyBtn.innerText = "Copiar"), 1500);
      });
    });
  },
};

export default jsonToMySQL;
