const jsonToFlow = {
  title: "JSON → Flow Types",
  description:
    "Converta objetos JSON em tipagens estáticas no estilo Flow. Útil para validar estruturas em JavaScript com tipagem opcional.",
  tags: ["json", "flow", "tipagem", "javascript", "flowtype", "types"],
  category: "Conversores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <textarea id="flowInput" rows="8" class="w-full p-2 bg-gray-700 text-white rounded mb-3" placeholder='Cole seu JSON aqui...'></textarea>
  
      <div class="flex gap-2 mb-3">
        <button id="flowConvertBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded">Converter</button>
        <button id="flowClearBtn" class="bg-gray-600 hover:bg-gray-500 px-4 py-1 rounded">Limpar</button>
        <button id="flowCopyBtn" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded">Copiar Resultado</button>
      </div>
  
      <pre id="flowOutput" class="bg-gray-900 text-green-400 text-sm p-3 rounded whitespace-pre-wrap break-words"></pre>
    `,

  init: () => {
    const input = document.getElementById("flowInput");
    const output = document.getElementById("flowOutput");
    const convertBtn = document.getElementById("flowConvertBtn");
    const clearBtn = document.getElementById("flowClearBtn");
    const copyBtn = document.getElementById("flowCopyBtn");

    const detectFlowType = (value) => {
      if (typeof value === "number")
        return Number.isInteger(value) ? "number" : "number";
      if (typeof value === "boolean") return "boolean";
      if (typeof value === "string") return "string";
      if (Array.isArray(value)) return "Array<mixed>";
      if (typeof value === "object" && value !== null)
        return "{ [key: string]: mixed }";
      return "mixed";
    };

    const generateFlow = (json) => {
      const lines = ["type Root = {"];
      for (const key in json) {
        const type = detectFlowType(json[key]);
        lines.push(`  ${key}: ${type},`);
      }
      lines.push("};");
      return lines.join("\n");
    };

    convertBtn.addEventListener("click", () => {
      try {
        const json = JSON.parse(input.value);
        const flow = generateFlow(json);
        output.innerText = flow;
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

export default jsonToFlow;
