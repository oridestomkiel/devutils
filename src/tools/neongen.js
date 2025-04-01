const neongen = {
  title: "Gerador de Efeito Neon",
  description:
    "Crie textos com efeito neon usando múltiplas camadas de sombra. Ideal para interfaces estilizadas, títulos chamativos ou modo hacker.",
  tags: [
    "neon",
    "text-shadow",
    "efeito brilho",
    "visual cyber",
    "ui glow",
    "modo hacker",
  ],
  category: "Design / Cores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <div class="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label class="text-sm text-gray-300">Cor do Neon</label>
          <input type="color" id="neonColor" class="w-full h-10 rounded" value="#00ffff" />
        </div>
        <div>
          <label class="text-sm text-gray-300">Intensidade</label>
          <input type="range" id="neonIntensity" min="1" max="10" step="1" value="5" class="w-full">
          <span id="neonIntensityValue" class="text-sm text-gray-400 block text-center">5</span>
        </div>
      </div>
  
      <button id="neonCopyBtn" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded">Copiar CSS</button>
  
      <div class="mt-4 bg-black border border-gray-700 p-10 rounded text-center">
        <h2 id="neonPreview" class="text-2xl font-bold text-white">Texto Neon</h2>
      </div>
  
      <pre id="neonCSS" class="mt-2 text-green-400 bg-gray-900 p-3 rounded whitespace-pre-wrap break-words text-sm"></pre>
    `,

  init: () => {
    const color = document.getElementById("neonColor");
    const intensity = document.getElementById("neonIntensity");
    const intensityVal = document.getElementById("neonIntensityValue");
    const preview = document.getElementById("neonPreview");
    const output = document.getElementById("neonCSS");
    const copyBtn = document.getElementById("neonCopyBtn");

    const update = () => {
      const col = color.value;
      const strength = parseInt(intensity.value, 10);
      intensityVal.innerText = strength;

      const shadows = Array.from({ length: strength }, (_, i) => {
        const blur = 2 + i * 2;
        return `0 0 ${blur}px ${col}`;
      }).join(", ");

      preview.style.textShadow = shadows;
      output.innerText = `text-shadow: ${shadows};`;
    };

    [color, intensity].forEach((el) => el.addEventListener("input", update));

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

export default neongen;
