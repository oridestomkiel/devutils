const imagecropper = {
  title: "Cortador de Imagem (Crop)",
  description:
    "Envie uma imagem, selecione a área de recorte e baixe apenas o trecho desejado. Suporta PNG e JPG.",
  tags: ["crop", "imagem", "recortar", "editor", "imagem utilitário"],
  category: "Imagens",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <input type="file" accept="image/png,image/jpeg" id="cropInput" class="mb-3 w-full text-sm text-gray-400" />
      
      <div id="cropContainer" class="hidden mb-3 border border-gray-700 rounded overflow-hidden max-h-[400px]">
        <img id="cropTarget" class="max-w-full" />
      </div>
  
      <div class="flex gap-2">
        <button id="cropDownloadBtn" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded hidden">
          Baixar Recorte
        </button>
        <button id="cropClearBtn" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded hidden">
          Limpar
        </button>
      </div>
    `,

  init: () => {
    const loadCropperLib = (callback) => {
      const cssHref =
        "https://cdn.jsdelivr.net/npm/cropperjs@1.5.13/dist/cropper.min.css";
      const jsSrc =
        "https://cdn.jsdelivr.net/npm/cropperjs@1.5.13/dist/cropper.min.js";

      if (!window.Cropper) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cssHref;
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = jsSrc;
        script.onload = callback;
        document.head.appendChild(script);
      } else {
        callback();
      }
    };

    loadCropperLib(() => {
      const input = document.getElementById("cropInput");
      const container = document.getElementById("cropContainer");
      const image = document.getElementById("cropTarget");
      const downloadBtn = document.getElementById("cropDownloadBtn");
      const clearBtn = document.getElementById("cropClearBtn");

      let cropper;

      input.addEventListener("change", () => {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          image.src = e.target.result;
          container.classList.remove("hidden");

          if (cropper) cropper.destroy();
          cropper = new Cropper(image, {
            aspectRatio: NaN,
            viewMode: 1,
            responsive: true,
            background: false,
          });

          downloadBtn.classList.remove("hidden");
          clearBtn.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
      });

      downloadBtn.addEventListener("click", () => {
        if (!cropper) return;
        const canvas = cropper.getCroppedCanvas();
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "recorte.png";
        link.click();
      });

      clearBtn.addEventListener("click", () => {
        if (cropper) {
          cropper.destroy();
          cropper = null;
        }
        input.value = "";
        image.src = "";
        container.classList.add("hidden");
        downloadBtn.classList.add("hidden");
        clearBtn.classList.add("hidden");
      });
    });
  },
};

export default imagecropper;
