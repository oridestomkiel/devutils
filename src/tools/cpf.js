const cpf = {
  title: "Gerador de CPF",
  description:
    "Gere números de CPF válidos para testes e desenvolvimento. Útil para preencher formulários, validar sistemas e simular cadastros.",
  tags: [
    "gerador de cpf",
    "cpf válido",
    "cpf para teste",
    "cpf fake",
    "número de cpf",
    "simulador de cpf",
    "teste de formulários",
  ],
  category: "Geradores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <div class="flex items-center gap-2 mb-2">
      <label class="text-sm flex items-center gap-1">
        <input type="checkbox" id="formatCheck" checked />
        <span>Formatar com máscara</span>
      </label>
    </div>

    <button
      id="cpfBtn"
      class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
    >
      Gerar CPF
    </button>
    <div class="mt-2 flex gap-2">
      <input
        id="cpfOutput"
        type="text"
        value=""
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full"
        placeholder="CPF gerado aparecerá aqui"
      />
      <button
        id="cpfCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const cpfBtn = document.getElementById("cpfBtn");
    const cpfOutput = document.getElementById("cpfOutput");
    const cpfCopyBtn = document.getElementById("cpfCopyBtn");
    const formatCheck = document.getElementById("formatCheck");

    const limpar = (str) => str.replace(/\D/g, "");

    const calcDv = (base, peso) => {
      const soma = base
        .split("")
        .reduce((acc, val, idx) => acc + parseInt(val) * (peso - idx), 0);
      const resto = (soma * 10) % 11;
      return resto === 10 ? 0 : resto;
    };

    const generateCPFValido = () => {
      let digitos = "";
      for (let i = 0; i < 9; i++) {
        digitos += Math.floor(Math.random() * 9).toString();
      }

      const dv1 = calcDv(digitos, 10);
      const dv2 = calcDv(digitos + dv1, 11);

      return digitos + dv1 + dv2;
    };

    const formatCPF = (rawCPF) =>
      rawCPF.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");

    const initialCPF = generateCPFValido();
    cpfOutput.value = formatCheck.checked ? formatCPF(initialCPF) : initialCPF;

    cpfBtn.addEventListener("click", () => {
      const newCPF = generateCPFValido();
      cpfOutput.value = formatCheck.checked ? formatCPF(newCPF) : newCPF;
    });

    cpfCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(cpfOutput.value).then(() => {
        const originalText = cpfCopyBtn.innerText;
        cpfCopyBtn.innerText = "Copiado!";
        setTimeout(() => {
          cpfCopyBtn.innerText = originalText;
        }, 1500);
      });
    });

    formatCheck.addEventListener("change", () => {
      const raw = limpar(cpfOutput.value);
      if (formatCheck.checked) {
        cpfOutput.value = formatCPF(raw);
      } else {
        cpfOutput.value = raw;
      }
    });
  },
};

export default cpf;
