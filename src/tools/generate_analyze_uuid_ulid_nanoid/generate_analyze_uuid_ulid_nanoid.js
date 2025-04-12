import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";
import { customAlphabet } from "nanoid/non-secure";

const generate_analyze_uuid_ulid_nanoid = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "en");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",

  render() {
    const t = (k) => this.i18n?.[k] ?? k;

    return `
  <div class="p-4 rounded text-sm space-y-6 text-gray-800 dark:bg-gray-800 dark:text-white">
    <div class="space-y-2">
      <label class="block">${t("type")}</label>
      <select id="tipoID" class="bg-white border border-gray-300 p-2 rounded w-full dark:bg-gray-700 dark:border-gray-700 dark:text-white">
        <option value="uuid">UUID v4</option>
        <option value="ulid">ULID</option>
        <option value="nanoid">Nano ID</option>
      </select>
    </div>

    <div class="space-y-2">
      <label class="block">${t("amount")}</label>
      <input id="quantidade" type="number" min="1" max="1000" value="10"
        class="bg-white border border-gray-300 p-2 rounded w-full dark:bg-gray-700 dark:border-gray-700 dark:text-white" />
    </div>

    <label class="inline-flex items-center space-x-2">
      <input type="checkbox" id="minusculas" class="form-checkbox text-blue-600 dark:text-blue-400" />
      <span>${t("lowercase")}</span>
    </label>

    <div>
      <button id="btnGerarIDs" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">${t(
        "generate"
      )}</button>
    </div>

    <textarea id="saidaIDs" rows="10"
      class="w-full mt-4 p-2 rounded bg-white border border-gray-300 text-green-600 font-mono dark:bg-gray-900 dark:border-gray-700 dark:text-green-400"
    ></textarea>

    <button id="btnCopiarIDs"
      class="mt-2 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white">${tGlobal(
        "copy"
      )}</button>

    <!-- Analisar ID -->
    <div class="mt-8 border-t border-gray-300 dark:border-gray-600 pt-4">
      <h3 class="text-base font-bold mb-2">${t("analyzeTitle")}</h3>
      <input id="entradaID" type="text" placeholder="${t("placeholder")}"
        class="w-full p-2 bg-white border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white mb-2" />
      <button id="btnAnalisarID"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white mb-2">${t(
          "analyze"
        )}</button>
      <div id="resultadoID"
        class="text-xs whitespace-pre font-mono bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300 p-2 rounded hidden"
      ></div>
    </div>
  </div>
  `;
  },

  async init() {
    const t = (k) => this.i18n?.[k] ?? k;

    const btnGerar = document.getElementById("btnGerarIDs");
    const btnCopiar = document.getElementById("btnCopiarIDs");
    const saida = document.getElementById("saidaIDs");

    btnGerar.onclick = async () => {
      const tipo = document.getElementById("tipoID").value;
      const qtd = parseInt(document.getElementById("quantidade").value);
      const usarMinusculas = document.getElementById("minusculas").checked;

      const ids = [];

      for (let i = 0; i < qtd; i++) {
        let id = "";

        if (tipo === "uuid") {
          id = crypto.randomUUID();
        } else if (tipo === "ulid") {
          const { ulid } = await import("/public/vendor/ulid-esm.js");
          id = ulid();
        } else if (tipo === "nanoid") {
          const nanoid = customAlphabet(
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
            21
          );
          id = nanoid();
        }

        ids.push(usarMinusculas ? id.toLowerCase() : id);
      }

      saida.value = ids.join("\n");
    };

    btnCopiar.onclick = () => {
      navigator.clipboard.writeText(saida.value).then(() => {
        btnCopiar.textContent = tGlobal("copied");
        setTimeout(() => {
          btnCopiar.textContent = tGlobal("copy");
        }, 1500);
      });
    };

    // Análise de ID
    const btnAnalisar = document.getElementById("btnAnalisarID");
    const entradaID = document.getElementById("entradaID");
    const resultadoID = document.getElementById("resultadoID");

    btnAnalisar.onclick = () => {
      const valor = entradaID.value.trim();
      resultadoID.classList.remove("text-red-400", "text-green-400");

      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-([1-5])[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          valor
        );
      const isULID = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/.test(valor);
      const isNanoID = /^[\w-]{21,}$/i.test(valor);

      if (isUUID) {
        const versao = valor.charAt(14);
        const varianteChar = valor.charAt(19).toLowerCase();
        let variante = ["8", "9", "a", "b"].includes(varianteChar)
          ? t("uuidRfc")
          : t("unknown");

        resultadoID.innerText = `🧬 ${t("uuidValid")}\n${t(
          "version"
        )}: ${versao}\n${t("variant")}: ${variante}`;
        resultadoID.classList.add("text-green-400");
      } else if (isULID) {
        resultadoID.innerText = `🔤 ${t("ulidValid")}`;
        resultadoID.classList.add("text-green-400");
      } else if (isNanoID) {
        resultadoID.innerText = `🆔 ${t("nanoidValid")}`;
        resultadoID.classList.add("text-green-400");
      } else {
        resultadoID.innerText = t("invalidID");
        resultadoID.classList.add("text-red-400");
      }

      resultadoID.classList.remove("hidden");
    };
  },
};

export default generate_analyze_uuid_ulid_nanoid;
