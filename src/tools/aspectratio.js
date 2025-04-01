const aspectratio = {
  title: "Gerador de Aspect Ratio",
  description:
    "Gere estilos CSS para manter uma proporção fixa em elementos, como vídeos, imagens ou containers responsivos.",
  tags: [
    "aspect ratio",
    "responsivo",
    "css hack",
    "proporção",
    "container",
    "padding-hack",
  ],
  category: "Design / Cores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <div class="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label class="text-sm text-gray-300">Proporção</label>
          <select id="ratioSelect" class="w-full p-1 bg-gray-700 text-white rounded">
            <option value="16/9">16:9</option>
            <option value="4/3">4:3</option>
            <option value="1/1">1:1</option>
            <option value="21/9">21:9</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>
        <div id="customRatioWrapper" class="hidden">
          <label class="text-sm text-gray-300">Custom (largura:altura)</label>
          <input type="text" id="customRatio" placeholder="ex: 3/2" class="w-full p-1 bg-gray-700 text-white rounded" />
        </div>
        <div class="col-span-2">
          <label class="text-sm text-gray-300">Modo</label>
          <select id="ratioMode" class="w-full p-1 bg-gray-700 text-white rounded">
            <option value="modern">aspect-ratio (moderno)</option>
            <option value="fallback">padding-top (compatível)</option>
          </select>
        </div>
      </div>
  
      <button id="ratioCopy" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded">Copiar CSS</button>
  
      <div class="mt-4 border border-gray-600 bg-white p-4 rounded">
        <div id="ratioPreview" class="bg-blue-300 w-full max-w-sm mx-auto rounded overflow-hidden relative">
          <div class="absolute inset-0 flex items-center justify-center font-bold text-black text-xl">Preview</div>
        </div>
      </div>
  
      <pre id="ratioCSS" class="mt-2 text-green-400 bg-gray-900 p-3 rounded whitespace-pre-wrap break-words text-sm"></pre>
    `,

  init: () => {
    const select = document.getElementById("ratioSelect");
    const customInput = document.getElementById("customRatio");
    const customWrapper = document.getElementById("customRatioWrapper");
    const mode = document.getElementById("ratioMode");
    const preview = document.getElementById("ratioPreview");
    const output = document.getElementById("ratioCSS");
    const copyBtn = document.getElementById("ratioCopy");

    const parseRatio = (value) => {
      const parts = value.split("/");
      return parts.length === 2 ? +parts[0] / +parts[1] : 1;
    };

    const update = () => {
      const value =
        select.value === "custom" ? customInput.value : select.value;
      const ratio = parseRatio(value || "1/1");
      const useModern = mode.value === "modern";

      let css = "";
      if (useModern) {
        css = `
  .aspect-box {
    aspect-ratio: ${value};
    width: 100%;
  }
          `.trim();
        preview.style.aspectRatio = value;
        preview.style.paddingTop = "";
      } else {
        const padding = (1 / ratio) * 100;
        css = `
  .aspect-box {
    position: relative;
    width: 100%;
    padding-top: ${padding.toFixed(2)}%;
  }
  .aspect-box > * {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
  }
          `.trim();
        preview.style.aspectRatio = "";
        preview.style.paddingTop = `${(1 / ratio) * 100}%`;
      }

      output.innerText = css;
    };

    select.addEventListener("change", () => {
      customWrapper.classList.toggle("hidden", select.value !== "custom");
      update();
    });

    [customInput, mode].forEach((el) => el.addEventListener("input", update));

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

export default aspectratio;
