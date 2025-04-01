const clampgen = {
  title: "Gerador de clamp() CSS",
  description:
    "Crie valores CSS responsivos com clamp() ajustando mínimo, ideal e máximo. Útil para fontes, espaçamentos e elementos fluidos.",
  tags: [
    "clamp",
    "font-size responsivo",
    "padding responsivo",
    "css responsivo",
    "vw rem clamp",
    "design fluido",
  ],
  category: "Design / Cores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <div class="grid grid-cols-3 gap-2 mb-3">
        <div>
          <label class="text-sm text-gray-300">Valor Mínimo</label>
          <input type="text" id="clampMin" class="w-full p-1 bg-gray-700 text-white rounded" value="1rem" />
        </div>
        <div>
          <label class="text-sm text-gray-300">Valor Ideal (vw)</label>
          <input type="text" id="clampIdeal" class="w-full p-1 bg-gray-700 text-white rounded" value="2vw" />
        </div>
        <div>
          <label class="text-sm text-gray-300">Valor Máximo</label>
          <input type="text" id="clampMax" class="w-full p-1 bg-gray-700 text-white rounded" value="2.5rem" />
        </div>
      </div>
  
      <label class="text-sm text-gray-300 mb-1">Propriedade CSS</label>
      <select id="clampProperty" class="w-full p-2 bg-gray-700 text-white rounded mb-3">
        <option value="font-size">font-size</option>
        <option value="padding">padding</option>
        <option value="margin">margin</option>
        <option value="gap">gap</option>
        <option value="height">height</option>
        <option value="width">width</option>
      </select>
  
      <button id="clampGenBtn" class="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded">Gerar clamp()</button>
      <button id="clampCopyBtn" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded ml-2">Copiar CSS</button>
  
      <div id="clampPreview" class="mt-4 bg-white border border-gray-600 p-10 flex items-center justify-center rounded text-center">
        <div id="clampBox" class="text-black font-bold">Texto de Exemplo</div>
      </div>
  
      <pre id="clampCSS" class="mt-2 text-green-400 bg-gray-900 p-3 rounded whitespace-pre-wrap break-words text-sm"></pre>
    `,

  init: () => {
    const genBtn = document.getElementById("clampGenBtn");
    const copyBtn = document.getElementById("clampCopyBtn");

    genBtn.addEventListener("click", () => {
      const min = document.getElementById("clampMin").value.trim();
      const ideal = document.getElementById("clampIdeal").value.trim();
      const max = document.getElementById("clampMax").value.trim();
      const prop = document.getElementById("clampProperty").value;

      const css = `${prop}: clamp(${min}, ${ideal}, ${max});`;

      const box = document.getElementById("clampBox");
      const output = document.getElementById("clampCSS");

      ["fontSize", "padding", "margin", "gap", "height", "width"].forEach(
        (p) => {
          box.style[p] = "";
        }
      );

      const cssProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase()); // font-size → fontSize
      box.style[cssProp] = `clamp(${min}, ${ideal}, ${max})`;

      output.innerText = css;
    });

    copyBtn.addEventListener("click", () => {
      const css = document.getElementById("clampCSS").innerText;
      if (!css) return;
      navigator.clipboard.writeText(css).then(() => {
        copyBtn.innerText = "Copiado!";
        setTimeout(() => (copyBtn.innerText = "Copiar CSS"), 1500);
      });
    });
  },
};

export default clampgen;
