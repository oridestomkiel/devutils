const binarydecimal = {
  title: "Conversor Binário ↔ Decimal",
  description:
    "Converta números binários em decimais e vice-versa de forma prática. Ideal para desenvolvedores, estudantes e entusiastas de sistemas digitais.",
  tags: [
    "binário",
    "decimal",
    "conversor binário",
    "converter binário para decimal",
    "decimal para binário",
    "calculadora binária",
    "binário online",
  ],
  category: "Conversores Numéricos",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <textarea
      id="binDecInput"
      class="w-full p-2 bg-gray-700 rounded mb-2"
      rows="3"
      placeholder="Digite um ou mais valores (binário ou decimal) separados por espaço"
    ></textarea>

    <div class="flex gap-2">
      <button
        id="binToDecBtn"
        class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
      >
        Binário → Decimal
      </button>
      <button
        id="decToBinBtn"
        class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
      >
        Decimal → Binário
      </button>
    </div>

    <div class="mt-2 flex gap-2">
      <input
        id="binDecOutput"
        type="text"
        value=""
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full"
      />
      <button
        id="binDecCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const inputEl = document.getElementById("binDecInput");
    const outputEl = document.getElementById("binDecOutput");
    const binToDecBtn = document.getElementById("binToDecBtn");
    const decToBinBtn = document.getElementById("decToBinBtn");
    const copyBtn = document.getElementById("binDecCopyBtn");

    binToDecBtn.addEventListener("click", () => {
      try {
        const input = inputEl.value.trim();
        const output = input
          .split(/\s+/)
          .map((bin) => parseInt(bin, 2))
          .join(" ");
        outputEl.value = output;
      } catch (e) {
        outputEl.value = "Erro: " + e.message;
      }
    });

    decToBinBtn.addEventListener("click", () => {
      try {
        const input = inputEl.value.trim();
        const output = input
          .split(/\s+/)
          .map((dec) => parseInt(dec, 10).toString(2))
          .join(" ");
        outputEl.value = output;
      } catch (e) {
        outputEl.value = "Erro: " + e.message;
      }
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(outputEl.value).then(() => {
        const originalText = copyBtn.innerText;
        copyBtn.innerText = "Copiado!";
        setTimeout(() => {
          copyBtn.innerText = originalText;
        }, 1500);
      });
    });
  },
};

export default binarydecimal;
