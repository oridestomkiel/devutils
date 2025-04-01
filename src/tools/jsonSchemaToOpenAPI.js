const jsonschemaToOpenapi = {
  title: "JSON Schema → OpenAPI",
  description:
    "Converta um schema JSON válido para o formato OpenAPI 3.0. Ajusta campos como 'nullable', remove '$schema' e formata corretamente para uso em APIs.",
  tags: ["json schema", "openapi", "converter", "api design", "spec"],
  category: "Conversores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <textarea id="schemaInput" class="w-full p-2 bg-gray-700 text-white rounded mb-2" rows="8"
        placeholder="Cole aqui seu JSON Schema..."></textarea>
  
      <div class="flex gap-2 mb-3">
        <button id="schemaConvert" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">Converter</button>
        <button id="schemaClear" class="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded">Limpar</button>
        <button id="schemaCopy" class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded">Copiar</button>
      </div>
  
      <pre id="schemaOutput" class="text-green-400 bg-gray-900 whitespace-pre-wrap break-words p-3 rounded text-sm hidden"></pre>
    `,

  init: () => {
    const input = document.getElementById("schemaInput");
    const output = document.getElementById("schemaOutput");
    const convertBtn = document.getElementById("schemaConvert");
    const clearBtn = document.getElementById("schemaClear");
    const copyBtn = document.getElementById("schemaCopy");

    const convertToOpenAPI = (jsonSchema) => {
      const schema = { ...jsonSchema };

      // Remove $schema e type: null
      delete schema.$schema;

      const process = (obj) => {
        if (obj?.type?.includes?.("null")) {
          obj.nullable = true;
          obj.type = obj.type.filter((t) => t !== "null")[0] || "string";
        }

        if (obj.properties) {
          for (const key in obj.properties) {
            process(obj.properties[key]);
          }
        }

        if (obj.items) {
          if (Array.isArray(obj.items)) {
            obj.items.forEach(process);
          } else {
            process(obj.items);
          }
        }

        return obj;
      };

      const converted = process(schema);
      const safeName = (schema.title || "ConvertedSchema").replace(/\s+/g, "");

      const openapi = {
        openapi: "3.0.0",
        info: {
          title: schema.title || "Converted Schema",
          version: "1.0.0",
        },
        paths: {}, // ← obrigatório no OpenAPI
        components: {
          schemas: {
            [safeName]: converted,
          },
        },
      };

      return openapi;
    };

    convertBtn.addEventListener("click", () => {
      try {
        const parsed = JSON.parse(input.value);
        const converted = convertToOpenAPI(parsed);
        output.textContent = JSON.stringify(converted, null, 2);
        output.classList.remove("hidden");
      } catch (e) {
        output.textContent = "Erro: JSON inválido.";
        output.classList.remove("hidden");
      }
    });

    clearBtn.addEventListener("click", () => {
      input.value = "";
      output.textContent = "";
      output.classList.add("hidden");
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(output.textContent).then(() => {
        copyBtn.innerText = "Copiado!";
        setTimeout(() => (copyBtn.innerText = "Copiar"), 1500);
      });
    });
  },
};

export default jsonschemaToOpenapi;
