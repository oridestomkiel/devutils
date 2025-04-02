const textnormalize = {
  title: "Normalizador de texto",
  description:
    "Remova acentos, caracteres especiais e padronize maiúsculas ou minúsculas de forma rápida. Ideal para uniformizar dados em sistemas e processamento de textos.",
  tags: [
    "normalizador de texto",
    "remover acentos",
    "texto sem acento",
    "padronização de texto",
    "caracteres especiais",
    "converter maiúsculas",
    "converter minúsculas",
  ],
  category: "Ferramentas de Texto",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.2.0",
  render: () => `
    <textarea id="normInput" class="w-full p-2 bg-gray-700 rounded mb-2 text-white" rows="4" placeholder="Digite ou cole seu texto com acentos, símbolos etc..."></textarea>
    <button id="normBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full mb-2">Normalizar</button>
    <div class="relative">
      <textarea id="normOutput" class="w-full p-2 bg-gray-700 text-green-400 rounded pr-20" rows="4" readonly placeholder="Texto normalizado aparecerá aqui..."></textarea>
      <button id="copyNormBtn" class="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">Copiar</button>
      <span id="copiedNormMsg" class="absolute top-2 right-2 text-green-400 px-2 py-1 hidden">Copiado!</span>
    </div>
  `,
  init: () => {
    const input = document.getElementById("normInput");
    const output = document.getElementById("normOutput");
    const copyBtn = document.getElementById("copyNormBtn");
    const copiedMsg = document.getElementById("copiedNormMsg");

    document.getElementById("normBtn").addEventListener("click", () => {
      const raw = input.value.trim();
      if (!raw) return (output.value = "");

      const normalized = raw
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/gi, "")
        .toLowerCase();

      output.value = normalized;
    });

    copyBtn.addEventListener("click", () => {
      const text = output.value;
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

export default textnormalize;
