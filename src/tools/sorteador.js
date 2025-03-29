const sorteador = {
  title: "Sorteador de números aleatórios",
  description:
    "Sorteador de números online e gratuito. Selecione o intervalo e clique em sortear número. Pode usar também para fazer sorteios no Facebook, Instagram e outras redes sociais.",
  tags: ["sorteio", "aleatório", "random", "número", "facebook", "instagram"],
  category: "Utilitários",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <div class="p-4 rounded bg-gray-800 text-white text-sm space-y-4">
        <p>Informe o intervalo de números e clique em sortear:</p>
  
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm mb-1">Mínimo</label>
            <input
              id="numMin"
              type="number"
              value="0"
              class="p-2 bg-gray-700 text-green-400 rounded w-full"
            />
          </div>
          <div>
            <label class="block text-sm mb-1">Máximo</label>
            <input
              id="numMax"
              type="number"
              value="10"
              class="p-2 bg-gray-700 text-green-400 rounded w-full"
            />
          </div>
        </div>
  
        <button
          id="btnSortear"
          class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm"
        >
          Sortear número
        </button>
  
        <div>
          <label class="block text-sm mb-1 mt-4">Número gerado:</label>
          <div class="flex gap-2">
            <input
              id="resultado"
              type="text"
              readonly
              value=""
              class="p-2 bg-gray-700 text-green-400 rounded w-full"
            />
            <button
              id="copyResultBtn"
              class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
            >
              Copiar
            </button>
          </div>
        </div>
      </div>
    `,

  init: () => {
    const resultadoEl = document.getElementById("resultado");
    const copiarBtn = document.getElementById("copyResultBtn");

    document.getElementById("btnSortear").addEventListener("click", () => {
      const min = parseInt(document.getElementById("numMin").value, 10);
      const max = parseInt(document.getElementById("numMax").value, 10);

      if (isNaN(min) || isNaN(max) || min > max) {
        resultadoEl.value = "⚠️ Intervalo inválido";
        resultadoEl.classList.replace("text-green-400", "text-yellow-400");
        return;
      }

      const sorteado = Math.floor(Math.random() * (max - min + 1)) + min;
      resultadoEl.value = sorteado;
      resultadoEl.classList.replace("text-yellow-400", "text-green-400");
    });

    copiarBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(resultadoEl.value).then(() => {
        copiarBtn.textContent = "Copiado!";
        setTimeout(() => (copiarBtn.textContent = "Copiar"), 1500);
      });
    });
  },
};

export default sorteador;
