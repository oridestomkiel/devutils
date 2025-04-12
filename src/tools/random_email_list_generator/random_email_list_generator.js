import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const random_email_list_generator = {
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
      <div class="grid grid-cols-2 gap-2 mb-2">
        <input
          id="emailCount"
          type="number"
          min="1"
          value="10"
          class="p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded"
          placeholder="${t("quantity_placeholder")}"
        />
        <input
          id="emailDomain"
          type="text"
          value="example.com"
          class="p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded"
          placeholder="${t("domain_placeholder")}"
        />
      </div>

      <button
        id="emailGenBtn"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
      >
        ${t("generate")}
      </button>

      <textarea
        id="emailOutput"
        class="w-full p-2 bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 border border-gray-300 dark:border-gray-700 rounded mt-2"
        rows="6"
        readonly
        placeholder="${t("output_placeholder")}"
      ></textarea>

      <button
        id="emailCopyBtn"
        class="mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
      >
        ${tGlobal("copy")}
      </button>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;
    const emailGenBtn = document.getElementById("emailGenBtn");
    const emailCountEl = document.getElementById("emailCount");
    const emailDomainEl = document.getElementById("emailDomain");
    const emailOutput = document.getElementById("emailOutput");
    const emailCopyBtn = document.getElementById("emailCopyBtn");

    const genNome = () => {
      const nomes = [
        "joao",
        "maria",
        "ana",
        "carlos",
        "lucas",
        "paula",
        "rafa",
        "leo",
        "isa",
        "duda",
      ];
      const sobrenomes = [
        "silva",
        "souza",
        "oliveira",
        "costa",
        "pereira",
        "ferreira",
        "santos",
      ];
      const n = nomes[Math.floor(Math.random() * nomes.length)];
      const s = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${n}.${s}${Math.floor(Math.random() * 1000)}`;
    };

    emailGenBtn.addEventListener("click", () => {
      const qtd = parseInt(emailCountEl.value, 10);
      const dominio = emailDomainEl.value.trim();
      if (!dominio || qtd <= 0) {
        emailOutput.value = `❌ ${t("error_input")}`;
        return;
      }

      const lista = Array.from(
        { length: qtd },
        () => `${genNome()}@${dominio}`
      );

      emailOutput.value = lista.join("\n");
    });

    emailCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(emailOutput.value).then(() => {
        const original = emailCopyBtn.innerText;
        emailCopyBtn.innerText = tGlobal("copied");
        setTimeout(() => {
          emailCopyBtn.innerText = tGlobal("copy");
        }, 1500);
      });
    });
  },
};

export default random_email_list_generator;
