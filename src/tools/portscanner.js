const portscanner = {
  title: "Verificador de Portas Abertas",
  description:
    "Escaneie portas específicas ou perfis prontos de um servidor remoto para detectar serviços ativos (HTTP, SSH, bancos de dados, etc).",
  tags: [
    "port scanner",
    "verificador de portas",
    "rede",
    "segurança",
    "http",
    "ssh",
    "mysql",
  ],
  category: "Rede",
  author: "DevUtils",
  hasApi: true,
  license: "MIT",
  version: "1.2.0",

  render: () => `
        <input
          id="portScanHost"
          type="text"
          placeholder="ex: scanme.nmap.org"
          class="w-full p-2 rounded bg-gray-700 text-white mb-2"
        />
    
        <div class="flex flex-wrap gap-2 mb-2">
          <button data-ports="80,443,8080" class="profileBtn bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm">🌐 Web</button>
          <button data-ports="21,22,23,25,110,139,445" class="profileBtn bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm">🔒 Segurança</button>
          <button data-ports="1433,3306,5432,27017" class="profileBtn bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm">💾 Banco de Dados</button>
        </div>
    
        <input
          id="portScanList"
          type="text"
          placeholder="Portas (ex: 22,80,443)"
          class="w-full p-2 rounded bg-gray-700 text-white mb-2"
        />
    
        <div class="flex gap-2 mb-4">
          <button id="scanPortBtn" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">
            Escanear
          </button>
          <button id="clearPortScanBtn" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">
            Limpar
          </button>
        </div>
    
        <div
          id="portScanResult"
          class="hidden bg-gray-900 p-3 mt-2 rounded text-sm text-green-400 whitespace-pre-wrap"
        ></div>
      `,

  init: () => {
    const hostInput = document.getElementById("portScanHost");
    const portInput = document.getElementById("portScanList");
    const resultBox = document.getElementById("portScanResult");

    document.querySelectorAll(".profileBtn").forEach((btn) => {
      btn.addEventListener("click", () => {
        portInput.value = btn.getAttribute("data-ports");
      });
    });

    document
      .getElementById("scanPortBtn")
      .addEventListener("click", async () => {
        const host = hostInput.value.trim();
        const ports = portInput.value.trim();

        if (!host || !ports) {
          resultBox.textContent = "Preencha o host e pelo menos uma porta.";
          resultBox.classList.remove("hidden");
          return;
        }

        resultBox.textContent = "Escaneando...";
        resultBox.classList.remove("hidden");

        try {
          const res = await fetch(
            `https://devutils.zmohouse.com.br/api/scan-port.json?host=${encodeURIComponent(
              host
            )}&ports=${encodeURIComponent(ports)}`
          );
          const data = await res.json();

          if (data.error) {
            resultBox.textContent = `Erro: ${data.error}`;
            return;
          }

          let html = `<p class="mb-2 text-green-300">Host: <strong>${data.host}</strong></p>`;
          html += `<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">`;

          data.resultado.forEach(({ porta, status }) => {
            const badge =
              status === "aberta"
                ? `<div class="bg-green-700 px-2 py-1 rounded text-white text-center">✅ Porta ${porta} Aberta</div>`
                : `<div class="bg-red-700 px-2 py-1 rounded text-white text-center">❌ Porta ${porta} Fechada</div>`;
            html += badge;
          });

          html += "</div>";
          resultBox.innerHTML = html;
        } catch (err) {
          resultBox.textContent = `Erro ao escanear: ${err.message}`;
        }
      });

    document
      .getElementById("clearPortScanBtn")
      .addEventListener("click", () => {
        hostInput.value = "";
        portInput.value = "";
        resultBox.textContent = "";
        resultBox.classList.add("hidden");
      });
  },
};

export default portscanner;
