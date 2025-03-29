const cpfvalidator = {
  title: "Validador de CPF",
  description:
    "Valide números de CPF rapidamente e com precisão. Ideal para sistemas de cadastro, validação de usuários e aplicações fiscais.",
  tags: [
    "validador de cpf",
    "validar cpf",
    "cpf válido",
    "verificador de cpf",
    "validação de cpf",
    "documento pessoal",
    "cpf brasil",
  ],
  category: "Validadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <input
      id="cpfValInput"
      type="text"
      class="w-full p-2 bg-gray-700 rounded mb-2"
      placeholder="Digite o CPF (com ou sem pontuação)"
    />

    <button
      id="cpfValBtn"
      class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
    >
      Validar CPF
    </button>
    <div class="mt-2 flex gap-2">
      <input
        id="cpfValOutput"
        type="text"
        value=""
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full"
        placeholder="Resultado da validação"
      />
      <button
        id="cpfValCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const cpfValInput = document.getElementById("cpfValInput");
    const cpfValBtn = document.getElementById("cpfValBtn");
    const cpfValOutput = document.getElementById("cpfValOutput");
    const cpfValCopyBtn = document.getElementById("cpfValCopyBtn");

    const limpar = (str) => str.replace(/\D/g, "");

    const validarCPF = (cpf) => {
      cpf = limpar(cpf);

      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

      const calcDv = (base, peso) => {
        const soma = base
          .split("")
          .reduce((acc, val, idx) => acc + parseInt(val) * (peso - idx), 0);
        const resto = (soma * 10) % 11;
        return resto === 10 ? 0 : resto;
      };

      const digitos = cpf.slice(0, 9);
      const dv1 = calcDv(digitos, 10);
      const dv2 = calcDv(digitos + dv1, 11);

      return cpf === digitos + dv1 + dv2;
    };

    cpfValBtn.addEventListener("click", () => {
      const inputValue = cpfValInput.value;

      cpfValOutput.classList.remove("text-green-400", "text-red-400");

      if (validarCPF(inputValue)) {
        cpfValOutput.value = "✅ CPF válido.";
        cpfValOutput.classList.add("text-green-400");
      } else {
        cpfValOutput.value = "❌ CPF inválido.";
        cpfValOutput.classList.add("text-red-400");
      }
    });

    cpfValCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(cpfValOutput.value).then(() => {
        const originalText = cpfValCopyBtn.innerText;
        cpfValCopyBtn.innerText = "Copiado!";
        setTimeout(() => {
          cpfValCopyBtn.innerText = originalText;
        }, 1500);
      });
    });
  },
};

export default cpfvalidator;
