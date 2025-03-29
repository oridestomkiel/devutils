const color = {
  title: "Conversor de Cores (HEX, RGB, HSL)",
  description:
    "Converta cores entre os formatos HEX, RGB e HSL de forma fácil e precisa. Ideal para designers, desenvolvedores e projetos web.",
  tags: [
    "conversor de cores",
    "hex para rgb",
    "rgb para hex",
    "hsl para rgb",
    "conversão de cores",
    "hex rgb hsl",
    "color converter",
    "ferramenta de cores",
  ],
  category: "Conversores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <input
      id="colorInput"
      type="text"
      placeholder="#3498db ou rgb(52,152,219)"
      class="w-full p-2 bg-gray-700 rounded mb-2 text-white"
    />

    <button
      id="colorConvertBtn"
      class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded"
    >
      Converter
    </button>

    <div
      id="colorPreview"
      class="w-full h-12 rounded mb-2 mt-4 border border-gray-600"
    ></div>

    <div class="mt-2 flex gap-2">
      <textarea
        id="colorOutput"
        rows="3"
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full"
        placeholder="Resultados da conversão"
      ></textarea>
      <button
        id="colorCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const colorInput = document.getElementById("colorInput");
    const preview = document.getElementById("colorPreview");
    const output = document.getElementById("colorOutput");
    const convertBtn = document.getElementById("colorConvertBtn");
    const copyBtn = document.getElementById("colorCopyBtn");

    const toHSL = (r, g, b) => {
      r /= 255;
      g /= 255;
      b /= 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h,
        s,
        l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }
      return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
        l * 100
      )}%)`;
    };

    convertBtn.addEventListener("click", () => {
      const input = colorInput.value.trim();
      let r, g, b;

      const isHex = /^#?([a-f\d]{6}|[a-f\d]{3})$/i.test(input);
      const isRgb = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/i.test(input);

      if (isHex) {
        let hex = input.replace("#", "");

        if (hex.length === 3) {
          hex = hex
            .split("")
            .map((c) => c + c)
            .join("");
        }
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      } else if (isRgb) {
        [r, g, b] = input.match(/\d+/g).map(Number);
      } else {
        output.value = "Formato inválido. Use #RRGGBB ou rgb(r,g,b)";
        preview.style.background = "transparent";
        return;
      }

      const hex = `#${[r, g, b]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")}`;
      const rgb = `rgb(${r}, ${g}, ${b})`;
      const hsl = toHSL(r, g, b);

      output.value = `HEX: ${hex}\nRGB: ${rgb}\nHSL: ${hsl}`;
      preview.style.background = rgb;
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(output.value).then(() => {
        const original = copyBtn.innerText;
        copyBtn.innerText = "Copiado!";
        setTimeout(() => {
          copyBtn.innerText = original;
        }, 1500);
      });
    });
  },
};

export default color;
