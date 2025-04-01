const forkprocessor = {
  title: "Fork de Texto por Delimitador",
  description:
    "Divide o texto com base em um delimitador e aplica uma operação a cada parte separadamente. Ideal para processar lotes de dados.",
  tags: ["fork", "batch", "texto", "processamento", "linhas"],
  category: "Utilitários",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.2.0",

  render: () => `
        <div class="mb-4">
          <textarea id="forkInput" class="w-full p-2 bg-gray-700 text-white rounded text-sm font-mono" rows="6" placeholder="Insira os dados separados por linha ou delimitador..."></textarea>
        </div>
  
        <div class="mb-2">
          <label class="text-xs text-gray-400">Delimitador</label>
          <input id="forkDelimiter" type="text" class="w-full p-2 bg-gray-700 text-white rounded text-sm" value="\\n" />
        </div>
  
        <div class="mb-4">
          <label class="text-xs text-gray-400">Operação</label>
          <select id="forkOperation" class="w-full p-2 bg-gray-700 text-white rounded text-sm">
            <option value="fromBase64">Base64 → Texto</option>
            <option value="toBase64">Texto → Base64</option>
            <option value="fromHex">Hex → Texto</option>
            <option value="toHex">Texto → Hex</option>
            <option value="toUrl">URL Encode</option>
            <option value="fromUrl">URL Decode</option>
            <option value="toUpper">Texto → Uppercase</option>
            <option value="toLower">Texto → Lowercase</option>
            <option value="reverse">Reverter texto</option>
            <option value="removeSpaces">Remover espaços</option>
            <option value="removeBreaks">Remover quebras de linha</option>
            <option value="toBinary">Texto → Binário</option>
            <option value="fromBinary">Binário → Texto</option>
          </select>
        </div>
  
        <div class="flex gap-2 mb-4">
          <button id="forkProcessBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm">Processar</button>
          <button id="forkClearBtn" class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm">Limpar</button>
        </div>
  
        <pre id="forkOutput" class="bg-gray-900 text-green-400 p-4 rounded text-sm whitespace-pre-wrap break-words hidden"></pre>
      `,

  init: () => {
    const inputEl = document.getElementById("forkInput");
    const delimiterEl = document.getElementById("forkDelimiter");
    const operationEl = document.getElementById("forkOperation");
    const outputEl = document.getElementById("forkOutput");
    const btn = document.getElementById("forkProcessBtn");
    const clearBtn = document.getElementById("forkClearBtn");

    const parseDelimiter = (str) => {
      if (str === "\\n") return "\n";
      if (str === "\\t") return "\t";
      if (str === "\\r") return "\r";
      return str;
    };

    const operations = {
      fromBase64: (text) => {
        try {
          return atob(text);
        } catch {
          return "[Erro ao decodificar Base64]";
        }
      },
      toBase64: (text) => btoa(text),
      fromHex: (text) => {
        try {
          return decodeURIComponent(
            text.replace(/\s+/g, "").replace(/(..)/g, "%$1")
          );
        } catch {
          return "[Erro ao decodificar Hex]";
        }
      },
      toHex: (text) =>
        Array.from(text)
          .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join(" "),
      toUrl: (text) => encodeURIComponent(text),
      fromUrl: (text) => {
        try {
          return decodeURIComponent(text);
        } catch {
          return "[Erro ao decodificar URL]";
        }
      },
      toUpper: (text) => text.toUpperCase(),
      toLower: (text) => text.toLowerCase(),
      reverse: (text) => text.split("").reverse().join(""),
      removeSpaces: (text) => text.replace(/\s+/g, ""),
      removeBreaks: (text) => text.replace(/[\n\r]/g, ""),
      toBinary: (text) =>
        text
          .split("")
          .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
          .join(" "),
      fromBinary: (text) =>
        text
          .split(/\s+/)
          .map((b) => String.fromCharCode(parseInt(b, 2)))
          .join(""),
    };

    btn.addEventListener("click", () => {
      const raw = inputEl.value.trim();
      const delim = parseDelimiter(delimiterEl.value.trim());
      const op = operationEl.value;
      if (!raw || !operations[op]) return;

      const parts = raw.split(delim);
      const result = parts.map(operations[op]).join("\n");

      outputEl.textContent = result;
      outputEl.classList.remove("hidden");
    });

    clearBtn.addEventListener("click", () => {
      inputEl.value = "";
      outputEl.textContent = "";
      outputEl.classList.add("hidden");
    });
  },
};

export default forkprocessor;
