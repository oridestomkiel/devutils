import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const code_chat_with_deepseek = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "en");
  },
  author: "DevUtils",
  hasApi: true,
  license: "MIT",
  version: "1.1.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
  <div class="mb-4">
    <textarea
      id="deepseekPrompt"
      class="w-full p-2 rounded text-sm font-mono bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
      rows="4"
      placeholder="${t("placeholder.input")}"
    ></textarea>
  </div>

  <div class="flex gap-2 mb-4">
    <button
      id="deepseekSendBtn"
      class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm text-white"
    >
      ${t("send")}
    </button>
    <button
      id="deepseekClearBtn"
      class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded text-sm text-gray-900 dark:text-white hidden"
    >
      ${t("clear")}
    </button>
  </div>

  <pre
    id="deepseekOutput"
    class="bg-gray-100 dark:bg-gray-900 text-green-700 dark:text-green-400 p-4 rounded text-sm whitespace-pre-wrap break-words hidden border border-gray-300 dark:border-gray-700"
  ></pre>
    `;
  },

  init() {
    const promptEl = document.getElementById("deepseekPrompt");
    const sendBtn = document.getElementById("deepseekSendBtn");
    const clearBtn = document.getElementById("deepseekClearBtn");
    const outputEl = document.getElementById("deepseekOutput");

    const sendPrompt = async () => {
      const prompt = promptEl.value.trim();
      if (!prompt) return;

      outputEl.textContent = "";
      outputEl.classList.remove("hidden");
      clearBtn.classList.remove("hidden");

      const res = await fetch("https://services.devutils.tools/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        outputEl.textContent += decoder.decode(value, { stream: true });
      }
    };

    const clearAll = () => {
      promptEl.value = "";
      outputEl.classList.add("hidden");
      outputEl.textContent = "";
      clearBtn.classList.add("hidden");
    };

    sendBtn.addEventListener("click", sendPrompt);
    clearBtn.addEventListener("click", clearAll);
  },
};

export default code_chat_with_deepseek;
