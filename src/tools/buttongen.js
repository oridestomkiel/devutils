const buttongen = {
  title: "Gerador de Botões CSS",
  description:
    "Monte botões personalizados com cor, padding, borda, sombra e estado hover. Ideal para criar componentes reutilizáveis de UI.",
  tags: [
    "botão css",
    "button",
    "hover",
    "sombra",
    "border-radius",
    "ui button",
    "componente visual",
  ],
  category: "Design / Cores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.3.0",

  render: () => `
    <div id="btnContainer">
      <div class="grid grid-cols-2 gap-2 mb-3">
        <div><label class="text-sm text-gray-300">Cor de fundo</label><input type="color" id="btnBg" class="w-full h-10 rounded" value="#4f46e5" /></div>
        <div><label class="text-sm text-gray-300">Cor do texto</label><input type="color" id="btnText" class="w-full h-10 rounded" value="#ffffff" /></div>
        <div><label class="text-sm text-gray-300">Padding (vertical)</label><input type="number" id="btnPy" value="10" class="w-full p-1 bg-gray-700 text-white rounded" /></div>
        <div><label class="text-sm text-gray-300">Padding (horizontal)</label><input type="number" id="btnPx" value="20" class="w-full p-1 bg-gray-700 text-white rounded" /></div>
        <div><label class="text-sm text-gray-300">Raio da borda</label><input type="number" id="btnRadius" value="8" class="w-full p-1 bg-gray-700 text-white rounded" /></div>
        <div><label class="text-sm text-gray-300">Cor da sombra</label><input type="color" id="btnShadowColor" value="#000000" class="w-full h-10 rounded" /></div>
        <div>
          <label class="text-sm text-gray-300">Opacidade da sombra</label>
          <input type="range" id="btnShadowAlpha" min="0" max="1" step="0.01" value="0.2" class="w-full" />
          <span id="btnShadowAlphaValue" class="text-sm text-gray-400 block text-center">0.20</span>
        </div>
        <div><label class="text-sm text-gray-300">Offset X</label><input type="number" id="btnShadowX" value="0" class="w-full p-1 bg-gray-700 text-white rounded" /></div>
        <div><label class="text-sm text-gray-300">Offset Y</label><input type="number" id="btnShadowY" value="2" class="w-full p-1 bg-gray-700 text-white rounded" /></div>
        <div><label class="text-sm text-gray-300">Desfoque</label><input type="number" id="btnShadowBlur" value="6" class="w-full p-1 bg-gray-700 text-white rounded" /></div>
        <div><label class="text-sm text-gray-300">Espalhamento</label><input type="number" id="btnShadowSpread" value="0" class="w-full p-1 bg-gray-700 text-white rounded" /></div>
        <div class="col-span-2"><label class="text-sm text-gray-300">Cor no hover</label><input type="color" id="btnHover" class="w-full h-10 rounded" value="#4338ca" /></div>
      </div>

      <button id="btnCopy" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded">Copiar CSS</button>

      <div class="mt-4 bg-white border border-gray-600 p-6 rounded text-center">
        <button id="btnPreview" class="btn-preview font-bold">Botão Exemplo</button>
      </div>

      <pre id="btnCSS" class="mt-2 text-green-400 bg-gray-900 p-3 rounded whitespace-pre-wrap break-words text-sm"></pre>
    </div>
  `,

  init: () => {
    const inputs = [
      "btnBg", "btnText", "btnPy", "btnPx", "btnRadius",
      "btnShadowColor", "btnShadowAlpha", "btnShadowX", "btnShadowY",
      "btnShadowBlur", "btnShadowSpread", "btnHover",
    ];

    const preview = document.getElementById("btnPreview");
    const output = document.getElementById("btnCSS");
    const copyBtn = document.getElementById("btnCopy");
    const shadowAlphaInput = document.getElementById("btnShadowAlpha");
    const shadowAlphaValue = document.getElementById("btnShadowAlphaValue");

    const hexToRGB = (hex) => {
      const raw = hex.replace("#", "");
      const bigint = parseInt(raw, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `${r}, ${g}, ${b}`;
    };

    const update = () => {
      const bg = document.getElementById("btnBg").value;
      const text = document.getElementById("btnText").value;
      const py = document.getElementById("btnPy").value;
      const px = document.getElementById("btnPx").value;
      const radius = document.getElementById("btnRadius").value;
      const hover = document.getElementById("btnHover").value;

      const shadowColor = document.getElementById("btnShadowColor").value;
      const shadowAlpha = parseFloat(shadowAlphaInput.value);
      const shadowX = document.getElementById("btnShadowX").value;
      const shadowY = document.getElementById("btnShadowY").value;
      const shadowBlur = document.getElementById("btnShadowBlur").value;
      const shadowSpread = document.getElementById("btnShadowSpread").value;

      const rgba = `rgba(${hexToRGB(shadowColor)}, ${shadowAlpha})`;
      const shadow = `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${rgba}`;
      shadowAlphaValue.innerText = shadowAlpha.toFixed(2);

      const css = `
#btnContainer .btn-preview {
  background: ${bg};
  color: ${text};
  padding: ${py}px ${px}px;
  border: none;
  border-radius: ${radius}px;
  box-shadow: ${shadow};
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
}
#btnContainer .btn-preview:hover {
  background: ${hover};
}
      `.trim();

      preview.style.background = bg;
      preview.style.color = text;
      preview.style.padding = `${py}px ${px}px`;
      preview.style.borderRadius = `${radius}px`;
      preview.style.boxShadow = shadow;
      preview.onmouseover = () => (preview.style.background = hover);
      preview.onmouseout = () => (preview.style.background = bg);

      output.innerText = css;
    };

    inputs.forEach((id) => {
      document.getElementById(id).addEventListener("input", update);
    });

    copyBtn.addEventListener("click", () => {
      const css = output.innerText;
      if (!css) return;
      navigator.clipboard.writeText(css).then(() => {
        copyBtn.innerText = "Copiado!";
        setTimeout(() => (copyBtn.innerText = "Copiar CSS"), 1500);
      });
    });

    update();
  },
};

export default buttongen;

