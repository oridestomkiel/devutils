const currencyformat = {
  title: "Formatador de moeda BRL / USD / EUR",
  description:
    "Formate valores monetários nos padrões BRL, USD e EUR com separadores e símbolos corretos. Ideal para exibir preços em sistemas e e-commerces.",
  tags: [
    "formatador de moeda",
    "moeda brl",
    "moeda usd",
    "moeda eur",
    "formatar valores",
    "formatação monetária",
    "preço formatado",
    "moeda internacional",
  ],
  category: "Formatadores / Minificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <input
      id="cfInput"
      type="text"
      placeholder="Digite o valor"
      class="w-full p-2 bg-gray-700 rounded mb-2"
    />

    <select
      id="cfCurrency"
      class="w-full p-2 bg-gray-700 rounded mb-2"
    >
      <option value="BRL">Real (BRL)</option>
      <option value="USD">Dólar (USD)</option>
      <option value="EUR">Euro (EUR)</option>
    </select>

    <button
      id="cfFormatBtn"
      class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
    >
      Formatar
    </button>
    <div class="mt-2 flex gap-2">
      <input
        id="cfOutput"
        type="text"
        value=""
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full"
        placeholder="Resultado formatado"
      />
      <button
        id="cfCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded self-start"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const cfInput = document.getElementById("cfInput");
    const cfCurrency = document.getElementById("cfCurrency");
    const cfFormatBtn = document.getElementById("cfFormatBtn");
    const cfOutput = document.getElementById("cfOutput");
    const cfCopyBtn = document.getElementById("cfCopyBtn");

    cfFormatBtn.addEventListener("click", () => {
      const valor = parseFloat(cfInput.value.replace(",", "."));
      if (isNaN(valor)) {
        cfOutput.value = "❌ Valor inválido.";
        return;
      }

      const moeda = cfCurrency.value;
      const localeMap = {
        BRL: "pt-BR",
        USD: "en-US",
        EUR: "de-DE",
      };

      const formatado = valor.toLocaleString(localeMap[moeda], {
        style: "currency",
        currency: moeda,
      });

      cfOutput.value = `${formatado}`;
    });

    cfCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(cfOutput.value).then(() => {
        const originalText = cfCopyBtn.innerText;
        cfCopyBtn.innerText = "Copiado!";
        setTimeout(() => {
          cfCopyBtn.innerText = originalText;
        }, 1500);
      });
    });
  },
};

export default currencyformat;
