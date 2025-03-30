const fakepessoas = {
  title: "Gerador de Dados de Pessoas Fictícias",
  description:
    "Crie perfis de pessoas com dados aleatórios para testes e simulações. Selecione os campos desejados e exporte facilmente em formato JSON.",
  tags: [
    "dados fictícios",
    "json de pessoas",
    "mock de usuário",
    "gerador de dados",
    "simulação de perfis",
    "teste de API",
  ],
  category: "Geradores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.2.0",

  render: () => `
        <div class="mb-2">
          <label class="text-sm text-gray-300 mb-1 block">Quantidade de registros</label>
          <input id="fakeCount" type="number" min="1" max="100" value="5" class="w-full p-2 rounded bg-gray-700 text-white" />
        </div>
  
        <div id="fakeFields" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-sm text-white mb-4"></div>
  
        <div class="flex gap-2 mb-4">
          <button id="generateFakeJsonBtn" class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded">
            Gerar JSON
          </button>
          <button id="downloadFakeJsonBtn" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded hidden">
            Baixar
          </button>
          <button id="copyFakeJsonBtn" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded hidden">
            Copiar
          </button>
        </div>
  
        <textarea id="fakeJsonOutput" class="w-full p-2 bg-gray-700 text-green-400 rounded" rows="10" readonly></textarea>
      `,

  init: async () => {
    const fakeFields = document.getElementById("fakeFields");
    const fakeCount = document.getElementById("fakeCount");
    const output = document.getElementById("fakeJsonOutput");
    const downloadBtn = document.getElementById("downloadFakeJsonBtn");
    const copyBtn = document.getElementById("copyFakeJsonBtn");

    let dictionary = {};

    try {
      const res = await fetch("/data/fakepessoa.json");
      dictionary = await res.json();
    } catch (err) {
      output.value = "Erro ao carregar os dados base.";
      return;
    }

    const allFields = Object.keys(dictionary);

    allFields.forEach((key) => {
      const checkbox = document.createElement("label");
      checkbox.className = "flex items-center gap-2";
      checkbox.innerHTML = `
          <input type="checkbox" value="${key}" checked class="form-checkbox text-green-500 bg-gray-700" />
          <span>${key.replace(/_/g, " ")}</span>
        `;
      fakeFields.appendChild(checkbox);
    });

    document
      .getElementById("generateFakeJsonBtn")
      .addEventListener("click", () => {
        const selectedFields = Array.from(
          fakeFields.querySelectorAll("input:checked")
        ).map((el) => el.value);
        const count = parseInt(fakeCount.value, 10);
        const result = [];

        for (let i = 0; i < count; i++) {
          const item = {};
          selectedFields.forEach((field) => {
            const options = dictionary[field];
            item[field] = options[Math.floor(Math.random() * options.length)];
          });
          result.push(item);
        }

        output.value = JSON.stringify(result, null, 2);
        downloadBtn.classList.remove("hidden");
        copyBtn.classList.remove("hidden");
      });

    downloadBtn.addEventListener("click", () => {
      const blob = new Blob([output.value], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dados-ficticios.json";
      a.click();
      URL.revokeObjectURL(url);
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(output.value).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copiado!";
        setTimeout(() => (copyBtn.textContent = originalText), 1500);
      });
    });
  },
};

export default fakepessoas;
