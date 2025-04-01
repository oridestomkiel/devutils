const textshadowgen = {
  title: "Gerador de Text Shadow",
  description:
    "Crie sombras para textos com controle de cor, offset e desfoque. Ideal para dar destaque ou profundidade a títulos e elementos de UI.",
  tags: [
    "text-shadow",
    "sombra de texto",
    "css texto",
    "efeito visual",
    "blur",
    "destaque de título",
  ],
  category: "Design / Cores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <div class="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label class="text-sm text-gray-300">Cor da sombra</label>
          <input type="color" id="textShadowColor" class="w-full h-10 rounded" value="#000000" />
        </div>
        <div>
          <label class="text-sm text-gray-300">Desfoque (px)</label>
          <input type="number" id="textShadowBlur" class="w-full p-1 bg-gray-700 text-white rounded" value="4" />
        </div>
        <div>
          <label class="text-sm text-gray-300">Offset Horizontal (X)</label>
          <input type="number" id="textShadowX" class="w-full p-1 bg-gray-700 text-white rounded" value="2" />
        </div>
        <div>
          <label class="text-sm text-gray-300">Offset Vertical (Y)</label>
          <input type="number" id="textShadowY" class="w-full p-1 bg-gray-700 text-white rounded" value="2" />
        </div>
      </div>
  
      <button id="textShadowCopyBtn" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded">Copiar CSS</button>
  
      <div class="mt-4 bg-white border border-gray-600 p-10 rounded text-center">
        <h2 id="textShadowPreview" class="text-2xl font-bold text-black">Texto com Sombra</h2>
      </div>
  
      <pre id="textShadowCSS" class="mt-2 text-green-400 bg-gray-900 p-3 rounded whitespace-pre-wrap break-words text-sm"></pre>
    `,

  init: () => {
    const color = document.getElementById("textShadowColor");
    const blur = document.getElementById("textShadowBlur");
    const offsetX = document.getElementById("textShadowX");
    const offsetY = document.getElementById("textShadowY");
    const preview = document.getElementById("textShadowPreview");
    const output = document.getElementById("textShadowCSS");
    const copyBtn = document.getElementById("textShadowCopyBtn");

    const update = () => {
      const css = `text-shadow: ${offsetX.value}px ${offsetY.value}px ${blur.value}px ${color.value};`;
      preview.style.textShadow = `${offsetX.value}px ${offsetY.value}px ${blur.value}px ${color.value}`;
      output.innerText = css;
    };

    [color, blur, offsetX, offsetY].forEach((el) =>
      el.addEventListener("input", update)
    );

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

export default textshadowgen;
