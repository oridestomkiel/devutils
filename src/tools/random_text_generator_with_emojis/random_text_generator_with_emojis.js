import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const random_text_generator_with_emojis = {
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
      <div>
        <label class="block text-sm text-gray-900 dark:text-gray-300 mb-1">${t(
          "paragraphs"
        )}</label>
        <input
          type="number"
          id="emojiIpsumCount"
          value="2"
          class="w-full p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded"
        />
      </div>
      <div>
        <label class="block text-sm text-gray-900 dark:text-gray-300 mb-1">${t(
          "style"
        )}</label>
        <select
          id="emojiIpsumStyle"
          class="w-full p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded"
        >
          <option value="casual">${t("casual")}</option>
          <option value="tech">${t("tech")}</option>
          <option value="funny">${t("funny")}</option>
          <option value="mix">${t("mix")}</option>
        </select>
      </div>
    </div>

    <button
      id="emojiIpsumGen"
      class="bg-pink-600 hover:bg-pink-700 px-4 py-1 rounded text-white"
    >
      ${t("generate")}
    </button>

    <div class="mt-4 flex gap-2">
      <textarea
        id="emojiIpsumOutput"
        rows="6"
        readonly
        class="p-2 bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 border border-gray-300 dark:border-gray-700 rounded w-full text-sm"
        placeholder="${t("placeholder")}"
      ></textarea>
      <button
        id="emojiIpsumCopy"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white self-start"
      >
        ${tGlobal("copy")}
      </button>
    </div>
    `;
  },

  init() {
    const presets = {
      casual: [
        "Lorem ipsum 😎 dolor sit amet, consectetur ✨ adipiscing elit 🥐.",
        "Pellentesque 🍕 habitant morbi 🍟 tristique senectus 😴.",
        "Vivamus commodo 🚀 massa ut ultricies 💼 fermentum 🛴.",
        "Aenean 🎯 sed nisi 🥲 sed justo 🔥 fringilla dapibus.",
      ],
      tech: [
        "Deploy 🚀 na main sem testar, sucesso garantido 🧨.",
        "Meu bug, minhas regras 🐞🧑‍💻.",
        "Refatorando o caos em TypeScript 🤯.",
        "Stack overflow salvou mais uma vez 🙏.",
        "const vida = { dev: true } 😵‍💫",
      ],
      funny: [
        "Café ☕ é o compilador da alma 🧠.",
        "Já dizia Confúcio: 'console.log ou nada' 🧘‍♂️.",
        "JS é tipo feitiçaria moderna 🧙‍♀️.",
        "function namoral() { return '🔥' }",
        "While(true) → burnout garantido 😬",
      ],
      mix: [],
    };
    presets.mix = [...presets.casual, ...presets.tech, ...presets.funny];

    const genBtn = document.getElementById("emojiIpsumGen");
    const countEl = document.getElementById("emojiIpsumCount");
    const styleEl = document.getElementById("emojiIpsumStyle");
    const outputEl = document.getElementById("emojiIpsumOutput");
    const copyBtn = document.getElementById("emojiIpsumCopy");

    genBtn.addEventListener("click", () => {
      const count = parseInt(countEl.value, 10);
      const style = styleEl.value;
      const source = presets[style] || presets.mix;
      let result = "";
      for (let i = 0; i < count; i++) {
        const shuffled = [...source].sort(() => 0.5 - Math.random());
        const p = shuffled.slice(0, Math.ceil(Math.random() * 3 + 2)).join(" ");
        result += p + "\n\n";
      }
      outputEl.value = result.trim();
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(outputEl.value).then(() => {
        const originalText = copyBtn.innerText;
        copyBtn.innerText = tGlobal("copied");
        setTimeout(() => {
          copyBtn.innerText = tGlobal("copy");
        }, 1500);
      });
    });
  },
};

export default random_text_generator_with_emojis;
