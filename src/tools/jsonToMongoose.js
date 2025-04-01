const jsonToMongoose = {
  title: "JSON → Mongoose Schema",
  description:
    "Gere schemas Mongoose automaticamente a partir de um JSON. Útil para modelar documentos MongoDB de forma rápida.",
  tags: ["json", "mongoose", "schema", "mongo", "modelagem"],
  category: "Conversores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <textarea id="mongooseInput" rows="8" class="w-full p-2 bg-gray-700 text-white rounded mb-3" placeholder='Cole seu JSON aqui...'></textarea>
  
      <div class="flex gap-2 mb-3">
        <button id="mongooseConvertBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded">Converter</button>
        <button id="mongooseClearBtn" class="bg-gray-600 hover:bg-gray-500 px-4 py-1 rounded">Limpar</button>
        <button id="mongooseCopyBtn" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded">Copiar</button>
      </div>
  
      <pre id="mongooseOutput" class="bg-gray-900 text-green-400 text-sm p-3 rounded whitespace-pre-wrap break-words"></pre>
    `,

  init: () => {
    const input = document.getElementById("mongooseInput");
    const output = document.getElementById("mongooseOutput");
    const convertBtn = document.getElementById("mongooseConvertBtn");
    const clearBtn = document.getElementById("mongooseClearBtn");
    const copyBtn = document.getElementById("mongooseCopyBtn");

    const detectType = (value) => {
      if (Array.isArray(value)) {
        if (value.length === 0) return "[]";
        return `[${detectType(value[0])}]`;
      }
      if (typeof value === "number")
        return Number.isInteger(value) ? "Number" : "Number";
      if (typeof value === "boolean") return "Boolean";
      if (typeof value === "string") return "String";
      if (value === null) return "String";
      return "Mixed";
    };

    const convertToMongoose = (obj) => {
      let lines = [
        "const mongoose = require('mongoose');",
        "",
        "const Schema = new mongoose.Schema({",
      ];
      for (const key in obj) {
        const type = detectType(obj[key]);
        lines.push(`  ${key}: { type: ${type} },`);
      }
      lines.push(
        "});",
        "",
        "module.exports = mongoose.model('ModelName', Schema);"
      );
      return lines.join("\n");
    };

    convertBtn.addEventListener("click", () => {
      try {
        const json = JSON.parse(input.value);
        const schema = convertToMongoose(json);
        output.innerText = schema;
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

export default jsonToMongoose;
