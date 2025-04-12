import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const markdown_to_html_tags = {
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
    <textarea 
      id="mdRawInput" 
      class="w-full p-2 bg-white border border-gray-300 rounded mb-2 text-gray-800 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400" 
      rows="6" 
      placeholder="${t("placeholder")}"
    ></textarea>

    <button 
      id="mdRawRenderBtn" 
      class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded mb-2 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
    >
      ${tGlobal("generate")}
    </button>

    <div class="relative">
      <pre 
        id="mdRawOutput" 
        class="bg-white border border-gray-300 text-green-600 rounded p-4 max-h-96 overflow-y-auto text-sm whitespace-pre-wrap break-words pr-16 dark:bg-gray-800 dark:border-gray-700 dark:text-green-400 p-6"
      ></pre>

      <button 
        id="copyMdRawBtn" 
        class="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white dark:bg-gray-500 dark:hover:bg-gray-400"
      >
        ${tGlobal("copy")}
      </button>

      <span 
        id="copiedMdRawMsg" 
        class="absolute top-2 right-2 text-green-600 px-2 py-1 hidden dark:text-green-400"
      >
        ${tGlobal("copied")}
      </span>
    </div>
    `;
  },

  init() {
    const input = document.getElementById("mdRawInput");
    const output = document.getElementById("mdRawOutput");
    const btn = document.getElementById("mdRawRenderBtn");
    const copyBtn = document.getElementById("copyMdRawBtn");
    const copiedMsg = document.getElementById("copiedMdRawMsg");

    const renderMarkdownToHtml = () => {
      const md = input.value;
      const html = window.marked.parse(md);
      output.innerText = html;
    };

    const setupCopy = () => {
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
    };

    const setup = () => {
      btn.addEventListener("click", renderMarkdownToHtml);
      setupCopy();
    };

    if (typeof marked === "undefined") {
      const script = document.createElement("script");
      script.src = "./vendor/marked.min.js";
      script.onload = setup;
      document.head.appendChild(script);
    } else {
      setup();
    }
  },
};

export default markdown_to_html_tags;
