const cssvarigen = {
  title: "Gerador de Variáveis CSS",
  description:
    "Crie e visualize variáveis CSS com valores customizados. Gera estrutura em :root para usar em temas e design tokens.",
  tags: ["variáveis", "css vars", "root", "design tokens", "temas"],
  category: "Design / Cores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",

  render: () => `
      <datalist id="cssVarSuggestions">
        <option value="--color-primary"></option>
        <option value="--color-secondary"></option>
        <option value="--text-color"></option>
        <option value="--bg-color"></option>
        <option value="--font-size"></option>
        <option value="--font-weight"></option>
        <option value="--line-height"></option>
        <option value="--spacing-xs"></option>
        <option value="--spacing-sm"></option>
        <option value="--spacing-md"></option>
        <option value="--spacing-lg"></option>
        <option value="--spacing-xl"></option>
        <option value="--padding"></option>
        <option value="--margin"></option>
        <option value="--radius"></option>
        <option value="--border-width"></option>
        <option value="--z-index"></option>
        <option value="--transition-speed"></option>
        <option value="--shadow"></option>
        <option value="--opacity"></option>
        <option value="--container-width"></option>
        <option value="--gap"></option>
      </datalist>
  
      <div id="varList" class="space-y-2 mb-4">
        <div class="grid grid-cols-2 gap-2">
          <input type="text" list="cssVarSuggestions" class="var-name p-1 bg-gray-700 text-white rounded" value="--bg-color" />
          <input type="text" class="var-value p-1 bg-gray-700 text-white rounded" value="#1e3a8a" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <input type="text" list="cssVarSuggestions" class="var-name p-1 bg-gray-700 text-white rounded" value="--text-color" />
          <input type="text" class="var-value p-1 bg-gray-700 text-white rounded" value="#ffffff" />
        </div>
      </div>
  
      <button id="addVar" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded mb-3">+ Adicionar Variável</button>
      <button id="copyVars" class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded mb-3 ml-2">Copiar CSS</button>
  
      <div class="mt-4 p-6 border border-gray-600 rounded" id="varsPreviewWrapper">
        <div id="varsPreview" class="p-6 text-white rounded font-bold" style="background: var(--bg-color); color: var(--text-color);">
          Preview com variáveis aplicadas
        </div>
      </div>
  
      <pre id="varsCSS" class="mt-4 text-green-400 bg-gray-900 p-3 rounded whitespace-pre-wrap break-words text-sm"></pre>
    `,

  init: () => {
    const list = document.getElementById("varList");
    const preview = document.getElementById("varsPreview");
    const output = document.getElementById("varsCSS");
    const copyBtn = document.getElementById("copyVars");
    const addBtn = document.getElementById("addVar");

    const update = () => {
      const vars = {};
      list.querySelectorAll(".var-name").forEach((el, i) => {
        const name = el.value.trim();
        const value = list.querySelectorAll(".var-value")[i].value.trim();
        if (name && value) vars[name] = value;
      });

      const rootCSS = `:root {\n${Object.entries(vars)
        .map(([k, v]) => `  ${k}: ${v};`)
        .join("\n")}\n}`;
      output.innerText = rootCSS;

      Object.entries(vars).forEach(([k, v]) => {
        preview.style.setProperty(k, v);
      });
    };

    list.addEventListener("input", update);
    addBtn.addEventListener("click", () => {
      const row = document.createElement("div");
      row.className = "grid grid-cols-2 gap-2";
      row.innerHTML = `
          <input type="text" list="cssVarSuggestions" class="var-name p-1 bg-gray-700 text-white rounded" placeholder="--nome" />
          <input type="text" class="var-value p-1 bg-gray-700 text-white rounded" placeholder="valor" />
        `;
      list.appendChild(row);
    });

    copyBtn.addEventListener("click", () => {
      const css = output.innerText;
      navigator.clipboard.writeText(css).then(() => {
        copyBtn.innerText = "Copiado!";
        setTimeout(() => (copyBtn.innerText = "Copiar CSS"), 1500);
      });
    });

    update();
  },
};

export default cssvarigen;
