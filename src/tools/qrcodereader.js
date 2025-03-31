const qrcodereader = {
  title: "Leitor de QR Code (Imagem)",
  description:
    "Envie uma imagem com QR Code para decodificar o conteúdo. Mostra o texto embutido e permite copiar com um clique.",
  tags: ["qr code", "leitor de qr", "imagem", "scanner", "decode qr"],
  category: "Imagens",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.3",

  render: () => `
    <input type="file" accept="image/png,image/jpeg" id="qrImageInput" class="mb-3 w-full text-sm text-gray-400" />

    <div id="qrPreview" class="mb-3 hidden"></div>

    <textarea
      id="qrResult"
      class="w-full p-2 bg-gray-700 text-green-400 text-sm rounded hidden resize-y mb-3"
      rows="4"
      readonly
    ></textarea>

    <div class="flex gap-2">
      <button id="qrCopyBtn" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded hidden">
        Copiar resultado
      </button>
      <button id="qrClearBtn" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded hidden">
        Limpar
      </button>
    </div>
  `,

  init: () => {
    const loadJsQRLib = (callback) => {
      if (window.jsQR) return callback();
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/jsqr/dist/jsQR.js";
      script.onload = callback;
      document.head.appendChild(script);
    };

    loadJsQRLib(() => {
      const input = document.getElementById("qrImageInput");
      const preview = document.getElementById("qrPreview");
      const result = document.getElementById("qrResult");
      const copyBtn = document.getElementById("qrCopyBtn");
      const clearBtn = document.getElementById("qrClearBtn");

      input.addEventListener("change", () => {
        const file = input.files[0];
        if (!file) return;

        const isSVG = file.type === "image/svg+xml";
        if (isSVG) {
          preview.innerHTML = `<div class="text-red-400 text-sm">❌ Formato SVG não é suportado. Use PNG ou JPG.</div>`;
          preview.classList.remove("hidden");
          result.classList.add("hidden");
          copyBtn.classList.add("hidden");
          clearBtn.classList.remove("hidden");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target.result;
          img.className =
            "max-w-full max-h-[300px] mx-auto rounded border border-gray-700";
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            const code = jsQR(imageData.data, canvas.width, canvas.height);

            if (code?.data) {
              result.value = code.data;
              result.classList.remove("hidden");
              copyBtn.classList.remove("hidden");
            } else {
              result.value = "Nenhum QR Code detectado.";
              result.classList.remove("hidden");
              copyBtn.classList.add("hidden");
            }

            clearBtn.classList.remove("hidden");
          };

          preview.innerHTML = "";
          preview.appendChild(img);
          preview.classList.remove("hidden");
        };

        reader.readAsDataURL(file);
      });

      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(result.value).then(() => {
          const original = copyBtn.textContent;
          copyBtn.textContent = "Copiado!";
          setTimeout(() => (copyBtn.textContent = original), 1500);
        });
      });

      clearBtn.addEventListener("click", () => {
        input.value = "";
        preview.innerHTML = "";
        preview.classList.add("hidden");
        result.value = "";
        result.classList.add("hidden");
        copyBtn.classList.add("hidden");
        clearBtn.classList.add("hidden");
      });
    });
  },
};

export default qrcodereader;
