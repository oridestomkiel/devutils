import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const hello_world_in_multiple_languages = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.2.0",

  render() {
    const t = (k) => this.i18n?.[k] ?? k;

    return `
      <select id="helloLangSelect" class="w-full p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded mb-2">
        <option value="" disabled selected>${t("selectPlaceholder")}</option>
      </select>

      <textarea
        id="helloOutput"
        class="w-full p-2 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-700 text-gray-800 dark:text-green-400 rounded mb-2"
        rows="8"
        readonly
      ></textarea>

      <div class="flex justify-end">
        <button id="helloCopyBtn" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-2 py-1 rounded">
          ${tGlobal("copy")}
        </button>
      </div>
    `;
  },

  init: async () => {
    const select = document.getElementById("helloLangSelect");
    const output = document.getElementById("helloOutput");
    const copyBtn = document.getElementById("helloCopyBtn");
    let langs = {};

    try {
      const response = await fetch("/data/helloworld.json");
      langs = await response.json();
    } catch (err) {
      console.error("Erro ao carregar JSON:", err);
      return;
    }

    for (const lang of Object.keys(langs).sort()) {
      const option = document.createElement("option");
      option.value = lang;
      option.textContent = lang;
      select.appendChild(option);
    }

    select.addEventListener("change", () => {
      const lang = select.value;
      const code = langs[lang];

      if (!code) return;

      output.value = "";
      let i = 0;
      const interval = setInterval(() => {
        if (i < code.length) {
          output.value += code[i++];
        } else {
          clearInterval(interval);
        }
      }, 10);
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(output.value).then(() => {
        const original = copyBtn.innerText;
        copyBtn.innerText = tGlobal("copied");
        setTimeout(() => (copyBtn.innerText = original), 1500);
      });
    });
  },
};

export default hello_world_in_multiple_languages;
