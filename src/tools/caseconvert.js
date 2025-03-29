const caseconvert = {
  title: "Conversor CamelCase ↔ snake_case ↔ kebab-case",
  description:
    "Converta facilmente entre os formatos CamelCase, snake_case e kebab-case. Ideal para padronização de variáveis, nomes de arquivos e APIs.",
  tags: [
    "camelcase",
    "snake_case",
    "kebab-case",
    "conversor de formato",
    "conversão de texto",
    "camel para snake",
    "snake para kebab",
    "kebab para camel",
    "case converter",
  ],
  category: "Conversores de Texto",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <input
      id="caseInput"
      type="text"
      class="w-full p-2 bg-gray-700 rounded mb-4"
      placeholder="Digite um texto em qualquer formato"
    />

    <div class="flex gap-2 items-center mb-2">
      <label class="w-[120px]"><strong>CamelCase:</strong></label>
      <input
        id="camelOutput"
        type="text"
        readonly
        class="w-full p-2 bg-gray-700 text-green-400 rounded"
        placeholder=""
      />
      <button
        id="camelCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
      >
        Copiar
      </button>
    </div>

    <div class="flex gap-2 items-center mb-2">
      <label class="w-[120px]"><strong>snake_case:</strong></label>
      <input
        id="snakeOutput"
        type="text"
        readonly
        class="w-full p-2 bg-gray-700 text-green-400 rounded"
        placeholder=""
      />
      <button
        id="snakeCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
      >
        Copiar
      </button>
    </div>

    <div class="flex gap-2 items-center">
      <label class="w-[120px]"><strong>kebab-case:</strong></label>
      <input
        id="kebabOutput"
        type="text"
        readonly
        class="w-full p-2 bg-gray-700 text-green-400 rounded"
        placeholder=""
      />
      <button
        id="kebabCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const inputEl = document.getElementById("caseInput");
    const camelEl = document.getElementById("camelOutput");
    const snakeEl = document.getElementById("snakeOutput");
    const kebabEl = document.getElementById("kebabOutput");

    const camelCopyBtn = document.getElementById("camelCopyBtn");
    const snakeCopyBtn = document.getElementById("snakeCopyBtn");
    const kebabCopyBtn = document.getElementById("kebabCopyBtn");

    const normalize = (str) =>
      str
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[-_]/g, " ")
        .toLowerCase()
        .trim();

    const toCamel = (str) =>
      str
        .split(" ")
        .map((word, i) =>
          i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join("");

    const toSnake = (str) => str.split(" ").join("_");

    const toKebab = (str) => str.split(" ").join("-");

    inputEl.addEventListener("input", () => {
      const norm = normalize(inputEl.value);
      camelEl.value = toCamel(norm);
      snakeEl.value = toSnake(norm);
      kebabEl.value = toKebab(norm);
    });

    const setupCopy = (btn, target) => {
      btn.addEventListener("click", () => {
        navigator.clipboard.writeText(target.value).then(() => {
          const original = btn.innerText;
          btn.innerText = "Copiado!";
          setTimeout(() => (btn.innerText = original), 1500);
        });
      });
    };

    setupCopy(camelCopyBtn, camelEl);
    setupCopy(snakeCopyBtn, snakeEl);
    setupCopy(kebabCopyBtn, kebabEl);
  },
};

export default caseconvert;
