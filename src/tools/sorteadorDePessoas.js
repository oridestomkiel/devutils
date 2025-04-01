const sorteadorDePessoas = {
  title: "Sorteador de Pessoas",
  description:
    "Cole uma lista de nomes, escolha o separador e a quantidade de sorteados. Sorteio rápido e divertido para rifas, brindes e decisões aleatórias.",
  tags: ["sorteio", "pessoas", "nomes", "lista", "random", "diversão"],
  category: "Utilitários",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.2.0",

  render: () => `
      <div class="p-4 rounded bg-gray-800 text-white text-sm space-y-4">
        <p>Cole os nomes abaixo, escolha o separador e quantos serão sorteados:</p>
  
        <textarea
          id="pessoasLista"
          rows="6"
          placeholder="Maria\nJoão\nCarlos\nAna"
          class="w-full p-2 bg-gray-700 text-green-400 rounded font-mono resize-none"
        ></textarea>
  
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm mb-1">Separador</label>
            <select id="separador" class="p-2 bg-gray-700 rounded w-full">
              <option value="\n">Quebra de linha (padrão)</option>
              <option value=",">Vírgula (,)</option>
              <option value=";">Ponto e vírgula (;)</option>
              <option value="|">Barra vertical (|)</option>
              <option value=".">Ponto (.)</option>
              <option value="__custom__">Outro (personalizado)</option>
            </select>
            <input
              id="separadorCustom"
              type="text"
              placeholder="Informe o separador..."
              class="mt-2 p-2 bg-gray-700 text-green-400 rounded w-full hidden"
            />
          </div>
          <div>
            <label class="block text-sm mb-1">Quantidade de sorteados</label>
            <input
              id="qtdSorteio"
              type="number"
              min="1"
              value="1"
              class="p-2 bg-gray-700 text-green-400 rounded w-full"
            />
          </div>
        </div>
  
        <button id="btnSortearPessoas" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm">
          Sortear 🎉
        </button>
  
        <div id="resultadoPessoas" class="mt-4 text-green-400 font-semibold space-y-2 bg-gray-900 p-8 rounded hidden"></div>
      </div>
    `,

  init: () => {
    const listaEl = document.getElementById("pessoasLista");
    const separadorEl = document.getElementById("separador");
    const customEl = document.getElementById("separadorCustom");
    const qtdEl = document.getElementById("qtdSorteio");
    const btn = document.getElementById("btnSortearPessoas");
    const resultadoEl = document.getElementById("resultadoPessoas");

    const detectSeparador = (text) => {
      const counts = {
        "\n": (text.match(/\n/g) || []).length,
        ",": (text.match(/,/g) || []).length,
        ";": (text.match(/;/g) || []).length,
        "|": (text.match(/\|/g) || []).length,
        ".": (text.match(/\./g) || []).length,
      };
      const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      return winner[1] > 0 ? winner[0] : "\n";
    };

    separadorEl.addEventListener("change", () => {
      customEl.classList.toggle("hidden", separadorEl.value !== "__custom__");
    });

    const atualizarTextarea = () => {
      const raw = listaEl.value.trim();
      const sep = detectSeparador(raw);
      separadorEl.value = sep;
      customEl.classList.add("hidden");
      const linhas = raw.split("\n").length;
      listaEl.rows = Math.min(30, Math.max(6, linhas));
    };

    listaEl.addEventListener("input", atualizarTextarea);
    listaEl.addEventListener("paste", () => setTimeout(atualizarTextarea, 10));

    listaEl.addEventListener("input", () => {
      const raw = listaEl.value;
      const sep = detectSeparador(raw);
      separadorEl.value = sep;
      customEl.classList.add("hidden");
    });

    btn.addEventListener("click", () => {
      const raw = listaEl.value.trim();
      const sep =
        separadorEl.value === "__custom__"
          ? customEl.value || "\n"
          : separadorEl.value;

      if (!raw.includes(sep)) {
        resultadoEl.innerHTML = `<p class="text-yellow-400">⚠️ O separador escolhido (“${sep}”) não foi encontrado no texto.</p>`;
        document.getElementById("resultadoPessoas").classList.remove("hidden");
        return;
      }

      const nomes = raw
        .split(sep)
        .map((n) => n.trim())
        .filter(Boolean);

      const qtd = parseInt(qtdEl.value, 10) || 1;

      if (nomes.length === 0) {
        resultadoEl.innerHTML = `<p class="text-yellow-400">⚠️ Nenhum nome válido encontrado.</p>`;
        document.getElementById("resultadoPessoas").classList.remove("hidden");
        return;
      }

      if (qtd > nomes.length) {
        resultadoEl.innerHTML = `<p class="text-yellow-400">⚠️ Quantidade maior que o número de nomes.</p>`;
        document.getElementById("resultadoPessoas").classList.remove("hidden");
        return;
      }

      const sorteados = [];
      const pool = [...nomes];

      while (sorteados.length < qtd) {
        const i = Math.floor(Math.random() * pool.length);
        sorteados.push(pool.splice(i, 1)[0]);
      }

      resultadoEl.innerHTML = `
      <p class="text-xl text-green-300 font-bold">🎊 ${
        qtd === 1 ? "Pessoa sorteada" : "Pessoas sorteadas"
      }:</p>
      <ol class="list-decimal list-inside text-green-200 text-lg space-y-1">
        ${sorteados.map((n) => `<li>${n}</li>`).join("")}
      </ol>
      <p class="text-sm text-gray-400">Parabéns! 🎉</p>
    `;
      document.getElementById("resultadoPessoas").classList.remove("hidden");
    });
  },
};

export default sorteadorDePessoas;
