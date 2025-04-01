const bcryptTool = {
  title: "Bcrypt: Gerar e Verificar Hash",
  description:
    "Gere hashes seguros com bcrypt e valide se um texto corresponde a um hash existente. Tudo no navegador, sem enviar dados para servidores.",
  tags: [
    "bcrypt",
    "hash",
    "senha",
    "segurança",
    "criptografia",
    "validação",
    "verificação",
  ],
  category: "Geradores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",

  render: () => `
      <div class="p-4 rounded bg-gray-800 text-white text-sm space-y-4">
        <div id="loadingBcrypt" class="text-center py-8">
          <p class="text-yellow-400">Carregando biblioteca de criptografia...</p>
          <p class="text-xs text-gray-400 mt-2">Aguarde enquanto carregamos os recursos necessários</p>
        </div>
  
        <div id="mainContent" class="hidden">
          <div class="space-y-6">
            <!-- Gerador de Hash -->
            <div>
              <h2 class="text-lg font-bold mb-2">Gerar Hash Bcrypt</h2>
              <div class="space-y-4">
                <div>
                  <label class="block mb-1">Texto para Hash:</label>
                  <input id="textoParaHash" type="text" class="w-full p-2 rounded bg-gray-700 text-white" placeholder="Digite o texto que deseja transformar em hash">
                </div>
                <div>
                  <label class="block mb-1">Rodadas (Fator de Custo):</label>
                  <div class="flex items-center gap-2">
                    <input id="numeroRodadas" type="number" min="4" max="31" value="12" class="w-20 p-2 rounded bg-gray-700 text-white">
                    <div class="flex gap-1">
                      <button id="btnDiminuir" class="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded">-</button>
                      <button id="btnAumentar" class="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded">+</button>
                    </div>
                  </div>
                  <p id="dicaRodadas" class="text-xs mt-1 text-gray-400">Segurança alta - recomendado para produção</p>
                </div>
                <button id="btnGerarHash" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm w-full">Gerar Hash</button>
              </div>
              <div id="resultadoContainer" class="hidden">
                <div class="mt-4 p-4 bg-gray-900 rounded">
                  <textarea id="hashResultado" readonly class="w-full p-2 rounded bg-gray-800 text-green-400 font-mono mb-2" rows="2"></textarea>
                  <button id="btnCopiarHash" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm">Copiar Hash</button>
                  <p id="infoRodadas" class="text-xs mt-2 text-gray-400"></p>
                </div>
              </div>
            </div>
  
            <!-- Verificador de Hash -->
            <div class="border-t border-gray-700 pt-4">
              <h2 class="text-lg font-bold mb-2">Verificar Hash</h2>
              <div class="space-y-4">
                <div>
                  <label class="block mb-1">Texto original:</label>
                  <input id="textoOriginal" type="text" class="w-full p-2 rounded bg-gray-700 text-white" placeholder="Texto plano">
                </div>
                <div>
                  <label class="block mb-1">Hash Bcrypt:</label>
                  <input id="hashParaVerificar" type="text" class="w-full p-2 rounded bg-gray-700 text-white font-mono" placeholder="Cole aqui o hash para validar">
                </div>
                <button id="btnVerificarHash" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm w-full">Verificar Hash</button>
                <p id="resultadoVerificacao" class="text-sm text-center mt-2"></p>
              </div>
            </div>
          </div>
        </div>
  
        <div id="errorContainer" class="hidden text-center py-8">
          <p class="text-red-400">Erro ao carregar a biblioteca necessária</p>
          <p class="text-xs text-gray-400 mt-2" id="errorDetail"></p>
          <button id="retryButton" class="mt-4 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm">Tentar novamente</button>
        </div>
      </div>
    `,

  init: () => {
    const loadingEl = document.getElementById("loadingBcrypt");
    const mainEl = document.getElementById("mainContent");
    const errorEl = document.getElementById("errorContainer");
    const retryBtn = document.getElementById("retryButton");
    const errorDetail = document.getElementById("errorDetail");

    const loadBcrypt = () => {
      loadingEl.classList.remove("hidden");
      mainEl.classList.add("hidden");
      errorEl.classList.add("hidden");

      const existingScript = document.querySelector('script[src*="bcryptjs"]');
      if (existingScript) existingScript.remove();

      const script = document.createElement("script");
      script.src = "https://unpkg.com/bcryptjs@2.4.3/dist/bcrypt.min.js";
      script.async = true;

      script.onload = () => {
        const bcrypt = window.dcodeIO?.bcrypt;
        if (!bcrypt || typeof bcrypt.hashSync !== "function") {
          loadingEl.classList.add("hidden");
          errorDetail.textContent =
            "A biblioteca foi carregada, mas bcrypt não ficou disponível no escopo global.";
          errorEl.classList.remove("hidden");
          return;
        }
        loadingEl.classList.add("hidden");
        mainEl.classList.remove("hidden");
        initBcryptUI(bcrypt);
      };

      script.onerror = () => {
        loadingEl.classList.add("hidden");
        errorDetail.textContent =
          "Erro ao carregar a biblioteca externa. Verifique sua conexão.";
        errorEl.classList.remove("hidden");
      };

      document.head.appendChild(script);
    };

    retryBtn.addEventListener("click", loadBcrypt);
    loadBcrypt();

    function initBcryptUI(bcrypt) {
      const input = document.getElementById("textoParaHash");
      const rounds = document.getElementById("numeroRodadas");
      const btnGen = document.getElementById("btnGerarHash");
      const btnCopy = document.getElementById("btnCopiarHash");
      const btnInc = document.getElementById("btnAumentar");
      const btnDec = document.getElementById("btnDiminuir");
      const output = document.getElementById("hashResultado");
      const container = document.getElementById("resultadoContainer");
      const info = document.getElementById("infoRodadas");
      const dica = document.getElementById("dicaRodadas");

      const inputTextoOriginal = document.getElementById("textoOriginal");
      const inputHash = document.getElementById("hashParaVerificar");
      const btnVerificar = document.getElementById("btnVerificarHash");
      const resultadoVerificacao = document.getElementById(
        "resultadoVerificacao"
      );

      const updateDica = () => {
        const r = parseInt(rounds.value);
        if (r < 8) {
          dica.textContent = "Segurança baixa - apenas para testes";
          dica.className = "text-xs mt-1 text-yellow-400";
        } else if (r < 12) {
          dica.textContent = "Segurança média - adequado para desenvolvimento";
          dica.className = "text-xs mt-1 text-blue-400";
        } else {
          dica.textContent = "Segurança alta - recomendado para produção";
          dica.className = "text-xs mt-1 text-green-400";
        }
      };

      btnDec.onclick = () => {
        const v = parseInt(rounds.value);
        if (v > 4) rounds.value = v - 1;
        updateDica();
      };

      btnInc.onclick = () => {
        const v = parseInt(rounds.value);
        if (v < 31) rounds.value = v + 1;
        updateDica();
      };

      rounds.onchange = updateDica;
      updateDica();

      btnGen.onclick = () => {
        const texto = input.value.trim();
        const saltRounds = parseInt(rounds.value);

        inputTextoOriginal.value = "";
        inputHash.value = "";
        document.getElementById("resultadoVerificacao").classList.add("hidden");

        if (!texto) {
          alert("Digite algo para gerar o hash.");
          return;
        }

        btnGen.disabled = true;
        btnGen.textContent = "Gerando...";

        setTimeout(() => {
          try {
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(texto, salt);
            output.value = hash;
            info.textContent = `Gerado com ${saltRounds} rodadas.`;
            container.classList.remove("hidden");

            inputTextoOriginal.value = texto;
            inputHash.value = hash;
            btnVerificar.click();
          } catch (err) {
            alert("Erro ao gerar hash. Tente novamente.");
          } finally {
            btnGen.disabled = false;
            btnGen.textContent = "Gerar Hash";
          }
        }, 50);
      };

      btnCopy.onclick = () => {
        navigator.clipboard.writeText(output.value).then(() => {
          btnCopy.textContent = "Copiado!";
          setTimeout(() => (btnCopy.textContent = "Copiar Hash"), 1500);
        });
      };

      btnVerificar.onclick = () => {
        const original = inputTextoOriginal.value.trim();
        const hash = inputHash.value.trim();

        if (!original || !hash) {
          alert("Preencha os dois campos para verificar.");
          return;
        }

        try {
          const match = bcrypt.compareSync(original, hash);
          resultadoVerificacao.textContent = match
            ? "✓ Hash corresponde ao texto."
            : "✗ Hash não corresponde.";
          resultadoVerificacao.className = match
            ? "text-green-400 text-sm text-center mt-2"
            : "text-red-400 text-sm text-center mt-2";
        } catch (err) {
          resultadoVerificacao.textContent = "Erro ao verificar hash.";
          resultadoVerificacao.className =
            "text-red-400 text-sm text-center mt-2";
        }
      };
    }
  },
};

export default bcryptTool;
