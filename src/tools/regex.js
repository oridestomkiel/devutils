const regex = {
  title: "Testador de Expressões Regulares",
  description:
    "Teste suas expressões regulares em tempo real. Ideal para analisar padrões, validar strings e corrigir erros de sintaxe de forma ágil.",
  tags: [
    "regex",
    "expressões regulares",
    "teste de regex",
    "regex tester",
    "validar regex",
    "analisar padrões",
    "ferramenta regex",
  ],
  category: "Ferramentas de Desenvolvimento",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",
  render: () => `
    <textarea id="regexInput" class="w-full p-2 bg-gray-700 rounded mb-2" rows="2" placeholder="Digite o regex..."></textarea>
    <textarea id="regexTest" class="w-full p-2 bg-gray-700 rounded mb-2" rows="3" placeholder="Texto para testar..."></textarea>
    <button id="regexTestBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded">Testar</button>
    <p id="regexOutput" class="mt-2 text-green-400 break-words"></p>
  `,
  init: () => {
    document.getElementById("regexTestBtn").addEventListener("click", () => {
      const pattern = document.getElementById("regexInput").value.trim();
      const text = document.getElementById("regexTest").value.trim();

      try {
        const re = new RegExp(pattern, "g");
        const matches = [...text.matchAll(re)].map((m) => m[0]);
        document.getElementById("regexOutput").innerText = matches.length
          ? `🔍 ${matches.length} ocorrências: ` + matches.join(", ")
          : "Nenhuma ocorrência encontrada.";
      } catch (e) {
        document.getElementById("regexOutput").innerText =
          "Erro no regex: " + e.message;
      }
    });
  },
};
export default regex;
