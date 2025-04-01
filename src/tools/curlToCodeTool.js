const curlToCodeTool = {
  title: "cURL para Código",
  description:
    "Converta comandos cURL em snippets de código nas linguagens mais usadas: JavaScript, Python, PHP, Node.js, Go e outras.",
  tags: [
    "curl",
    "http",
    "api",
    "conversão",
    "ansible",
    "csharp",
    "dart",
    "elixir",
    "go",
    "java",
    "javascript",
    "kotlin",
    "lua",
    "node",
    "objc",
    "perl",
    "php",
    "python",
    "r",
    "ruby",
    "rust",
    "swift",
    "wget",
  ],
  category: "Conversores",
  author: "DevUtils",
  hasApi: true,
  license: "MIT",
  version: "1.0.1",

  render: () => `
    <div class="p-4 rounded bg-gray-800 text-white text-sm space-y-4">
      <label class="block mb-1">Comando cURL:</label>
      <textarea id="curlInput" class="w-full p-2 rounded bg-gray-700 text-white h-32 font-mono" placeholder="curl https://api.exemplo.com ..."></textarea>

      <div class="flex items-center justify-between gap-2">
        <label class="block">Linguagem:</label>
        <select id="langSelect" class="flex-1 bg-gray-700 p-2 rounded text-white">
          <option value="ansible">Ansible</option>
          <option value="csharp">C#</option>
          <option value="dart">Dart</option>
          <option value="elixir">Elixir</option>
          <option value="go">Go</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript (fetch)</option>
          <option value="kotlin">Kotlin</option>
          <option value="lua">Lua</option>
          <option value="node">Node.js</option>
          <option value="objc">Objective-C</option>
          <option value="perl">Perl</option>
          <option value="php">PHP</option>
          <option value="python">Python (requests)</option>
          <option value="r">R</option>
          <option value="ruby">Ruby</option>
          <option value="rust">Rust</option>
          <option value="swift">Swift</option>
          <option value="wget">Wget</option>
        </select>
      </div>

      <button id="btnConvertCurl" class="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded">Converter</button>

      <div>
        <label class="block mb-1">Código Gerado:</label>
        <textarea id="curlCodeOutput" readonly class="w-full p-2 rounded bg-gray-900 text-green-400 h-40 font-mono"></textarea>
        <button id="btnCopyCurlCode" class="mt-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded">Copiar</button>
      </div>
    </div>
  `,

  init: () => {
    const input = document.getElementById("curlInput");
    const output = document.getElementById("curlCodeOutput");
    const btn = document.getElementById("btnConvertCurl");
    const copy = document.getElementById("btnCopyCurlCode");
    const lang = document.getElementById("langSelect");

    btn.onclick = async () => {
      const command = input.value.trim();
      const selected = lang.value;

      if (!command.startsWith("curl ")) {
        output.value =
          "// Por favor, insira um comando válido que comece com curl";
        return;
      }

      try {
        const res = await fetch("https://services.devutils.tools/curl2code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ curl: command, lang: selected }),
        });

        const data = await res.json();
        output.value = data.code || "// Erro: resposta vazia.";
      } catch (err) {
        output.value = "// Falha ao converter: " + err.message;
      }
    };

    copy.onclick = () => {
      navigator.clipboard.writeText(output.value).then(() => {
        copy.textContent = "Copiado!";
        setTimeout(() => (copy.textContent = "Copiar"), 1500);
      });
    };
  },
};

export default curlToCodeTool;
