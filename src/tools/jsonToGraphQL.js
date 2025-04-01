const jsonToGraphQL = {
  title: "JSON → GraphQL",
  description:
    "Gere tipos GraphQL automaticamente a partir de um JSON. Útil para construir schemas de API rapidamente.",
  tags: ["json", "graphql", "schema", "converter", "types"],
  category: "Conversores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <textarea id="gqlInput" rows="8" class="w-full p-2 bg-gray-700 text-white rounded mb-3" placeholder='Cole seu JSON aqui...'></textarea>
  
      <div class="flex gap-2 mb-3">
        <button id="gqlConvertBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded">Converter</button>
        <button id="gqlClearBtn" class="bg-gray-600 hover:bg-gray-500 px-4 py-1 rounded">Limpar</button>
        <button id="gqlCopyBtn" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded">Copiar</button>
      </div>
  
      <pre id="gqlOutput" class="bg-gray-900 text-green-400 text-sm p-3 rounded whitespace-pre-wrap break-words"></pre>
    `,

  init: () => {
    const input = document.getElementById("gqlInput");
    const output = document.getElementById("gqlOutput");
    const convertBtn = document.getElementById("gqlConvertBtn");
    const clearBtn = document.getElementById("gqlClearBtn");
    const copyBtn = document.getElementById("gqlCopyBtn");

    const detectType = (value) => {
      if (Array.isArray(value)) {
        if (value.length === 0) return "[String]";
        return "[" + detectType(value[0]) + "]";
      }
      if (typeof value === "number")
        return Number.isInteger(value) ? "Int" : "Float";
      if (typeof value === "boolean") return "Boolean";
      if (typeof value === "string") return "String";
      if (value === null) return "String";
      return "String";
    };

    const convertToGraphQL = (obj) => {
      let lines = ["type Root {"];
      for (const key in obj) {
        const type = detectType(obj[key]);
        lines.push(`  ${key}: ${type}`);
      }
      lines.push("}");
      return lines.join("\n");
    };

    convertBtn.addEventListener("click", () => {
      try {
        const json = JSON.parse(input.value);
        const gql = convertToGraphQL(json);
        output.innerText = gql;
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

export default jsonToGraphQL;
