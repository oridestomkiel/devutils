const base64 = {
  title: "Codificador/Decodificador Base64",
  description:
    "Codifique e decodifique strings em Base64 para manipulação segura de dados em URLs, APIs, arquivos e sistemas de autenticação.",
  tags: [
    "base64",
    "codificador base64",
    "decodificador base64",
    "converter base64",
    "base64 online",
    "base64 encode decode",
    "base64 para texto",
  ],
  category: "Codificadores / Decodificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <textarea
      id="base64Input"
      class="w-full p-2 bg-gray-700 rounded mb-2"
      rows="3"
      placeholder="Digite o texto"
    ></textarea>

    <div class="flex gap-2">
      <button
        id="base64EncodeBtn"
        class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
      >
        Encode
      </button>
      <button
        id="base64DecodeBtn"
        class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
      >
        Decode
      </button>
    </div>

    <div class="mt-2 flex gap-2">
      <input
        id="base64Output"
        type="text"
        value=""
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full"
      />
      <button
        id="base64CopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const inputEl = document.getElementById("base64Input");
    const outputEl = document.getElementById("base64Output");
    const encodeBtn = document.getElementById("base64EncodeBtn");
    const decodeBtn = document.getElementById("base64DecodeBtn");
    const copyBtn = document.getElementById("base64CopyBtn");

    encodeBtn.addEventListener("click", () => {
      const input = inputEl.value;
      outputEl.value = btoa(input);
    });

    decodeBtn.addEventListener("click", () => {
      try {
        const input = inputEl.value;
        outputEl.value = atob(input);
      } catch {
        outputEl.value = "Texto inválido para decodificação";
      }
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(outputEl.value).then(() => {
        const original = copyBtn.innerText;
        copyBtn.innerText = "Copiado!";
        setTimeout(() => (copyBtn.innerText = original), 1500);
      });
    });
  },
};

export default base64;
