const informacoesDoSistema = {
  title: "Informações do Sistema",
  description:
    "Exibe detalhes sobre o ambiente do usuário, incluindo sistema operacional, navegador e outras informações relevantes.",
  tags: ["sistema operacional", "navegador", "informações do usuário"],
  category: "Utilitários",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <div class="p-4 rounded bg-gray-800 text-white text-sm space-y-4">
        <h2 class="text-lg font-semibold">Meu Sistema Operacional</h2>
        <div class="space-y-2">
          <div>
            <label class="block text-sm mb-1">Sistema Operacional</label>
            <input id="outSistemaOperacional" readonly class="w-full p-2 bg-gray-700 text-green-400 rounded" />
          </div>
          <div>
            <label class="block text-sm mb-1">Resolução de Tela</label>
            <input id="outResolucaoTela" readonly class="w-full p-2 bg-gray-700 text-green-400 rounded" />
          </div>
        </div>
  
        <h2 class="text-lg font-semibold mt-4">Meu Navegador</h2>
        <div class="space-y-2">
          <div>
            <label class="block text-sm mb-1">Navegador</label>
            <input id="outNavegador" readonly class="w-full p-2 bg-gray-700 text-green-400 rounded" />
          </div>
          <div>
            <label class="block text-sm mb-1">Versão</label>
            <input id="outVersaoNavegador" readonly class="w-full p-2 bg-gray-700 text-green-400 rounded" />
          </div>
        </div>
      </div>
    `,

  init: () => {
    const sistemaOperacionalEl = document.getElementById(
      "outSistemaOperacional"
    );
    const resolucaoTelaEl = document.getElementById("outResolucaoTela");
    const navegadorEl = document.getElementById("outNavegador");
    const versaoNavegadorEl = document.getElementById("outVersaoNavegador");

    const plataforma = navigator.platform;
    sistemaOperacionalEl.value = plataforma;

    const larguraTela = window.screen.width;
    const alturaTela = window.screen.height;
    resolucaoTelaEl.value = `${larguraTela}x${alturaTela}`;

    const userAgent = navigator.userAgent;
    let navegador = "Desconhecido";
    let versao = "Desconhecida";

    if (userAgent.indexOf("Firefox") > -1) {
      navegador = "Mozilla Firefox";
      versao = userAgent.match(/Firefox\/([\d.]+)/)[1];
    } else if (userAgent.indexOf("Chrome") > -1) {
      navegador = "Google Chrome";
      versao = userAgent.match(/Chrome\/([\d.]+)/)[1];
    } else if (userAgent.indexOf("Safari") > -1) {
      navegador = "Safari";
      versao = userAgent.match(/Version\/([\d.]+)/)[1];
    } else if (
      userAgent.indexOf("MSIE") > -1 ||
      userAgent.indexOf("Trident/") > -1
    ) {
      navegador = "Internet Explorer";
      versao = userAgent.match(/(MSIE |rv:)([\d.]+)/)[2];
    }

    navegadorEl.value = navegador;
    versaoNavegadorEl.value = versao;
  },
};

export default informacoesDoSistema;
