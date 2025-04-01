const multitransitiongen = {
  title: "Transições com Múltiplas Propriedades",
  description:
    "Monte transições CSS personalizadas com múltiplas propriedades, cada uma com sua duração, delay e easing.",
  tags: ["transition", "css", "animação", "easing", "delay", "multi-prop"],
  category: "Design / Cores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <div class="space-y-3 mb-4">
        ${["background-color", "color", "transform", "opacity", "border-radius"]
          .map(
            (prop) => `
          <div class="bg-gray-800 p-3 rounded">
            <label class="text-sm text-white font-bold block mb-1">${prop}</label>
            <div class="grid grid-cols-3 gap-2">
              <input type="number" id="${prop}-dur" value="0.3" step="0.1" min="0" class="p-1 bg-gray-700 text-white rounded" placeholder="Duração (s)" />
              <input type="number" id="${prop}-delay" value="0" step="0.1" min="0" class="p-1 bg-gray-700 text-white rounded" placeholder="Delay (s)" />
              <select id="${prop}-ease" class="p-1 bg-gray-700 text-white rounded">
                <option value="ease">ease</option>
                <option value="linear">linear</option>
                <option value="ease-in">ease-in</option>
                <option value="ease-out">ease-out</option>
                <option value="ease-in-out">ease-in-out</option>
              </select>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
  
      <button id="multiTransCopy" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded mb-4">Copiar CSS</button>
  
      <div class="bg-white p-10 rounded text-center border border-gray-600">
        <div id="multiTransPreview" class="transition-all duration-300 ease-in-out w-40 h-20 bg-blue-500 text-white flex items-center justify-center rounded hover:bg-red-500 hover:text-black hover:opacity-75 hover:scale-110">
          Preview
        </div>
      </div>
  
      <pre id="multiTransCSS" class="mt-4 text-green-400 bg-gray-900 p-3 rounded whitespace-pre-wrap break-words text-sm"></pre>
    `,

  init: () => {
    const properties = [
      "background-color",
      "color",
      "transform",
      "opacity",
      "border-radius",
    ];
    const preview = document.getElementById("multiTransPreview");
    const cssOut = document.getElementById("multiTransCSS");
    const copyBtn = document.getElementById("multiTransCopy");

    const update = () => {
      const parts = properties.map((prop) => {
        const dur = document.getElementById(`${prop}-dur`).value;
        const delay = document.getElementById(`${prop}-delay`).value;
        const ease = document.getElementById(`${prop}-ease`).value;
        return `${prop} ${dur}s ${ease} ${delay}s`;
      });

      const css = `transition: ${parts.join(", ")};`;

      preview.style.transition = parts.join(", ");
      cssOut.innerText = css;
    };

    properties.forEach((prop) => {
      ["dur", "delay", "ease"].forEach((type) => {
        document
          .getElementById(`${prop}-${type}`)
          .addEventListener("input", update);
      });
    });

    copyBtn.addEventListener("click", () => {
      const css = cssOut.innerText;
      navigator.clipboard.writeText(css).then(() => {
        copyBtn.innerText = "Copiado!";
        setTimeout(() => (copyBtn.innerText = "Copiar CSS"), 1500);
      });
    });

    update();
  },
};

export default multitransitiongen;
