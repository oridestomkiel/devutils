import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const bcrypt_hash_tool_generate_verify = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "en");
  },
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
  <div class="p-4 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm space-y-4">
    <div id="loadingBcrypt" class="text-center py-8">
      <p class="text-yellow-600 dark:text-yellow-400">${t("loading")}</p>
      <p class="text-xs text-gray-600 dark:text-gray-400 mt-2">${t(
        "loading.sub"
      )}</p>
    </div>

    <div id="mainContent" class="hidden">
      <div class="space-y-6">
        <div>
          <h2 class="text-lg font-bold mb-2">${t("section.generate")}</h2>
          <div class="space-y-4">
            <div>
              <label class="block mb-1 text-gray-700 dark:text-gray-300">${t(
                "label.text"
              )}</label>
              <input id="textoParaHash" type="text" class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label class="block mb-1 text-gray-700 dark:text-gray-300">${t(
                "label.rounds"
              )}</label>
              <div class="flex items-center gap-2">
                <input id="numeroRodadas" type="number" min="4" max="31" value="12" class="w-20 p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                <div class="flex gap-1">
                  <button id="btnDiminuir" class="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded">-</button>
                  <button id="btnAumentar" class="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded">+</button>
                </div>
              </div>
              <p id="dicaRodadas" class="text-xs mt-1 text-gray-600 dark:text-gray-400"></p>
            </div>
            <button id="btnGerarHash" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm w-full">${t(
              "generate"
            )}</button>
          </div>

          <div id="resultadoContainer" class="hidden">
            <div class="mt-4 p-4 bg-gray-200 dark:bg-gray-900 rounded">
              <textarea id="hashResultado" readonly class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-green-700 dark:text-green-400 font-mono mb-2" rows="2"></textarea>
              <button id="btnCopiarHash" class="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-3 py-1 rounded text-sm">${tGlobal(
                "copy"
              )}</button>
              <p id="infoRodadas" class="text-xs mt-2 text-gray-600 dark:text-gray-400"></p>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-300 dark:border-gray-700 pt-4">
          <h2 class="text-lg font-bold mb-2">${t("section.verify")}</h2>
          <div class="space-y-4">
            <div>
              <label class="block mb-1 text-gray-700 dark:text-gray-300">${t(
                "label.original"
              )}</label>
              <input id="textoOriginal" type="text" class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label class="block mb-1 text-gray-700 dark:text-gray-300">${t(
                "label.hash"
              )}</label>
              <input id="hashParaVerificar" type="text" class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono" />
            </div>
            <button id="btnVerificarHash" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm w-full">${t(
              "verify"
            )}</button>
            <p id="resultadoVerificacao" class="text-sm text-center mt-2 hidden"></p>
          </div>
        </div>
      </div>
    </div>

    <div id="errorContainer" class="hidden text-center py-8">
      <p class="text-red-600 dark:text-red-400">${t("error.load")}</p>
      <p class="text-xs text-gray-600 dark:text-gray-400 mt-2" id="errorDetail"></p>
      <button id="retryButton" class="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm">${t(
        "retry"
      )}</button>
    </div>
  </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const loadingEl = document.getElementById("loadingBcrypt");
    const mainEl = document.getElementById("mainContent");
    const errorEl = document.getElementById("errorContainer");
    const retryBtn = document.getElementById("retryButton");
    const errorDetail = document.getElementById("errorDetail");

    const loadBcrypt = () => {
      loadingEl.classList.remove("hidden");
      mainEl.classList.add("hidden");
      errorEl.classList.add("hidden");

      const existingScript = document.querySelector('script[src*="bcryptjs"]');
      if (existingScript) existingScript.remove();

      const script = document.createElement("script");
      script.src = "./vendor/bcrypt.min.js";
      script.async = true;

      script.onload = () => {
        const bcrypt = window.dcodeIO?.bcrypt;
        if (!bcrypt || typeof bcrypt.hashSync !== "function") {
          loadingEl.classList.add("hidden");
          errorDetail.textContent = t("error.scope");
          errorEl.classList.remove("hidden");
          return;
        }

        loadingEl.classList.add("hidden");
        mainEl.classList.remove("hidden");
        initBcryptUI(bcrypt);
      };

      script.onerror = () => {
        loadingEl.classList.add("hidden");
        errorDetail.textContent = t("error.network");
        errorEl.classList.remove("hidden");
      };

      document.head.appendChild(script);
    };

    retryBtn.addEventListener("click", loadBcrypt);
    loadBcrypt();

    function initBcryptUI(bcrypt) {
      const input = document.getElementById("textoParaHash");
      const rounds = document.getElementById("numeroRodadas");
      const btnGen = document.getElementById("btnGerarHash");
      const btnCopy = document.getElementById("btnCopiarHash");
      const btnInc = document.getElementById("btnAumentar");
      const btnDec = document.getElementById("btnDiminuir");
      const output = document.getElementById("hashResultado");
      const container = document.getElementById("resultadoContainer");
      const info = document.getElementById("infoRodadas");
      const dica = document.getElementById("dicaRodadas");

      const inputTextoOriginal = document.getElementById("textoOriginal");
      const inputHash = document.getElementById("hashParaVerificar");
      const btnVerificar = document.getElementById("btnVerificarHash");
      const resultadoVerificacao = document.getElementById(
        "resultadoVerificacao"
      );

      const updateDica = () => {
        const r = parseInt(rounds.value);
        if (r < 8) {
          dica.textContent = t("rounds.low");
          dica.className = "text-xs mt-1 text-yellow-400";
        } else if (r < 12) {
          dica.textContent = t("rounds.medium");
          dica.className = "text-xs mt-1 text-blue-400";
        } else {
          dica.textContent = t("rounds.high");
          dica.className = "text-xs mt-1 text-green-400";
        }
      };

      btnDec.onclick = () => {
        const v = parseInt(rounds.value);
        if (v > 4) rounds.value = v - 1;
        updateDica();
      };

      btnInc.onclick = () => {
        const v = parseInt(rounds.value);
        if (v < 31) rounds.value = v + 1;
        updateDica();
      };

      rounds.onchange = updateDica;
      updateDica();

      btnGen.onclick = () => {
        const texto = input.value.trim();
        const saltRounds = parseInt(rounds.value);

        if (!texto) return alert(t("input.empty"));

        inputTextoOriginal.value = "";
        inputHash.value = "";
        resultadoVerificacao.classList.add("hidden");

        btnGen.disabled = true;
        btnGen.textContent = `${t("generate")}...`;

        setTimeout(() => {
          try {
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(texto, salt);
            output.value = hash;
            info.textContent = t("generated.with").replace(
              "{rounds}",
              saltRounds
            );
            container.classList.remove("hidden");

            inputTextoOriginal.value = texto;
            inputHash.value = hash;
            btnVerificar.click();
          } catch (err) {
            alert(t("error.gerar"));
          } finally {
            btnGen.disabled = false;
            btnGen.textContent = t("generate");
          }
        }, 50);
      };

      btnCopy.onclick = () => {
        navigator.clipboard.writeText(output.value).then(() => {
          btnCopy.textContent = tGlobal("copied");
          setTimeout(() => (btnCopy.textContent = tGlobal("copy")), 1500);
        });
      };

      btnVerificar.onclick = () => {
        const original = inputTextoOriginal.value.trim();
        const hash = inputHash.value.trim();

        if (!original || !hash) {
          alert(t("input.verify.empty"));
          return;
        }

        try {
          const match = bcrypt.compareSync(original, hash);
          resultadoVerificacao.textContent = match
            ? t("match.ok")
            : t("match.fail");
          resultadoVerificacao.className = match
            ? "text-green-400 text-sm text-center mt-2"
            : "text-red-400 text-sm text-center mt-2";
          resultadoVerificacao.classList.remove("hidden");
        } catch {
          resultadoVerificacao.textContent = t("match.error");
          resultadoVerificacao.className =
            "text-red-400 text-sm text-center mt-2";
        }
      };
    }
  },
};

export default bcrypt_hash_tool_generate_verify;
