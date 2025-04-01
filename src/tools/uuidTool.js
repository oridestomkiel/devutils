import { customAlphabet } from "nanoid/non-secure";

const uuidTool = {
  title: "Gerar e Analisar UUID / ULID / Nano ID",
  description:
    "Gere identificadores únicos (UUID, ULID, Nano ID) e inspecione sua estrutura e validade. Tudo local no seu navegador.",
  tags: ["uuid", "ulid", "nanoid", "identificador", "segurança", "gerador"],
  category: "Geradores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",

  render: () => `
    <div class="p-4 bg-gray-800 text-white text-sm space-y-6 rounded">

      <div class="space-y-2">
        <label class="block">Tipo de ID:</label>
        <select id="tipoID" class="bg-gray-700 p-2 rounded w-full">
          <option value="uuid">UUID v4</option>
          <option value="ulid">ULID</option>
          <option value="nanoid">Nano ID</option>
        </select>
      </div>

      <div class="space-y-2">
        <label class="block">Quantidade:</label>
        <input id="quantidade" type="number" min="1" max="1000" value="10" class="bg-gray-700 p-2 rounded w-full" />
      </div>

      <label class="inline-flex items-center space-x-2">
        <input type="checkbox" id="minusculas" class="form-checkbox" />
        <span>Converter para minúsculas</span>
      </label>

      <button id="btnGerarIDs" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded w-full">Gerar</button>

      <textarea id="saidaIDs" rows="10" class="w-full mt-4 p-2 rounded bg-gray-900 text-green-400 font-mono"></textarea>

      <button id="btnCopiarIDs" class="mt-2 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">Copiar</button>

      <!-- Analisar ID -->
      <div class="mt-8 border-t border-gray-600 pt-4">
        <h3 class="text-base font-bold mb-2">Analisar Identificador</h3>
        <input id="entradaID" type="text" placeholder="Cole um UUID, ULID ou Nano ID" class="w-full p-2 bg-gray-700 rounded mb-2" />
        <button id="btnAnalisarID" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded w-full mb-2">Analisar</button>
        <div id="resultadoID" class="text-xs text-gray-300 whitespace-pre font-mono bg-gray-900 p-2 rounded hidden"></div>
      </div>
    </div>
  `,

  init: async () => {
    const btnGerar = document.getElementById("btnGerarIDs");
    const btnCopiar = document.getElementById("btnCopiarIDs");
    const saida = document.getElementById("saidaIDs");

    btnGerar.onclick = async () => {
      const tipo = document.getElementById("tipoID").value;
      const qtd = parseInt(document.getElementById("quantidade").value);
      const usarMinusculas = document.getElementById("minusculas").checked;

      const ids = [];
      for (let i = 0; i < qtd; i++) {
        let id = "";

        if (tipo === "uuid") {
          id = crypto.randomUUID();
        } else if (tipo === "ulid") {
          const { ulid } = await import(
            "https://cdn.jsdelivr.net/npm/ulid/+esm"
          );
          id = ulid();
        } else if (tipo === "nanoid") {
          const nanoid = customAlphabet(
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
            21
          );
          id = nanoid();
        }

        ids.push(usarMinusculas ? id.toLowerCase() : id);
      }

      saida.value = ids.join("\n");
    };

    btnCopiar.onclick = () => {
      navigator.clipboard.writeText(saida.value).then(() => {
        btnCopiar.textContent = "Copiado!";
        setTimeout(() => (btnCopiar.textContent = "Copiar"), 1500);
      });
    };

    // Análise de ID
    const btnAnalisar = document.getElementById("btnAnalisarID");
    const entradaID = document.getElementById("entradaID");
    const resultadoID = document.getElementById("resultadoID");

    btnAnalisar.onclick = () => {
      const valor = entradaID.value.trim();
      resultadoID.classList.remove("text-red-400", "text-green-400");

      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-([1-5])[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          valor
        );
      const isULID = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/.test(valor);
      const isNanoID = /^[\w-]{21,}$/i.test(valor);

      if (isUUID) {
        const versao = valor.charAt(14);
        const varianteChar = valor.charAt(19).toLowerCase();
        let variante = ["8", "9", "a", "b"].includes(varianteChar)
          ? "RFC 4122 (padrão)"
          : "Desconhecida";

        resultadoID.innerText = `🧬 UUID válido\nVersão: ${versao}\nVariante: ${variante}`;
        resultadoID.classList.add("text-green-400");
      } else if (isULID) {
        resultadoID.innerText = "🔤 ULID válido";
        resultadoID.classList.add("text-green-400");
      } else if (isNanoID) {
        resultadoID.innerText = "🆔 Nano ID válido";
        resultadoID.classList.add("text-green-400");
      } else {
        resultadoID.innerText = "ID inválido ou não reconhecido.";
        resultadoID.classList.add("text-red-400");
      }

      resultadoID.classList.remove("hidden");
    };
  },
};

export default uuidTool;
