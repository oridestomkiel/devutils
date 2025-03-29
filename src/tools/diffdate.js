const diffdate = {
  title: "Calculadora de Diferença entre Datas",
  description:
    "Calcule a diferença entre duas datas em dias, meses ou anos. Ideal para prazos, controle de vencimentos e contagem de tempo.",
  tags: [
    "diferença entre datas",
    "calcular datas",
    "quantos dias entre datas",
    "dias entre datas",
    "calculadora de tempo",
    "tempo entre datas",
    "contar dias",
  ],
  category: "Datas e Horários",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <label class="block mb-1">Data Inicial:</label>
    <input
      id="startDate"
      type="datetime-local"
      class="w-full p-2 bg-gray-700 rounded mb-3 text-white"
    />
    <label class="block mb-1">Data Final:</label>
    <input
      id="endDate"
      type="datetime-local"
      class="w-full p-2 bg-gray-700 rounded mb-3 text-white"
    />
    <button
      id="diffBtn"
      class="bg-pink-600 hover:bg-pink-700 px-4 py-1 rounded w-full"
    >
      Calcular
    </button>
    <div class="mt-4 flex gap-2">
      <textarea
        id="diffResult"
        rows="4"
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full whitespace-pre-wrap text-sm"
        placeholder="Resultado aparecerá aqui"
      ></textarea>
      <button
        id="diffCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded self-start"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const startDateEl = document.getElementById("startDate");
    const endDateEl = document.getElementById("endDate");
    const diffBtn = document.getElementById("diffBtn");
    const diffResult = document.getElementById("diffResult");
    const diffCopyBtn = document.getElementById("diffCopyBtn");

    diffBtn.addEventListener("click", () => {
      const start = new Date(startDateEl.value);
      const end = new Date(endDateEl.value);

      if (isNaN(start) || isNaN(end)) {
        diffResult.value = "Preencha as duas datas corretamente.";
        return;
      }

      const diffMs = Math.abs(end - start);
      const mins = Math.floor(diffMs / (1000 * 60));
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      diffResult.value = `Diferença:
- ${days} dias
- ${hours} horas
- ${mins} minutos`;
    });

    diffCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(diffResult.value).then(() => {
        const originalText = diffCopyBtn.innerText;
        diffCopyBtn.innerText = "Copiado!";
        setTimeout(() => {
          diffCopyBtn.innerText = originalText;
        }, 1500);
      });
    });
  },
};

export default diffdate;
