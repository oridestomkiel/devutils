const layoutgen = {
  title: "Gerador de Layout Flex/Grid",
  description:
    "Monte layouts rapidamente usando Flexbox ou Grid. Ajuste alinhamento, espaçamento e visualize em tempo real com exemplos.",
  tags: [
    "flexbox",
    "grid layout",
    "display flex",
    "css grid",
    "alinhamento css",
    "gap",
    "justify-content",
    "align-items",
  ],
  category: "Geradores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <div class="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label class="text-sm text-gray-300">Tipo de Layout</label>
          <select id="layoutMode" class="w-full p-1 bg-gray-700 text-white rounded">
            <option value="flex">Flexbox</option>
            <option value="grid">Grid</option>
          </select>
        </div>
        <div>
          <label class="text-sm text-gray-300">Gap</label>
          <input type="number" id="layoutGap" value="10" class="w-full p-1 bg-gray-700 text-white rounded" />
        </div>
        <div>
          <label class="text-sm text-gray-300">Justify</label>
          <select id="layoutJustify" class="w-full p-1 bg-gray-700 text-white rounded">
            <option>start</option>
            <option>center</option>
            <option>end</option>
            <option>space-between</option>
            <option>space-around</option>
            <option>space-evenly</option>
          </select>
        </div>
        <div>
          <label class="text-sm text-gray-300">Align</label>
          <select id="layoutAlign" class="w-full p-1 bg-gray-700 text-white rounded">
            <option>start</option>
            <option>center</option>
            <option>end</option>
            <option>stretch</option>
          </select>
        </div>
      </div>
  
      <button id="layoutCopyBtn" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded">Copiar CSS</button>
  
      <div class="mt-4 bg-white border border-gray-600 p-6 rounded" id="layoutPreview">
        <div class="layout-box bg-blue-500 text-white p-2 rounded">1</div>
        <div class="layout-box bg-purple-500 text-white p-2 rounded">2</div>
        <div class="layout-box bg-green-500 text-white p-2 rounded">3</div>
      </div>
  
      <pre id="layoutCSS" class="mt-2 text-green-400 bg-gray-900 p-3 rounded whitespace-pre-wrap break-words text-sm"></pre>
    `,

  init: () => {
    const mode = document.getElementById("layoutMode");
    const gap = document.getElementById("layoutGap");
    const justify = document.getElementById("layoutJustify");
    const align = document.getElementById("layoutAlign");
    const preview = document.getElementById("layoutPreview");
    const output = document.getElementById("layoutCSS");
    const copyBtn = document.getElementById("layoutCopyBtn");

    const updateLayout = () => {
      const type = mode.value;
      const g = gap.value + "px";
      const jc = justify.value;
      const ai = align.value;

      // Reset layout
      preview.style.display = type;
      preview.style.gap = g;

      if (type === "flex") {
        preview.style.flexDirection = "row";
        preview.style.justifyContent = jc;
        preview.style.alignItems = ai;
        preview.style.gridTemplateColumns = "";
      } else {
        preview.style.justifyContent = "";
        preview.style.alignItems = "";
        preview.style.gridTemplateColumns = "repeat(3, 1fr)";
      }

      const css =
        type === "flex"
          ? `
  display: flex;
  gap: ${g};
  justify-content: ${jc};
  align-items: ${ai};
          `.trim()
          : `
  display: grid;
  gap: ${g};
  grid-template-columns: repeat(3, 1fr);
          `.trim();

      output.innerText = css;
    };

    [mode, gap, justify, align].forEach((el) =>
      el.addEventListener("input", updateLayout)
    );

    copyBtn.addEventListener("click", () => {
      const css = output.innerText;
      if (!css) return;
      navigator.clipboard.writeText(css).then(() => {
        copyBtn.innerText = "Copiado!";
        setTimeout(() => (copyBtn.innerText = "Copiar CSS"), 1500);
      });
    });

    updateLayout();
  },
};

export default layoutgen;
