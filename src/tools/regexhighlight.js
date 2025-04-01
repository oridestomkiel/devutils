const regexhighlight = {
  title: "Testador de Regex com Destaque",
  description:
    "Teste suas expressões regulares em tempo real com destaque de sintaxe. Ideal para analisar padrões, validar strings e corrigir erros de forma ágil.",
  tags: [
    "regex",
    "expressões regulares",
    "teste de regex",
    "regex com destaque",
    "validar regex",
    "analisar padrões",
    "ferramenta de regex",
  ],
  category: "Utilitários",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.2.0",
  render: () => `
    <input id="regexPattern" class="w-full p-2 bg-gray-700 rounded mb-2 text-white" placeholder="Digite o padrão regex (ex: \\d+ ou /\\w+/gi)" />
    <textarea id="regexText" class="w-full p-2 bg-gray-700 rounded mb-2 text-white" rows="4" placeholder="Texto onde aplicar a regex"></textarea>
    <button id="regexTestBtn" class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded">Testar Regex</button>
    <div class="relative mt-4">
      <div id="regexResult" class="p-3 bg-gray-800 rounded text-white whitespace-pre-wrap break-words pr-16"></div>
      <button id="copyRegexResultBtn" class="absolute top-2 right-2 text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">Copiar</button>
      <span id="copiedRegexMsg" class="absolute top-2 right-2 text-xs text-green-400 px-2 py-1 hidden">Copiado!</span>
    </div>
    <small class="text-gray-400 block mt-2">Use sintaxe padrão JavaScript. Flags como <code>g</code> e <code>i</code> são opcionais no final: <code>/padrão/gi</code>.</small>
  `,
  init: () => {
    const input = document.getElementById("regexPattern");
    const textArea = document.getElementById("regexText");
    const result = document.getElementById("regexResult");
    const copyBtn = document.getElementById("copyRegexResultBtn");
    const copiedMsg = document.getElementById("copiedRegexMsg");

    document.getElementById("regexTestBtn").addEventListener("click", () => {
      const patternInput = input.value.trim();
      const text = textArea.value.trim();

      if (!patternInput || !text) {
        result.innerHTML = `<span class="text-gray-500">Preencha ambos os campos.</span>`;
        return;
      }

      let pattern = patternInput;
      let flags = "";

      const match = patternInput.match(/^\/(.+)\/([gimsuy]*)$/);
      if (match) {
        pattern = match[1];
        flags = match[2];
      }

      let regex;
      try {
        regex = new RegExp(pattern, flags || "g");
      } catch (e) {
        result.innerHTML = `<span class="text-red-400">Regex inválida: ${e.message}</span>`;
        return;
      }

      const highlighted = text.replace(
        regex,
        (m) => `<span class="bg-yellow-500 text-black px-1 rounded">${m}</span>`
      );

      result.innerHTML =
        highlighted ||
        `<span class="text-gray-500">Nenhuma correspondência encontrada.</span>`;
    });

    copyBtn.addEventListener("click", () => {
      const html = result.innerHTML;
      if (!html) return;

      navigator.clipboard.writeText(html).then(() => {
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

export default regexhighlight;
