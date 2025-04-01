const jsonbeautifier = {
  title: "Formatador de JSON (Prettifier)",
  description:
    "Deixe seus arquivos JSON legíveis e organizados com indentação automática. Ideal para leitura, depuração e desenvolvimento.",
  tags: [
    "formatador de json",
    "json prettifier",
    "embelezar json",
    "json formatado",
    "indentação json",
    "prettify json",
    "json beautifier",
  ],
  category: "Formatadores / Minificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.1",
  render: () => `
    <textarea id="jsonPrettyInput" class="w-full p-2 bg-gray-700 rounded mb-2" rows="6" placeholder='Digite ou cole um JSON'></textarea>
    <button id="jsonPrettyBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded mb-2">Formatar</button>
    <div class="relative">
      <pre id="jsonPrettyOutput" class="mt-2 text-green-400 whitespace-pre-wrap break-words pr-12"> </pre>
      <button id="copyJsonPretty" class="absolute top-0 right-0 text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">Copiar</button>
      <span id="copiedJsonPretty" class="absolute top-0 right-0 text-xs text-green-400 px-2 py-1 hidden">Copiado!</span>
    </div>
  `,
  init: () => {
    const outputEl = document.getElementById("jsonPrettyOutput");
    const copyBtn = document.getElementById("copyJsonPretty");
    const copiedMsg = document.getElementById("copiedJsonPretty");

    document.getElementById("jsonPrettyBtn").addEventListener("click", () => {
      try {
        const input = document.getElementById("jsonPrettyInput").value;
        const parsed = JSON.parse(input);
        outputEl.innerText = JSON.stringify(parsed, null, 2);
      } catch (e) {
        outputEl.innerText = "Erro: " + e.message;
      }
    });

    copyBtn.addEventListener("click", () => {
      const text = outputEl.innerText;
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        copiedMsg.classList.remove("hidden");
        copyBtn.classList.add("hidden");

        setTimeout(() => {
          copiedMsg.classList.add("hidden");
          copyBtn.classList.remove("hidden");
        }, 2000);
      });
    });
  },
};

export default jsonbeautifier;
