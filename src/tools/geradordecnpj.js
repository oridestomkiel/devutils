const geradordecnpj = {
  title: "Gerador de CNPJ",
  description:
    "Gere números de CNPJ válidos para testes e desenvolvimento. Útil para simulações de empresas, cadastros e validações.",
  tags: [
    "gerador de cnpj",
    "cnpj válido",
    "cnpj para teste",
    "cnpj fake",
    "número de cnpj",
    "simulador de cnpj",
    "teste de empresas",
  ],
  category: "Geradores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
      <div class="flex items-center gap-2 mb-2">
        <label class="text-sm flex items-center gap-1">
          <input type="checkbox" id="cnpjFormatCheck" checked />
          <span>Formatar com máscara</span>
        </label>
      </div>
  
      <button
        id="cnpjBtn"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        Gerar CNPJ
      </button>
  
      <div class="mt-2 flex gap-2">
        <input
          id="cnpjOutput"
          type="text"
          value=""
          readonly
          class="p-2 bg-gray-700 text-green-400 rounded w-full"
          placeholder="CNPJ gerado aparecerá aqui"
        />
        <button
          id="cnpjCopyBtn"
          class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
        >
          Copiar
        </button>
      </div>
    `,
  init: () => {
    const cnpjBtn = document.getElementById("cnpjBtn");
    const cnpjOutput = document.getElementById("cnpjOutput");
    const cnpjCopyBtn = document.getElementById("cnpjCopyBtn");
    const formatCheck = document.getElementById("cnpjFormatCheck");

    const limpar = (str) => str.replace(/\D/g, "");

    const generateCNPJValido = () => {
      const getRandomInt = (max) => Math.floor(Math.random() * max);

      const base =
        Array.from({ length: 8 }, () => getRandomInt(10)).join("") + "0001";

      const calcDV = (cnpjBase) => {
        const calc = (nums, pesos) =>
          nums
            .split("")
            .reduce((sum, digit, i) => sum + parseInt(digit) * pesos[i], 0);

        const dv1Pesos = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const dv1 = calc(cnpjBase, dv1Pesos);
        const d1 = dv1 % 11 < 2 ? 0 : 11 - (dv1 % 11);

        const dv2Pesos = [6].concat(dv1Pesos);
        const dv2 = calc(cnpjBase + d1, dv2Pesos);
        const d2 = dv2 % 11 < 2 ? 0 : 11 - (dv2 % 11);

        return cnpjBase + d1 + d2;
      };

      return calcDV(base);
    };

    const formatCNPJ = (raw) =>
      raw.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");

    const initial = generateCNPJValido();
    cnpjOutput.value = formatCheck.checked ? formatCNPJ(initial) : initial;

    cnpjBtn.addEventListener("click", () => {
      const novo = generateCNPJValido();
      cnpjOutput.value = formatCheck.checked ? formatCNPJ(novo) : novo;
    });

    cnpjCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(cnpjOutput.value).then(() => {
        const original = cnpjCopyBtn.innerText;
        cnpjCopyBtn.innerText = "Copiado!";
        setTimeout(() => {
          cnpjCopyBtn.innerText = original;
        }, 1500);
      });
    });

    formatCheck.addEventListener("change", () => {
      const raw = limpar(cnpjOutput.value);
      cnpjOutput.value = formatCheck.checked ? formatCNPJ(raw) : raw;
    });
  },
};

export default geradordecnpj;
