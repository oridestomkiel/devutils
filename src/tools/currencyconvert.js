const currencyconvert = {
  title: "Conversor BRL ↔ USD (tempo real)",
  description:
    "Converta valores entre Real (BRL) e Dólar (USD) com cotação em tempo real. Ideal para e-commerce, viagens e operações financeiras.",
  tags: [
    "conversor de moeda",
    "brl para usd",
    "usd para brl",
    "cotação do dólar",
    "câmbio em tempo real",
    "conversão de real",
    "converter dólar",
    "moeda brasileira",
  ],
  category: "Conversores Financeiros",
  author: "DevUtils",
  hasApi: true,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <div class="grid grid-cols-2 gap-2 mb-2">
      <select
        id="currencyDirection"
        class="p-2 bg-gray-700 rounded"
      >
        <option value="BRL-USD">BRL → USD</option>
        <option value="USD-BRL">USD → BRL</option>
      </select>
      <input
        id="currencyInput"
        type="number"
        min="0"
        step="0.01"
        class="p-2 bg-gray-700 rounded"
        placeholder="Valor"
      />
    </div>

    <button
      id="currencyConvertBtn"
      class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
    >
      Converter
    </button>
    <div class="mt-2 flex gap-2">
      <input
        id="currencyOutput"
        type="text"
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full"
        placeholder="Resultado aparecerá aqui"
      />
      <button
        id="currencyCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded self-start"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const convertBtn = document.getElementById("currencyConvertBtn");
    const currencyInput = document.getElementById("currencyInput");
    const currencyDirection = document.getElementById("currencyDirection");
    const currencyOutput = document.getElementById("currencyOutput");
    const currencyCopyBtn = document.getElementById("currencyCopyBtn");

    convertBtn.addEventListener("click", async () => {
      const valor = parseFloat(currencyInput.value);
      const [from, to] = currencyDirection.value.split("-");

      if (isNaN(valor) || valor <= 0) {
        currencyOutput.value = "❌ Valor inválido.";
        return;
      }

      try {
        const res = await fetch(
          `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${valor}`
        );
        const data = await res.json();

        if (!data.result && data.result !== 0) throw new Error();

        const format = to === "BRL" ? "pt-BR" : "en-US";
        currencyOutput.value = `💱 ${data.result.toLocaleString(format, {
          style: "currency",
          currency: to,
        })}`;
      } catch {
        currencyOutput.value = "❌ Erro ao obter cotação. Tente novamente.";
      }
    });

    currencyCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(currencyOutput.value).then(() => {
        const originalText = currencyCopyBtn.innerText;
        currencyCopyBtn.innerText = "Copiado!";
        setTimeout(() => {
          currencyCopyBtn.innerText = originalText;
        }, 1500);
      });
    });
  },
};

export default currencyconvert;
