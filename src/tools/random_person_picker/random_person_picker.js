import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const random_person_picker = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.2.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
      <div class="p-4 rounded text-gray-800 text-sm space-y-4 dark:bg-gray-800 dark:text-white">
        <p>${t("instructions")}</p>

        <textarea
          id="pessoasLista"
          rows="6"
          placeholder="Maria\nJoão\nCarlos\nAna"
          class="w-full p-2 bg-white border border-gray-300 dark:text-green-600 rounded font-mono resize-none dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
        ></textarea>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm mb-1">${t("separator")}</label>
            <select id="separador" class="p-2 bg-white border border-gray-300 text-gray-800 rounded w-full dark:bg-gray-700 dark:border-gray-700 dark:text-white">
              <option value="\n">${t("newline")}</option>
              <option value=",">${t("comma")}</option>
              <option value=";">${t("semicolon")}</option>
              <option value="|">${t("pipe")}</option>
              <option value=".">${t("dot")}</option>
              <option value="__custom__">${t("custom")}</option>
            </select>
            <input
              id="separadorCustom"
              type="text"
              placeholder="${t("custom_placeholder")}"
              class="mt-2 p-2 bg-white border border-gray-300 text-gray-800 rounded w-full hidden dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          <div>
            <label class="block text-sm mb-1">${t("quantity")}</label>
            <input
              id="qtdSorteio"
              type="number"
              min="1"
              value="1"
              class="p-2 bg-white border border-gray-300 text-gray-800 rounded w-full dark:bg-gray-700 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        <button id="btnSortearPessoas" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm text-white dark:bg-indigo-500 dark:hover:bg-indigo-600">
          ${t("draw")} 🎉
        </button>

        <div id="resultadoPessoas" class="mt-4 text-green-600 font-semibold space-y-2 bg-white border border-gray-300 p-8 rounded hidden dark:bg-gray-900 dark:border-gray-700 dark:text-green-400"></div>
      </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const listaEl = document.getElementById("pessoasLista");
    const separadorEl = document.getElementById("separador");
    const customEl = document.getElementById("separadorCustom");
    const qtdEl = document.getElementById("qtdSorteio");
    const btn = document.getElementById("btnSortearPessoas");
    const resultadoEl = document.getElementById("resultadoPessoas");

    const detectSeparador = (text) => {
      const counts = {
        "\n": (text.match(/\n/g) || []).length,
        ",": (text.match(/,/g) || []).length,
        ";": (text.match(/;/g) || []).length,
        "|": (text.match(/\|/g) || []).length,
        ".": (text.match(/\./g) || []).length,
      };
      const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      return winner[1] > 0 ? winner[0] : "\n";
    };

    separadorEl.addEventListener("change", () => {
      customEl.classList.toggle("hidden", separadorEl.value !== "__custom__");
    });

    const atualizarTextarea = () => {
      const raw = listaEl.value.trim();
      const sep = detectSeparador(raw);
      separadorEl.value = sep;
      customEl.classList.add("hidden");
      const linhas = raw.split("\n").length;
      listaEl.rows = Math.min(30, Math.max(6, linhas));
    };

    listaEl.addEventListener("input", atualizarTextarea);
    listaEl.addEventListener("paste", () => setTimeout(atualizarTextarea, 10));

    btn.addEventListener("click", () => {
      const raw = listaEl.value.trim();
      const sep =
        separadorEl.value === "__custom__"
          ? customEl.value || "\n"
          : separadorEl.value;

      if (!raw.includes(sep)) {
        resultadoEl.innerHTML = `<p class="text-yellow-400">⚠️ ${t(
          "separator_not_found"
        )} (“${sep}”)</p>`;
        resultadoEl.classList.remove("hidden");
        return;
      }

      const nomes = raw
        .split(sep)
        .map((n) => n.trim())
        .filter(Boolean);

      const qtd = parseInt(qtdEl.value, 10) || 1;

      if (nomes.length === 0) {
        resultadoEl.innerHTML = `<p class="text-yellow-400">⚠️ ${t(
          "no_valid_names"
        )}</p>`;
        resultadoEl.classList.remove("hidden");
        return;
      }

      if (qtd > nomes.length) {
        resultadoEl.innerHTML = `<p class="text-yellow-400">⚠️ ${t(
          "more_than_available"
        )}</p>`;
        resultadoEl.classList.remove("hidden");
        return;
      }

      const nomeMap = {};
      const duplicados = [];

      nomes.forEach((nome) => {
        const lower = nome.toLowerCase();
        nomeMap[lower] = nomeMap[lower] ? nomeMap[lower] + 1 : 1;
      });

      for (const [nome, count] of Object.entries(nomeMap)) {
        if (count > 1) {
          duplicados.push(nomes.find((n) => n.toLowerCase() === nome));
        }
      }

      if (duplicados.length > 0) {
        resultadoEl.innerHTML = `
          <p class="text-yellow-400">
            ⚠️ ${t("duplicates_found")}:
            <strong>${duplicados.join(", ")}</strong>
          </p>
        `;
        resultadoEl.classList.remove("hidden");
        return;
      }

      const sorteados = [];
      const pool = [...nomes];

      while (sorteados.length < qtd) {
        const i = Math.floor(Math.random() * pool.length);
        sorteados.push(pool.splice(i, 1)[0]);
      }

      resultadoEl.innerHTML = `
        <p class="text-xl font-bold text-green-600 dark:text-green-300">
          🎊 ${qtd === 1 ? t("winner_single") : t("winner_plural")}:
        </p>
        <ol class="list-decimal list-inside text-green-500 dark:text-green-200 text-lg space-y-1">
          ${sorteados.map((n) => `<li>${n}</li>`).join("")}
        </ol>
        <p class="text-sm text-gray-600 dark:text-gray-400">${t("congrats")}</p>
      `;

      resultadoEl.classList.remove("hidden");
    });
  },
};

export default random_person_picker;
