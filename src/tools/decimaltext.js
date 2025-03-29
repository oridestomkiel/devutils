const decimaltext = {
  title: "Conversor Decimal ↔ Texto",
  description:
    "Converta números decimais para texto e texto para decimal com facilidade. Útil para codificação, testes e manipulação de dados.",
  tags: [
    "decimal para texto",
    "texto para decimal",
    "conversão decimal",
    "converter número em texto",
    "ascii decimal",
    "representação decimal",
    "conversor de números",
  ],
  category: "Codificadores / Decodificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <textarea
      id="decimalTextInput"
      class="w-full p-2 bg-gray-700 rounded mb-2"
      rows="4"
      placeholder="Digite texto ou decimais separados por espaço"
    ></textarea>

    <div class="flex gap-2">
      <button
        id="textToDecimalBtn"
        class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
      >
        Texto → Decimal
      </button>
      <button
        id="decimalToTextBtn"
        class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
      >
        Decimal → Texto
      </button>
    </div>
    <div class="mt-2 flex gap-2">
      <textarea
        id="decimalTextOutput"
        rows="3"
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full"
        placeholder="Resultado aparecerá aqui"
      ></textarea>
      <button
        id="decimalCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded self-start"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const inputEl = document.getElementById("decimalTextInput");
    const outputEl = document.getElementById("decimalTextOutput");
    const copyBtn = document.getElementById("decimalCopyBtn");

    const textToDecimalBtn = document.getElementById("textToDecimalBtn");
    const decimalToTextBtn = document.getElementById("decimalToTextBtn");

    textToDecimalBtn.addEventListener("click", () => {
      const input = inputEl.value;
      const decimals = [...input].map((c) => c.charCodeAt(0)).join(" ");
      outputEl.value = decimals;
    });

    decimalToTextBtn.addEventListener("click", () => {
      const input = inputEl.value.trim();
      try {
        const text = input
          .split(/\s+/)
          .map((n) => String.fromCharCode(parseInt(n, 10)))
          .join("");
        outputEl.value = text;
      } catch (e) {
        outputEl.value = "Erro: " + e.message;
      }
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(outputEl.value).then(() => {
        const original = copyBtn.innerText;
        copyBtn.innerText = "Copiado!";
        setTimeout(() => {
          copyBtn.innerText = original;
        }, 1500);
      });
    });
  },
};

export default decimaltext;
