const htmlEntityTool = {
  title: "HTML Entity Encode/Decode",
  description:
    "Converta trechos de HTML para entidades ou decodifique para texto normal. Útil para segurança e visualização de código.",
  tags: ["html", "entity", "encode", "decode", "xss", "conversão"],
  category: "Ferramentas de Texto",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <div class="p-4 rounded bg-gray-800 text-white text-sm space-y-4">
        <div class="flex items-center gap-4">
          <label><input type="radio" name="htmlMode" value="encode" checked> Encode</label>
          <label><input type="radio" name="htmlMode" value="decode"> Decode</label>
        </div>
  
        <div>
          <label class="block mb-1">Input:</label>
          <textarea id="htmlInput" class="w-full p-2 rounded bg-gray-700 text-white h-32 font-mono"></textarea>
        </div>
  
        <button id="htmlEntityBtn" class="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded">Converter</button>
  
        <div>
          <label class="block mb-1">Output:</label>
          <textarea id="htmlOutput" readonly class="w-full p-2 rounded bg-gray-900 text-green-400 h-32 font-mono"></textarea>
          <button id="copyHtmlEntity" class="mt-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded">Copiar</button>
        </div>
      </div>
    `,

  init: () => {
    const input = document.getElementById("htmlInput");
    const output = document.getElementById("htmlOutput");
    const button = document.getElementById("htmlEntityBtn");
    const copyBtn = document.getElementById("copyHtmlEntity");

    function encode(str) {
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }

    function decode(str) {
      const div = document.createElement("div");
      div.innerHTML = str;
      return div.textContent;
    }

    button.onclick = () => {
      const mode = document.querySelector(
        'input[name="htmlMode"]:checked'
      ).value;
      output.value =
        mode === "encode" ? encode(input.value) : decode(input.value);
    };

    copyBtn.onclick = () => {
      navigator.clipboard.writeText(output.value);
      copyBtn.textContent = "Copiado!";
      setTimeout(() => (copyBtn.textContent = "Copiar"), 1500);
    };
  },
};

export default htmlEntityTool;
