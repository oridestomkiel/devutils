const glassmorphism = {
  title: "Gerador de Glassmorphism",
  description:
    "Crie o efeito vidro fosco com cor, transparência, desfoque e borda. Ideal para painéis e cards com visual moderno.",
  tags: [
    "glassmorphism",
    "blur",
    "transparência",
    "efeito vidro",
    "frosted glass",
    "ui moderna",
    "visual glass",
  ],
  category: "Design / Cores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.3.0",

  render: () => `
        <div class="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label class="text-sm text-gray-300">Cor de fundo</label>
            <input type="color" id="glassColor" class="w-full h-10 rounded" value="#3399ff" />
          </div>
          <div>
            <label class="text-sm text-gray-300">Opacidade</label>
            <input type="range" id="glassOpacity" min="0" max="1" step="0.01" value="0.25" class="w-full">
            <span id="glassOpacityValue" class="text-sm text-gray-400 block text-center">0.25</span>
          </div>
          <div>
            <label class="text-sm text-gray-300">Desfoque (px)</label>
            <input type="number" id="glassBlur" class="w-full p-1 bg-gray-700 text-white rounded" value="10" />
          </div>
          <div>
            <label class="text-sm text-gray-300">Cor da Borda</label>
            <input type="color" id="glassBorderColor" class="w-full h-10 rounded" value="#000000" />
          </div>
          <div>
            <label class="text-sm text-gray-300">Opacidade da Borda</label>
            <input type="range" id="glassBorderAlpha" min="0" max="1" step="0.01" value="0.15" class="w-full">
            <span id="glassBorderAlphaValue" class="text-sm text-gray-400 block text-center">0.15</span>
          </div>
          <div>
            <label class="text-sm text-gray-300">Fundo do Preview</label>
            <input type="color" id="previewBg" class="w-full h-10 rounded" value="#ffffff" />
          </div>
        </div>
    
        <button id="glassResetBtn" class="bg-gray-600 hover:bg-gray-500 px-4 py-1 rounded">Resetar</button>
        <button id="glassCopyBtn" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded ml-2">Copiar CSS</button>
    
        <div id="glassPreviewWrapper" class="mt-4 border border-gray-600 p-10 flex items-center justify-center rounded">
          <div id="glassBox" class="w-48 h-24 flex items-center justify-center text-white font-bold backdrop-blur-md">
            Preview
          </div>
        </div>
    
        <pre id="glassCSS" class="mt-2 text-green-400 bg-gray-900 p-3 rounded whitespace-pre-wrap break-words text-sm"></pre>
      `,

  init: () => {
    const resetBtn = document.getElementById("glassResetBtn");
    const copyBtn = document.getElementById("glassCopyBtn");

    const opacityInput = document.getElementById("glassOpacity");
    const opacityValue = document.getElementById("glassOpacityValue");
    const borderAlphaInput = document.getElementById("glassBorderAlpha");
    const borderAlphaValue = document.getElementById("glassBorderAlphaValue");

    const allInputs = [
      "glassColor",
      "glassOpacity",
      "glassBlur",
      "glassBorderColor",
      "glassBorderAlpha",
      "previewBg",
    ];

    const updatePreview = () => {
      const color = document.getElementById("glassColor").value;
      const opacity = parseFloat(opacityInput.value);
      const blur = document.getElementById("glassBlur").value;
      const borderColor = document.getElementById("glassBorderColor").value;
      const borderAlpha = parseFloat(borderAlphaInput.value);
      const previewBg = document.getElementById("previewBg").value;

      const bgColor = hexToRGBA(color, opacity);
      const border = hexToRGBA(borderColor, borderAlpha);

      const css = `
      background: ${bgColor};
      backdrop-filter: blur(${blur}px);
      -webkit-backdrop-filter: blur(${blur}px);
      border: 1px solid ${border};
          `.trim();

      const box = document.getElementById("glassBox");
      const output = document.getElementById("glassCSS");
      const wrapper = document.getElementById("glassPreviewWrapper");

      box.style.background = bgColor;
      box.style.backdropFilter = `blur(${blur}px)`;
      box.style.webkitBackdropFilter = `blur(${blur}px)`;
      box.style.border = `1px solid ${border}`;
      wrapper.style.backgroundColor = previewBg;

      output.innerText = css;
    };

    allInputs.forEach((id) =>
      document.getElementById(id).addEventListener("input", updatePreview)
    );

    opacityInput.addEventListener("input", () => {
      opacityValue.innerText = parseFloat(opacityInput.value).toFixed(2);
    });

    borderAlphaInput.addEventListener("input", () => {
      borderAlphaValue.innerText = parseFloat(borderAlphaInput.value).toFixed(
        2
      );
    });

    resetBtn.addEventListener("click", () => {
      document.getElementById("glassColor").value = "#3399ff";
      document.getElementById("glassOpacity").value = 0.25;
      opacityValue.innerText = "0.25";

      document.getElementById("glassBlur").value = 10;

      document.getElementById("glassBorderColor").value = "#000000";
      document.getElementById("glassBorderAlpha").value = 0.15;
      borderAlphaValue.innerText = "0.15";

      document.getElementById("previewBg").value = "#ffffff";

      updatePreview();
    });

    copyBtn.addEventListener("click", () => {
      const css = document.getElementById("glassCSS").innerText;
      if (!css) return;
      navigator.clipboard.writeText(css).then(() => {
        copyBtn.innerText = "Copiado!";
        setTimeout(() => (copyBtn.innerText = "Copiar CSS"), 1500);
      });
    });

    const hexToRGBA = (hex, alpha = 1) => {
      const raw = hex.replace("#", "");
      const bigint = parseInt(raw, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    updatePreview();
  },
};

export default glassmorphism;
