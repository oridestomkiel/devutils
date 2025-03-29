const imageplaceholder = {
  title: "Gerador de Imagem Placeholder",
  description:
    "Gere imagens personalizadas para usar como placeholder em testes e layouts. Escolha cores, texto e dimensões livremente.",
  tags: ["placeholder", "imagem", "gerador", "teste", "lorem", "pixel"],
  category: "Imagens",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <div class="p-4 rounded bg-gray-800 text-white text-sm space-y-4">
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label class="block mb-1">Largura</label>
            <input type="number" id="imgWidth" value="320" class="w-full p-2 bg-gray-700 rounded" />
          </div>
          <div>
            <label class="block mb-1">Altura</label>
            <input type="number" id="imgHeight" value="240" class="w-full p-2 bg-gray-700 rounded" />
          </div>
          <div>
            <label class="block mb-1">Tamanho do texto</label>
            <input type="number" id="fontSize" value="20" class="w-full p-2 bg-gray-700 rounded" />
          </div>
          <div>
            <label class="block mb-1">Cor de fundo</label>
            <input type="color" id="bgColor" value="#10fef4" class="w-full h-10 p-1 rounded bg-gray-700" />
          </div>
          <div>
            <label class="block mb-1">Cor do texto</label>
            <input type="color" id="textColor" value="#000000" class="w-full h-10 p-1 rounded bg-gray-700" />
          </div>
          <div>
            <label class="block mb-1">Formato</label>
            <select id="imgFormat" class="w-full p-2 rounded bg-gray-700 text-white">
              <option value="png">.png</option>
              <option value="jpg">.jpg</option>
              <option value="gif">.gif</option>
            </select>
          </div>
        </div>
  
        <div>
          <label class="block mb-1 mt-2">Texto:</label>
          <input type="text" id="imgText" value="Gerador Placeholder" class="w-full p-2 bg-gray-700 rounded" />
        </div>
  
        <button id="btnGerar" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm mt-2">
          Gerar Imagem
        </button>
  
        <div id="previewContainer" class="mt-4 hidden space-y-2">
          <canvas id="previewCanvas" class="max-w-full border border-gray-700 rounded"></canvas>
          <a id="btnDownload" download="placeholder.png" class="inline-block bg-gray-700 hover:bg-gray-600 px-4 py-1 rounded text-sm text-center cursor-pointer">
            Baixar imagem
          </a>
        </div>
      </div>
    `,

  init: () => {
    const canvas = document.getElementById("previewCanvas");
    const ctx = canvas.getContext("2d");

    const drawImage = () => {
      const width = parseInt(document.getElementById("imgWidth").value);
      const height = parseInt(document.getElementById("imgHeight").value);
      const bgColor = document.getElementById("bgColor").value;
      const textColor = document.getElementById("textColor").value;
      const fontSize = parseInt(document.getElementById("fontSize").value);
      const text = document.getElementById("imgText").value;
      const format = document.getElementById("imgFormat").value;

      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = textColor;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, width / 2, height / 2);

      const mime =
        format === "jpg"
          ? "image/jpeg"
          : format === "gif"
          ? "image/gif"
          : "image/png";
      const dataURL = canvas.toDataURL(mime);
      const link = document.getElementById("btnDownload");
      link.href = dataURL;
      link.download = `placeholder.${format}`;
    };

    document.getElementById("btnGerar").addEventListener("click", () => {
      drawImage();
      document.getElementById("previewContainer").classList.remove("hidden");
    });
  },
};

export default imageplaceholder;
