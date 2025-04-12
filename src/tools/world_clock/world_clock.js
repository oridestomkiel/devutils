import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const world_clock = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: true,
  license: "MIT",
  version: "1.1.1",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
      <div class="p-4 rounded bg-gray-100 dark:bg-gray-800 text-sm space-y-4 text-gray-800 dark:text-white">
        <div>
          <p class="mb-1 font-semibold">${t("choose_timezone")}</p>
          <select id="timezoneSelect" class="p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded w-full border border-gray-300 dark:border-gray-600">
            <option value="">${t("select_placeholder")}</option>
          </select>
          <div class="mt-2 flex gap-2">
            <input
              id="timezoneOutput"
              type="text"
              readonly
              value=""
              class="p-2 bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 rounded w-full border border-gray-300 dark:border-gray-600"
              placeholder="${t("output_placeholder")}"
            />
            <button
              id="copyTimeBtn"
              class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-2 py-1 rounded text-gray-800 dark:text-white"
            >
              ${tGlobal("copy")}
            </button>
          </div>
        </div>

        <div>
          <p class="font-semibold mb-1">${t("popular_times")}</p>
          <div id="popularTimes" class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm"></div>
        </div>
      </div>
    `;
  },

  init: async function () {
    const t = (key) => this.i18n?.[key] ?? key;

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
          `https://devutils.tools/api/timezone.json?zone=${zone}`
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
          ptbr: t("error_time"),
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
        copyBtn.textContent = t("copied");
        setTimeout(() => (copyBtn.textContent = tGlobal("copy")), 1500);
      });
    });

    const carregarPopulares = async () => {
      listContainer.innerHTML = t("loading");
      const blocos = await Promise.all(
        zonas.map(async ({ zone, label }) => {
          const { original, ptbr, offset } = await fetchHora(zone);
          return `
          <div class="bg-gray-200 dark:bg-gray-700 p-3 rounded space-y-1 text-sm text-gray-800 dark:text-white">
            <div class="font-semibold">${label}</div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">${t(
                "label_original"
              )}</span>
              <span class="text-green-700 dark:text-green-400 font-mono">${original}</span>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">${t(
                "label_ptbr"
              )}</span>
              <span class="text-green-700 dark:text-green-400 font-mono">${ptbr}</span>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">${t(
                "label_offset"
              )}</span>
              <span class="text-yellow-600 dark:text-yellow-400">${offset}</span>
            </div>
          </div>
        `;
        })
      );

      listContainer.innerHTML = blocos.join("");
    };

    carregarPopulares();
  },
};

export default world_clock;
