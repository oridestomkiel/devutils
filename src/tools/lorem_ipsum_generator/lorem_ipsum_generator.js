import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const lorem_ipsum_generator = {
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
    <div class="flex flex-col gap-2 mb-2">
      <input
        id="loremCount"
        type="number"
        min="1"
        max="100"
        value="5"
        class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white"
      />

      <select
        id="loremType"
        class="w-full p-2 bg-white border border-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-white"
      >
        <option value="paragraphs">${t("paragraphs")}</option>
        <option value="words">${t("words")}</option>
        <option value="bytes">${t("bytes")}</option>
        <option value="lists">${t("lists")}</option>
      </select>

      <div id="loremStartContainer" class="text-sm text-gray-800 flex gap-2 items-center dark:text-white">
        <input type="checkbox" id="loremStart" checked />
        <label for="loremStart">${t("startWithLorem")}</label>
      </div>
    </div>

    <button
      id="loremBtn"
      class="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-white dark:bg-yellow-500 dark:hover:bg-yellow-600"
    >
      ${tGlobal("generate")}
    </button>

    <div class="relative mt-2">
      <pre
        id="loremOutput"
        class="text-green-600 bg-white border border-gray-300 whitespace-pre-wrap break-words p-6 pr-16 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
      ></pre>

      <button
        id="copyLoremBtn"
        class="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white dark:bg-gray-500 dark:hover:bg-gray-400"
      >
        ${tGlobal("copy")}
      </button>

      <span
        id="copiedLoremMsg"
        class="absolute top-2 right-2 text-green-600 px-2 py-1 hidden dark:text-green-400"
      >
        ${tGlobal("copied")}
      </span>
    </div>
    `;
  },

  async init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const output = document.getElementById("loremOutput");
    const copyBtn = document.getElementById("copyLoremBtn");
    const copiedMsg = document.getElementById("copiedLoremMsg");
    const btn = document.getElementById("loremBtn");

    let fullText = "";

    try {
      const res = await fetch("/data/lorem.json");
      const json = await res.json();
      fullText = json.text || "";
    } catch (err) {
      output.innerText = t("error.loading");
      btn.disabled = true;
      return;
    }

    const typeSelect = document.getElementById("loremType");
    const startContainer = document.getElementById("loremStartContainer");

    typeSelect.addEventListener("change", () => {
      const isParagraph = typeSelect.value === "paragraphs";
      startContainer.style.display = isParagraph ? "flex" : "none";
      output.innerText = "";
      if (!isParagraph) {
        document.getElementById("loremStart").checked = false;
      }
    });

    startContainer.style.display =
      typeSelect.value === "paragraphs" ? "flex" : "none";

    btn.addEventListener("click", () => {
      const count = parseInt(document.getElementById("loremCount").value, 10);
      const type = document.getElementById("loremType").value;
      const start = document.getElementById("loremStart").checked;

      const loremStart = t("loremIntro");
      const cleanText = fullText.replace(/\s+/g, " ").trim();
      const paragraphs = fullText.split(/\n+/).filter(Boolean);
      const words = cleanText.split(" ");

      const randomPick = (arr, n) => {
        const copy = [...arr];
        const res = [];
        while (res.length < n && copy.length) {
          const i = Math.floor(Math.random() * copy.length);
          res.push(copy.splice(i, 1)[0]);
        }
        return res;
      };

      let result = "";

      switch (type) {
        case "paragraphs":
          result = randomPick(paragraphs, count).join("\n\n");
          break;
        case "words":
          result = randomPick(words, count).join(" ");
          break;
        case "bytes":
          const startIndex = Math.floor(
            Math.random() * Math.max(1, cleanText.length - count)
          );
          result = cleanText.slice(startIndex, startIndex + count);
          break;
        case "lists":
          result = randomPick(words, count)
            .map((w) => `• ${w}`)
            .join("\n");
          break;
      }

      if (start && !result.startsWith("Lorem ipsum")) {
        result = `${loremStart}\n\n${result}`;
      }

      output.innerText = result;
    });

    copyBtn.addEventListener("click", () => {
      const text = output.innerText;
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        copyBtn.classList.add("hidden");
        copiedMsg.classList.remove("hidden");

        setTimeout(() => {
          copiedMsg.classList.add("hidden");
          copyBtn.classList.remove("hidden");
        }, 2000);
      });
    });
  },
};

export default lorem_ipsum_generator;
