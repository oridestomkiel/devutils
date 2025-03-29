const geradorendereco = {
  title: "Gerador de Endereço",
  description:
    "Gere um endereço válido do Brasil com base em estado e cidade (opcional). A base vem diretamente dos Correios.",
  tags: ["cep", "endereço", "gerador", "brasil", "código postal"],
  category: "Utilitários",
  author: "DevUtils",
  hasApi: true,
  license: "MIT",
  version: "1.0.0",

  render: () => `
    <div class="p-4 rounded bg-gray-800 text-white text-sm space-y-4">
      <p>Para gerar um endereço do Brasil, selecione o estado e cidade (opcional), e se deseja pontuação no CEP.</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm mb-1">Estado (UF)</label>
          <select id="cepUf" class="w-full p-2 bg-gray-700 text-white rounded">
            <option value="">Aleatório</option>
          </select>
        </div>
        <div>
          <label class="block text-sm mb-1">Cidade</label>
          <select id="cepCidade" class="w-full p-2 bg-gray-700 text-white rounded" disabled>
            <option value="">Selecione o estado</option>
          </select>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <label class="block text-sm">Com pontuação no CEP?</label>
        <label class="inline-flex items-center gap-1">
          <input type="radio" name="pontuar" value="sim" checked /> Sim
        </label>
        <label class="inline-flex items-center gap-1">
          <input type="radio" name="pontuar" value="nao" /> Não
        </label>
      </div>

      <button id="btnGerarCep" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm">
        Gerar Endereço
      </button>

      <div id="resultadoCepWrapper" class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 hidden">
        <div id="resultadoCep" class="space-y-4">
          ${["CEP", "Endereço", "Bairro", "Cidade", "Estado"]
            .map(
              (label, i) => `
            <div>
              <label class="block text-sm mb-1">${label}</label>
              <div class="flex gap-2">
                <input id="out${label}" readonly class="w-full p-2 bg-gray-700 text-green-400 rounded" />
                <button data-copy="out${label}" class="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs">Copiar</button>
              </div>
            </div>`
            )
            .join("")}
        </div>

        <div class="space-y-2">
          <label class="block text-sm mb-1">Resposta completa (JSON)</label>
          <div class="relative">
            <pre id="outJson" class="h-full p-3 bg-gray-900 text-green-400 rounded text-xs overflow-auto whitespace-pre-wrap border border-gray-700"></pre>
            <button id="copyJson" class="absolute top-2 right-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs">Copiar</button>
          </div>
        </div>
      </div>
    </div>
  `,

  init: () => {
    const ufEl = document.getElementById("cepUf");
    const cidadeEl = document.getElementById("cepCidade");
    const btn = document.getElementById("btnGerarCep");
    const resultadoWrapper = document.getElementById("resultadoCepWrapper");

    const fields = {
      CEP: document.getElementById("outCEP"),
      Endereço: document.getElementById("outEndereço"),
      Bairro: document.getElementById("outBairro"),
      Cidade: document.getElementById("outCidade"),
      Estado: document.getElementById("outEstado"),
    };

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((res) => res.json())
      .then((estados) => {
        estados.sort((a, b) => a.nome.localeCompare(b.nome));
        estados.forEach((uf) => {
          const opt = document.createElement("option");
          opt.value = uf.sigla;
          opt.textContent = uf.nome;
          ufEl.appendChild(opt);
        });
      });

    ufEl.addEventListener("change", () => {
      const uf = ufEl.value;
      cidadeEl.innerHTML = '<option value="">Aleatória</option>';
      cidadeEl.disabled = true;
      if (!uf) return;
      fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
      )
        .then((res) => res.json())
        .then((cidades) => {
          cidades.sort((a, b) => a.nome.localeCompare(b.nome));
          cidades.forEach((cidade) => {
            const opt = document.createElement("option");
            opt.value = cidade.id;
            opt.textContent = cidade.nome;
            cidadeEl.appendChild(opt);
          });
          cidadeEl.disabled = false;
        });
    });

    btn.addEventListener("click", () => {
      const uf = ufEl.value;
      const cidade = cidadeEl.value;
      const pontuar =
        document.querySelector("input[name='pontuar']:checked").value === "sim";

      resultadoWrapper.classList.remove("hidden");
      Object.values(fields).forEach((el) => {
        el.value = "⏳ Aguardando...";
      });
      document.getElementById("outJson").textContent = "⏳ Consultando...";

      const params = new URLSearchParams();
      if (uf) params.append("uf", uf);
      if (cidade) params.append("cidade", cidade);
      params.append("pontuar", pontuar ? "1" : "0");

      fetch(
        `https://devutils.zmohouse.com.br/api/address-generator.json?${params.toString()}`
      )
        .then((res) => res.json())
        .then((data) => {
          fields.CEP.value = data.cep;
          fields["Endereço"].value = data.endereco;
          fields.Bairro.value = data.bairro;
          fields.Cidade.value = data.cidade;
          fields.Estado.value = data.estado;
          document.getElementById("outJson").textContent = JSON.stringify(
            data,
            null,
            2
          );
        })
        .catch(() => {
          Object.values(fields).forEach((el) => (el.value = "❌ Erro"));
          document.getElementById("outJson").textContent =
            "❌ Falha ao buscar dados";
        });
    });

    document.addEventListener("click", (e) => {
      if (e.target.matches("button[data-copy]")) {
        const id = e.target.getAttribute("data-copy");
        const val = document.getElementById(id).value;
        navigator.clipboard.writeText(val).then(() => {
          e.target.textContent = "Copiado!";
          setTimeout(() => (e.target.textContent = "Copiar"), 1500);
        });
      }

      if (e.target.id === "copyJson") {
        const val = document.getElementById("outJson").textContent;
        navigator.clipboard.writeText(val).then(() => {
          e.target.textContent = "Copiado!";
          setTimeout(() => (e.target.textContent = "Copiar"), 1500);
        });
      }
    });
  },
};

export default geradorendereco;
