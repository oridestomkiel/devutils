const placasPorEstado = {
  title: "Gerador de Placas de Automóveis",
  description:
    "Gere placas de veículos válidas com base no estado e escolha se deseja incluir pontuação. Ideal para testes e simulações.",
  tags: [
    "gerador de placas",
    "placa de carro",
    "simulador de placa",
    "placa com estado",
    "placa com máscara",
  ],
  category: "Geradores",
  author: "DevUtils",
  hasApi: true,
  license: "MIT",
  version: "1.2.0",
  render: () => `
    <div class="flex flex-col gap-2">
      <div class="flex gap-2 items-center">
        <label class="text-sm">Quantidade:</label>
        <input type="number" id="placaQuantidade" min="1" value="1" class="w-20 bg-gray-700 rounded p-1" />
      </div>
      <div class="flex gap-2 items-center">
        <label class="text-sm">Estado:</label>
        <select id="placaEstado" class="bg-gray-700 p-1 rounded">
          <option value="">Qualquer</option>
        </select>
      </div>
      <label class="text-sm flex gap-1 items-center">
        <input type="checkbox" id="placaMascara" checked /> Com pontuação (ex: ABC-1234)
      </label>
      <button id="gerarPlacaBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
        Gerar Placas
      </button>
      <textarea id="placaResultado" rows="6" readonly class="bg-gray-700 text-green-400 p-2 rounded w-full"></textarea>
      <button id="placaCopiarBtn" class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">
        Copiar
      </button>
    </div>
  `,
  init: async () => {
    const gerarBtn = document.getElementById("gerarPlacaBtn");
    const copiarBtn = document.getElementById("placaCopiarBtn");
    const resultado = document.getElementById("placaResultado");
    const estadoSelect = document.getElementById("placaEstado");

    let placaData = [];

    try {
      const res = await fetch(
        "https://devutils.zmohouse.com.br/data/placas.json"
      );
      placaData = await res.json();

      const estadosUnicos = [...new Set(placaData.map((p) => p.Estado))].sort();
      estadosUnicos.forEach((estado) => {
        const opt = document.createElement("option");
        opt.value = estado;
        opt.textContent = estado;
        estadoSelect.appendChild(opt);
      });
    } catch (err) {
      alert("Erro ao carregar dados de placas.");
      return;
    }

    const gerarNumeros = () =>
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");

    const toNum = (str) =>
      str
        .split("")
        .reduce(
          (acc, l, i) => acc + (l.charCodeAt(0) - 65) * Math.pow(26, 2 - i),
          0
        );

    const toStr = (num) => {
      let res = "";
      for (let i = 2; i >= 0; i--) {
        res =
          String.fromCharCode(65 + (Math.floor(num / Math.pow(26, i)) % 26)) +
          res;
      }
      return res;
    };

    const gerarPlaca = (estado, comMascara) => {
      const faixas = placaData.filter((p) => !estado || p.Estado === estado);
      if (faixas.length === 0) return "SEM DADOS";

      const faixa = faixas[0];

      const gerarPrefixoDentroDaFaixa = (inicio, final) => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        const toIndex = (str) =>
          str.split("").reduce((acc, c, i) => acc * 26 + chars.indexOf(c), 0);

        const toStr = (num) => {
          let result = "";
          for (let i = 0; i < 3; i++) {
            result = chars[num % 26] + result;
            num = Math.floor(num / 26);
          }
          return result;
        };

        const startIndex = toIndex(inicio);
        const endIndex = toIndex(final);
        const randIndex =
          Math.floor(Math.random() * (endIndex - startIndex + 1)) + startIndex;

        return toStr(randIndex);
      };

      const letras = gerarPrefixoDentroDaFaixa(faixa.Inicio, faixa.Final);
      const numeros = gerarNumeros();

      return comMascara ? `${letras}-${numeros}` : `${letras}${numeros}`;
    };

    gerarBtn.addEventListener("click", () => {
      const qtd = parseInt(document.getElementById("placaQuantidade").value);
      const estado = estadoSelect.value;
      const comMascara = document.getElementById("placaMascara").checked;

      const placas = Array.from({ length: qtd }, () =>
        gerarPlaca(estado, comMascara)
      );
      resultado.value = placas.join("\n");
    });

    copiarBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(resultado.value).then(() => {
        const textoOriginal = copiarBtn.innerText;
        copiarBtn.innerText = "Copiado!";
        setTimeout(() => {
          copiarBtn.innerText = textoOriginal;
        }, 1500);
      });
    });
  },
};

export default placasPorEstado;
