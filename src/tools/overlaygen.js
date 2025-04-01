const overlaygen = {
  title: "Overlay Generator",
  description:
    "Crie overlays visuais com cor, opacidade e blend mode para aplicar sobre imagens, banners ou seções de destaque.",
  tags: [
    "overlay",
    "blend",
    "background",
    "mix-blend-mode",
    "efeito",
    "css visual",
  ],
  category: "Design / Cores",
  author: "DevUtils",
  hasApi: true,
  license: "MIT",
  version: "1.2.0",

  render: () => `
      <div class="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label class="text-sm text-gray-300">Cor do Overlay</label>
          <input type="color" id="overlayColor" value="#000000" class="w-full h-10 rounded" />
        </div>
        <div>
          <label class="text-sm text-gray-300">Opacidade</label>
          <input type="range" id="overlayAlpha" min="0" max="1" step="0.01" value="0.4" class="w-full" />
          <span id="overlayAlphaValue" class="text-sm text-gray-400 block text-center">0.40</span>
        </div>
        <div class="col-span-2">
          <label class="text-sm text-gray-300">Blend Mode</label>
          <select id="overlayBlend" class="w-full bg-gray-700 text-white p-1 rounded">
            <option value="normal">normal</option>
            <option value="multiply">multiply</option>
            <option value="overlay">overlay</option>
            <option value="screen">screen</option>
            <option value="soft-light">soft-light</option>
            <option value="hard-light">hard-light</option>
            <option value="color-dodge">color-dodge</option>
            <option value="darken">darken</option>
            <option value="lighten">lighten</option>
          </select>
        </div>
      </div>
  
      <div class="flex gap-2 mb-3">
        <button id="overlayCopy" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded">Copiar CSS</button>
        <button id="overlayRefresh" class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded">🔄 Nova Imagem</button>
        <label class="text-sm text-gray-300 flex items-center gap-2">
          <input type="file" id="overlayUpload" accept="image/*" class="hidden" />
          <span class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded cursor-pointer">📁 Usar imagem local</span>
        </label>
      </div>
  
      <div class="mt-4 relative h-56 border border-gray-600 rounded overflow-hidden" id="overlayPreviewWrapper">
        <img id="overlayImage" src="" class="w-full h-full object-cover" />
        <div id="overlayPreview" class="absolute inset-0"></div>
      </div>
  
      <pre id="overlayCSS" class="mt-2 text-green-400 bg-gray-900 p-3 rounded whitespace-pre-wrap break-words text-sm"></pre>
    `,

  init: () => {
    const ACCESS_KEY = "qqX-zCJJ74tXG59lFDJOO9vk_FPejIPyfSD0R33_CXc";

    const colorInput = document.getElementById("overlayColor");
    const alphaInput = document.getElementById("overlayAlpha");
    const alphaValue = document.getElementById("overlayAlphaValue");
    const blendInput = document.getElementById("overlayBlend");

    const preview = document.getElementById("overlayPreview");
    const image = document.getElementById("overlayImage");
    const output = document.getElementById("overlayCSS");
    const copyBtn = document.getElementById("overlayCopy");
    const refreshBtn = document.getElementById("overlayRefresh");
    const uploadInput = document.getElementById("overlayUpload");

    const hexToRGBA = (hex, alpha = 1) => {
      const raw = hex.replace("#", "");
      const bigint = parseInt(raw, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const update = () => {
      const hex = colorInput.value;
      const alpha = parseFloat(alphaInput.value);
      const blend = blendInput.value;
      const rgba = hexToRGBA(hex, alpha);

      alphaValue.innerText = alpha.toFixed(2);
      preview.style.background = rgba;
      preview.style.mixBlendMode = blend;

      const css = `
  .overlay {
    background: ${rgba};
    mix-blend-mode: ${blend};
  }
        `.trim();

      output.innerText = css;
    };

    const fetchNewImage = () => {
      fetch(
        "https://api.unsplash.com/photos/random?query=landscape&orientation=landscape",
        {
          headers: {
            Authorization: `Client-ID ${ACCESS_KEY}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.urls?.regular) {
            image.src = data.urls.regular;
          }
        });
    };

    const handleUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        image.src = event.target.result;
      };
      reader.readAsDataURL(file);
    };

    [colorInput, alphaInput, blendInput].forEach((el) =>
      el.addEventListener("input", update)
    );

    uploadInput.addEventListener("change", handleUpload);
    refreshBtn.addEventListener("click", fetchNewImage);

    copyBtn.addEventListener("click", () => {
      const css = output.innerText;
      navigator.clipboard.writeText(css).then(() => {
        copyBtn.innerText = "Copiado!";
        setTimeout(() => (copyBtn.innerText = "Copiar CSS"), 1500);
      });
    });

    update();
    fetchNewImage();
  },
};

export default overlaygen;
