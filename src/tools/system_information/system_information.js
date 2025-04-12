import { loadToolI18n } from "../../utils/i18n-loader.js";

const system_information = {
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
    <div class="p-4 rounded text-gray-800 text-sm space-y-4 dark:bg-gray-800 dark:text-white">
      <h2 class="text-lg font-semibold">${t("title_os")}</h2>
      <div class="space-y-2">
        <div>
          <label class="block text-sm mb-1">${t("os_label")}</label>
          <input id="outSistemaOperacional" readonly
            class="w-full p-2 rounded bg-white border border-gray-300 text-green-600 dark:bg-gray-700 dark:border-gray-700 dark:text-green-400" />
        </div>
        <div>
          <label class="block text-sm mb-1">${t("screen_label")}</label>
          <input id="outResolucaoTela" readonly
            class="w-full p-2 rounded bg-white border border-gray-300 text-green-600 dark:bg-gray-700 dark:border-gray-700 dark:text-green-400" />
        </div>
      </div>

      <h2 class="text-lg font-semibold mt-4">${t("title_browser")}</h2>
      <div class="space-y-2">
        <div>
          <label class="block text-sm mb-1">${t("browser_label")}</label>
          <input id="outNavegador" readonly
            class="w-full p-2 rounded bg-white border border-gray-300 text-green-600 dark:bg-gray-700 dark:border-gray-700 dark:text-green-400" />
        </div>
        <div>
          <label class="block text-sm mb-1">${t("browser_version")}</label>
          <input id="outVersaoNavegador" readonly
            class="w-full p-2 rounded bg-white border border-gray-300 text-green-600 dark:bg-gray-700 dark:border-gray-700 dark:text-green-400" />
        </div>
      </div>
    </div>
    `;
  },

  init() {
    const sistemaOperacionalEl = document.getElementById(
      "outSistemaOperacional"
    );
    const resolucaoTelaEl = document.getElementById("outResolucaoTela");
    const navegadorEl = document.getElementById("outNavegador");
    const versaoNavegadorEl = document.getElementById("outVersaoNavegador");

    sistemaOperacionalEl.value = navigator.platform;
    resolucaoTelaEl.value = `${screen.width}x${screen.height}`;

    const ua = navigator.userAgent;
    let navegador = "Desconhecido";
    let versao = "Desconhecida";

    if (ua.includes("Firefox")) {
      navegador = "Mozilla Firefox";
      versao = ua.match(/Firefox\/([\d.]+)/)?.[1] ?? "";
    } else if (ua.includes("Chrome")) {
      navegador = "Google Chrome";
      versao = ua.match(/Chrome\/([\d.]+)/)?.[1] ?? "";
    } else if (ua.includes("Safari")) {
      navegador = "Safari";
      versao = ua.match(/Version\/([\d.]+)/)?.[1] ?? "";
    } else if (ua.includes("MSIE") || ua.includes("Trident/")) {
      navegador = "Internet Explorer";
      versao = ua.match(/(MSIE |rv:)([\d.]+)/)?.[2] ?? "";
    }

    navegadorEl.value = navegador;
    versaoNavegadorEl.value = versao;
  },
};

export default system_information;
