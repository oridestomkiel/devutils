const ping = {
  title: "Ping Online",
  description:
    "Envie pacotes de teste para um domínio ou IP e veja se o host está acessível. Ideal para diagnósticos de rede e latência.",
  tags: [
    "ping online",
    "teste de rede",
    "latência",
    "verificar conexão",
    "ping servidor",
    "ping dns",
    "teste ip",
  ],
  category: "Redes / HTTP",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
      <div class="space-y-4">
        <div>
          <label for="pingHost" class="block mb-1 text-sm">Digite o domínio ou IP:</label>
          <input
            id="pingHost"
            type="text"
            placeholder="ex: google.com"
            class="w-full p-2 bg-gray-700 text-white rounded"
          />
        </div>
  
        <button
          id="pingBtn"
          class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
        >
          Enviar Ping
        </button>
  
        <div id="pingResultArea" class="hidden">
          <label class="block mt-4 mb-1 text-sm">Resultado:</label>
          <textarea
            id="pingOutput"
            rows="8"
            readonly
            class="w-full p-2 bg-gray-800 text-green-400 font-mono rounded"
          >Aguarde...</textarea>
          <button
            id="pingCopyBtn"
            class="mt-2 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
          >
            Copiar
          </button>
        </div>
      </div>
    `,
  init: () => {
    const hostInput = document.getElementById("pingHost");
    const pingBtn = document.getElementById("pingBtn");
    const resultArea = document.getElementById("pingResultArea");
    const pingOutput = document.getElementById("pingOutput");
    const copyBtn = document.getElementById("pingCopyBtn");

    pingBtn.addEventListener("click", () => {
      const host = hostInput.value.trim();
      if (!host) {
        alert("Digite um domínio ou IP para pingar.");
        return;
      }

      pingBtn.textContent = "Pingando...";
      pingBtn.disabled = true;
      pingOutput.value = "Aguarde...";
      resultArea.classList.remove("hidden");

      fetch(
        `https://devutils.zmohouse.com.br/api/ping.json?host=${encodeURIComponent(
          host
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            pingOutput.value = data.raw.join("\n");
          } else {
            pingOutput.value = "Erro: " + (data.message || "Host inacessível");
          }
        })
        .catch(() => {
          pingOutput.value = "Erro ao realizar ping.";
        })
        .finally(() => {
          pingBtn.textContent = "Enviar Ping";
          pingBtn.disabled = false;
        });
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(pingOutput.value).then(() => {
        copyBtn.textContent = "Copiado!";
        setTimeout(() => (copyBtn.textContent = "Copiar"), 1500);
      });
    });
  },
};

export default ping;
