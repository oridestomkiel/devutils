import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const what_is_my_ip = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: true,
  license: "MIT",
  version: "1.0.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
      <div class="p-4 rounded text-gray-800 text-sm space-y-4 dark:bg-gray-800 dark:text-white">
        <p>${t("intro")}</p>

        <div>
          <p><strong>${t("ip_label")}</strong></p>
          <div class="flex gap-2 mt-1">
            <input
              id="ipOutput"
              type="text"
              readonly
              value="${t("loading")}"
              class="p-2 bg-white border border-gray-300 text-green-600 rounded w-full dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
            />
            <button
              id="copyIpBtn"
              class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              ${tGlobal("copy")}
            </button>
          </div>
        </div>

        <div>
          <p><strong>${t("dns_label")}</strong></p>
          <div class="flex gap-2 mt-1">
            <input
              id="dnsOutput"
              type="text"
              readonly
              value="${t("loading")}"
              class="p-2 bg-white border border-gray-300 text-green-600 rounded w-full dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
            />
            <button
              id="copyDnsBtn"
              class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              ${tGlobal("copy")}
            </button>
          </div>
        </div>

        <div>
          <p class="text-gray-700 dark:text-gray-300">${t("ip_types")}</p>
          <ul class="list-disc pl-5 text-gray-600 dark:text-gray-400">
            <li><strong>${t("ipv4")}</strong></li>
            <li><strong>${t("ipv6")}</strong></li>
          </ul>
        </div>
      </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    fetch("https://devutils.tools/api/ipinfo.json")
      .then((res) => res.json())
      .then((data) => {
        const ip = data.ip;
        const hostname = data.hostname || t("hostname_na");

        const ipEl = document.getElementById("ipOutput");
        const dnsEl = document.getElementById("dnsOutput");
        const copyIpBtn = document.getElementById("copyIpBtn");
        const copyDnsBtn = document.getElementById("copyDnsBtn");

        ipEl.value = ip;
        dnsEl.value = hostname;

        copyIpBtn.addEventListener("click", () => {
          navigator.clipboard.writeText(ip).then(() => {
            copyIpBtn.textContent = t("copied");
            setTimeout(() => (copyIpBtn.textContent = tGlobal("copy")), 1500);
          });
        });

        copyDnsBtn.addEventListener("click", () => {
          navigator.clipboard.writeText(hostname).then(() => {
            copyDnsBtn.textContent = t("copied");
            setTimeout(() => (copyDnsBtn.textContent = tGlobal("copy")), 1500);
          });
        });
      })
      .catch(() => {
        document.getElementById("ipOutput").value = t("error_ip");
        document.getElementById("dnsOutput").value = t("error_dns");
      });
  },
};

export default what_is_my_ip;
