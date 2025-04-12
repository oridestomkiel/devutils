import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const open_ports_checker = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: true,
  license: "MIT",
  version: "1.2.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
    <input
      id="portScanHost"
      type="text"
      placeholder="${t("host_placeholder")}"
      class="w-full p-2 rounded bg-white border border-gray-300 text-gray-800 mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
    />

    <div class="flex flex-wrap gap-2 mb-2">
      <button
        data-ports="80,443,8080"
        class="profileBtn bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm text-white dark:bg-gray-600 dark:hover:bg-gray-500"
      >
        🌐 ${t("profile_web")}
      </button>
      <button
        data-ports="21,22,23,25,110,139,445"
        class="profileBtn bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm text-white dark:bg-gray-600 dark:hover:bg-gray-500"
      >
        🔒 ${t("profile_security")}
      </button>
      <button
        data-ports="1433,3306,5432,27017"
        class="profileBtn bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm text-white dark:bg-gray-600 dark:hover:bg-gray-500"
      >
        💾 ${t("profile_db")}
      </button>
    </div>

    <input
      id="portScanList"
      type="text"
      placeholder="${t("ports_placeholder")}"
      class="w-full p-2 rounded bg-white border border-gray-300 text-gray-800 mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
    />

    <div class="flex gap-2 mb-4">
      <button
        id="scanPortBtn"
        class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        ${t("scan")}
      </button>
      <button
        id="clearPortScanBtn"
        class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white dark:bg-gray-600 dark:hover:bg-gray-500"
      >
        ${tGlobal("clear")}
      </button>
    </div>

    <div
      id="portScanResult"
      class="hidden bg-white border border-gray-300 p-3 mt-2 rounded text-sm text-green-600 whitespace-pre-wrap dark:bg-gray-900 dark:border-gray-700 dark:text-green-400"
    ></div>
    `;
  },

  init() {
    const t = (key) => open_ports_checker.i18n?.[key] ?? key;
    const hostInput = document.getElementById("portScanHost");
    const portInput = document.getElementById("portScanList");
    const resultBox = document.getElementById("portScanResult");

    document.querySelectorAll(".profileBtn").forEach((btn) => {
      btn.addEventListener("click", () => {
        portInput.value = btn.getAttribute("data-ports");
      });
    });

    document
      .getElementById("scanPortBtn")
      .addEventListener("click", async () => {
        const host = hostInput.value.trim();
        const ports = portInput.value.trim();

        if (!host || !ports) {
          resultBox.textContent = t("error_fill_fields");
          resultBox.classList.remove("hidden");
          return;
        }

        resultBox.textContent = t("scanning");
        resultBox.classList.remove("hidden");

        try {
          const res = await fetch(
            `https://devutils.tools/api/scan-port.json?host=${encodeURIComponent(
              host
            )}&ports=${encodeURIComponent(ports)}`
          );
          const data = await res.json();

          if (data.error) {
            resultBox.textContent = `Erro: ${data.error}`;
            return;
          }

          let html = `<p class="mb-2 text-green-300">${t(
            "host_label"
          )}: <strong>${data.host}</strong></p>`;
          html += `<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">`;

          data.resultado.forEach(({ porta, status }) => {
            const badge =
              status === "aberta"
                ? `<div class="bg-green-700 px-2 py-1 rounded text-white text-center">✅ ${t(
                    "port_open"
                  )} ${porta}</div>`
                : `<div class="bg-red-700 px-2 py-1 rounded text-white text-center">❌ ${t(
                    "port_closed"
                  )} ${porta}</div>`;
            html += badge;
          });

          html += "</div>";
          resultBox.innerHTML = html;
        } catch (err) {
          resultBox.textContent = `${t("scan_error")}: ${err.message}`;
        }
      });

    document
      .getElementById("clearPortScanBtn")
      .addEventListener("click", () => {
        hostInput.value = "";
        portInput.value = "";
        resultBox.textContent = "";
        resultBox.classList.add("hidden");
      });
  },
};

export default open_ports_checker;
