const extrairemail = {
  title: "Extrair E-mails de Texto",
  description:
    "Cole qualquer conteúdo de texto e extraia todos os endereços de e-mail encontrados. Organize por ordem alfabética ou por domínio.",
  tags: ["e-mail", "extrair", "texto", "ordenar", "domínio", "lista de emails"],
  category: "Texto",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <div class="p-4 rounded bg-gray-800 text-white text-sm space-y-4">
        <div>
          <label class="block mb-1">Texto de origem:</label>
          <textarea id="inputEmailTexto" rows="6" class="w-full p-2 rounded bg-gray-700 text-white" placeholder="Cole aqui o conteúdo com e-mails..."></textarea>
        </div>
  
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1">Ordenar por:</label>
            <select id="ordenarPor" class="w-full p-2 rounded bg-gray-700 text-white">
              <option value="alfabeto">Ordem Alfabética</option>
              <option value="dominio">Domínio</option>
            </select>
          </div>
        </div>
  
        <button id="btnExtrair" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm">
          Extrair e-mails
        </button>
  
        <div>
          <label class="block mb-1 mt-4">E-mails extraídos:</label>
          <textarea id="resultadoEmails" rows="6" readonly class="w-full p-2 rounded bg-gray-700 text-green-400"></textarea>
          <div class="flex gap-2 mt-2">
            <button id="btnCopiarEmails" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm">Copiar</button>
            <button id="btnDownloadEmails" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm">Baixar TXT</button>
          </div>
        </div>
      </div>
    `,

  init: () => {
    const input = document.getElementById("inputEmailTexto");
    const resultado = document.getElementById("resultadoEmails");

    document.getElementById("btnExtrair").addEventListener("click", () => {
      const texto = input.value;
      const ordenarPor = document.getElementById("ordenarPor").value;

      const encontrados = [
        ...texto.matchAll(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi),
      ].map((m) => m[0]);
      const unicos = [...new Set(encontrados)];

      let ordenados = [...unicos];

      if (ordenarPor === "alfabeto") {
        ordenados.sort((a, b) => a.localeCompare(b));
      } else if (ordenarPor === "dominio") {
        ordenados.sort((a, b) => {
          const domA = a.split("@")[1];
          const domB = b.split("@")[1];
          return domA.localeCompare(domB) || a.localeCompare(b);
        });
      }

      resultado.value = ordenados.join("\n");
    });

    document.getElementById("btnCopiarEmails").addEventListener("click", () => {
      navigator.clipboard.writeText(resultado.value).then(() => {
        const btn = document.getElementById("btnCopiarEmails");
        btn.textContent = "Copiado!";
        setTimeout(() => (btn.textContent = "Copiar"), 1500);
      });
    });

    document
      .getElementById("btnDownloadEmails")
      .addEventListener("click", () => {
        const blob = new Blob([resultado.value], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "emails-extraidos.txt";
        link.click();
      });
  },
};

export default extrairemail;
