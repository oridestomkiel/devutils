const horarioMundial = {
  title: "Horário Mundial",
  description:
    "Consulte o horário atual em diversas cidades do mundo ou informe um fuso horário para obter o horário local exato.",
  tags: [
    "horário mundial",
    "fuso horário",
    "hora atual",
    "timezones",
    "relogio mundial",
    "horário de países",
    "data e hora global",
  ],
  category: "Informações",
  author: "DevUtils",
  hasApi: true,
  license: "MIT",
  version: "1.1.1",
  render: () => `
    <div class="p-4 rounded bg-gray-800 text-white text-sm space-y-4">
      <div>
        <p class="mb-1 font-semibold">Escolha um fuso horário:</p>
        <select id="timezoneSelect" class="p-2 bg-gray-700 rounded w-full text-white">
          <option value="">Selecione um fuso horário...</option>
        </select>
        <div class="mt-2 flex gap-2">
          <input
            id="timezoneOutput"
            type="text"
            readonly
            value=""
            class="p-2 bg-gray-700 text-green-400 rounded w-full"
            placeholder="Horário aparecerá aqui"
          />
          <button
            id="copyTimeBtn"
            class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
          >
            Copiar
          </button>
        </div>
      </div>

      <div>
        <p class="font-semibold mb-1">Horários Populares:</p>
        <div id="popularTimes" class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm"></div>
      </div>
    </div>
  `,
  init: async () => {
    const output = document.getElementById("timezoneOutput");
    const copyBtn = document.getElementById("copyTimeBtn");
    const listContainer = document.getElementById("popularTimes");
    const select = document.getElementById("timezoneSelect");

    const zonas = [
      { zone: "America/Sao_Paulo", label: "🇧🇷 São Paulo" },
      { zone: "America/New_York", label: "🇺🇸 Nova York" },
      { zone: "Europe/London", label: "🇬🇧 Londres" },
      { zone: "Europe/Berlin", label: "🇩🇪 Berlim" },
      { zone: "Asia/Tokyo", label: "🇯🇵 Tóquio" },
      { zone: "Australia/Sydney", label: "🇦🇺 Sydney" },
    ];

    const todasZonas = Intl.supportedValuesOf("timeZone");

    todasZonas.forEach((zone) => {
      const opt = document.createElement("option");
      opt.value = zone;
      opt.textContent = zone;
      select.appendChild(opt);
    });

    const fetchHora = async (zone) => {
      try {
        const res = await fetch(
          `https://devutils.zmohouse.com.br/api/timezone.json?zone=${zone}`
        );
        const json = await res.json();

        const [datePart, timePart] = json.time.split(" ");
        const utcDate = new Date(`${datePart}T${timePart}Z`);

        const ptbr = utcDate.toLocaleString("pt-BR", {
          timeZone: json.zone,
          hour12: false,
        });

        return {
          original: json.time,
          ptbr,
          offset: json.offset,
        };
      } catch {
        return {
          original: "-",
          ptbr: "Erro ao buscar horário",
          offset: "-",
        };
      }
    };

    select.addEventListener("change", async () => {
      const zone = select.value;
      if (!zone) {
        output.value = "";
        return;
      }
      const { ptbr } = await fetchHora(zone);
      output.value = ptbr;
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(output.value).then(() => {
        copyBtn.textContent = "Copiado!";
        setTimeout(() => (copyBtn.textContent = "Copiar"), 1500);
      });
    });

    const carregarPopulares = async () => {
      listContainer.innerHTML = "Carregando...";
      const blocos = await Promise.all(
        zonas.map(async ({ zone, label }) => {
          const { original, ptbr, offset } = await fetchHora(zone);
          return `
            <div class="bg-gray-700 p-3 rounded space-y-1 text-sm">
              <div class="font-semibold">${label}</div>
              <div><span class="text-gray-400">Horário original:</span> <span class="text-green-400 font-mono">${original}</span></div>
              <div><span class="text-gray-400">PT-BR:</span> <span class="text-green-400 font-mono">${ptbr}</span></div>
              <div><span class="text-gray-400">UTC Offset:</span> <span class="text-yellow-400">${offset}</span></div>
            </div>
          `;
        })
      );

      listContainer.innerHTML = blocos.join("");
    };

    carregarPopulares();
  },
};

export default horarioMundial;
