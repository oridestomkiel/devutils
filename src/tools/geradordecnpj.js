const geradordecnpj = {
  title: "Gerador de CNPJ",
  description:
    "Gere números de CNPJ válidos para testes e desenvolvimento. Agora com suporte a múltiplos e filialização.",
  tags: [
    "gerador de cnpj",
    "cnpj válido",
    "cnpj para teste",
    "cnpj fake",
    "número de cnpj",
    "simulador de cnpj",
    "teste de empresas",
    "filial",
    "múltiplos",
  ],
  category: "Geradores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "2.0.0",

  render: () => `
    <div class="space-y-3">
      <div class="flex items-center gap-3 flex-wrap">
        <label class="text-sm flex items-center gap-2">
          <input type="checkbox" id="cnpjFormatCheck" checked />
          <span>Formatar com máscara</span>
        </label>

        <label class="text-sm flex items-center gap-2">
          <input type="checkbox" id="cnpjMultiCheck" />
          <span>Gerar múltiplos</span>
        </label>

        <label class="text-sm flex items-center gap-2">
          <input type="checkbox" id="cnpjFilialCheck" />
          <span>Simular CNPJ Pai + Filiais</span>
        </label>

        <input type="number" id="cnpjQtd" class="bg-gray-700 p-1 rounded w-20 text-sm" value="10" min="1" max="1000" />
      </div>

      <button id="cnpjBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Gerar CNPJ</button>

      <div class="mt-2 flex gap-2">
        <textarea id="cnpjOutput" readonly class="p-2 bg-gray-700 text-green-400 rounded w-full h-40 font-mono resize-none" placeholder="CNPJs gerados aparecerão aqui"></textarea>
        <button id="cnpjCopyBtn" class="bg-green-700 hover:bg-green-600 px-2 py-1 rounded">Copiar</button>
      </div>
    </div>
  `,

  init: () => {
    const $ = (id) => document.getElementById(id);
    const output = $("cnpjOutput");

    const limpar = (str) => str.replace(/\D/g, "");
    const formatCNPJ = (raw) =>
      raw.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");

    const generateCNPJValido = (sufixo = "0001") => {
      const getRandomInt = (max) => Math.floor(Math.random() * max);
      const base =
        Array.from({ length: 8 }, () => getRandomInt(10)).join("") + sufixo;

      const calcDV = (cnpjBase) => {
        const calc = (nums, pesos) =>
          nums
            .split("")
            .reduce((sum, digit, i) => sum + parseInt(digit) * pesos[i], 0);

        const dv1 = calc(cnpjBase, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
        const d1 = dv1 % 11 < 2 ? 0 : 11 - (dv1 % 11);

        const dv2 = calc(
          cnpjBase + d1,
          [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        );
        const d2 = dv2 % 11 < 2 ? 0 : 11 - (dv2 % 11);

        return cnpjBase + d1 + d2;
      };

      return calcDV(base);
    };

    const gerarCNPJs = () => {
      const formatar = $("cnpjFormatCheck").checked;
      const multiplo = $("cnpjMultiCheck").checked;
      const filial = $("cnpjFilialCheck").checked;
      const qtd = parseInt($("cnpjQtd").value) || 1;

      let lista = [];

      const getRandomInt = (max) => Math.floor(Math.random() * max);
      const gerarRaiz = () =>
        Array.from({ length: 8 }, () => getRandomInt(10)).join("");

      const calcDV = (cnpjBase) => {
        const calc = (nums, pesos) =>
          nums
            .split("")
            .reduce((sum, digit, i) => sum + parseInt(digit) * pesos[i], 0);

        const dv1 = calc(cnpjBase, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
        const d1 = dv1 % 11 < 2 ? 0 : 11 - (dv1 % 11);

        const dv2 = calc(
          cnpjBase + d1,
          [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        );
        const d2 = dv2 % 11 < 2 ? 0 : 11 - (dv2 % 11);

        return cnpjBase + d1 + d2;
      };

      if (multiplo) {
        if (filial) {
          const raiz = gerarRaiz();
          for (let i = 1; i <= qtd; i++) {
            const sufixo = i.toString().padStart(4, "0");
            const cnpjBase = raiz + sufixo;
            const raw = calcDV(cnpjBase);
            lista.push(formatar ? formatCNPJ(raw) : raw);
          }
        } else {
          for (let i = 0; i < qtd; i++) {
            const cnpjBase = gerarRaiz() + "0001";
            const raw = calcDV(cnpjBase);
            lista.push(formatar ? formatCNPJ(raw) : raw);
          }
        }
      } else {
        const cnpjBase = gerarRaiz() + "0001";
        const raw = calcDV(cnpjBase);
        lista.push(formatar ? formatCNPJ(raw) : raw);
      }

      output.value = lista.join("\n");
    };

    $("cnpjBtn").addEventListener("click", gerarCNPJs);
    $("cnpjMultiCheck").addEventListener("change", gerarCNPJs);
    $("cnpjFilialCheck").addEventListener("change", gerarCNPJs);
    $("cnpjFormatCheck").addEventListener("change", gerarCNPJs);
    $("cnpjQtd").addEventListener("input", gerarCNPJs);

    $("cnpjCopyBtn").addEventListener("click", () => {
      navigator.clipboard.writeText(output.value).then(() => {
        const original = $("cnpjCopyBtn").innerText;
        $("cnpjCopyBtn").innerText = "Copiado!";
        setTimeout(() => ($("cnpjCopyBtn").innerText = original), 1500);
      });
    });

    gerarCNPJs();
  },
};

export default geradordecnpj;
