import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const dns_lookup = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "en");
  },
  author: "DevUtils",
  hasApi: true,
  license: "MIT",
  version: "1.2.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
<div class="p-4 rounded bg-gray-100 dark:bg-gray-800 text-sm space-y-4 text-gray-800 dark:text-white">
  <p>${t("intro")}</p>

  <div class="space-y-2">
    <label class="block text-sm mb-1">${t("label.domain")}</label>
    <input id="dnsDomain" type="text" placeholder="exemplo.com" class="w-full p-2 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-700 text-black dark:text-white rounded" />
  </div>

  <div class="space-y-2">
    <label class="block text-sm mb-1">${t("label.recordTypes")}</label>
    <div class="flex flex-wrap gap-2">
      ${["A", "AAAA", "MX", "CNAME", "TXT", "NS", "SOA"]
        .map(
          (type) => `
        <label class="inline-flex items-center gap-1">
          <input type="checkbox" name="dnsTypes" value="${type}" checked />
          ${type}
        </label>`
        )
        .join("")}
    </div>
  </div>

  <div class="space-y-2">
    <label class="block text-sm mb-1">${t("label.format")}</label>
    <select id="dnsFormat" class="p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
      <option value="json">${t("format.json")}</option>
      <option value="text">${t("format.text")}</option>
      <option value="table">${t("format.table")}</option>
    </select>
  </div>

  <button id="btnDnsLookup" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm text-white">
    ${t("lookup")}
  </button>

  <div id="dnsResultWrapper" class="mt-4 hidden space-y-2">
    <label class="block text-sm mb-1">${t("label.result")}</label>
    <pre id="dnsResult" class="hidden p-3 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-900 text-green-700 dark:text-green-400 rounded text-xs overflow-auto whitespace-pre-wrap"></pre>
    <table id="dnsResultTable" class="hidden w-full text-left border border-collapse border-gray-300 dark:border-gray-600 text-xs">
      <thead class="bg-gray-200 dark:bg-gray-700 text-black dark:text-white">
        <tr>
          <th class="p-2 border">${t("table.type")}</th>
          <th class="p-2 border">${t("table.value")}</th>
        </tr>
      </thead>
      <tbody id="dnsTableBody"></tbody>
    </table>

    <div class="flex gap-2">
      <button id="copyDnsJson" class="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded">
        ${tGlobal("copy")}
      </button>
      <button id="downloadDnsResult" class="px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
        ${t("download")}
      </button>
    </div>
  </div>
</div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const domainInput = document.getElementById("dnsDomain");
    const btn = document.getElementById("btnDnsLookup");
    const formatSelect = document.getElementById("dnsFormat");
    const resultWrapper = document.getElementById("dnsResultWrapper");
    const resultEl = document.getElementById("dnsResult");
    const tableEl = document.getElementById("dnsResultTable");
    const tableBody = document.getElementById("dnsTableBody");
    const downloadBtn = document.getElementById("downloadDnsResult");

    const copyBtn = document.getElementById("copyDnsJson");

    btn.addEventListener("click", () => {
      const domain = domainInput.value.trim();
      if (!domain) return alert(t("error.emptyDomain"));

      const types = [
        ...document.querySelectorAll("input[name='dnsTypes']:checked"),
      ].map((el) => el.value);
      if (!types.length) return alert(t("error.noTypes"));

      const format = formatSelect.value;
      resultWrapper.classList.remove("hidden");
      resultEl.classList.add("hidden");
      tableEl.classList.add("hidden");
      tableBody.innerHTML = "";
      resultEl.textContent = t("json.loading");

      if (format === "json" || format === "text") {
        resultEl.classList.remove("hidden");
      }

      fetch("https://services.devutils.tools/dns-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, types }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (format === "json") {
            resultEl.textContent = JSON.stringify(data, null, 2);
          } else if (format === "text") {
            let output = `Domínio: ${data.domain}\n\n`;
            for (const [type, value] of Object.entries(data.results)) {
              const val = Array.isArray(value)
                ? value.join("\n")
                : typeof value === "object"
                ? JSON.stringify(value)
                : value;
              output += `🔹 ${type}:\n${val}\n\n`;
            }
            resultEl.textContent = output;
          } else if (format === "table") {
            tableEl.classList.remove("hidden");
            for (const [type, value] of Object.entries(data.results)) {
              const values = Array.isArray(value) ? value : [value];
              values.forEach((v) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                  <td class="p-2 border align-top">${type}</td>
                  <td class="p-2 border whitespace-pre-wrap">${
                    typeof v === "object" ? JSON.stringify(v, null, 2) : v
                  }</td>
                `;
                tableBody.appendChild(row);
              });
            }
          }
        })
        .catch(() => {
          resultEl.classList.remove("hidden");
          resultEl.textContent = t("error.fetch");
        });
    });

    copyBtn.addEventListener("click", () => {
      const format = formatSelect.value;
      let content = "";

      if (format === "table") {
        const rows = [...tableBody.querySelectorAll("tr")].map((row) =>
          [...row.querySelectorAll("td")]
            .map((td) => td.textContent.trim())
            .join(" | ")
        );
        content = rows.join("\n");
      } else {
        content = resultEl.textContent;
      }

      navigator.clipboard.writeText(content).then(() => {
        copyBtn.textContent = tGlobal("copied");
        setTimeout(() => (copyBtn.textContent = tGlobal("copy")), 1500);
      });
    });

    downloadBtn.addEventListener("click", () => {
      const format = formatSelect.value;
      let content = "";

      if (format === "table") {
        const rows = [...tableBody.querySelectorAll("tr")].map((row) =>
          [...row.querySelectorAll("td")]
            .map((td) => td.textContent.trim())
            .join(" | ")
        );
        content = rows.join("\n");
      } else {
        content = resultEl.textContent;
      }

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `dns-result.${format === "json" ? "json" : "txt"}`;
      a.click();
    });
  },
};

export default dns_lookup;
