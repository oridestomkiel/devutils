const imgtodataurl = {
  title: "Imagem → Data URL (Base64)",
  description:
    "Selecione uma imagem do seu dispositivo para converter automaticamente em um Data URL base64. Útil para embutir imagens em HTML ou CSS.",
  tags: [
    "imagem para base64",
    "imagem para data url",
    "converter imagem",
    "base64",
    "data uri",
  ],
  category: "Imagens",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.2.0",

  render: () => `
      <input
        type="file"
        accept="image/*"
        id="imgToDataUrlInput"
        class="w-full p-2 mb-3 text-white bg-gray-700 rounded"
      />
  
      <div
        id="imgToDataUrlPreview"
        class="hidden flex justify-center items-center bg-gray-900 border border-gray-700 rounded mb-2 min-h-[200px] overflow-hidden"
      ></div>
  
      <textarea
        id="imgToDataUrlOutput"
        class="w-full p-2 bg-gray-700 text-green-400 rounded mb-2 hidden"
        rows="6"
        readonly
      ></textarea>
  
      <div id="imgToDataUrlActions" class="flex flex-wrap gap-2 hidden">
        <button id="copyImgToDataUrlBtn" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">
          Copiar base64
        </button>
        <button id="downloadImgToDataUrlBtn" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">
          Baixar imagem
        </button>
        <button id="clearImgToDataUrlBtn" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">
          Limpar
        </button>
      </div>
    `,

  init: () => {
    const fileInput = document.getElementById("imgToDataUrlInput");
    const preview = document.getElementById("imgToDataUrlPreview");
    const output = document.getElementById("imgToDataUrlOutput");
    const copyBtn = document.getElementById("copyImgToDataUrlBtn");
    const downloadBtn = document.getElementById("downloadImgToDataUrlBtn");
    const clearBtn = document.getElementById("clearImgToDataUrlBtn");
    const actions = document.getElementById("imgToDataUrlActions");

    let currentDataUrl = "";
    let currentMime = "image/png";

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file || !file.type.startsWith("image/")) {
        output.classList.add("hidden");
        preview.classList.add("hidden");
        actions.classList.add("hidden");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        currentDataUrl = reader.result;
        currentMime = file.type || "image/png";

        output.value = currentDataUrl;
        output.classList.remove("hidden");

        const img = new Image();
        img.src = currentDataUrl;
        img.className = "max-w-full max-h-[300px]";
        preview.innerHTML = "";
        preview.appendChild(img);
        preview.classList.remove("hidden");

        actions.classList.remove("hidden");
      };
      reader.readAsDataURL(file);
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(output.value).then(() => {
        const original = copyBtn.textContent;
        copyBtn.textContent = "Copiado!";
        setTimeout(() => (copyBtn.textContent = original), 1500);
      });
    });

    downloadBtn.addEventListener("click", () => {
      if (!currentDataUrl) return;
      const ext = currentMime.split("/")[1] || "png";
      const a = document.createElement("a");
      a.href = currentDataUrl;
      a.download = `imagem.${ext}`;
      a.click();
    });

    clearBtn.addEventListener("click", () => {
      fileInput.value = "";
      currentDataUrl = "";
      preview.innerHTML = "";
      output.value = "";
      preview.classList.add("hidden");
      output.classList.add("hidden");
      actions.classList.add("hidden");
    });
  },
};

export default imgtodataurl;
