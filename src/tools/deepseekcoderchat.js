const deepseekcoderchat = {
  title: "Chat de Código com DeepSeek",
  description:
    "Converse com um modelo local especializado em programação. Ideal para dúvidas rápidas e geração de código.",
  tags: ["chat", "programação", "deepseek", "assistente", "código"],
  category: "Assistentes",
  author: "DevUtils",
  hasApi: true,
  license: "MIT",
  version: "1.1.0",

  render: () => `
      <div class="mb-4">
        <textarea id="deepseekPrompt" class="w-full p-2 bg-gray-700 text-white rounded text-sm font-mono" rows="4" placeholder="Digite sua dúvida de programação aqui..."></textarea>
      </div>
  
      <div class="flex gap-2 mb-4">
        <button id="deepseekSendBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm">Enviar</button>
        <button id="deepseekClearBtn" class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm hidden">Limpar</button>
      </div>
  
      <pre id="deepseekOutput" class="bg-gray-900 text-green-400 p-4 rounded text-sm whitespace-pre-wrap break-words hidden"></pre>
    `,

  init: () => {
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

export default deepseekcoderchat;
