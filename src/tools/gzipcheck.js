const gzipcheck = {
  title: "Verificador de GZIP",
  description:
    "Teste se o servidor de uma URL está com a compressão GZIP ativada. Veja os headers de resposta em tempo real.",
  tags: [
    "gzip",
    "http headers",
    "compressão",
    "verificador gzip",
    "otimização",
    "performance web",
  ],
  category: "Redes / HTTP",
  author: "DevUtils",
  hasApi: true,
  license: "MIT",
  version: "1.2.1",

  render: () => `
      <input
        id="gzipUrlInput"
        type="text"
        placeholder="https://exemplo.com/arquivo.js"
        class="w-full p-2 rounded bg-gray-700 text-white mb-2"
      />
      <div class="flex gap-2 mb-4">
        <button id="checkGzipBtn" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">
          Verificar GZIP
        </button>
        <button id="clearGzipBtn" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">
          Limpar
        </button>
      </div>
      <div
        id="gzipResult"
        class="hidden bg-gray-900 p-3 mt-2 rounded text-sm text-green-400 whitespace-pre-wrap min-h-[100px]"
      ></div>
    `,

  init: () => {
    const input = document.getElementById("gzipUrlInput");
    const result = document.getElementById("gzipResult");
    const clearBtn = document.getElementById("clearGzipBtn");

    document
      .getElementById("checkGzipBtn")
      .addEventListener("click", async () => {
        const url = input.value.trim();
        if (!url) {
          result.textContent = "Informe uma URL válida.";
          result.classList.remove("hidden");
          return;
        }

        result.textContent = "Verificando...";
        result.classList.remove("hidden");

        try {
          const res = await fetch(
            `https://devutils.zmohouse.com.br/api/gzip-check.json?url=${encodeURIComponent(
              url
            )}`
          );
          const data = await res.json();

          if (data.error) {
            result.textContent = `Erro: ${data.error}`;
            return;
          }

          const statusMsg = data.gzip
            ? "✅ GZIP está ATIVADO — texto está sendo compactado."
            : "❌ GZIP NÃO está ativado — resposta não compactada.";

          result.textContent = `${statusMsg}\n\nCabeçalhos HTTP:\n${data.headers.join(
            "\n"
          )}`;
        } catch (err) {
          result.textContent = `Erro ao testar: ${err.message}`;
        }
      });

    clearBtn.addEventListener("click", () => {
      result.textContent = "";
      result.classList.add("hidden");
      input.value = "";
    });
  },
};

export default gzipcheck;
