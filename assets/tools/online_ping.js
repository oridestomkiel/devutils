import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const online_ping = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
    <div class="space-y-4">
      <div>
        <label for="pingHost" class="block mb-1 text-sm text-gray-800 dark:text-gray-300">${t(
          "input_label"
        )}</label>
        <input
          id="pingHost"
          type="text"
          placeholder="${t("input_placeholder")}"
          class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
        />
      </div>

      <button
        id="pingBtn"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm text-white dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        ${t("send_ping")}
      </button>

      <div id="pingResultArea" class="hidden">
        <label class="block mt-4 mb-1 text-sm text-gray-800 dark:text-gray-300">${t(
          "result_label"
        )}</label>
        <textarea
          id="pingOutput"
          rows="8"
          readonly
          class="w-full p-2 bg-white border border-gray-300 text-green-600 font-mono rounded dark:bg-gray-800 dark:border-gray-700 dark:text-green-400"
        >${t("waiting")}</textarea>

        <button
          id="pingCopyBtn"
          class="mt-2 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm text-white dark:bg-gray-600 dark:hover:bg-gray-500"
        >
          ${tGlobal("copy")}
        </button>
      </div>
    </div>
    `;
  },

  init() {
    const hostInput = document.getElementById("pingHost");
    const pingBtn = document.getElementById("pingBtn");
    const resultArea = document.getElementById("pingResultArea");
    const pingOutput = document.getElementById("pingOutput");
    const copyBtn = document.getElementById("pingCopyBtn");

    pingBtn.addEventListener("click", () => {
      const host = hostInput.value.trim();
      if (!host) {
        alert("Digite um domínio ou IP para pingar."); // Essa pode ser internacionalizada também se quiser
        return;
      }

      pingBtn.textContent = "Pingando...";
      pingBtn.disabled = true;
      pingOutput.value = "Aguarde...";
      resultArea.classList.remove("hidden");

      fetch(
        `https://devutils.tools/api/ping.json?host=${encodeURIComponent(host)}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            pingOutput.value = data.raw.join("\n");
          } else {
            pingOutput.value = "Erro: " + (data.message || "Host inacessível");
          }
        })
        .catch(() => {
          pingOutput.value = "Erro ao realizar ping.";
        })
        .finally(() => {
          pingBtn.textContent = "Enviar Ping";
          pingBtn.disabled = false;
        });
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(pingOutput.value).then(() => {
        copyBtn.textContent = tGlobal("copied");
        setTimeout(() => (copyBtn.textContent = tGlobal("copy")), 1500);
      });
    });
  },
};

export default online_ping;
