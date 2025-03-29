const jsonformatter = {
  title: "Formatador de JSON",
  description:
    "Formate seus dados JSON para torná-los mais legíveis e organizados. Ideal para desenvolvedores que trabalham com APIs e estruturas complexas.",
  tags: [
    "formatador de json",
    "json legível",
    "embelezar json",
    "prettifier json",
    "json indentado",
    "json organizado",
    "ferramenta json",
  ],
  category: "Formatadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.1",
  render: () => `
    <div class="flex flex-col gap-2">
      <textarea id="jsonInput" class="w-full p-2 bg-gray-700 text-white rounded" rows="6" placeholder='{"exemplo":true}'></textarea>
      <button id="formatJsonBtn" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white">
        Formatar JSON
      </button>
      <div class="relative">
        <pre id="jsonOutput" class="p-3 bg-gray-800 text-green-400 rounded overflow-x-auto whitespace-pre-wrap text-sm pr-16"></pre>
        <button id="copyJsonBtn" class="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs text-white">
          Copiar
        </button>
        <span id="copiedJsonMsg" class="absolute top-2 right-2 text-xs text-green-400 px-2 py-1 hidden">Copiado!</span>
      </div>
    </div>
  `,
  init: () => {
    const input = document.getElementById("jsonInput");
    const output = document.getElementById("jsonOutput");
    const formatBtn = document.getElementById("formatJsonBtn");
    const copyBtn = document.getElementById("copyJsonBtn");
    const copiedMsg = document.getElementById("copiedJsonMsg");

    formatBtn.addEventListener("click", () => {
      try {
        const parsed = JSON.parse(input.value);
        output.textContent = JSON.stringify(parsed, null, 2);
      } catch {
        output.textContent = "JSON inválido";
      }
    });

    copyBtn.addEventListener("click", () => {
      const text = output.textContent;
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        copyBtn.classList.add("hidden");
        copiedMsg.classList.remove("hidden");

        setTimeout(() => {
          copiedMsg.classList.add("hidden");
          copyBtn.classList.remove("hidden");
        }, 2000);
      });
    });
  },
};

export default jsonformatter;
