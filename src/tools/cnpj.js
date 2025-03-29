const cnpj = {
  title: "Validador de CNPJ",
  description:
    "Valide números de CNPJ de forma rápida e precisa. Ideal para aplicações fiscais, cadastros empresariais e verificação de dados.",
  tags: [
    "validar cnpj",
    "validador de cnpj",
    "cnpj válido",
    "verificador de cnpj",
    "cnpj brasil",
    "documento empresarial",
    "validação de cnpj",
  ],
  category: "Validadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <input
      id="cnpjInput"
      type="text"
      placeholder="Digite o CNPJ"
      class="w-full p-2 bg-gray-700 rounded mb-2"
    />

    <button
      id="validateCnpjBtn"
      class="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded"
    >
      Validar
    </button>

    <div class="mt-2 flex gap-2">
      <input
        id="cnpjOutput"
        type="text"
        value=""
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full"
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
    const cnpjInput = document.getElementById("cnpjInput");
    const cnpjOutput = document.getElementById("cnpjOutput");
    const validateBtn = document.getElementById("validateCnpjBtn");
    const copyBtn = document.getElementById("cnpjCopyBtn");

    const validateCNPJ = (cnpj) => {
      cnpj = cnpj.replace(/[^\d]+/g, "");
      if (cnpj.length !== 14) return false;

      let tamanho = cnpj.length - 2;
      let numeros = cnpj.substring(0, tamanho);
      const digitos = cnpj.substring(tamanho);

      let soma = 0;
      let pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
      }

      let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      if (resultado !== parseInt(digitos.charAt(0), 10)) return false;

      tamanho += 1;
      numeros = cnpj.substring(0, tamanho);
      soma = 0;
      pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
      }

      resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      if (resultado !== parseInt(digitos.charAt(1), 10)) return false;

      return true;
    };

    validateBtn.addEventListener("click", () => {
      const cnpjValue = cnpjInput.value;
      const isValid = validateCNPJ(cnpjValue);

      cnpjOutput.value = isValid ? "CNPJ válido" : "CNPJ inválido";
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(cnpjOutput.value).then(() => {
        const originalText = copyBtn.innerText;
        copyBtn.innerText = "Copiado!";
        setTimeout(() => {
          copyBtn.innerText = originalText;
        }, 1500);
      });
    });
  },
};

export default cnpj;
