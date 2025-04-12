import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const address_generator = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "en");
  },
  author: "DevUtils",
  hasApi: true,
  license: "MIT",
  version: "1.0.0",
  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
  <div class="p-4 rounded bg-gray-100 dark:bg-gray-800 text-sm space-y-4 text-gray-800 dark:text-white">
    <p>${t("intro")}</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm mb-1">${t("label.state")}</label>
        <select id="cepUf" class="w-full p-2 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-700 text-black dark:text-white rounded">
          <option value="">${t("option.random")}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm mb-1">${t("label.city")}</label>
        <select id="cepCidade" class="w-full p-2 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-700 text-black dark:text-white rounded" disabled>
          <option value="">${t("label.city.selectState")}</option>
        </select>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <label class="block text-sm">${t("label.maskCep")}</label>
      <label class="inline-flex items-center gap-1">
        <input type="radio" name="pontuar" value="sim" checked /> ${t("yes")}
      </label>
      <label class="inline-flex items-center gap-1">
        <input type="radio" name="pontuar" value="nao" /> ${t("no")}
      </label>
    </div>

    <button id="btnGerarCep" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm text-white">
      ${t("generate")}
    </button>

    <div id="resultadoCepWrapper" class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 hidden">
      <div id="resultadoCep" class="space-y-4">
        ${["cep", "address", "neighborhood", "city", "state"]
          .map(
            (key) => `
          <div>
            <label class="block text-sm mb-1">${t(
              "label.result." + key
            )}</label>
            <div class="flex gap-2">
              <input id="out${key}" readonly class="w-full p-2 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-700 text-green-700 dark:text-green-400 rounded" />
              <button data-copy="out${key}" class="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded">${tGlobal(
              "copy"
            )}</button>
            </div>
          </div>`
          )
          .join("")}
      </div>

      <div class="space-y-2">
        <label class="block text-sm mb-1">${t("label.result.json")}</label>
        <div class="relative">
          <pre id="outJson" class="h-full p-3 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-900 text-green-700 dark:text-green-400 rounded text-xs overflow-auto whitespace-pre-wrap"></pre>
          <button id="copyJson" class="absolute top-2 right-2 px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded">${tGlobal(
            "copy"
          )}</button>
        </div>
      </div>
    </div>
  </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const ufEl = document.getElementById("cepUf");
    const cidadeEl = document.getElementById("cepCidade");
    const btn = document.getElementById("btnGerarCep");
    const resultadoWrapper = document.getElementById("resultadoCepWrapper");

    const fields = {
      cep: document.getElementById("outcep"),
      address: document.getElementById("outaddress"),
      neighborhood: document.getElementById("outneighborhood"),
      city: document.getElementById("outcity"),
      state: document.getElementById("outstate"),
    };

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((res) => res.json())
      .then((estados) => {
        estados.sort((a, b) => a.nome.localeCompare(b.nome));
        estados.forEach((uf) => {
          const opt = document.createElement("option");
          opt.value = uf.sigla;
          opt.textContent = uf.nome;
          ufEl.appendChild(opt);
        });
      });

    ufEl.addEventListener("change", () => {
      const uf = ufEl.value;
      cidadeEl.innerHTML = `<option value="">${t(
        "option.random.city"
      )}</option>`;
      cidadeEl.disabled = true;
      if (!uf) return;
      fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
      )
        .then((res) => res.json())
        .then((cidades) => {
          cidades.sort((a, b) => a.nome.localeCompare(b.nome));
          cidades.forEach((cidade) => {
            const opt = document.createElement("option");
            opt.value = cidade.id;
            opt.textContent = cidade.nome;
            cidadeEl.appendChild(opt);
          });
          cidadeEl.disabled = false;
        });
    });

    btn.addEventListener("click", () => {
      const uf = ufEl.value;
      const cidade = cidadeEl.value;
      const pontuar =
        document.querySelector("input[name='pontuar']:checked").value === "sim";

      resultadoWrapper.classList.remove("hidden");
      Object.values(fields).forEach((el) => (el.value = t("loading")));
      document.getElementById("outJson").textContent = t("json.loading");

      const params = new URLSearchParams();
      if (uf) params.append("uf", uf);
      if (cidade) params.append("cidade", cidade);
      params.append("pontuar", pontuar ? "1" : "0");

      fetch(
        `https://devutils.tools/api/address-generator.json?${params.toString()}`
      )
        .then((res) => res.json())
        .then((data) => {
          fields.cep.value = data.cep;
          fields.address.value = data.endereco;
          fields.neighborhood.value = data.bairro;
          fields.city.value = data.cidade;
          fields.state.value = data.estado;
          document.getElementById("outJson").textContent = JSON.stringify(
            data,
            null,
            2
          );
        })
        .catch(() => {
          Object.values(fields).forEach((el) => (el.value = t("error")));
          document.getElementById("outJson").textContent = t("error.fetch");
        });
    });

    document.addEventListener("click", (e) => {
      if (e.target.matches("button[data-copy]")) {
        const id = e.target.getAttribute("data-copy");
        const val = document.getElementById(id).value;
        navigator.clipboard.writeText(val).then(() => {
          e.target.textContent = tGlobal("copied");
          setTimeout(() => (e.target.textContent = tGlobal("copy")), 1500);
        });
      }

      if (e.target.id === "copyJson") {
        const val = document.getElementById("outJson").textContent;
        navigator.clipboard.writeText(val).then(() => {
          e.target.textContent = tGlobal("copied");
          setTimeout(() => (e.target.textContent = tGlobal("copy")), 1500);
        });
      }
    });
  },
};

export default address_generator;
