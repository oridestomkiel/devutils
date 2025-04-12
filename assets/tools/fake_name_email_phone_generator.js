import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const fake_name_email_phone_generator = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "en");
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
      id="fakeUserQtd" 
      type="number" 
      min="1" 
      value="5" 
      class="p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded" 
      placeholder="${t("quantity")}" 
    />
    <input 
      id="fakeUserDomain" 
      type="text" 
      value="exemplo.com" 
      class="p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded" 
      placeholder="${t("emailDomain")}" 
    />
  </div>
  <button id="fakeUserGenBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">${t(
    "generate"
  )}</button>
  <textarea 
    id="fakeUserOutput" 
    class="w-full p-2 bg-white dark:bg-gray-700 text-green-700 dark:text-green-400 border border-gray-300 dark:border-gray-600 rounded mt-2" 
    rows="6" 
    readonly 
    placeholder="${t("outputPlaceholder")}"
  ></textarea>
  <button id="fakeUserCopyBtn" class="mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white">${tGlobal(
    "copy"
  )}</button>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const nomes = [
      "João",
      "Maria",
      "Carlos",
      "Ana",
      "Lucas",
      "Paula",
      "Pedro",
      "Larissa",
      "Gabriel",
      "Juliana",
    ];
    const sobrenomes = [
      "Silva",
      "Souza",
      "Pereira",
      "Costa",
      "Santos",
      "Oliveira",
      "Ferreira",
      "Almeida",
    ];

    const gerarNomeCompleto = () => {
      const n = nomes[Math.floor(Math.random() * nomes.length)];
      const s = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${n} ${s}`;
    };

    const gerarTelefone = () => {
      const ddd = Math.floor(11 + Math.random() * 89);
      const parte1 = Math.floor(90000 + Math.random() * 10000);
      const parte2 = Math.floor(1000 + Math.random() * 9000);
      return `(${ddd}) ${parte1}-${parte2}`;
    };

    const gerarEmail = (nomeCompleto, dominio) => {
      const slug = nomeCompleto.toLowerCase().replace(/[^a-z]/g, "");
      const numero = Math.floor(Math.random() * 1000);
      return `${slug}${numero}@${dominio}`;
    };

    const fakeUserGenBtn = document.getElementById("fakeUserGenBtn");
    const fakeUserQtd = document.getElementById("fakeUserQtd");
    const fakeUserDomain = document.getElementById("fakeUserDomain");
    const fakeUserOutput = document.getElementById("fakeUserOutput");
    const fakeUserCopyBtn = document.getElementById("fakeUserCopyBtn");

    fakeUserGenBtn.addEventListener("click", () => {
      const qtd = parseInt(fakeUserQtd.value, 10);
      const dominio = fakeUserDomain.value.trim();

      if (!dominio || qtd <= 0) {
        fakeUserOutput.value = t("errorInput");
        return;
      }

      const lista = Array.from({ length: qtd }, () => {
        const nome = gerarNomeCompleto();
        const tel = gerarTelefone();
        const email = gerarEmail(nome, dominio);
        return `${nome} | ${email} | ${tel}`;
      });

      fakeUserOutput.value = lista.join("\n");
    });

    fakeUserCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(fakeUserOutput.value).then(() => {
        const original = fakeUserCopyBtn.innerText;
        fakeUserCopyBtn.innerText = tGlobal("copied");
        setTimeout(() => {
          fakeUserCopyBtn.innerText = tGlobal("copy");
        }, 1500);
      });
    });
  },
};

export default fake_name_email_phone_generator;
