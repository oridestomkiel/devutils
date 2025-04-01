const jsonschema = {
  title: "JSON → JSON Schema",
  description:
    "Gere schemas JSON automaticamente a partir de um objeto JSON válido. Útil para validação, documentação e contratos de API.",
  tags: ["json", "schema", "validação", "api", "contrato", "json-schema"],
  category: "Conversores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <textarea id="jsonInput" rows="8" class="w-full p-2 bg-gray-700 text-white rounded mb-3" placeholder='Cole seu JSON aqui...'></textarea>
  
      <div class="flex gap-2 mb-3">
        <button id="jsonToSchemaBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded">Converter</button>
        <button id="jsonClearBtn" class="bg-gray-600 hover:bg-gray-500 px-4 py-1 rounded">Limpar</button>
        <button id="jsonCopyBtn" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded">Copiar Resultado</button>
      </div>
  
      <pre id="jsonSchemaOutput" class="bg-gray-900 text-green-400 text-sm p-3 rounded whitespace-pre-wrap break-words"></pre>
    `,

  init: () => {
    const input = document.getElementById("jsonInput");
    const output = document.getElementById("jsonSchemaOutput");
    const convertBtn = document.getElementById("jsonToSchemaBtn");
    const clearBtn = document.getElementById("jsonClearBtn");
    const copyBtn = document.getElementById("jsonCopyBtn");

    const detectType = (value) => {
      const type = typeof value;
      if (Array.isArray(value)) return "array";
      if (type === "number")
        return Number.isInteger(value) ? "integer" : "number";
      if (value === null) return "null";
      return type;
    };

    const generateSchema = (json) => {
      const schema = {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "Generated schema for Root",
        type: "object",
        properties: {},
        required: [],
      };

      for (const key in json) {
        const value = json[key];
        const type = detectType(value);
        schema.properties[key] = { type };
        schema.required.push(key);
      }

      return schema;
    };

    convertBtn.addEventListener("click", () => {
      try {
        const json = JSON.parse(input.value);
        const schema = generateSchema(json);
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

export default jsonschema;
