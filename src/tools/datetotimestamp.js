const datetotimestamp = {
  title: "Conversor de Data para Timestamp",
  description:
    "Converta uma data/hora para o formato de timestamp Unix de forma simples e rápida. Ideal para programação, bancos de dados e depuração.",
  tags: [
    "data para timestamp",
    "timestamp unix",
    "converter timestamp",
    "epoch time",
    "tempo unix",
    "conversão de datas",
  ],
  category: "Datas e Horários",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <label class="block text-sm text-gray-300 mb-1">Data para Timestamp (Unix)</label>
    <input
      id="dtInput"
      type="datetime-local"
      class="w-full p-2 bg-gray-700 rounded mb-2"
    />
    <button
      id="dtToTsBtn"
      class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full"
    >
      Converter
    </button>

    <div class="mt-2 flex gap-2">
      <input
        id="tsOutput"
        type="text"
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full text-sm"
        placeholder="Timestamp gerado aparecerá aqui"
      />
      <button
        id="tsCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded self-start"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const dtInput = document.getElementById("dtInput");
    const dtToTsBtn = document.getElementById("dtToTsBtn");
    const tsOutput = document.getElementById("tsOutput");
    const tsCopyBtn = document.getElementById("tsCopyBtn");

    dtToTsBtn.addEventListener("click", () => {
      const dtValue = dtInput.value;
      if (!dtValue) {
        tsOutput.value = "❌ Data inválida.";
        return;
      }

      const ts = Math.floor(new Date(dtValue).getTime() / 1000);
      tsOutput.value = `${ts}`;
    });

    tsCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(tsOutput.value).then(() => {
        const originalText = tsCopyBtn.innerText;
        tsCopyBtn.innerText = "Copiado!";
        setTimeout(() => {
          tsCopyBtn.innerText = originalText;
        }, 1500);
      });
    });
  },
};

export default datetotimestamp;
