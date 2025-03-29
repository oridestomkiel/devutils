const qrcodegen = {
  title: "Gerador de QR Code Avançado",
  description:
    "Crie códigos QR personalizáveis com logotipos, cores e tamanhos específicos. Ideal para campanhas, marketing e compartilhamento de dados.",
  tags: [
    "qr code",
    "gerador de qr code",
    "qr code avançado",
    "qr code com logo",
    "marketing de qr",
    "qrcode customizado",
    "qrcode generator",
    "compartilhamento de dados",
  ],
  category: "Geradores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",
  render: () => `
    <textarea id="qrInput" class="w-full p-2 bg-gray-700 rounded mb-2 text-white" rows="3" placeholder="Texto ou URL para gerar QR"></textarea>
    
    <div class="grid grid-cols-2 gap-2 mb-2">
      <div>
        <label class="block text-sm text-gray-300 mb-1">Tamanho (px)</label>
        <input type="number" id="qrSize" value="256" class="w-full p-2 bg-gray-700 rounded text-white" />
      </div>
      <div>
        <label class="block text-sm text-gray-300 mb-1">Margem</label>
        <input type="number" id="qrMargin" value="2" class="w-full p-2 bg-gray-700 rounded text-white" />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2 mb-2">
      <div>
        <label class="block text-sm text-gray-300 mb-1">Cor do traço</label>
        <input type="color" id="qrDark" value="#000000" class="w-full h-10 rounded" />
      </div>
      <div>
        <label class="block text-sm text-gray-300 mb-1">Cor do fundo</label>
        <input type="color" id="qrLight" value="#ffffff" class="w-full h-10 rounded" />
      </div>
    </div>

    <label class="block text-sm text-gray-300 mb-1">Logo central (URL da imagem)</label>
    <input id="qrLogoUrl" class="w-full p-2 bg-gray-700 rounded text-white mb-3" placeholder="https://exemplo.com/logo.png" />

    <div class="flex flex-wrap gap-2 mb-4">
      <button id="qrGenerateBtn" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-1 rounded">Gerar QR</button>
      <button id="qrDownloadPng" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded">Download PNG</button>
      <button id="qrDownloadSvg" class="bg-yellow-600 hover:bg-yellow-700 px-4 py-1 rounded">Exportar SVG</button>
    </div>

    <div class="relative w-fit" id="qrContainer"></div>
  `,
  init: () => {
    const loadScript = (src, callback) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = callback;
      document.head.appendChild(script);
    };

    loadScript("https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js", () => {
      loadScript(
        "https://cdn.jsdelivr.net/npm/qr-code-styling@1.5.0/lib/qr-code-styling.js",
        setup
      );
    });

    function setup() {
      let qr = null;

      const generate = () => {
        const text = document.getElementById("qrInput").value;
        const size = parseInt(document.getElementById("qrSize").value);
        const colorDark = document.getElementById("qrDark").value;
        const colorLight = document.getElementById("qrLight").value;
        const logoUrl = document.getElementById("qrLogoUrl").value;
        const container = document.getElementById("qrContainer");

        container.innerHTML = "";

        qr = new QRCodeStyling({
          width: size,
          height: size,
          data: text,
          image: logoUrl || undefined,
          margin: 2,
          dotsOptions: {
            color: colorDark,
            type: "square",
          },
          backgroundOptions: {
            color: colorLight,
          },
          imageOptions: {
            crossOrigin: "anonymous",
            margin: 4,
          },
        });

        qr.append(container);
      };

      document
        .getElementById("qrGenerateBtn")
        .addEventListener("click", generate);

      document.getElementById("qrDownloadPng").addEventListener("click", () => {
        if (qr) qr.download({ extension: "png" });
      });

      document.getElementById("qrDownloadSvg").addEventListener("click", () => {
        if (qr) qr.download({ extension: "svg" });
      });
    }
  },
};
export default qrcodegen;
