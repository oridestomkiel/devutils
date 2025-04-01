const shadowgen = {
  title: "Gerador de Sombras CSS",
  description:
    "Monte sombras personalizadas com controle de deslocamento, blur, spread e cor. Ideal para destacar elementos de UI com estilo.",
  tags: [
    "box-shadow",
    "css shadow",
    "sombra personalizada",
    "efeito sombra",
    "sombras visuais",
    "css visual",
    "design ui",
    "ui elevation",
  ],
  category: "Design / Cores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <div class="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label class="text-sm text-gray-300">Horizontal</label>
          <input type="number" id="shadowX" class="w-full p-1 bg-gray-700 text-white rounded" value="4" />
        </div>
        <div>
          <label class="text-sm text-gray-300">Vertical</label>
          <input type="number" id="shadowY" class="w-full p-1 bg-gray-700 text-white rounded" value="4" />
        </div>
        <div>
          <label class="text-sm text-gray-300">Desfoque (blur)</label>
          <input type="number" id="shadowBlur" class="w-full p-1 bg-gray-700 text-white rounded" value="10" />
        </div>
        <div>
          <label class="text-sm text-gray-300">Espalhamento (spread)</label>
          <input type="number" id="shadowSpread" class="w-full p-1 bg-gray-700 text-white rounded" value="0" />
        </div>
        <div class="col-span-2">
          <label class="text-sm text-gray-300">Cor da sombra</label>
          <input type="color" id="shadowColor" class="w-full h-10 rounded" value="#000000" />
        </div>
      </div>
  
      <button id="shadowGenBtn" class="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded">Gerar Sombra</button>
      <button id="shadowCopyBtn" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded ml-2">Copiar CSS</button>
  
    <div id="shadowPreview" class="mt-4 bg-white border border-gray-600 p-10 flex items-center justify-center rounded">
    <div id="shadowBox" class="w-32 h-20 bg-gray-200 text-black font-bold flex items-center justify-center rounded">
        Preview
    </div>
    </div>
    <pre id="shadowCSS" class="mt-2 text-green-400 bg-gray-900 p-3 rounded whitespace-pre-wrap break-words text-sm"></pre>
    `,

  init: () => {
    const genBtn = document.getElementById("shadowGenBtn");
    const copyBtn = document.getElementById("shadowCopyBtn");

    genBtn.addEventListener("click", () => {
      const x = document.getElementById("shadowX").value;
      const y = document.getElementById("shadowY").value;
      const blur = document.getElementById("shadowBlur").value;
      const spread = document.getElementById("shadowSpread").value;
      const color = document.getElementById("shadowColor").value;

      const css = `box-shadow: ${x}px ${y}px ${blur}px ${spread}px ${color};`;

      const box = document.getElementById("shadowBox");
      const output = document.getElementById("shadowCSS");

      box.style.boxShadow = `${x}px ${y}px ${blur}px ${spread}px ${color}`;
      output.innerText = css;
    });

    copyBtn.addEventListener("click", () => {
      const css = document.getElementById("shadowCSS").innerText;
      if (!css) return;
      navigator.clipboard.writeText(css).then(() => {
        copyBtn.innerText = "Copiado!";
        setTimeout(() => (copyBtn.innerText = "Copiar CSS"), 1500);
      });
    });
  },
};

export default shadowgen;
