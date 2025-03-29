const gradientgen = {
  title: "Gerador de Gradientes CSS",
  description:
    "Crie gradientes CSS personalizados de forma visual e intuitiva. Ideal para deixar seu site mais bonito com transições de cores suaves.",
  tags: [
    "gradientes css",
    "gerador de gradiente",
    "background css",
    "cores degradê",
    "css gradient",
    "degradê personalizado",
    "estilo visual",
    "fundo com gradiente",
  ],
  category: "Design / Cores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <div class="grid grid-cols-2 gap-2 mb-3">
      <div>
        <label class="block text-sm text-gray-300 mb-1">Cor 1</label>
        <input type="color" id="gradColor1" value="#ff6b6b" class="w-full h-10 rounded" />
      </div>
      <div>
        <label class="block text-sm text-gray-300 mb-1">Cor 2</label>
        <input type="color" id="gradColor2" value="#6b6bff" class="w-full h-10 rounded" />
      </div>
    </div>

    <label class="block text-sm text-gray-300 mb-1">Direção</label>
    <select id="gradDirection" class="w-full p-2 bg-gray-700 rounded text-white mb-3">
      <option value="to right">⬅️ → Direita</option>
      <option value="to left">➡️ ← Esquerda</option>
      <option value="to bottom">⬆️ ↓ Baixo</option>
      <option value="to top">⬇️ ↑ Cima</option>
      <option value="135deg">↘️ Diagonal (135°)</option>
      <option value="45deg">↗️ Diagonal (45°)</option>
    </select>

    <button id="gradGenBtn" class="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded">Gerar Gradiente</button>
    <button id="gradCopyBtn" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded ml-2">Copiar CSS</button>

    <div id="gradPreview" class="mt-4 h-32 rounded shadow-inner border border-gray-600"></div>
    <pre id="gradCSS" class="mt-2 text-green-400 whitespace-pre-wrap break-words text-sm"></pre>
  `,
  init: () => {
    const genBtn = document.getElementById("gradGenBtn");
    const copyBtn = document.getElementById("gradCopyBtn");

    genBtn.addEventListener("click", () => {
      const c1 = document.getElementById("gradColor1").value;
      const c2 = document.getElementById("gradColor2").value;
      const dir = document.getElementById("gradDirection").value;
      const css = `background: linear-gradient(${dir}, ${c1}, ${c2});`;

      const preview = document.getElementById("gradPreview");
      const output = document.getElementById("gradCSS");

      preview.style.background = `linear-gradient(${dir}, ${c1}, ${c2})`;
      output.innerText = css;
    });

    copyBtn.addEventListener("click", () => {
      const css = document.getElementById("gradCSS").innerText;
      if (!css) return;
      navigator.clipboard.writeText(css).then(() => {
        copyBtn.innerText = "Copiado!";
        setTimeout(() => (copyBtn.innerText = "Copiar CSS"), 1500);
      });
    });
  },
};

export default gradientgen;
