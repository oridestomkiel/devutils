const datedelta = {
  title: "Manipulador de Datas (dias, meses, anos)",
  description:
    "Adicione ou subtraia dias, meses ou anos de uma data com facilidade. Ideal para cálculos de prazos, agendamentos e testes de sistemas.",
  tags: [
    "manipulador de datas",
    "calcular datas",
    "somar dias",
    "subtrair meses",
    "diferença entre datas",
    "datas em javascript",
    "data futura",
    "data passada",
  ],
  category: "Datas e Horários",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <input
      id="dateBase"
      type="date"
      class="w-full p-2 bg-gray-700 rounded mb-2"
    />

    <div class="grid grid-cols-2 gap-2 mb-2">
      <input
        id="dateDelta"
        type="number"
        class="p-2 bg-gray-700 rounded"
        placeholder="Valor"
      />
      <select id="dateUnit" class="p-2 bg-gray-700 rounded">
        <option value="days">Dias</option>
        <option value="months">Meses</option>
        <option value="years">Anos</option>
      </select>

      <select
        id="dateDirection"
        class="p-2 bg-gray-700 rounded col-span-2"
      >
        <option value="add">Adicionar</option>
        <option value="sub">Subtrair</option>
      </select>
    </div>

    <button
      id="dateDeltaBtn"
      class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full"
    >
      Calcular
    </button>
    <div class="mt-2 flex gap-2">
      <input
        id="dateDeltaOut"
        type="text"
        value=""
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full text-center"
        placeholder="Resultado aparecerá aqui"
      />
      <button
        id="dateDeltaCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded self-start"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const dateBaseEl = document.getElementById("dateBase");
    const dateDeltaEl = document.getElementById("dateDelta");
    const dateUnitEl = document.getElementById("dateUnit");
    const dateDirectionEl = document.getElementById("dateDirection");
    const dateDeltaBtn = document.getElementById("dateDeltaBtn");
    const dateDeltaOut = document.getElementById("dateDeltaOut");
    const dateDeltaCopyBtn = document.getElementById("dateDeltaCopyBtn");

    dateDeltaBtn.addEventListener("click", () => {
      const base = dateBaseEl.value;
      const valor = parseInt(dateDeltaEl.value, 10);
      const unidade = dateUnitEl.value;
      const direcao = dateDirectionEl.value;

      if (!base || isNaN(valor)) {
        dateDeltaOut.value = "❌ Preencha a data e o valor.";
        return;
      }

      const [yyyy, mm, dd] = base.split("-");
      const data = new Date(yyyy, mm - 1, dd);

      const delta = direcao === "add" ? valor : -valor;

      switch (unidade) {
        case "days":
          data.setDate(data.getDate() + delta);
          break;
        case "months":
          data.setMonth(data.getMonth() + delta);
          break;
        case "years":
          data.setFullYear(data.getFullYear() + delta);
          break;
      }

      const resultStr = data.toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      dateDeltaOut.value = `${resultStr}`;
    });

    dateDeltaCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(dateDeltaOut.value).then(() => {
        const originalText = dateDeltaCopyBtn.innerText;
        dateDeltaCopyBtn.innerText = "Copiado!";
        setTimeout(() => {
          dateDeltaCopyBtn.innerText = originalText;
        }, 1500);
      });
    });
  },
};

export default datedelta;
