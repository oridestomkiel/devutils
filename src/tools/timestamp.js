const timestamp = {
  title: "Conversor de Timestamp ↔ Data",
  description:
    "Converta timestamps entre diferentes formatos ou sistemas. Ideal para desenvolvimento, registros de logs e manipulação de datas.",
  tags: [
    "timestamp",
    "converter timestamp",
    "unix time",
    "data para timestamp",
    "formato de data",
    "epoch time",
    "data legível",
  ],
  category: "Datas e Horários",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.4.0",
  render: () => `
    <input id="timestampInput" type="text" placeholder="Digite timestamp ou data..." class="w-full p-2 bg-gray-700 text-white rounded mb-2" />

    <select id="timestampFormat" class="w-full p-2 bg-gray-700 text-white rounded mb-2">
      <option value="br">Data legível (pt-BR)</option>
      <option value="iso">Formato ISO 8601</option>
      <option value="utc">Data UTC</option>
    </select>

    <button id="timestampBtn" class="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded mb-2 w-full">Converter</button>

    <div class="relative">
      <input id="timestampOutput" type="text" readonly class="w-full p-2 bg-gray-800 text-green-400 rounded pr-20" placeholder="Resultado aparecerá aqui..." />
      <button id="copyTimestampBtn" class="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">Copiar</button>
      <span id="copiedTimestampMsg" class="absolute top-2 right-2 text-green-400 px-2 py-1 hidden">Copiado!</span>
    </div>

    <small class="text-gray-400 block mt-2">Aceita timestamp Unix (segundos) ou datas como <code>2025-03-28 15:00</code>, <code>28/03/2025</code> etc.</small>
  `,
  init: () => {
    const input = document.getElementById("timestampInput");
    const format = document.getElementById("timestampFormat");
    const output = document.getElementById("timestampOutput");
    const copyBtn = document.getElementById("copyTimestampBtn");
    const copiedMsg = document.getElementById("copiedTimestampMsg");

    document.getElementById("timestampBtn").addEventListener("click", () => {
      const raw = input.value.trim();
      const selected = format.value;

      let date;

      if (/^\d+$/.test(raw)) {
        const ts = parseInt(raw, 10);
        date = new Date(ts * 1000);
      } else {
        date = new Date(raw);
      }

      if (isNaN(date.getTime())) {
        output.value = "Entrada inválida";
        return;
      }

      let result = "";
      switch (selected) {
        case "br":
          result = date.toLocaleString("pt-BR", {
            dateStyle: "full",
            timeStyle: "medium",
          });
          break;
        case "iso":
          result = date.toISOString();
          break;
        case "utc":
          result = date.toUTCString();
          break;
      }

      output.value = result;
    });

    copyBtn.addEventListener("click", () => {
      const value = output.value;
      if (!value || value === "Entrada inválida") return;

      navigator.clipboard.writeText(value).then(() => {
        copyBtn.classList.add("hidden");
        copiedMsg.classList.remove("hidden");
        setTimeout(() => {
          copiedMsg.classList.add("hidden");
          copyBtn.classList.remove("hidden");
        }, 2000);
      });
    });
  },
};

export default timestamp;
