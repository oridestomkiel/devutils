const jsonToTypescript = {
  title: "JSON → TypeScript",
  description:
    "Converta um JSON para interfaces TypeScript automaticamente, com tipagem forte e estrutura baseada nos dados fornecidos.",
  tags: ["json", "typescript", "converter", "interface", "types"],
  category: "Conversores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <textarea id="tsInput" rows="8" class="w-full p-2 bg-gray-700 text-white rounded mb-3" placeholder='Cole seu JSON aqui...'></textarea>
  
      <div class="flex gap-2 mb-3">
        <button id="tsConvertBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded">Converter</button>
        <button id="tsClearBtn" class="bg-gray-600 hover:bg-gray-500 px-4 py-1 rounded">Limpar</button>
        <button id="tsCopyBtn" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded">Copiar</button>
      </div>
  
      <pre id="tsOutput" class="bg-gray-900 text-green-400 text-sm p-3 rounded whitespace-pre-wrap break-words"></pre>
    `,

  init: () => {
    const input = document.getElementById("tsInput");
    const output = document.getElementById("tsOutput");
    const convertBtn = document.getElementById("tsConvertBtn");
    const clearBtn = document.getElementById("tsClearBtn");
    const copyBtn = document.getElementById("tsCopyBtn");

    const detectType = (value) => {
      if (Array.isArray(value)) {
        if (value.length === 0) return "any[]";
        return detectType(value[0]) + "[]";
      }
      if (value === null) return "null";
      if (typeof value === "object") return "any";
      return typeof value;
    };

    const convertToTS = (obj) => {
      let lines = ["export interface Root {"];
      for (const key in obj) {
        const val = obj[key];
        const type = detectType(val);
        lines.push(`  ${key}: ${type};`);
      }
      lines.push("}");
      return lines.join("\n");
    };

    convertBtn.addEventListener("click", () => {
      try {
        const json = JSON.parse(input.value);
        const ts = convertToTS(json);
        output.innerText = ts;
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

export default jsonToTypescript;
