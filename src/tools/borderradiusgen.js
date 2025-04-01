const borderradiusgen = {
  title: "Gerador de Border Radius",
  description:
    "Personalize bordas arredondadas com facilidade. Gere rapidamente CSS com variações para todos os cantos ou individualmente.",
  tags: [
    "border-radius",
    "borda arredondada",
    "css radius",
    "design visual",
    "ui arredondada",
    "css border",
    "estilo visual",
  ],
  category: "Design / Cores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <div class="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label class="text-sm text-gray-300">Top Left</label>
          <input type="number" id="radiusTL" class="w-full p-1 bg-gray-700 text-white rounded" value="8" />
        </div>
        <div>
          <label class="text-sm text-gray-300">Top Right</label>
          <input type="number" id="radiusTR" class="w-full p-1 bg-gray-700 text-white rounded" value="8" />
        </div>
        <div>
          <label class="text-sm text-gray-300">Bottom Right</label>
          <input type="number" id="radiusBR" class="w-full p-1 bg-gray-700 text-white rounded" value="8" />
        </div>
        <div>
          <label class="text-sm text-gray-300">Bottom Left</label>
          <input type="number" id="radiusBL" class="w-full p-1 bg-gray-700 text-white rounded" value="8" />
        </div>
      </div>
  
      <button id="radiusGenBtn" class="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded">Gerar Radius</button>
      <button id="radiusCopyBtn" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded ml-2">Copiar CSS</button>
  
      <div id="radiusPreview" class="mt-4 bg-white border border-gray-600 p-10 flex items-center justify-center rounded">
        <div id="radiusBox" class="w-32 h-20 bg-gray-200 text-black font-bold flex items-center justify-center">
          Preview
        </div>
      </div>
      <pre id="radiusCSS" class="mt-2 text-green-400 bg-gray-900 p-3 rounded whitespace-pre-wrap break-words text-sm"></pre>
    `,

  init: () => {
    const genBtn = document.getElementById("radiusGenBtn");
    const copyBtn = document.getElementById("radiusCopyBtn");

    genBtn.addEventListener("click", () => {
      const tl = document.getElementById("radiusTL").value;
      const tr = document.getElementById("radiusTR").value;
      const br = document.getElementById("radiusBR").value;
      const bl = document.getElementById("radiusBL").value;

      const css = `border-radius: ${tl}px ${tr}px ${br}px ${bl}px;`;

      const box = document.getElementById("radiusBox");
      const output = document.getElementById("radiusCSS");

      box.style.borderRadius = `${tl}px ${tr}px ${br}px ${bl}px`;
      output.innerText = css;
    });

    copyBtn.addEventListener("click", () => {
      const css = document.getElementById("radiusCSS").innerText;
      if (!css) return;
      navigator.clipboard.writeText(css).then(() => {
        copyBtn.innerText = "Copiado!";
        setTimeout(() => (copyBtn.innerText = "Copiar CSS"), 1500);
      });
    });
  },
};

export default borderradiusgen;
