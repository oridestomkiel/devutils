const jwt = {
  title: "Visualizador de JWT",
  description:
    "Decode tokens JWT para visualizar o header, payload e assinatura. Ideal para depuração, segurança e desenvolvimento de autenticação.",
  tags: [
    "jwt",
    "visualizar jwt",
    "decode jwt",
    "token jwt",
    "jwt debugger",
    "analisar jwt",
    "jwt decoder",
    "jwt token viewer",
  ],
  category: "Codificadores / Decodificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",
  render: () => `
    <div class="flex flex-col gap-2">
      <textarea
        id="jwtInput"
        class="w-full p-2 bg-gray-700 text-white rounded"
        rows="4"
        placeholder="Cole seu JWT aqui"
      ></textarea>
      <button
        id="jwtDecodeBtn"
        class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white"
      >
        Decodificar
      </button>
      <div class="relative">
        <pre
          id="jwtOutput"
          class="p-3 bg-gray-800 text-green-400 rounded overflow-x-auto whitespace-pre-wrap break-words text-sm"
        ></pre>
        <button
          id="jwtCopyBtn"
          class="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs"
        >
          Copiar
        </button>
      </div>
    </div>
  `,
  init: () => {
    const inputEl = document.getElementById("jwtInput");
    const outputEl = document.getElementById("jwtOutput");
    const decodeBtn = document.getElementById("jwtDecodeBtn");
    const copyBtn = document.getElementById("jwtCopyBtn");

    decodeBtn.addEventListener("click", () => {
      const input = inputEl.value.trim();
      const partes = input.split(".");

      if (partes.length === 3) {
        try {
          const payload = JSON.parse(
            atob(partes[1].replace(/-/g, "+").replace(/_/g, "/"))
          );
          outputEl.textContent = JSON.stringify(payload, null, 2);
        } catch {
          outputEl.textContent = "JWT inválido";
        }
      } else {
        outputEl.textContent = "JWT deve conter 3 partes separadas por ponto.";
      }
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(outputEl.textContent).then(() => {
        copyBtn.textContent = "Copiado!";
        setTimeout(() => (copyBtn.textContent = "Copiar"), 1500);
      });
    });
  },
};

export default jwt;
