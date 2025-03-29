const jsonvalidator = {
  title: "Validador de JSON",
  description:
    "Verifique se um JSON é válido e bem formatado. Ideal para detectar erros de sintaxe em APIs, arquivos de configuração e testes de integração.",
  tags: [
    "validador de json",
    "json válido",
    "verificar json",
    "json checker",
    "erro em json",
    "validar estrutura json",
    "sintaxe json",
  ],
  category: "Validadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <textarea id="jsonValidatorInput" class="w-full p-2 bg-gray-700 rounded mb-2" rows="6" placeholder='Digite ou cole um JSON'></textarea>
    <button id="jsonValidatorBtn" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded">Validar</button>
    <p id="jsonValidatorOutput" class="mt-2 text-green-400 break-words"></p>
  `,
  init: () => {
    document
      .getElementById("jsonValidatorBtn")
      .addEventListener("click", () => {
        const input = document.getElementById("jsonValidatorInput").value;
        try {
          JSON.parse(input);
          document.getElementById("jsonValidatorOutput").innerText =
            "✅ JSON válido.";
        } catch (e) {
          document.getElementById("jsonValidatorOutput").innerText =
            "❌ Inválido: " + e.message;
        }
      });
  },
};
export default jsonvalidator;
