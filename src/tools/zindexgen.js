const zindexgen = {
  title: "Gerador de Z-Index Layering",
  description:
    "Visualize e controle a sobreposição de elementos com position e z-index. Ideal para entender empilhamento em CSS.",
  tags: [
    "z-index",
    "camadas",
    "stacking",
    "sobreposição",
    "position",
    "css layering",
  ],
  category: "Design / Cores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",

  render: () => `
      <div id="zIndexContainer">
        <div class="grid grid-cols-3 gap-2 mb-3">
          ${["A", "B", "C"]
            .map(
              (id) => `
            <div class="p-2 bg-gray-800 rounded">
              <h3 class="text-white font-bold mb-1">Camada ${id}</h3>
              <label class="text-xs text-gray-400 block mb-1">position</label>
              <select id="pos${id}" class="w-full mb-2 bg-gray-700 text-white p-1 rounded">
                <option>relative</option>
                <option>absolute</option>
                <option>fixed</option>
              </select>
              <label class="text-xs text-gray-400 block mb-1">z-index</label>
              <input type="number" id="z${id}" value="${
                id === "A" ? 1 : id === "B" ? 2 : 3
              }" class="w-full bg-gray-700 text-white p-1 rounded" />
              <label class="text-xs text-gray-400 block mt-2 mb-1">Cor</label>
              <input type="color" id="bg${id}" value="${
                id === "A" ? "#f87171" : id === "B" ? "#60a5fa" : "#34d399"
              }" class="w-full h-10 rounded" />
            </div>`
            )
            .join("")}
        </div>
  
        <button id="zCopy" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded">Copiar CSS</button>
  
        <div class="relative h-64 border border-gray-600 mt-4 rounded overflow-hidden bg-white">
        <div id="zPreview" class="relative w-full h-full" style="transform: translateZ(0);">
            ${["A", "B", "C"]
              .map(
                (id) => `
              <div id="layer${id}" class="absolute inset-6 flex items-center justify-center font-bold text-white rounded shadow">
                Camada ${id}
              </div>`
              )
              .join("")}
          </div>
        </div>
  
        <pre id="zCSS" class="mt-2 text-green-400 bg-gray-900 p-3 rounded whitespace-pre-wrap break-words text-sm"></pre>
      </div>
    `,

  init: () => {
    const layers = ["A", "B", "C"];

    const update = () => {
      const css = layers
        .map((id) => {
          const pos = document.getElementById(`pos${id}`).value;
          const z = document.getElementById(`z${id}`).value;
          const bg = document.getElementById(`bg${id}`).value;
          const el = document.getElementById(`layer${id}`);

          el.style.position = pos;
          el.style.zIndex = z;
          el.style.backgroundColor = bg;

          return `#zIndexContainer #layer${id} {
    position: ${pos};
    z-index: ${z};
    background: ${bg};
  }`;
        })
        .join("\n\n");

      document.getElementById("zCSS").innerText = css;
    };

    document.getElementById("zCopy").addEventListener("click", () => {
      const css = document.getElementById("zCSS").innerText;
      if (!css) return;
      navigator.clipboard.writeText(css).then(() => {
        const btn = document.getElementById("zCopy");
        btn.innerText = "Copiado!";
        setTimeout(() => (btn.innerText = "Copiar CSS"), 1500);
      });
    });

    ["pos", "z", "bg"].forEach((prefix) =>
      layers.forEach((id) =>
        document
          .getElementById(`${prefix}${id}`)
          .addEventListener("input", update)
      )
    );

    update();
  },
};

export default zindexgen;
