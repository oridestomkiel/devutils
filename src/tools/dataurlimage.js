const dataurlimage = {
  title: "Visualizador de Data URL (Imagem Base64)",
  description:
    "Cole um Data URL contendo uma imagem para visualizar, obter detalhes e baixar. Ideal para testar imagens embutidas em base64.",
  tags: [
    "data url",
    "imagem base64",
    "visualizador de imagem",
    "base64 para imagem",
    "converter base64",
  ],
  category: "Imagens",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",

  render: () => `
      <textarea
        id="dataUrlInput"
        class="w-full p-2 bg-gray-700 text-green-400 rounded mb-2"
        rows="6"
        placeholder="Cole aqui o código Data URL completo da imagem (data:image/png;base64,...)"
      ></textarea>
  
      <div class="flex gap-2 mb-4">
        <button id="viewImageBtn" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">
          Visualizar imagem
        </button>
        <button id="copyDataUrlBtn" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded hidden">
          Copiar base64
        </button>
        <button id="downloadDataUrlBtn" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded hidden">
          Baixar imagem
        </button>
        <button id="clearDataUrlBtn" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">
          Limpar
        </button>
      </div>
  
      <div id="dataUrlInfo" class="text-sm text-gray-400 mb-2 hidden"></div>
  
      <div
        id="dataUrlPreview"
        class="hidden flex justify-center items-center min-h-[200px] bg-gray-900 border border-gray-700 rounded overflow-hidden"
      ></div>
    `,

  init: () => {
    const input = document.getElementById("dataUrlInput");
    const preview = document.getElementById("dataUrlPreview");
    const info = document.getElementById("dataUrlInfo");
    const viewBtn = document.getElementById("viewImageBtn");
    const copyBtn = document.getElementById("copyDataUrlBtn");
    const downloadBtn = document.getElementById("downloadDataUrlBtn");
    const clearBtn = document.getElementById("clearDataUrlBtn");

    viewBtn.addEventListener("click", () => {
      const val = input.value.trim();

      if (!val.startsWith("data:image/") || !val.includes("base64,")) {
        preview.classList.remove("hidden");
        preview.innerHTML = `<span class="text-sm text-red-400">Formato inválido. Use um Data URL de imagem válido.</span>`;
        info.classList.add("hidden");
        copyBtn.classList.add("hidden");
        downloadBtn.classList.add("hidden");
        return;
      }

      const mime =
        val.match(/^data:(image\/[a-zA-Z]+);base64,/i)?.[1] || "desconhecido";
      const base64 = val.split("base64,")[1] || "";
      const byteSize = Math.round((base64.length * 3) / 4);
      const sizeKB = (byteSize / 1024).toFixed(1);

      const img = new Image();
      img.src = val;
      img.alt = "Preview";
      img.className = "max-w-full max-h-[300px]";

      img.onload = () => {
        preview.innerHTML = "";
        preview.appendChild(img);
        preview.classList.remove("hidden");

        info.innerHTML = `
            <div class="mb-1 text-green-400">✔️ Imagem detectada</div>
            • Tipo: <code>${mime}</code><br />
            • Tamanho: ${sizeKB} KB<br />
            • Dimensões: ${img.naturalWidth} x ${img.naturalHeight} px
          `;
        info.classList.remove("hidden");
        copyBtn.classList.remove("hidden");
        downloadBtn.classList.remove("hidden");
      };
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(input.value).then(() => {
        const original = copyBtn.textContent;
        copyBtn.textContent = "Copiado!";
        setTimeout(() => (copyBtn.textContent = original), 1500);
      });
    });

    downloadBtn.addEventListener("click", () => {
      const mime =
        input.value.match(/^data:(image\/[a-zA-Z]+);base64,/i)?.[1] ||
        "image/png";
      const ext = mime.split("/")[1];
      const a = document.createElement("a");
      a.href = input.value;
      a.download = `imagem.${ext}`;
      a.click();
    });

    clearBtn.addEventListener("click", () => {
      input.value = "";
      preview.innerHTML = "";
      preview.classList.add("hidden");
      info.innerHTML = "";
      info.classList.add("hidden");
      copyBtn.classList.add("hidden");
      downloadBtn.classList.add("hidden");
    });
  },
};

export default dataurlimage;
