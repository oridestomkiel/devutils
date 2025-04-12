import { loadToolI18n } from "../../utils/i18n-loader.js";

const word_character_line_sentence_counter = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
      <textarea 
        id="wcInput" 
        class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded mb-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white" 
        rows="6" 
        placeholder="${t("placeholder")}"
      ></textarea>

      <div class="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300 mt-2">
        <div>${t(
          "words"
        )}: <span id="wcWords" class="text-green-600 dark:text-green-400">0</span></div>
        <div>${t(
          "chars"
        )}: <span id="wcChars" class="text-green-600 dark:text-green-400">0</span></div>
        <div>${t(
          "chars_no_space"
        )}: <span id="wcCharsNoSpace" class="text-green-600 dark:text-green-400">0</span></div>
        <div>${t(
          "lines"
        )}: <span id="wcLines" class="text-green-600 dark:text-green-400">0</span></div>
        <div>${t(
          "sentences"
        )}: <span id="wcSentences" class="text-green-600 dark:text-green-400">0</span></div>
      </div>
    `;
  },

  init() {
    const input = document.getElementById("wcInput");
    const words = document.getElementById("wcWords");
    const chars = document.getElementById("wcChars");
    const charsNoSpace = document.getElementById("wcCharsNoSpace");
    const lines = document.getElementById("wcLines");
    const sentences = document.getElementById("wcSentences");

    const updateCount = () => {
      const text = input.value;

      words.innerText = text
        .trim()
        .split(/\s+/)
        .filter((w) => w).length;
      chars.innerText = text.length;
      charsNoSpace.innerText = text.replace(/\s/g, "").length;
      lines.innerText = text.split(/\n/).length;
      sentences.innerText = (text.match(/[\.\?!](\s|$)/g) || []).length;
    };

    input.addEventListener("input", updateCount);
  },
};

export default word_character_line_sentence_counter;
